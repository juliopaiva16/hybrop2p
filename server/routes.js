import docs from './controllers/docs.js';
import express from 'express';

// cria rotas como um modulo express
var routes = express.Router();

// rota para obter o json tfidf
routes.get('/tfidf', docs.getTFIDF);

// rota para obter os documentos
routes.get('/docs', docs.getDocuments);

// rota para atualizar o tfidf
// routes.post('/docs', docs.updateTFIDF);

// rota para obter os documentos similares
routes.post('/docs/similar', docs.getSimilarDocs);

// rota para calcular todos os tfidf e salvar no arquivo tfidf.json
routes.post('/docs/update', docs.updateAllTFIDF);

// exporta as rotas
export default routes;

// exemplo de curl para calcular todos os tfidf e salvar no arquivo tfidf.json
// curl -X POST http://localhost:3000/docs/update