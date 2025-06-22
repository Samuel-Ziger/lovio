const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

// ==================== CRUD ROUTES ====================

// CREATE - Criar site
router.post('/sites', siteController.criarSite);

// READ - Buscar site por slug
router.get('/site/:slug', siteController.buscarSitePorSlug);

// READ - Listar todos os sites
router.get('/sites', siteController.listarSites);

// READ - Listar sites ativos
router.get('/sites/ativos', siteController.listarSitesAtivos);

// UPDATE - Atualizar site
router.put('/site/:slug', siteController.atualizarSite);

// DELETE - Deletar site
router.delete('/site/:slug', siteController.deletarSite);

// ==================== PAYMENT ROUTES ====================

// Criar preferência de pagamento
router.post('/pagamento/preferencia', siteController.criarPreferencia);

// Webhook do Mercado Pago
router.post('/pagamento/webhook', siteController.webhook);

// ==================== UTILITY ROUTES ====================

// Health check
router.get('/health', siteController.healthCheck);

// Teste da API
router.get('/test', siteController.testAPI);

module.exports = router; 