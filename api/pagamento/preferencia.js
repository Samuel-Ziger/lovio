const { criarPreferencia } = require('../../mercadopago-preference');

module.exports = async (req, res) => {
  // Verifica se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const response = await criarPreferencia();
    return res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message 
    });
  }
}; 