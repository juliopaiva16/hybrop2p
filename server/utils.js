import fs from 'fs';

var utils = {};

// abre os arquivos documents.json e tfidf.json em raiz/server/src/
utils.documents = JSON.parse(fs.readFileSync('./server/src/documents.json', 'utf8'));
utils.tfidf = JSON.parse(fs.readFileSync('./server/src/tfidf.json', 'utf8'));

// função que adiciona um novo documento e atualiza o tfidf
utils.addNewDocument = function (doc) {
  // adiciona o documento no array de documentos
  utils.documents.push(doc);
  utils.saveDocuments();

  utils.updateTFIDF(doc);
}

// função que salva o arquivo documents.json
utils.saveDocuments = function () {
  // salva o arquivo documents.json
  fs.writeFile('./server/src/documents.json', JSON.stringify(utils.documents), function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

// função que salva o arquivo tfidf.json
utils.saveTFIDF = function () {
  // salva o arquivo tfidf.json
  fs.writeFile('./server/src/tfidf.json', JSON.stringify(utils.tfidf), function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

// para todos os documentos, calcula o tfidf e salva no arquivo tfidf.json
utils.updateAllTFIDF = function () {
  for (var i = 0; i < utils.documents.length; i++) {
    var doc = utils.documents[i];
    utils.updateTFIDF(doc, false);
  }

  // salva o arquivo tfidf.json
  utils.saveTFIDF();
  
}

// função que, ao receber um novo documento, calcula o tfidf
// e atualiza o arquivo tfidf.json
utils.updateTFIDF = function (doc, save = true) {
  if (!doc) {
    return;
  }

  // calcula o tfidf
  var _tfidf = utils.calcTFIDF(doc);

  // atualiza o arquivo tfidf.json somando o tfidf calculado
  // com o tfidf já existente
  // utils.tfidf tem formato [{word: 'word', tfidf: 0.1}]
  for (var word in _tfidf) {
    if (_tfidf.hasOwnProperty(word)) {
      var found = false;
      for (var i = 0; i < utils.tfidf.length; i++) {
        var tfidf = utils.tfidf[i];
        if (tfidf.word === word) {
          tfidf.tfidf = tfidf.tfidf + _tfidf[word];
          found = true;
          break;
        }
      }
      if (!found) {
        utils.tfidf.push({word: word, tfidf: _tfidf[word]});
      }
    }
  }

  if (save) {
    // salva o arquivo tfidf.json
    utils.saveTFIDF();
  }
}

// função que calcula o tfidf de um documento
utils.calcTFIDF = function (doc) {
  // calcula o tf
  var tf = utils.calcTF(doc);

  // calcula o idf
  var idf = utils.calcIDF(doc);

  // calcula o tfidf
  var _tfidf = {};
  for (var word in tf) {
    if (tf.hasOwnProperty(word)) {
      _tfidf[word] = tf[word] * idf[word];
    }
  }

  return _tfidf;
}

// função que calcula o tf de um documento
utils.calcTF = function (doc) {
  // cria um objeto vazio para armazenar o tf
  var tf = {};

  // cria um array com as palavras do documento
  var words = doc.text.split(' ');

  // calcula o tf de cada palavra
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (tf.hasOwnProperty(word)) {
      tf[word] = tf[word] + 1;
    } else {
      tf[word] = 1;
    }
  }

  // divide o tf pelo número de palavras do documento
  for (var word in tf) {
    if (tf.hasOwnProperty(word)) {
      tf[word] = tf[word] / words.length;
    }
  }

  return tf;
}

// função que calcula o idf de um documento
utils.calcIDF = function (doc) {
  // cria um objeto vazio para armazenar o idf
  var idf = {};

  // cria um array com as palavras do documento
  var words = doc.text.split(' ');

  // calcula o idf de cada palavra
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (idf.hasOwnProperty(word)) {
      idf[word] = idf[word] + 1;
    } else {
      idf[word] = 1;
    }
  }

  // divide o idf pelo número de palavras do documento
  for (var word in idf) {
    if (idf.hasOwnProperty(word)) {
      idf[word] = Math.log(words.length / idf[word]);
    }
  }

  return idf;
}

// função que calcula a similaridade entre uma consulta e um documento
utils.calcSimilarity = function (query, doc) {
  // calcula o tfidf da consulta
  var tfidfQuery = utils.calcTFIDF(query);

  // calcula o tfidf do documento
  var tfidfDoc = utils.calcTFIDF(doc);

  // calcula a similaridade entre a consulta e o documento
  var similarity = 0;
  for (var word in tfidfQuery) {
    if (tfidfQuery.hasOwnProperty(word)) {
      if (tfidfDoc.hasOwnProperty(word)) {
        similarity = similarity + tfidfQuery[word] * tfidfDoc[word];
      }
    }
  }

  return similarity;
}

// função que retorna os documentos com alta similaridade com a consulta
utils.getSimilarDocs = function (query) {
  // cria um array vazio para armazenar os documentos
  var docs = [];

  // calcula a similaridade entre a consulta e cada documento
  for (var i = 0; i < utils.documents.length; i++) {
    var doc = utils.documents[i];
    var similarity = utils.calcSimilarity(query, doc);

    // se a similaridade for maior que 0.1, adiciona o documento no array
    if (similarity > 0.1) {
      docs.push(doc);
    }
  }

  return docs;
}

utils.getTFIDF = function () {
  return JSON.stringify(utils.tfidf);
}

utils.getDocuments = function () {
  return JSON.stringify(utils.documents);
}

export default utils;