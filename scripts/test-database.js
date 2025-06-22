const sequelize = require('../config/database');
const Site = require('../models/Site');

async function testDatabase() {
  try {
    console.log('🧪 Testando conexão com o banco de dados...\n');

    // Testar conexão
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Sincronizar modelos
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados!');

    // Testar criação de um site
    const testSite = await Site.create({
      slug: 'teste-conexao',
      nome_site: 'Site de Teste',
      plano: 'basic',
      data_criacao: new Date(),
      data_expiracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      dados_json: JSON.stringify({
        titulo: 'Site de Teste',
        mensagem: 'Teste de conexão com banco de dados',
        data_inicio: new Date().toISOString(),
        imagens: [],
        emojis: ['🧪'],
        spotify_url: ''
      }),
      status: 'ativo'
    });

    console.log('✅ Site de teste criado:', testSite.slug);

    // Buscar o site criado
    const siteEncontrado = await Site.findOne({ where: { slug: 'teste-conexao' } });
    console.log('✅ Site encontrado:', siteEncontrado.nome_site);

    // Deletar o site de teste
    await siteEncontrado.destroy();
    console.log('✅ Site de teste removido');

    // Contar sites
    const totalSites = await Site.count();
    console.log(`📊 Total de sites no banco: ${totalSites}`);

    console.log('\n🎉 Todos os testes passaram! O banco de dados está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    console.log('\n💡 Verifique se:');
    console.log('   1. O Docker está rodando: docker-compose up -d');
    console.log('   2. As credenciais estão corretas no config/database.js');
    console.log('   3. O banco de dados foi inicializado corretamente');
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Executar testes
testDatabase(); 