// Serviço para integração direta com Mercado Pago
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-fc533834-0b64-46f1-88ff-f4a610774e2d';
const MERCADO_PAGO_ACCESS_TOKEN = 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343';

export const mercadopagoService = {
  // Inicializar Mercado Pago
  init() {
    if (typeof window !== 'undefined' && window.Mercadopago) {
      window.Mercadopago.setPublishableKey(MERCADO_PAGO_PUBLIC_KEY);
    }
  },

  // Criar preferência de pagamento
  async criarPreferencia(dados_site) {
    try {
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
          success: `${window.location.origin}/pagamento/sucesso`,
          failure: `${window.location.origin}/pagamento/erro`,
          pending: `${window.location.origin}/pagamento/pendente`
        },
        external_reference: dados_site.slug,
        statement_descriptor: 'MEMORIA SITE',
        expires: true,
        expiration_date_from: agora.toISOString(),
        expiration_date_to: trintaMinutosDepois.toISOString(),
        payment_methods: {
          excluded_payment_types: [],
          installments: 1
        }
      };

      // Salvar dados do site no localStorage para recuperação posterior
      localStorage.setItem('site_data', JSON.stringify({
        ...dados_site,
        data_criacao: agora.toISOString(),
        data_expiracao: trintaMinutosDepois.toISOString(),
        status: 'pendente'
      }));

      // Criar preferência real no Mercado Pago
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferencia)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar preferência no Mercado Pago');
      }

      const data = await response.json();
      console.log('Preferência criada no Mercado Pago:', data);
      
      return data;

    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      throw error;
    }
  },

  // Processar pagamento de sucesso
  processarSucesso(payment_id, status) {
    try {
      const siteData = localStorage.getItem('site_data');
      if (siteData) {
        const dados = JSON.parse(siteData);
        dados.status = status === 'approved' ? 'ativo' : 'pendente';
        dados.payment_id = payment_id;
        dados.data_pagamento = new Date().toISOString();
        
        localStorage.setItem('site_data', JSON.stringify(dados));
        
        // Salvar no localStorage como site ativo
        const sitesAtivos = JSON.parse(localStorage.getItem('sites_ativos') || '[]');
        sitesAtivos.push(dados);
        localStorage.setItem('sites_ativos', JSON.stringify(sitesAtivos));
        
        return dados;
      }
    } catch (error) {
      console.error('Erro ao processar sucesso:', error);
      throw error;
    }
  },

  // Buscar site por slug
  buscarSite(slug) {
    try {
      const sitesAtivos = JSON.parse(localStorage.getItem('sites_ativos') || '[]');
      const site = sitesAtivos.find(s => s.slug === slug);
      
      if (!site) {
        throw new Error('Site não encontrado');
      }

      if (site.status !== 'ativo') {
        throw new Error('Site não está ativo');
      }

      if (new Date() > new Date(site.data_expiracao)) {
        throw new Error('Site expirado');
      }

      return site;
    } catch (error) {
      console.error('Erro ao buscar site:', error);
      throw error;
    }
  },

  // Listar sites ativos
  listarSites() {
    try {
      return JSON.parse(localStorage.getItem('sites_ativos') || '[]');
    } catch (error) {
      console.error('Erro ao listar sites:', error);
      return [];
    }
  },

  // Verificar status do pagamento
  async verificarPagamento(payment_id) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar pagamento');
      }

      const payment = await response.json();
      return payment;
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      throw error;
    }
  }
}; 