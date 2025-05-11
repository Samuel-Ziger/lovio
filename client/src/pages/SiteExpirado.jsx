import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const SiteExpirado = () => {
  return (
    <Container>
      <Title>Site Expirado</Title>
      <Message>
        Este site expirou. Para continuar acessando, renove sua assinatura.
      </Message>
      <Button to="/">Voltar para a página inicial</Button>
    </Container>
  );
};

export default SiteExpirado; 