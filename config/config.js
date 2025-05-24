require('dotenv').config();

// Log das variáveis de ambiente para debug
console.log('Variáveis de ambiente:', {
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  MERCADO_PAGO_CLIENT_ID: process.env.MERCADO_PAGO_CLIENT_ID,
  MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  MERCADO_PAGO_PUBLIC_KEY: process.env.MERCADO_PAGO_PUBLIC_KEY,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

// Determinar URLs baseado no ambiente
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.RAILWAY_STATIC_URL || process.env.BACKEND_URL || 'http://localhost:8080';
  }
  return 'http://localhost:5001';
};

const baseUrl = getBaseUrl();

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || baseUrl,
  backendUrl: process.env.BACKEND_URL || baseUrl,
  mercadoPago: {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
    clientId: process.env.MERCADO_PAGO_CLIENT_ID,
    clientSecret: process.env.MERCADO_PAGO_CLIENT_SECRET
  }
}; 