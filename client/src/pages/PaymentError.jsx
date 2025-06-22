import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const ErrorCard = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 6px solid #ef4444;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ef4444;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #ef4444;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #dc2626;
  }
`;

const PaymentError = () => {
  const navigate = useNavigate();

  const handleTentarNovamente = () => {
    navigate('/create/plan');
  };

  const handleVoltarInicio = () => {
    navigate('/');
  };

  return (
    <Container>
      <ErrorCard>
        <Title>❌ Pagamento Não Aprovado</Title>
        <Message>
          Ocorreu um problema com o seu pagamento. Não se preocupe, você pode tentar novamente.
        </Message>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Possíveis motivos:</h3>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Cartão recusado pelo banco</li>
            <li>Dados do cartão incorretos</li>
            <li>Limite insuficiente</li>
            <li>Problema temporário no sistema</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={handleTentarNovamente}>
            Tentar Novamente
          </Button>
          <Button onClick={handleVoltarInicio} style={{ background: '#3b82f6' }}>
            Voltar ao Início
          </Button>
        </div>
      </ErrorCard>
    </Container>
  );
};

export default PaymentError; 