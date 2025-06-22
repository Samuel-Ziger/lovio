require('dotenv').config();

// Log das variáveis de ambiente para debug
console.log('Variáveis de ambiente:', {
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  MERCADO_PAGO_CLIENT_ID: process.env.MERCADO_PAGO_CLIENT_ID,
  MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  MERCADO_PAGO_PUBLIC_KEY: process.env.MERCADO_PAGO_PUBLIC_KEY
});

module.exports = {
  // Configurações do Banco de Dados
  database: {
    name: process.env.DB_NAME || 'namoromemoria',
    user: process.env.DB_USER || 'namoro_user',
    password: process.env.DB_PASSWORD || 'namoro123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306
  },

  // Configurações do Mercado Pago
  mercadoPago: {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343',
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-fc533834-0b64-46f1-88ff-f4a610774e2d',
    clientId: process.env.MERCADO_PAGO_CLIENT_ID || '',
    clientSecret: process.env.MERCADO_PAGO_CLIENT_SECRET || ''
  },

  // Configurações da Aplicação
  app: {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // URLs da Aplicação
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001'
}; 