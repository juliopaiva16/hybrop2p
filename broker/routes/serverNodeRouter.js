// serverNodeRoutes.js
const express = require('express');
const router = express.Router();
const serverNodeCrud = require('../controllers/serverNodeCrud');

// Rota para registrar um nó servidor
router.post('/register', async (req, res) => {
  try {
    const { name, keywords } = req.body;
    const createdServerNode = await serverNodeCrud.createServerNode(name, keywords);
    res.json(createdServerNode);
  } catch (error) {
    console.error('Erro ao registrar nó servidor:', error);
    res.status(500).json({ error: 'Erro ao registrar nó servidor.' });
  }
});

// Rota para obter o status de um nó servidor
router.get('/status/:id', async (req, res) => {
  try {
    const serverNode = await serverNodeCrud.getServerNodeById(req.params.id);

    if (serverNode) {
      res.json({ status: 'online' }); // Supondo que o status online seja o padrão para simplificar o exemplo
    } else {
      res.status(404).json({ error: 'Nó servidor não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao obter status de nó servidor:', error);
    res.status(500).json({ error: 'Erro ao obter status de nó servidor.' });
  }
});

// Rota para receber uma query de um nó cliente
router.post('/query', async (req, res) => {
  const { query, sender } = req.body;

  // Lógica para processar a query
  console.log('Recebendo query:', query, 'de', sender);
  // Busca os nós server relevantes para a query
  const relevantServerNodes = await serverNodeCrud.searchServerNodesByQuery(query);

  // Lógica para enviar os nós relevantes ao nó cliente
  const results = [];
  for (let i = 0; i < relevantServerNodes.length; i++) {
    const serverNode = relevantServerNodes[i];
    results.push(serverNode.name);
  }

  // Lógica para enviar os resultados para o nó cliente
  console.log(results.length, 'servidores relevantes encontrados.');
  res.json({ results });
});

module.exports = router;
