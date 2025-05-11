const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const router = express.Router();

// Banco de dados em memória
const sites = new Map();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: config.mercadoPago.accessToken
});

// Criar preferência de pagamento
router.post('/pagamento/preferencia', async (req, res) => {
  try {
    const { siteData } = req.body;
    console.log('Dados recebidos:', siteData);

    // Definir preço baseado no plano
    let price;
    switch(siteData.plan) {
      case 'basic':
        price = 1.00;
        break;
      case 'premium':
        price = 49.90;
        break;
      case 'deluxe':
        price = 99.90;
        break;
      default:
        price = 1.00;
    }

    const preference = new Preference(client);
    const result = await preference.create({
      items: [
        {
          title: `Site ${siteData.plan.charAt(0).toUpperCase() + siteData.plan.slice(1)}`,
          unit_price: price,
          quantity: 1,
          currency_id: "BRL",
          description: `Criação de site no plano ${siteData.plan}`
        }
      ],
      back_urls: {
        success: `${config.frontendUrl}/success`,
        failure: `${config.frontendUrl}/failure`,
        pending: `${config.frontendUrl}/pending`
      },
      auto_return: "approved",
      notification_url: `${config.backendUrl}/api/pagamento/webhook`,
      external_reference: siteData.slug,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60000).toISOString()
    });

    console.log('Preferência criada:', result);
    res.json(result);
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message 
    });
  }
});

// Webhook do Mercado Pago
exports.webhook = async (req, res) => {
  try {
    console.log('Webhook recebido:', req.body);

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: config.mercadoPago.accessToken
    });

    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      console.log('Pagamento encontrado:', payment.body);

      const siteId = payment.body.external_reference;

      if (payment.body.status === 'approved') {
        const site = sites.get(siteId);
        if (site) {
          site.status = 'ativo';
          sites.set(siteId, site);
          console.log('Site atualizado:', site);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || error.stack
    });
  }
};

// Buscar site por slug
exports.buscarSitePorSlug = (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Buscando site por slug:', slug);

    const site = Array.from(sites.values()).find(s => s.slug === slug);

    if (!site) {
      console.log('Site não encontrado');
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    if (site.status !== 'ativo') {
      console.log('Site não está ativo:', site.status);
      return res.status(403).json({ error: 'Site não está ativo' });
    }

    if (new Date() > site.data_expiracao) {
      console.log('Site expirado');
      return res.status(403).json({ error: 'Site expirado' });
    }

    console.log('Site encontrado:', site);
    res.json(site);
  } catch (error) {
    console.error('Erro ao buscar site:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
}; 