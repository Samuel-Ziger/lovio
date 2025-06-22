// Serviço para integração com Mercado Pago via backend
import { apiService } from './apiService';

export const mercadopagoService = {
  // Inicializar Mercado Pago
  init() {
    if (typeof window !== 'undefined' && window.Mercadopago) {
      // Configuração será feita pelo backend
      console.log('Mercado Pago inicializado');
    }
  },

  // Criar preferência de pagamento via backend
  async criarPreferencia(dados_site) {
    try {
      console.log('Criando preferência via backend:', dados_site);

      // Preparar dados do site
      const dadosLocalStorage = {
        title: dados_site.nome_site,
        date: dados_site.data_inicio,
        message: dados_site.mensagem,
        images: localStorage.getItem('images'),
        emojis: localStorage.getItem('emojis'),
        spotifyUrl: localStorage.getItem('spotifyUrl'),
        plan: dados_site.plano
      };

      // Preparar dados para a API
      const siteData = apiService.prepararDadosSite(dadosLocalStorage);
      
      // Validar dados
      apiService.validarDadosSite(siteData);

      // Verificar se slug está disponível
      const slugDisponivel = await apiService.verificarSlugDisponivel(siteData.slug);
      if (!slugDisponivel) {
        throw new Error('Este nome de site já está em uso. Escolha outro nome.');
      }

      // Salvar dados no localStorage para recuperação posterior
      localStorage.setItem('site_data', JSON.stringify({
        ...siteData,
        data_criacao: new Date().toISOString(),
        status: 'pendente'
      }));

      // Criar preferência via backend
      const response = await apiService.criarPreferencia(siteData);

      console.log('Preferência criada via backend:', response);
      
      return response;

    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      throw error;
    }
  },

  // Processar pagamento de sucesso
  async processarSucesso(payment_id, status) {
    try {
      const siteData = localStorage.getItem('site_data');
      if (siteData) {
        const dados = JSON.parse(siteData);
        dados.status = status === 'approved' ? 'ativo' : 'pendente';
        dados.payment_id = payment_id;
        dados.data_pagamento = new Date().toISOString();
        
        // Se o pagamento foi aprovado, criar o site no banco
        if (status === 'approved') {
          try {
            await apiService.criarSite(dados);
            console.log('Site criado no banco após pagamento aprovado');
          } catch (error) {
            console.error('Erro ao criar site no banco:', error);
            // Não falhar o processo se houver erro no banco
          }
        }
        
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

  // Buscar site por slug (primeiro tenta API, depois localStorage)
  async buscarSite(slug) {
    try {
      // Primeiro tenta buscar na API
      try {
        const site = await apiService.buscarSite(slug);
        console.log('Site encontrado na API:', site);
        return site;
      } catch (apiError) {
        console.log('Site não encontrado na API, tentando localStorage:', apiError.message);
        
        // Se não encontrar na API, tenta no localStorage
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
      }
    } catch (error) {
      console.error('Erro ao buscar site:', error);
      throw error;
    }
  },

  // Listar sites ativos (combina API e localStorage)
  async listarSites() {
    try {
      // Buscar sites da API
      const sitesAPI = await apiService.listarSitesAtivos();
      
      // Buscar sites do localStorage
      const sitesLocalStorage = JSON.parse(localStorage.getItem('sites_ativos') || '[]');
      
      // Combinar e remover duplicatas
      const todosSites = [...sitesAPI.sites, ...sitesLocalStorage];
      const sitesUnicos = todosSites.filter((site, index, self) => 
        index === self.findIndex(s => s.slug === site.slug)
      );
      
      return sitesUnicos;
    } catch (error) {
      console.error('Erro ao listar sites:', error);
      // Em caso de erro na API, retorna apenas localStorage
      return JSON.parse(localStorage.getItem('sites_ativos') || '[]');
    }
  },

  // Verificar status do pagamento via backend
  async verificarPagamento(payment_id) {
    try {
      // Por enquanto, vamos usar a API do Mercado Pago diretamente
      // No futuro, isso pode ser feito via backend
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: {
          'Authorization': `Bearer APP_USR-4868459967001491-051003-be2cae39860e8eb714f547165324245f-305462343`
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
  },

  // Limpar dados temporários
  limparDadosTemporarios() {
    localStorage.removeItem('site_data');
    localStorage.removeItem('title');
    localStorage.removeItem('date');
    localStorage.removeItem('message');
    localStorage.removeItem('images');
    localStorage.removeItem('emojis');
    localStorage.removeItem('spotifyUrl');
    localStorage.removeItem('plan');
  }
}; 