// documents.js
const { Router } = require('express');
const DocumentCrud = require('../controllers/documentCrud');

const DocumentRouter = Router();

// Rota para criar um novo documento
DocumentRouter.post('/create', async (req, res) => {
  try {
    const { abstract, content } = req.body;
    console.log('Criando documento:', { abstract, content });
    const createdDocument = await DocumentCrud.createDocument(abstract, content);
    res.json(createdDocument);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    res.status(500).json({ error: 'Erro ao criar documento.' });
  }
});

// Rota para obter um documento por ID
DocumentRouter.get('/:id', async (req, res) => {
  try {
    const document = await DocumentCrud.getDocumentById(req.params.id);
    if (document) {
      console.log('Documento encontrado:', document.toJSON());
      res.json(document);
    } else {
      res.status(404).json({ error: 'Documento não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao obter documento por ID:', error);
    res.status(500).json({ error: 'Erro ao obter documento.' });
  }
});

// Rota para atualizar um documento por ID
DocumentRouter.put('/:id', async (req, res) => {
  try {
    const { abstract, content } = req.body;
    const updatedDocument = await DocumentCrud.updateDocument(req.params.id, abstract, content);
    
    if (updatedDocument) {
      res.json(updatedDocument);
    } else {
      res.status(404).json({ error: 'Documento não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar documento por ID:', error);
    res.status(500).json({ error: 'Erro ao atualizar documento.' });
  }
});

// Rota para excluir um documento por ID
DocumentRouter.delete('/:id', async (req, res) => {
  try {
    const result = await DocumentCrud.deleteDocument(req.params.id);

    if (result) {
      res.json({ message: 'Documento excluído com sucesso.' });
    } else {
      res.status(404).json({ error: 'Documento não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao excluir documento por ID:', error);
    res.status(500).json({ error: 'Erro ao excluir documento.' });
  }
});

// Rota para receber uma query
DocumentRouter.post('/query', async (req, res) => {
  try {
    // Lógica para processar a query
    const { query, sender } = req.body;
    console.log('Recebendo query:', query, 'de', sender);
    const results = await DocumentCrud.searchDocuments(query);
    console.log('Query processada com sucesso.');

    // Lógica para enviar os resultados para o nó cliente
    console.log('Enviando resultados para', sender, ':', results);
    // TODO: Enviar os resultados para o nó cliente
  } catch (error) {
    console.error('Erro ao processar query:', error);
    res.status(500).json({ error: 'Erro ao processar query.' });
  }
});

module.exports = DocumentRouter;
