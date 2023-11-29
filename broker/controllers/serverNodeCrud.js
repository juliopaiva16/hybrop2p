// serverNodeCrud.js
const ServerNode = require('../models/ServerNode');

const ServerNodeCrud = {};

ServerNodeCrud.searchServerNodesByQuery = async function (query) {
  // TODO: verificar se está correto
  return ServerNode.findAll({
    where: {
      keywords: {
        [Op.like]: `%${query}%`,
      },
    },
  });
}

ServerNodeCrud.createServerNode = async function (name, keywords) {
  return ServerNode.create({ name, keywords });
}

ServerNodeCrud.getServerNodeById = async function (id) {
  return ServerNode.findByPk(id);
}

ServerNodeCrud.updateServerNode = async function (id, name, keywords) {
  const serverNode = await ServerNode.findByPk(id);

  if (serverNode) {
    serverNode.name = name;
    serverNode.keywords = keywords;
    return serverNode.save();
  }

  return null;
}

ServerNodeCrud.deleteServerNode = async function (id) {
  const serverNode = await ServerNode.findByPk(id);

  if (serverNode) {
    return serverNode.destroy();
  }

  return null;
}

module.exports = ServerNodeCrud;
