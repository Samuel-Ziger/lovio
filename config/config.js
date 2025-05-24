require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001',
  mercadoPago: {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
    clientId: process.env.MERCADO_PAGO_CLIENT_ID,
    clientSecret: process.env.MERCADO_PAGO_CLIENT_SECRET
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:5173']
  }
};

// Validação das variáveis de ambiente críticas
const requiredEnvVars = [
  'MERCADO_PAGO_ACCESS_TOKEN',
  'MERCADO_PAGO_PUBLIC_KEY',
  'MERCADO_PAGO_CLIENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Aviso: As seguintes variáveis de ambiente estão faltando:', missingEnvVars);
}

module.exports = config; 