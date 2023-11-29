// Document.js
const Sequelize = require('sequelize');
const sequelize = require('../sequelize-config');

const Document = sequelize.define('Document', {
  keywords: {
    type: Sequelize.STRING,
  },
  abstract: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
  },
});

module.exports = Document;
