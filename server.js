// Carregar variáveis de ambiente primeiro
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const siteRoutes = require('./routes/siteRoutes');
const siteController = require('./controllers/siteController');

const app = express();

// Configurações de CORS
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Origem da requisição:', origin);
    const allowedOrigins = ['https://presentenamorados.vercel.app', 'http://localhost:5173'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origem bloqueada:', origin);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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

// Middleware para parsing de JSON
app.use(express.json());

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
      cors: corsOptions
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
    port: process.env.PORT || 5001,
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

// Servir arquivos estáticos do frontend apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
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

// Iniciar servidor apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`URL do frontend: ${config.frontendUrl}`);
    console.log('Token do Mercado Pago configurado:', !!config.mercadoPago.accessToken);
    console.log('Configurações CORS:', corsOptions);
  });
}

// Exportar o app para a Vercel
module.exports = app; 