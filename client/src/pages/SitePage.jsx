import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mercadopagoService } from '../services/mercadopagoService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Text = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  margin: 1rem 0;
`;

const SpotifyPlayer = styled.iframe`
  width: 100%;
  height: 80px;
  border: none;
  margin: 1rem 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 1.1rem;
  margin: 2rem 0;
`;

const SitePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        console.log('Buscando site:', slug);
        const siteData = await mercadopagoService.buscarSite(slug);
        console.log('Site encontrado:', siteData);
        setSite(siteData);
      } catch (error) {
        console.error('Erro ao buscar site:', error);
        
        if (error.message === 'Site expirado') {
          navigate('/site-expirado');
        } else if (error.message === 'Site não encontrado') {
          setError('Site não encontrado. Verifique se a URL está correta.');
        } else if (error.message === 'Site não está ativo') {
          setError('Este site ainda não está ativo. Aguarde a confirmação do pagamento.');
        } else {
          setError('Erro ao carregar o site. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [slug, navigate]);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div>
            <div>Carregando site...</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
              Buscando na API e localStorage...
            </div>
          </div>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h2>❌ Erro</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#ff69b4',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Voltar ao Início
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  if (!site) {
    return (
      <Container>
        <ErrorMessage>
          <h2>🔍 Site não encontrado</h2>
          <p>O site que você está procurando não existe ou foi removido.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#ff69b4',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Criar Meu Site
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  // Extrair dados do site (pode vir da API ou localStorage)
  const dados = site.dados_json || site;
  const titulo = dados.titulo || site.nome_site;
  const mensagem = dados.mensagem || site.mensagem;
  const data = dados.data || site.data_inicio;
  const imagens = dados.imagens || [];
  const emojis = dados.emojis || [];
  const musica = dados.musica || dados.spotifyUrl;

  return (
    <Container>
      <Title>{titulo}</Title>
      <Content>
        {/* Emojis */}
        {emojis.length > 0 && (
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {emojis.join(' ')}
          </div>
        )}

        {/* Mensagem */}
        <Text>{mensagem}</Text>

        {/* Data */}
        <Text>
          <strong>Data Especial:</strong> {new Date(data).toLocaleDateString('pt-BR')}
        </Text>

        {/* Imagens */}
        {imagens.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Nossas Fotos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {imagens.map((img, index) => (
                <Image key={index} src={img} alt={`Foto ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        {/* Música */}
        {musica && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Nossa Música</h3>
            <SpotifyPlayer
              src={musica}
              allow="encrypted-media"
            />
          </div>
        )}

        {/* Informações do site */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '5px' }}>
          <Text style={{ fontSize: '0.9rem', color: '#666' }}>
            <strong>Plano:</strong> {site.plano} | 
            <strong> Criado em:</strong> {new Date(site.data_criacao).toLocaleDateString('pt-BR')} |
            <strong> Expira em:</strong> {new Date(site.data_expiracao).toLocaleDateString('pt-BR')}
          </Text>
        </div>
      </Content>
    </Container>
  );
};

export default SitePage; 