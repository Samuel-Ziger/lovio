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
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001',
  mercadoPago: {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343',
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-fc533834-0b64-46f1-88ff-f4a610774e2d',
    clientId: process.env.MERCADO_PAGO_CLIENT_ID,
    clientSecret: 'a6SCnm9JWKNBZuqVStUGOEvB4u0Reqpm'
  }
}; 