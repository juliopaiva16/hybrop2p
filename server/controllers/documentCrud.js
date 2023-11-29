// documents.js
const Document = require('../models/Document');
const utils = require('../controllers/utils');

const DocumentCrud = {};

DocumentCrud.createDocument = async function (abstract, content) {
  var keywords = utils.countTermFrequencies(content);
  await utils.countAndSyncTermFrequencies(keywords);
  return Document.create({ keywords: utils.fromMapToString(keywords), abstract, content });
}

DocumentCrud.getDocumentById = async function (id) {
  return Document.findByPk(id);
}

// Procura por documentos a partir de uma query usando BM25
DocumentCrud.searchDocuments = async function (query) {
  const documents = await Document.findAll();
  const keywords = utils.countTermFrequencies(query);
  const scores = [];
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const documentKeywords = utils.fromStringToMap(document.keywords);
    const score = utils.bm25(keywords, documentKeywords);
    scores.push({ id: document.id, score });
  }
  scores.sort((a, b) => b.score - a.score);
  const results = [];
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    const document = await Document.findByPk(score.id);
    results.push({ id: document.id, abstract: document.abstract, score: score.score });
  }
  return results;
}

DocumentCrud.updateDocument = async function (id, abstract, content) {
  const document = await Document.findByPk(id);
  // Decrementa as frequências dos termos do documento antigo
  var keywords = utils.countTermFrequencies(document.content);
  await utils.countAndSyncTermFrequencies(keywords, true);
  // Incrementa as frequências dos termos do documento novo
  keywords = utils.countTermFrequencies(content);
  await utils.countAndSyncTermFrequencies();
  if (document) {
    document.keywords = utils.fromMapToString(keywords);
    document.abstract = abstract;
    document.content = content;
    return document.save();
  }
  return null;
}

DocumentCrud.deleteDocument = async function (id) {
  const document = await Document.findByPk(id);
  // Decrementa as frequências dos termos do documento
  const keywords = utils.countTermFrequencies(document.content);
  await utils.countAndSyncTermFrequencies(keywords, true);
  if (document) {
    return document.destroy();
  }
  return null;
}

module.exports = DocumentCrud;
