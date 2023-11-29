// initialize-db.js
import sequelize from './sequelize-config';

sequelize.sync({ force: true }) // force: true recria as tabelas
  .then(() => {
    console.log('Banco de dados e tabelas criados.');
  })
  .catch((error) => {
    console.error('Erro ao criar banco de dados e tabelas:', error);
  })
  .finally(() => {
    sequelize.close();
  });
