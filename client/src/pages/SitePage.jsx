import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

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
        const response = await axios.get(`/api/site/${slug}`);
        setSite(response.data);
      } catch (error) {
        if (error.response?.status === 410) {
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

  const dados = JSON.parse(site.dados_json);

  return (
    <Container>
      <Title>{site.nome_site}</Title>
      <Content>
        {dados.emoji && <div style={{ fontSize: '4rem' }}>{dados.emoji}</div>}
        {dados.imagem && <Image src={dados.imagem} alt={site.nome_site} />}
        {dados.texto && <Text>{dados.texto}</Text>}
        {dados.musica && (
          <SpotifyPlayer
            src={`https://open.spotify.com/embed/track/${dados.musica}`}
            allow="encrypted-media"
          />
        )}
      </Content>
    </Container>
  );
};

export default SitePage; 