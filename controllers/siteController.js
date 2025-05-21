const { MercadoPagoConfig, Preference } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Banco de dados em memória
const sites = new Map();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: config.mercadoPago.accessToken
});

// Log da configuração do Mercado Pago
console.log('Configuração do Mercado Pago:', {
    accessToken: config.mercadoPago.accessToken,
    publicKey: config.mercadoPago.publicKey,
    clientId: config.mercadoPago.clientId,
    clientSecret: config.mercadoPago.clientSecret,
    frontendUrl: config.frontendUrl,
    backendUrl: config.backendUrl
});

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    console.log('Requisição recebida:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });

    if (!req.body || !req.body.dados_site) {
      console.error('Dados inválidos recebidos:', req.body);
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: 'O corpo da requisição deve conter dados_site'
      });
    }

    const { dados_site } = req.body;

    // Validar dados obrigatórios
    if (!dados_site.nome_site || !dados_site.plano || !dados_site.slug) {
      console.error('Dados obrigatórios faltando:', dados_site);
      return res.status(400).json({
        error: 'Dados incompletos',
        details: 'nome_site, plano e slug são obrigatórios'
      });
    }

    // Definir preço baseado no plano
    let preco;
    switch (dados_site.plano) {
      case 'basic':
        preco = 19.99;
        break;
      case 'premium':
        preco = 39.90;
        break;
      case 'deluxe':
        preco = 59.90;
        break;
      default:
        console.error('Plano inválido:', dados_site.plano);
        return res.status(400).json({
          error: 'Plano inválido',
          details: 'O plano deve ser basic, premium ou deluxe'
        });
    }

    const agora = new Date();
    const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

    // URLs fixas para produção
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://presentenamorados.vercel.app'
      : 'http://localhost:5173';
    
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'https://presentenamorados.vercel.app'
      : 'http://localhost:5001';

    console.log('Ambiente:', process.env.NODE_ENV);
    console.log('URLs configuradas:', { frontendUrl, backendUrl });
    console.log('Token do Mercado Pago:', config.mercadoPago.accessToken ? 'Configurado' : 'Não configurado');

    const preferencia = {
      items: [{
        title: `Site ${dados_site.nome_site} - Plano ${dados_site.plano}`,
        unit_price: preco,
        quantity: 1,
        currency_id: 'BRL'
      }],
      back_urls: {
        success: `${frontendUrl}/pagamento/sucesso`,
        failure: `${frontendUrl}/pagamento/erro`,
        pending: `${frontendUrl}/pagamento/pendente`
      },
      external_reference: dados_site.slug,
      notification_url: `${backendUrl}/api/pagamento/webhook`,
      statement_descriptor: 'MEMORIA SITE',
      expires: true,
      expiration_date_from: agora.toISOString(),
      expiration_date_to: trintaMinutosDepois.toISOString(),
      payment_methods: {
        excluded_payment_types: [],
        installments: 1
      }
    };

    console.log('Criando preferência com os dados:', JSON.stringify(preferencia, null, 2));

    const preference = new Preference(client);
    const response = await preference.create({ body: preferencia });
    
    console.log('Preferência criada com sucesso:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Verificar se é um erro de autenticação
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Erro de autenticação com o Mercado Pago',
        details: 'Token de acesso inválido ou expirado'
      });
    }

    // Verificar se é um erro de método não permitido
    if (error.response?.status === 405) {
      return res.status(405).json({
        error: 'Método não permitido',
        details: 'Verifique se a URL e o método da requisição estão corretos'
      });
    }

    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message,
      status: error.response?.status
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