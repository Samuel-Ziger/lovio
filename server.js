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
  origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Adicionar headers de segurança
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' http2.mlstatic.com https://http2.mlstatic.com https://www.googletagmanager.com https://js-agent.newrelic.com https://static.hotjar.com https://sdk.mercadopago.com https://www.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://http2.mlstatic.com; " +
    "img-src 'self' data: https://http2.mlstatic.com; " +
    "connect-src 'self' https://api.mercadopago.com https://http2.mlstatic.com; " +
    "frame-src 'self' https://www.google.com;"
  );
  next();
});

// Middleware para parsing de JSON
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use('/api', siteRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'client/dist')));

// Rota para todas as outras requisições
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 URL do frontend: ${config.frontendUrl}`);
  console.log(`🔗 URL do backend: ${config.backendUrl}`);
  console.log(`💳 Token do Mercado Pago configurado: ${!!config.mercadoPago.accessToken}`);
  console.log(`📊 Banco de dados: ${config.database.name} em ${config.database.host}:${config.database.port}`);
}); 