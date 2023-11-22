import utils from '../utils.js';

var docs = {};

// função que recebe requisião POST para /docs
// e atualiza o arquivo tfidf.json
docs.updateTFIDF = async function (req, res) {
  // calcula o tfidf
  var tfidf = await utils.updateTFIDF(req.body.doc);

  // resposta com status 200
  res.status(200).send(tfidf);
}

// função que recebe requisição GET para /docs
// e retorna o arquivo tfidf.json
docs.getTFIDF = async function (req, res) {
  var tfidf = await utils.getTFIDF();
  // resposta com status 200
  res.status(200).send(tfidf);
}

// função que recebe requisição GET para /docs
// e retorna os documentos
docs.getDocuments = async function (req, res) {
  var documents = await utils.getDocuments();
  // resposta com status 200
  res.status(200).send(documents);
}

// função que recebe requisição POST para /docs/similar
// e retorna os documentos similares
docs.getSimilarDocs = async function (req, res) {
  // calcula os documentos similares
  var similarDocs = await utils.getSimilarDocs(req.body.query);

  // resposta com status 200
  res.status(200).send(similarDocs);
}

// função que recebe requisição POST para /docs
// e adiciona um novo documento
docs.addNewDocument = async function (req, res) {
  // adiciona o documento
  await utils.addNewDocument(req.body.doc);

  // resposta com status 200
  res.status(200).send();
}

// função que recebe requisição POST para /docs/update
// e atualiza o tfidf de todos os documentos
docs.updateAllTFIDF = async function (req, res) {
  // atualiza o tfidf de todos os documentos
  await utils.updateAllTFIDF();

  // resposta com status 200
  res.status(200).send();
}


export default docs;