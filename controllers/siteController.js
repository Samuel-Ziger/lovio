const { MercadoPagoConfig, Preference } = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const Site = require('../models/Site');
const { Op } = require('sequelize');

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

// Função para calcular data de expiração baseada no plano
const calcularExpiracao = (plano) => {
  const agora = new Date();
  switch (plano) {
    case 'basic':
      return new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano
    case 'premium':
      return new Date(agora.getTime() + 2 * 365 * 24 * 60 * 60 * 1000); // 2 anos
    case 'deluxe':
      return new Date(agora.getTime() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 anos
    default:
      return new Date(agora.getTime() + 30 * 60 * 1000); // 30 minutos (padrão)
  }
};

// ==================== CRUD OPERATIONS ====================

// CREATE - Criar site
exports.criarSite = async (req, res) => {
  try {
    console.log('Criando site:', req.body);
    const { slug, nome_site, plano, dados_json } = req.body;

    // Validar dados obrigatórios
    if (!slug || !nome_site || !plano || !dados_json) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios faltando',
        required: ['slug', 'nome_site', 'plano', 'dados_json']
      });
    }

    // Verificar se o slug já existe
    const siteExistente = await Site.findOne({ where: { slug } });
    if (siteExistente) {
      return res.status(409).json({ 
        error: 'Slug já existe',
        slug: slug
      });
    }

    // Calcular data de expiração
    const data_expiracao = calcularExpiracao(plano);

    // Criar site no banco
    const site = await Site.create({
      slug,
      nome_site,
      plano,
      data_criacao: new Date(),
      data_expiracao,
      dados_json: JSON.stringify(dados_json),
      status: 'ativo'
    });

    console.log('✅ Site criado com sucesso:', site.slug);
    res.status(201).json({
      message: 'Site criado com sucesso',
      site: {
        id: site.id,
        slug: site.slug,
        nome_site: site.nome_site,
        plano: site.plano,
        data_criacao: site.data_criacao,
        data_expiracao: site.data_expiracao,
        status: site.status
      }
    });

  } catch (error) {
    console.error('❌ Erro ao criar site:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// READ - Buscar site por slug
exports.buscarSitePorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('🔍 Buscando site por slug:', slug);

    const site = await Site.findOne({ where: { slug } });

    if (!site) {
      console.log('❌ Site não encontrado');
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    if (site.status !== 'ativo') {
      console.log('❌ Site não está ativo:', site.status);
      return res.status(403).json({ error: 'Site não está ativo' });
    }

    if (new Date() > site.data_expiracao) {
      console.log('❌ Site expirado');
      return res.status(403).json({ error: 'Site expirado' });
    }

    console.log('✅ Site encontrado:', site.slug);
    res.json({
      id: site.id,
      slug: site.slug,
      nome_site: site.nome_site,
      plano: site.plano,
      data_criacao: site.data_criacao,
      data_expiracao: site.data_expiracao,
      status: site.status,
      dados_json: JSON.parse(site.dados_json)
    });

  } catch (error) {
    console.error('❌ Erro ao buscar site:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// READ - Listar todos os sites
exports.listarSites = async (req, res) => {
  try {
    console.log('📋 Listando todos os sites');

    const sites = await Site.findAll({
      order: [['data_criacao', 'DESC']],
      attributes: ['id', 'slug', 'nome_site', 'plano', 'data_criacao', 'data_expiracao', 'status']
    });

    console.log(`✅ ${sites.length} sites encontrados`);
    res.json({
      total: sites.length,
      sites: sites
    });

  } catch (error) {
    console.error('❌ Erro ao listar sites:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// READ - Listar sites ativos
exports.listarSitesAtivos = async (req, res) => {
  try {
    console.log('📋 Listando sites ativos');

    const sites = await Site.findAll({
      where: { 
        status: 'ativo',
        data_expiracao: {
          [Op.gt]: new Date()
        }
      },
      order: [['data_criacao', 'DESC']],
      attributes: ['id', 'slug', 'nome_site', 'plano', 'data_criacao', 'data_expiracao']
    });

    console.log(`✅ ${sites.length} sites ativos encontrados`);
    res.json({
      total: sites.length,
      sites: sites
    });

  } catch (error) {
    console.error('❌ Erro ao listar sites ativos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// UPDATE - Atualizar site
exports.atualizarSite = async (req, res) => {
  try {
    const { slug } = req.params;
    const { nome_site, plano, dados_json, status } = req.body;

    console.log('🔄 Atualizando site:', slug);

    const site = await Site.findOne({ where: { slug } });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {};
    if (nome_site) dadosAtualizacao.nome_site = nome_site;
    if (plano) {
      dadosAtualizacao.plano = plano;
      dadosAtualizacao.data_expiracao = calcularExpiracao(plano);
    }
    if (dados_json) dadosAtualizacao.dados_json = JSON.stringify(dados_json);
    if (status) dadosAtualizacao.status = status;

    // Atualizar site
    await site.update(dadosAtualizacao);

    console.log('✅ Site atualizado com sucesso:', slug);
    res.json({
      message: 'Site atualizado com sucesso',
      site: {
        id: site.id,
        slug: site.slug,
        nome_site: site.nome_site,
        plano: site.plano,
        data_criacao: site.data_criacao,
        data_expiracao: site.data_expiracao,
        status: site.status
      }
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar site:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// DELETE - Deletar site
exports.deletarSite = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('🗑️ Deletando site:', slug);

    const site = await Site.findOne({ where: { slug } });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    await site.destroy();

    console.log('✅ Site deletado com sucesso:', slug);
    res.json({
      message: 'Site deletado com sucesso',
      slug: slug
    });

  } catch (error) {
    console.error('❌ Erro ao deletar site:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
};

// ==================== PAYMENT OPERATIONS ====================

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    console.log('💳 Criando preferência de pagamento:', req.body);
    const { dados_site } = req.body;

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
        preco = 19.99;
    }

    const agora = new Date();
    const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

    // URLs dinâmicas baseadas na configuração
    const frontendUrl = config.frontendUrl;
    const backendUrl = config.backendUrl;

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

    console.log('📋 Preferência criada:', JSON.stringify(preferencia, null, 2));

    const preference = new Preference(client);
    const response = await preference.create({ body: preferencia });
    
    console.log('✅ Preferência criada com sucesso');
    res.json(response);

  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message 
    });
  }
};

// Webhook do Mercado Pago
exports.webhook = async (req, res) => {
  try {
    console.log('🔔 Webhook recebido:', req.body);

    const { type, data } = req.body;

    if (type === 'payment') {
      // Buscar pagamento no Mercado Pago
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: {
          'Authorization': `Bearer ${config.mercadoPago.accessToken}`
        }
      }).then(res => res.json());

      console.log('💳 Pagamento encontrado:', payment.status);

      const siteSlug = payment.external_reference;

      if (payment.status === 'approved') {
        // Buscar site no banco
        const site = await Site.findOne({ where: { slug: siteSlug } });
        
        if (site) {
          // Atualizar status do site
          await site.update({ status: 'ativo' });
          console.log('✅ Site ativado:', siteSlug);
        } else {
          // Se o site não existe no banco, criar com os dados do pagamento
          console.log('📝 Criando site no banco após pagamento aprovado:', siteSlug);
          
          // Preparar dados básicos do site
          const dadosSite = {
            slug: siteSlug,
            nome_site: payment.description || `Site ${siteSlug}`,
            plano: 'basic', // Plano padrão, pode ser melhorado
            data_criacao: new Date(),
            data_expiracao: calcularExpiracao('basic'),
            dados_json: JSON.stringify({
              titulo: payment.description || `Site ${siteSlug}`,
              mensagem: 'Site criado após pagamento aprovado',
              data: new Date().toISOString().split('T')[0],
              imagens: [],
              emojis: ['💕'],
              musica: null
            }),
            status: 'ativo'
          };

          await Site.create(dadosSite);
          console.log('✅ Site criado no banco:', siteSlug);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
};

// ==================== UTILITY OPERATIONS ====================

// Health check
exports.healthCheck = async (req, res) => {
  try {
    const agora = new Date();
    res.json({ 
      status: 'ok', 
      timestamp: agora.toISOString(),
      serverTime: agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      config: {
        frontendUrl: config.frontendUrl,
        backendUrl: config.backendUrl,
        hasMpToken: !!config.mercadoPago.accessToken
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
};

// Teste da API
exports.testAPI = async (req, res) => {
  try {
    const agora = new Date();
    res.json({ 
      message: 'API funcionando!',
      serverTime: agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      database: 'MySQL conectado',
      mercadoPago: 'Configurado'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
}; 