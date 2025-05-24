const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343'
});

const formatarData = (data) => {
    return data.toISOString().replace('Z', '-03:00');
};

const criarPreferencia = async () => {
    try {
        const agora = new Date();
        const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

        const preferencia = {
            items: [{
                title: 'Plano X',
                unit_price: 19.9,
                quantity: 1,
                currency_id: 'BRL'
            }],
            back_urls: {
                success: 'https://meusite.com/sucesso',
                failure: 'https://meusite.com/erro',
                pending: 'https://meusite.com/pendente'
            },
            external_reference: 'meu-slug',
            notification_url: 'https://meusite.com/api/pagamento/webhook',
            statement_descriptor: 'MEMORIA SITE',
            expires: true,
            expiration_date_from: formatarData(agora),
            expiration_date_to: formatarData(trintaMinutosDepois),
            payment_methods: {
                excluded_payment_types: [],
                installments: 1
            },
            sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...'
        };

        console.log('Objeto de preferência:', JSON.stringify(preferencia, null, 2));
        
        const preference = new Preference(client);
        const response = await preference.create({ body: preferencia });
        console.log('Resposta do Mercado Pago:', response);
        return response;
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw error;
    }
};

// Teste da função
criarPreferencia()
    .then(response => {
        console.log('Preferência criada com sucesso:', response);
    })
    .catch(error => {
        console.error('Erro ao criar preferência:', error);
    });

module.exports = { criarPreferencia }; 