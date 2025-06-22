const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurações do banco de dados
const dbConfig = {
  database: process.env.DB_NAME || 'lovio_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Teste de conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    console.log(`📊 Banco: ${dbConfig.database}`);
    console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    console.log('💡 Verifique se o Docker está rodando: docker-compose up -d');
    return false;
  }
};

// Executar teste de conexão
testConnection();

module.exports = { sequelize, testConnection }; 