// Serviço para integração com a API do backend
const API_BASE_URL = 'http://localhost:5002/api';

export const apiService = {
  // Configuração base do axios
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  },

  // ==================== CRUD SITES ====================

  // Criar site
  async criarSite(siteData) {
    return this.request('/sites', {
      method: 'POST',
      body: JSON.stringify(siteData)
    });
  },

  // Buscar site por slug
  async buscarSite(slug) {
    return this.request(`/site/${slug}`, {
      method: 'GET'
    });
  },

  // Listar todos os sites
  async listarSites() {
    return this.request('/sites', {
      method: 'GET'
    });
  },

  // Listar sites ativos
  async listarSitesAtivos() {
    return this.request('/sites/ativos', {
      method: 'GET'
    });
  },

  // Atualizar site
  async atualizarSite(slug, dadosAtualizacao) {
    return this.request(`/site/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(dadosAtualizacao)
    });
  },

  // Deletar site
  async deletarSite(slug) {
    return this.request(`/site/${slug}`, {
      method: 'DELETE'
    });
  },

  // ==================== PAGAMENTO ====================

  // Criar preferência de pagamento
  async criarPreferencia(dados_site) {
    return this.request('/pagamento/preferencia', {
      method: 'POST',
      body: JSON.stringify({ dados_site })
    });
  },

  // ==================== UTILITY ====================

  // Health check
  async healthCheck() {
    return this.request('/health', {
      method: 'GET'
    });
  },

  // Teste da API
  async testAPI() {
    return this.request('/test', {
      method: 'GET'
    });
  },

  // ==================== HELPERS ====================

  // Preparar dados do site para criação
  prepararDadosSite(dadosLocalStorage) {
    const {
      title,
      date,
      message,
      images,
      emojis,
      spotifyUrl,
      plan
    } = dadosLocalStorage;

    // Gerar slug baseado no título
    const slug = title?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'site-' + Date.now();

    // Preparar dados JSON
    const dados_json = {
      titulo: title,
      mensagem: message,
      data: date,
      imagens: images ? JSON.parse(images) : [],
      emojis: emojis ? JSON.parse(emojis) : [],
      musica: spotifyUrl || null
    };

    return {
      slug,
      nome_site: title,
      plano: plan,
      dados_json
    };
  },

  // Validar dados obrigatórios
  validarDadosSite(dados) {
    const camposObrigatorios = ['titulo', 'mensagem', 'data'];
    const camposFaltantes = camposObrigatorios.filter(campo => !dados.dados_json[campo]);
    
    if (camposFaltantes.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${camposFaltantes.join(', ')}`);
    }

    if (!dados.slug || dados.slug.length < 3) {
      throw new Error('Slug deve ter pelo menos 3 caracteres');
    }

    if (!dados.plano) {
      throw new Error('Plano é obrigatório');
    }

    return true;
  },

  // Verificar se slug está disponível
  async verificarSlugDisponivel(slug) {
    try {
      await this.buscarSite(slug);
      return false; // Slug já existe
    } catch (error) {
      if (error.message.includes('Site não encontrado')) {
        return true; // Slug disponível
      }
      throw error; // Outro erro
    }
  }
}; 