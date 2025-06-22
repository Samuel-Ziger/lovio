/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const mercadopago = require('mercadopago');
const { v4: uuidv4 } = require('uuid');

// Configuração do Express
const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'lovio',
  logging: false
});

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-123456789'
});

// Modelo Site
const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  nome_site: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  plano: {
    type: DataTypes.ENUM('basic', 'premium', 'deluxe'),
    allowNull: false
  },
  dados_json: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data_expiracao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ativo', 'expirado', 'pendente'),
    defaultValue: 'pendente'
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sites',
  timestamps: false
});

// Modelo Memory
const Memory = sequelize.define('Memory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  site_slug: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'memories',
  timestamps: false
});

// Relacionamentos
Site.hasMany(Memory, { foreignKey: 'site_slug', sourceKey: 'slug' });
Memory.belongsTo(Site, { foreignKey: 'site_slug', targetKey: 'slug' });

// Função para calcular data de expiração
function calcularDataExpiracao(plano) {
  const hoje = new Date();
  const dias = {
    'basic': 30,
    'premium': 90,
    'deluxe': 365
  };
  const dataExpiracao = new Date(hoje);
  dataExpiracao.setDate(hoje.getDate() + dias[plano]);
  return dataExpiracao;
}

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Lovio funcionando!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Teste da API Lovio' });
});

// ==================== CRUD SITES ====================

// Criar site
app.post('/api/sites', async (req, res) => {
  try {
    const { slug, nome_site, plano, dados_json } = req.body;
    
    if (!slug || !nome_site || !plano || !dados_json) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const dataExpiracao = calcularDataExpiracao(plano);
    
    const site = await Site.create({
      slug,
      nome_site,
      plano,
      dados_json: JSON.stringify(dados_json),
      data_expiracao,
      status: 'ativo'
    });

    res.status(201).json({
      message: 'Site criado com sucesso',
      site: {
        id: site.id,
        slug: site.slug,
        nome_site: site.nome_site,
        plano: site.plano,
        dados_json: JSON.parse(site.dados_json),
        data_expiracao: site.data_expiracao,
        status: site.status
      }
    });
  } catch (error) {
    console.error('Erro ao criar site:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar site por slug
app.get('/api/site/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const site = await Site.findOne({
      where: { slug },
      include: [Memory]
    });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    res.json({
      id: site.id,
      slug: site.slug,
      nome_site: site.nome_site,
      plano: site.plano,
      dados_json: JSON.parse(site.dados_json),
      data_expiracao: site.data_expiracao,
      status: site.status,
      memories: site.Memories || []
    });
  } catch (error) {
    console.error('Erro ao buscar site:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar todos os sites
app.get('/api/sites', async (req, res) => {
  try {
    const sites = await Site.findAll({
      include: [Memory]
    });

    res.json(sites.map(site => ({
      id: site.id,
      slug: site.slug,
      nome_site: site.nome_site,
      plano: site.plano,
      dados_json: JSON.parse(site.dados_json),
      data_expiracao: site.data_expiracao,
      status: site.status,
      memories: site.Memories || []
    })));
  } catch (error) {
    console.error('Erro ao listar sites:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar sites ativos
app.get('/api/sites/ativos', async (req, res) => {
  try {
    const sites = await Site.findAll({
      where: { status: 'ativo' },
      include: [Memory]
    });

    res.json(sites.map(site => ({
      id: site.id,
      slug: site.slug,
      nome_site: site.nome_site,
      plano: site.plano,
      dados_json: JSON.parse(site.dados_json),
      data_expiracao: site.data_expiracao,
      status: site.status,
      memories: site.Memories || []
    })));
  } catch (error) {
    console.error('Erro ao listar sites ativos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar site
app.put('/api/site/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const dadosAtualizacao = req.body;
    
    const site = await Site.findOne({ where: { slug } });
    
    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    await site.update(dadosAtualizacao);
    
    res.json({
      message: 'Site atualizado com sucesso',
      site: {
        id: site.id,
        slug: site.slug,
        nome_site: site.nome_site,
        plano: site.plano,
        dados_json: JSON.parse(site.dados_json),
        data_expiracao: site.data_expiracao,
        status: site.status
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar site:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar site
app.delete('/api/site/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const site = await Site.findOne({ where: { slug } });
    
    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    await site.destroy();
    
    res.json({ message: 'Site deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar site:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ==================== MEMORIES ====================

// Criar memory
app.post('/api/memories', async (req, res) => {
  try {
    const { site_slug, nome, mensagem } = req.body;
    
    if (!site_slug || !nome || !mensagem) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const memory = await Memory.create({
      site_slug,
      nome,
      mensagem
    });

    res.status(201).json({
      message: 'Memory criada com sucesso',
      memory: {
        id: memory.id,
        site_slug: memory.site_slug,
        nome: memory.nome,
        mensagem: memory.mensagem,
        data_criacao: memory.data_criacao
      }
    });
  } catch (error) {
    console.error('Erro ao criar memory:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar memories de um site
app.get('/api/memories/:site_slug', async (req, res) => {
  try {
    const { site_slug } = req.params;
    
    const memories = await Memory.findAll({
      where: { site_slug },
      order: [['data_criacao', 'DESC']]
    });

    res.json(memories);
  } catch (error) {
    console.error('Erro ao listar memories:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ==================== PAGAMENTO ====================

// Criar preferência de pagamento
app.post('/api/pagamento/preferencia', async (req, res) => {
  try {
    const { dados_site } = req.body;
    
    if (!dados_site) {
      return res.status(400).json({ error: 'Dados do site são obrigatórios' });
    }

    const { slug, nome_site, plano, dados_json } = dados_site;
    
    // Configurar preferência do Mercado Pago
    const preference = {
      items: [
        {
          title: `Site ${nome_site} - Plano ${plano}`,
          unit_price: {
            basic: 29.90,
            premium: 79.90,
            deluxe: 199.90
          }[plano],
          quantity: 1
        }
      ],
      external_reference: slug,
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'https://loviosz.web.app'}/payment/success`,
        failure: `${process.env.FRONTEND_URL || 'https://loviosz.web.app'}/payment/error`,
        pending: `${process.env.FRONTEND_URL || 'https://loviosz.web.app'}/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.FRONTEND_URL || 'https://loviosz.web.app'}/api/webhook`
    };

    const response = await mercadopago.preferences.create(preference);
    
    res.json({
      preference_id: response.body.id,
      init_point: response.body.init_point
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Webhook do Mercado Pago
app.post('/api/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      
      if (payment.body.status === 'approved') {
        const externalReference = payment.body.external_reference;
        
        // Buscar site pendente
        const site = await Site.findOne({
          where: { slug: externalReference, status: 'pendente' }
        });
        
        if (site) {
          // Ativar site
          await site.update({ status: 'ativo' });
          console.log(`Site ${externalReference} ativado após pagamento aprovado`);
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro');
  }
});

// Inicializar banco de dados
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados estabelecida.');
    
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar com banco de dados:', error);
  }
}

// Inicializar banco quando a função for carregada
initializeDatabase();

// Exportar a função HTTP
exports.api = onRequest(app);
