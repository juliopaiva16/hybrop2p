// index.js
const express = require('express');
const { json } = require('body-parser');
const sequelize = require('./sequelize-config');
const documentRouter = require('./routes/documentRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

// Use as rotas definidas em documents.js
app.use('/documents', documentRouter);

// Inicialize o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Trate o encerramento do aplicativo
process.on('SIGINT', () => {
  console.log('Encerrando aplicativo...');
  sequelize.close().then(() => process.exit(0));
});
