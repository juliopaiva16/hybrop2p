// ServerNode.js
const Sequelize = require('sequelize');
const sequelize = require('../sequelize-config');

const ServerNode = sequelize.define('ServerNode', {
  name: {
    type: Sequelize.STRING,
  },
  keywords: {
    type: Sequelize.STRING,
  },
});

module.exports = ServerNode;
