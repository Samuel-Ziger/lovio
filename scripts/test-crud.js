const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

// Configurar axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Função para log colorido
const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  info: (msg) => console.log(`ℹ️ ${msg}`),
  warning: (msg) => console.log(`⚠️ ${msg}`)
};

// Teste de dados
const siteTeste = {
  slug: 'teste-crud-' + Date.now(),
  nome_site: 'Site Teste CRUD',
  plano: 'basic',
  dados_json: {
    titulo: 'Feliz Aniversário!',
    mensagem: 'Parabéns pelo seu dia especial!',
    data: '2024-12-25',
    imagens: ['https://exemplo.com/imagem1.jpg'],
    emojis: ['🎉', '🎂', '🎁'],
    musica: 'https://exemplo.com/musica.mp3'
  }
};

async function testarCRUD() {
  log.info('🚀 Iniciando testes CRUD...\n');

  try {
    // 1. Teste de Health Check
    log.info('1. Testando Health Check...');
    const health = await api.get('/health');
    log.success(`Health Check: ${health.data.status}`);
    console.log(`   Timestamp: ${health.data.serverTime}\n`);

    // 2. CREATE - Criar site
    log.info('2. Testando CREATE - Criar site...');
    const createResponse = await api.post('/sites', siteTeste);
    log.success(`Site criado: ${createResponse.data.site.slug}`);
    console.log(`   ID: ${createResponse.data.site.id}`);
    console.log(`   Nome: ${createResponse.data.site.nome_site}`);
    console.log(`   Plano: ${createResponse.data.site.plano}\n`);

    // 3. READ - Buscar site por slug
    log.info('3. Testando READ - Buscar site por slug...');
    const readResponse = await api.get(`/site/${siteTeste.slug}`);
    log.success(`Site encontrado: ${readResponse.data.slug}`);
    console.log(`   Dados JSON: ${JSON.stringify(readResponse.data.dados_json, null, 2)}\n`);

    // 4. READ - Listar todos os sites
    log.info('4. Testando READ - Listar todos os sites...');
    const listResponse = await api.get('/sites');
    log.success(`Total de sites: ${listResponse.data.total}`);
    console.log(`   Sites: ${listResponse.data.sites.length}\n`);

    // 5. READ - Listar sites ativos
    log.info('5. Testando READ - Listar sites ativos...');
    const ativosResponse = await api.get('/sites/ativos');
    log.success(`Sites ativos: ${ativosResponse.data.total}`);
    console.log(`   Sites ativos: ${ativosResponse.data.sites.length}\n`);

    // 6. UPDATE - Atualizar site
    log.info('6. Testando UPDATE - Atualizar site...');
    const updateData = {
      nome_site: 'Site Teste CRUD Atualizado',
      plano: 'premium',
      dados_json: {
        titulo: 'Feliz Aniversário Atualizado!',
        mensagem: 'Parabéns pelo seu dia especial! Atualizado!',
        data: '2024-12-25',
        imagens: ['https://exemplo.com/imagem1.jpg', 'https://exemplo.com/imagem2.jpg'],
        emojis: ['🎉', '🎂', '🎁', '✨'],
        musica: 'https://exemplo.com/musica.mp3'
      }
    };
    const updateResponse = await api.put(`/site/${siteTeste.slug}`, updateData);
    log.success(`Site atualizado: ${updateResponse.data.site.nome_site}`);
    console.log(`   Novo plano: ${updateResponse.data.site.plano}\n`);

    // 7. DELETE - Deletar site
    log.info('7. Testando DELETE - Deletar site...');
    const deleteResponse = await api.delete(`/site/${siteTeste.slug}`);
    log.success(`Site deletado: ${deleteResponse.data.slug}\n`);

    // 8. Verificar se foi deletado
    log.info('8. Verificando se o site foi deletado...');
    try {
      await api.get(`/site/${siteTeste.slug}`);
      log.error('Site ainda existe após deletar!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log.success('Site não encontrado após deletar (esperado)');
      } else {
        log.error(`Erro inesperado: ${error.message}`);
      }
    }

    log.success('🎉 Todos os testes CRUD passaram com sucesso!');

  } catch (error) {
    log.error(`Erro nos testes: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    process.exit(1);
  }
}

// Executar testes
testarCRUD(); 