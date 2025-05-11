const Site = require('../models/Site');
const sequelize = require('../config/database');

async function verificarSitesExpirados() {
  try {
    const sitesExpirados = await Site.findAll({
      where: {
        status: 'ativo',
        data_expiracao: {
          [sequelize.Op.lt]: new Date()
        }
      }
    });

    for (const site of sitesExpirados) {
      site.status = 'expirado';
      await site.save();
      console.log(`Site ${site.slug} marcado como expirado`);
    }

    console.log(`Verificação concluída. ${sitesExpirados.length} sites expirados.`);
  } catch (error) {
    console.error('Erro ao verificar sites expirados:', error);
  } finally {
    await sequelize.close();
  }
}

verificarSitesExpirados(); 