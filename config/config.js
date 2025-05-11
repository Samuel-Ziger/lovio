require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5001',
  mercadoPago: {
    accessToken: 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343'
  }
}; 