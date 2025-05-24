// Carregar variáveis de ambiente primeiro
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const siteRoutes = require('./routes/siteRoutes');
const siteController = require('./controllers/siteController');

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Configurações de CORS
const corsOptions = {
  origin: '*', // Temporariamente permitindo todas as origens para debug
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Origin:', req.headers.origin);
  next();
});

// Rotas da API
app.use('/api', siteRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  const agora = new Date();
  res.json({ 
    status: 'ok', 
    timestamp: agora.toISOString(),
    serverTime: agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    config: {
      frontendUrl: config.frontendUrl,
      backendUrl: config.backendUrl,
      hasMpToken: !!config.mercadoPago.accessToken,
      environment: process.env.NODE_ENV,
      port: process.env.PORT
    }
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  const agora = new Date();
  res.json({ 
    message: 'API funcionando!',
    serverTime: agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    environment: process.env.NODE_ENV,
    cors: corsOptions
  });
});

// Rota de teste POST
app.post('/api/test-post', (req, res) => {
  console.log('Teste POST recebido:', {
    body: req.body,
    headers: req.headers,
    method: req.method
  });
  
  res.json({ 
    message: 'POST funcionando!',
    receivedData: req.body,
    headers: req.headers
  });
});

// Adicionar headers de segurança
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.mercadopago.com https://*.mlstatic.com https://www.googletagmanager.com https://js-agent.newrelic.com https://static.hotjar.com https://sdk.mercadopago.com https://www.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://*.mlstatic.com; " +
    "img-src 'self' data: https://*.mlstatic.com; " +
    "connect-src 'self' https://*.mercadopago.com https://*.mlstatic.com https://api.mercadopago.com; " +
    "frame-src 'self' https://*.mercadopago.com https://www.google.com;"
  );
  next();
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL do frontend: ${config.frontendUrl}`);
  console.log(`URL do backend: ${config.backendUrl}`);
  console.log('Token do Mercado Pago configurado:', !!config.mercadoPago.accessToken);
  console.log('Configurações CORS:', corsOptions);
  console.log('Ambiente:', process.env.NODE_ENV);
});

// Exportar o app
module.exports = app; 