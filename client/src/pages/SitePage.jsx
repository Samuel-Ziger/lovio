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

const SitePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const siteData = mercadopagoService.buscarSite(slug);
        setSite(siteData);
      } catch (error) {
        if (error.message === 'Site expirado') {
          navigate('/site-expirado');
        } else {
          setError('Erro ao carregar o site');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [slug, navigate]);

  if (loading) return <Container>Carregando...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!site) return <Container>Site não encontrado</Container>;

  return (
    <Container>
      <Title>{site.nome_site}</Title>
      <Content>
        <div style={{ fontSize: '4rem' }}>💕</div>
        <Text>{site.mensagem}</Text>
        <Text>Data: {new Date(site.data_inicio).toLocaleDateString('pt-BR')}</Text>
        <Text>Plano: {site.plano}</Text>
      </Content>
    </Container>
  );
};

export default SitePage; 