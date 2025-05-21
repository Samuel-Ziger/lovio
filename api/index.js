const express = require('express');
const cors = require('cors');
const config = require('../config/config');
const siteController = require('../controllers/siteController');

const app = express();

// Configurações de CORS
app.use(cors({
  origin: ['https://presentenamorados.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Rotas da API
app.post('/pagamento/preferencia', siteController.criarPreferencia);
app.post('/pagamento/webhook', siteController.webhook);
app.get('/site/:slug', siteController.buscarSitePorSlug);

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message
  });
});

module.exports = app; 