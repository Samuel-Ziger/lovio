require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001',
  mercadoPago: {
    accessToken: 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343',
    publicKey: 'APP_USR-fc533834-0b64-46f1-88ff-f4a610774e2d',
    clientId: process.env.MERCADO_PAGO_CLIENT_ID,
    clientSecret: 'a6SCnm9JWKNBZuqVStUGOEvB4u0Reqpm'
  }
}; 