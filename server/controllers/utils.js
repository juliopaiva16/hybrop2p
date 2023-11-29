// utils.js
const TermFrequencyController = require('./termFrequencyCrud');

const utils = {};

// Função auxiliar para calcular o BM25
utils.bm25 = function (keywords, documentKeywords) {
  const k1 = 1.2;
  const b = 0.75;
  const k = k1 * ((1 - b) + b * (documentKeywords.size / 100));
  var score = 0;
  keywords.forEach((value, key) => {
    const documentFrequency = documentKeywords.get(key) || 0;
    const idf = Math.log((1 + 1) / (1 + documentFrequency)) + 1;
    score += idf * ((k1 + 1) * value) / (k + value);
  });
  return score;
}

// Função auxiliar para extrair palavras do documento
utils.proccessStopWords = function (text) {
  // Por enquanto, apenas separa as palavras por espaço
  return text.split(/\s+/);
}

utils.countTermFrequencies = function (content) {
  // Extrai palavras do documento
  const words = utils.proccessStopWords(content);

  // Inicializa um mapa para contar a frequência de cada termo
  const termFrequencyMap = new Map();

  // Conta a frequência de cada termo no documento
  words.forEach((word) => {
    const normalizedWord = word.toLowerCase();
    const count = termFrequencyMap.get(normalizedWord) || 0;
    termFrequencyMap.set(normalizedWord, count + 1);
  });

  return termFrequencyMap;
}

utils.fromMapToString = function (map) {
  var strArr = [];
  map.forEach((value, key) => {
    strArr.push(key);
  });
  return strArr.join(',');
}

utils.fromStringToMap = function (keywords) {
  const termFrequencyMap = new Map();
  keywords.split(',').forEach((keyword) => {
    const count = termFrequencyMap.get(keyword) || 0;
    termFrequencyMap.set(keyword, count + 1);
  });
  return termFrequencyMap;
}

utils.countAndSyncTermFrequencies = async function (termFrequencyMap, remove=false) {
  // Atualiza a frequência na base de dados
  const updates = [];

  for (const [term, frequency] of termFrequencyMap.entries()) {
    const termEntity = await TermFrequencyController.getOrCreateTermFrequency(term);

    // Incrementa a frequência do termo na base de dados
    if (remove) termEntity.frequency -= frequency;
    else termEntity.frequency += frequency;
    updates.push(termEntity.save());
  }

  // Aguarda todas as atualizações serem concluídas
  return Promise.all(updates);
}

module.exports = utils;
