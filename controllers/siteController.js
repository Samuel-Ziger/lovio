const mercadopago = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Banco de dados em memória
const sites = new Map();

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    console.log('Requisição recebida:', {
      body: req.body,
      headers: req.headers
    });

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: config.mercadoPago.accessToken
    });

    const { dados_site } = req.body;
    console.log('Dados do site recebidos:', dados_site);

    if (!dados_site) {
      console.error('Dados do site não fornecidos');
      return res.status(400).json({ error: 'Dados do site não fornecidos' });
    }

    // Validar dados obrigatórios
    if (!dados_site.plano || !dados_site.nome_site) {
      console.error('Dados obrigatórios faltando:', dados_site);
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
    }

    // Definir preço baseado no plano
    let preco;
    switch (dados_site.plano) {
      case 'basic':
        preco = 19.90;
        break;
      case 'premium':
        preco = 39.90;
        break;
      case 'deluxe':
        preco = 59.90;
        break;
      default:
        console.error('Plano inválido:', dados_site.plano);
        return res.status(400).json({ error: 'Plano inválido' });
    }

    const agora = new Date();
    const preferencia = {
      items: [{
        title: `Site ${dados_site.nome_site} - Plano ${dados_site.plano}`,
        unit_price: preco,
        quantity: 1,
        currency_id: 'BRL'
      }],
      back_urls: {
        success: `${config.frontendUrl}/pagamento/sucesso`,
        failure: `${config.frontendUrl}/pagamento/erro`,
        pending: `${config.frontendUrl}/pagamento/pendente`
      },
      external_reference: dados_site.slug,
      notification_url: `${config.backendUrl}/api/pagamento/webhook`,
      statement_descriptor: 'MEMORIA SITE',
      expires: true,
      expiration_date_from: agora.toISOString().replace('Z', '-03:00'),
      expiration_date_to: new Date(agora.getTime() + 30 * 60 * 1000).toISOString().replace('Z', '-03:00') // 30 minutos
    };

    console.log('Criando preferência:', preferencia);
    const response = await mercadopago.preferences.create(preferencia);
    console.log('Resposta do Mercado Pago:', response);

    // Salvar dados do site temporariamente
    const siteId = uuidv4();
    sites.set(siteId, {
      ...dados_site,
      id: siteId,
      status: 'pendente',
      data_criacao: new Date(),
      data_expiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
    });

    console.log('Site salvo:', sites.get(siteId));

    res.json({
      init_point: response.body.init_point,
      site_id: siteId
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || error.stack
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