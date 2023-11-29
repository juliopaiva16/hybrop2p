// TermFrequency.js
const Sequelize = require('sequelize');
const sequelize = require('../sequelize-config');

const TermFrequency = sequelize.define('TermFrequency', {
  term: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  frequency: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = TermFrequency;
