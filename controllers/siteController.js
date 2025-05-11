const mercadopago = require('mercadopago');
const Site = require('../models/Site');
const { addYears, addMonths } = require('date-fns');

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343'
});

const siteController = {
  // Criar preferência de pagamento
  async criarPreferencia(req, res) {
    try {
      const { plano, dados_site } = req.body;
      
      const preferencia = {
        items: [{
          title: `Plano ${plano} - Namoro Memória`,
          unit_price: plano === 'anual' ? 99.90 : 199.90,
          quantity: 1,
          currency_id: 'BRL'
        }],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONTEND_URL}/pagamento/erro`
        },
        auto_return: 'approved',
        external_reference: JSON.stringify(dados_site)
      };

      const response = await mercadopago.preferences.create(preferencia);
      res.json({ init_point: response.body.init_point });
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  },

  // Webhook do Mercado Pago
  async webhook(req, res) {
    try {
      const { type, data } = req.body;

      if (type === 'payment') {
        const payment = await mercadopago.payment.findById(data.id);
        
        if (payment.status === 'approved') {
          const dados_site = JSON.parse(payment.external_reference);
          const plano = dados_site.plano;
          
          // Calcular data de expiração
          const data_criacao = new Date();
          const data_expiracao = plano === 'anual' 
            ? addYears(data_criacao, 1)
            : addYears(data_criacao, 100); // Vitalício

          // Criar site no banco
          await Site.create({
            ...dados_site,
            data_criacao,
            data_expiracao,
            status: 'ativo'
          });

          res.status(200).send('OK');
        }
      }
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ error: 'Erro ao processar webhook' });
    }
  },

  // Buscar site por slug
  async buscarSite(req, res) {
    try {
      const { slug } = req.params;
      const site = await Site.findOne({ where: { slug } });

      if (!site) {
        return res.status(404).json({ error: 'Site não encontrado' });
      }

      // Verificar expiração
      if (site.status === 'expirado' || new Date() > site.data_expiracao) {
        site.status = 'expirado';
        await site.save();
        return res.status(410).json({ error: 'Site expirado' });
      }

      res.json(site);
    } catch (error) {
      console.error('Erro ao buscar site:', error);
      res.status(500).json({ error: 'Erro ao buscar site' });
    }
  }
};

module.exports = siteController; 