const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurações do banco de dados
const dbConfig = {
  database: process.env.DB_NAME || 'namoromemoria',
  username: process.env.DB_USER || 'namoro_user',
  password: process.env.DB_PASSWORD || 'namoro123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false,
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
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error.message);
    console.log('💡 Verifique se o Docker está rodando: docker-compose up -d');
  }
};

// Executar teste de conexão
testConnection();

module.exports = sequelize; 