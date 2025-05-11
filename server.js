// Carregar variáveis de ambiente primeiro
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const siteRoutes = require('./routes/siteRoutes');

const app = express();

// Configurações de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rotas da API
app.use('/api', siteRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    config: {
      frontendUrl: config.frontendUrl,
      backendUrl: config.backendUrl,
      hasMpToken: !!config.mercadoPago.accessToken
    }
  });
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor com tratamento de erros
try {
  app.listen(config.port, () => {
    console.log(`Servidor rodando na porta ${config.port}`);
    console.log(`URL do frontend: ${config.frontendUrl}`);
    console.log('Token do Mercado Pago configurado:', !!config.mercadoPago.accessToken);
    console.log('Configurações CORS:', {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    });
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
} 