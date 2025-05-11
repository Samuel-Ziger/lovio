const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

// Rota para criar preferência de pagamento
router.post('/pagamento/preferencia', siteController.criarPreferencia);

// Webhook do Mercado Pago
router.post('/pagamento/webhook', siteController.webhook);

// Rota para buscar site por slug
router.get('/site/:slug', siteController.buscarSite);

module.exports = router; 