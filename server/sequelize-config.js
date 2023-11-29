// sequelize-config.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Nome do arquivo SQLite
});

// exporte as funções sync, close e define
module.exports = sequelize;