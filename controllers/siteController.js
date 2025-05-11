const { MercadoPagoConfig, Preference } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Banco de dados em memória
const sites = new Map();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343'
});

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    console.log('Requisição recebida:', req);
    const { dados_site } = req.body;

    // Definir preço baseado no plano
    let preco;
    switch (dados_site.plano) {
      case 'basic':
        preco = 1.00;
        break;
      case 'premium':
        preco = 39.90;
        break;
      case 'deluxe':
        preco = 59.90;
        break;
      default:
        preco = 1.00;
    }

    const agora = new Date();
    const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

    const preferencia = {
      items: [{
        title: `Site ${dados_site.nome_site} - Plano ${dados_site.plano}`,
        unit_price: preco,
        quantity: 1,
        currency_id: 'BRL'
      }],
      back_urls: {
        success: 'http://localhost:5173/sucesso',
        failure: 'http://localhost:5173/erro',
        pending: 'http://localhost:5173/pendente'
      },
      external_reference: dados_site.slug,
      notification_url: 'http://localhost:5001/api/pagamento/webhook',
      statement_descriptor: 'MEMORIA SITE',
      expires: true,
      expiration_date_from: agora.toISOString(),
      expiration_date_to: trintaMinutosDepois.toISOString(),
      payment_methods: {
        excluded_payment_types: [],
        installments: 1
      }
    };

    console.log('Criando preferência com os dados:', preferencia);

    const preference = new Preference(client);
    const response = await preference.create({ body: preferencia });
    
    console.log('Preferência criada com sucesso:', response);
    res.json(response);
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message 
    });
  }
};

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