from whoosh.fields import Schema, TEXT, ID, KEYWORD, DATETIME
from whoosh.analysis import RegexTokenizer
from whoosh.analysis import Filter, LowercaseFilter
from whoosh.scoring import BM25F
from whoosh.index import create_in
from whoosh.qparser import MultifieldParser

# Importe o stemmer do Snowball
from nltk.stem.snowball import SnowballStemmer

import json

# Crie uma classe de Stemer para usar o SnowballStemmer do NLTK
class Stemmer:
    def __init__(self):
        self.stemmer = SnowballStemmer('portuguese')

    def stem(self, text):
        text = text.split()
        text = [self.stemmer.stem(word) for word in text]
        print(f"Stemmed Text: {text}")
        return ' '.join(text)

    def stem_query(self, query):
        print(f"Query: {query}")
        return self.stem(query)

# Crie uma classe de filtro personalizado para usar o SnowballStemmer do NLTK
class SnowballStemFilter(Filter):
    def __init__(self, lang='portuguese'):
        self.stemmer = SnowballStemmer(lang)

    def __call__(self, tokens):
        for t in tokens:
            t.text = self.stemmer.stem(t.text)
            yield t

# Classe para representar documentos
class Document:
    def __init__(self, path, title, keywords, content, publish_date, authors, document_type):
        self.path = path
        self.title = title
        self.keywords = keywords
        self.content = content
        self.publish_date = publish_date
        self.authors = authors
        self.document_type = document_type

# Classe para representar o esquema e operações de busca
class SearchEngine:
    def __init__(self, index_dir):
        self.index_dir = index_dir
        self.schema = self._build_schema()
        self.ix = create_in(index_dir, self.schema)
        self.searcher = self.ix.searcher()

    # Construa e retorne o esquema
    def _build_schema(self):
        return Schema(
            path=ID(stored=True, unique=True),
            title=TEXT(stored=True, vector=BM25F(), analyzer=RegexTokenizer() | LowercaseFilter() | SnowballStemFilter()),
            keywords=KEYWORD(commas=True, analyzer=RegexTokenizer() | LowercaseFilter() | SnowballStemFilter()),
            content=TEXT(vector=BM25F(), analyzer=RegexTokenizer() | LowercaseFilter() | SnowballStemFilter()),
            authors=KEYWORD(commas=True, analyzer=RegexTokenizer() | LowercaseFilter() | SnowballStemFilter()),
            publish_date=DATETIME(stored=True),
            type=TEXT(stored=True)
        )

    # Adicione documentos ao índice
    def index_document(self, document):
        writer = self.ix.writer()
        writer.add_document(
            path=document.path,
            title=document.title,
            keywords=document.keywords,
            content=document.content,
            authors=document.authors,
            publish_date=document.publish_date,
            type=document.document_type
        )
        print(f"Indexing document:")
        print(f"!!!! ==> path={document.path}")
        print(f"!!!! ==> title={document.title}")
        print(f"!!!! ==> keywords={document.keywords}")
        print(f"!!!! ==> content={document.content}")
        print(f"!!!! ==> authors={document.authors}")
        print(f"!!!! ==> publish_date={document.publish_date}")
        print(f"!!!! ==> type={document.document_type}")

        writer.commit()

    # Método para carregar documentos a partir de um JSON
    def load_documents_from_json(self, json_file):
        with open(json_file, 'r', encoding='utf-8') as file:
            documents_data = json.load(file)

        documents = []
        for data in documents_data:
            # Os campos do JSON são:
            # "type", "title", "author", "advisor", "abstract", "abstractEnglish",
            # "keywords", "subjectCnpq", "program", "productionUnit", "publisher",
            # "issueDate", "publisherCountry", "language", "rightAccess",
            # "appearsInCollections", "pdfUrl"
            date = data.get('issueDate', '')
            if date and len(date.split('-')) > 1:
                date = date.split('-')[1]
            document = Document(
                path=data.get('pdfUrl', ''),
                title=data.get('title', ''),
                keywords=data.get('keywords', ''),
                content=data.get('abstract', ''),
                authors=data.get('author', '').replace(',', '') + ',' + data.get('advisor', '').replace(',', ''),
                # TODO: conerter de string de ano para datetime
                publish_date=date,
                document_type=data.get('type', '')
            )
            documents.append(document)

        return documents

    def search(
        self,
        query,
        publish_date_from=None,
        publish_date_to=None,
        authors=None,
        document_type=None,
    ):
        # Construa a consulta base
        query_string = f"content:{(query)}"
        query_string += f" OR title:{(query)}"
        query_string += f" OR keywords:{(query)}"

        # Adicione filtros dinamicamente
        if publish_date_from and publish_date_to:
            publish_date = f"[{publish_date_from} TO {publish_date_to}]"
            query_string += f" AND publish_date:{publish_date}"
        if authors:
            query_string += f" AND authors:{(authors)}"
        if document_type:
            query_string += f" AND type:{(document_type)}"

        # Faz o parse da consulta
        parsed_query = MultifieldParser(
            ["title", "content", "publish_date"],
            schema=self.schema,
        ).parse(query_string)

        # Obtenha os resultados
        print(f"Query String: {query_string}")
        print(f"Parsed Query: {parsed_query}")
        results = self.searcher.search(parsed_query)

        # Imprima os resultados
        print(f"Total de resultados: {len(results)}")
        print(f"Resultados: {results}")

        for result in results:
            print(f"Resultado: {result}")

    def close(self):
        # Lembre-se de fechar o índice e o pesquisador após o uso
        self.searcher.close()
        self.ix.close()

# Usar o método load_documents_from_json
index_dir = "./poc/whoosh_index"
search_engine = SearchEngine(index_dir)

# Carregar documentos a partir de um JSON
documents = search_engine.load_documents_from_json(r'C:\Users\julio\Projects\UFRJ\hybrop2p\poc\parsed_doutorados.json')
print(f"Total de documentos: {len(documents)}")

# Indexar documentos
for document in documents:
    search_engine.index_document(document)

search_engine.searcher = search_engine.searcher.refresh()

# print quantidade de documentos indexados
print(f"Quantidade de documentos indexados: {search_engine.searcher.doc_count_all()}")

# Realizar uma consulta de exemplo
search_engine.search("sistemas")

# Lembre-se de fechar o SearchEngine após o uso
search_engine.close()
