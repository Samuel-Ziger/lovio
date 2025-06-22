const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nome_site: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plano: {
    type: DataTypes.ENUM('basic', 'premium', 'deluxe'),
    allowNull: false
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  data_expiracao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dados_json: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'pendente'),
    allowNull: false,
    defaultValue: 'pendente'
  }
});

module.exports = Site; 