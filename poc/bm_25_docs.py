from nltk.stem.snowball import SnowballStemmer
import re
import math
import json

# Implementação de uma classe auxiliar para fazer stemming
class Stemmer:
  def __init__(self):
    self.stemmer = SnowballStemmer('portuguese')

  def stem(self, text):
    # Utiliza uma expressão regular para substituir caracteres
    # especiais por espaços
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    
    # Remove espaços extras no início e no final
    text = text.strip()
    
    text = text.split()
    return [self.stemmer.stem(word) for word in text]


# Implementação do indexador BM25 para documentos
class BM25Indexer:
  stemmer = Stemmer()

  def __init__(self, corpus, k1=1.2, b=0.75):
    # Inicializa o indexador BM25 com o corpus de documentos
    # e parâmetros k1 e b. k1 e b são parâmetros de ajuste e geralmente
    # são definidos como k1 = 1.2 e b = 0.75 (pelo Elasticsearch,
    # por exemplo)
    self.corpus = corpus # corpus de documentos
    self.k1 = k1 # ajuda a determinar as características de saturação
    self.b = b # é um multiplicador da razão entre comprimentos
    self.doc_lengths = [len(doc) for doc in corpus]
    self.avg_doc_length = sum(self.doc_lengths) / len(self.doc_lengths)
    self.doc_term_freqs = [self.get_doc_term_freqs(doc) for doc in corpus]
    self.total_docs = len(corpus)
    self.doc_freqs = self.get_doc_freqs()

  def get_doc_term_freqs(self, doc):
    # Calcula as frequências de termos para cada campo em um documento
    term_freqs = {}
    terms = self.tokenize(doc)
    for term in terms:
      term_freqs[term] = term_freqs.get(term, 0) + 1
    return term_freqs

  def get_doc_freqs(self):
    # Calcula as frequências de documentos para cada termo em todos
    # os documentos
    doc_freqs = {}
    for doc in self.corpus:
      terms = set(self.tokenize(doc))
      for term in terms:
        doc_freqs[term] = doc_freqs.get(term, 0) + 1
    return doc_freqs

  def get_idf(self, term):
    # Calcula o fator IDF (Inverse Document Frequency) para um termo
    doc_freq = self.doc_freqs.get(term, 0)
    return math.log(
      (self.total_docs - doc_freq + 0.5) / (doc_freq + 0.5) + 1.0
    )

  def get_bm25_score(self, query, doc):
    # Calcula o escore BM25 para um documento em relação a uma consulta
    score = 0
    terms = self.tokenize(query)
    for term in terms:
      idf = self.get_idf(term)
      doc_freq = self.doc_term_freqs[doc].get(term, 0)
      doc_length = self.doc_lengths[doc]
      numerator = doc_freq * (self.k1 + 1)
      denominator = (doc_freq + self.k1 * (1 - self.b + self.b * doc_length / self.avg_doc_length))
      score += idf * numerator / denominator
    return score

  def tokenize(self, text):
    # Implementa a lógica de tokenização
    # Vamos usar o Snowball Stemmer para o Português
    return self.stemmer.stem(text)

corpus = []
# corpus de documentos lido do arquivo JSON C:\Users\julio\Projects\UFRJ\hybrop2p\poc\parsed_doutorados.json
with open('poc\parsed_doutorados.json', 'r', encoding='utf-8') as f:
  corpus = json.load(f)

print(f"Total de documentos: {len(corpus)}")

# Inicializa o indexador BM25
bm25_indexer = {
  'title': BM25Indexer([doc['title'] for doc in corpus]),
  'author': BM25Indexer([doc['author'] for doc in corpus]),
  'advisor': BM25Indexer([doc['advisor'] for doc in corpus]),
  'abstract': BM25Indexer([doc['abstract'] for doc in corpus]),
  'abstractEnglish': BM25Indexer([doc['abstractEnglish'] for doc in corpus]),
  'keywords': BM25Indexer([doc['keywords'] for doc in corpus]),
}

# Consulta
def search(query, field, top_n=10):
  # Implementa a lógica de busca
  scores = []
  for i, doc in enumerate(corpus):
    score = bm25_indexer[field].get_bm25_score(query, i)
    scores.append((i, score))
  scores = sorted(scores, key=lambda x: x[1], reverse=True)
  return scores[:top_n]

# Teste
query = 'sistemas distribuídos'
field = 'abstract'
top_n = 25
scores = search(query, field, top_n)

print(f"Top {top_n} documentos para a consulta '{query}' no campo '{field}':")
print()
for i, score in scores:
  print(f"Documento: {corpus[i]['title']}")
  print(f"Score: {score}")
  print(f"Autores: {corpus[i]['author']}")
  print(f"Palavras-chave: {corpus[i]['keywords'].replace(',', '; ')}")
  print(f"URL: {corpus[i]['pdfUrl']}")
  print()