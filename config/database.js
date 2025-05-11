const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('namoromemoria', 'seu_usuario', 'sua_senha', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('Não foi possível conectar ao banco de dados:', err));

module.exports = sequelize; 