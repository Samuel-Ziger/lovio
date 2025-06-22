import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const PendingCard = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 6px solid #f59e0b;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #f59e0b;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #f59e0b;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #d97706;
  }
`;

const PaymentPending = () => {
  const navigate = useNavigate();

  const handleVerificarStatus = () => {
    // Recarregar a página para verificar se o status mudou
    window.location.reload();
  };

  const handleVoltarInicio = () => {
    navigate('/');
  };

  return (
    <Container>
      <PendingCard>
        <Title>⏳ Pagamento Pendente</Title>
        <Message>
          Seu pagamento está sendo processado. Isso pode levar alguns minutos.
        </Message>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>O que está acontecendo:</h3>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Pagamento em análise pelo banco</li>
            <li>Processamento pelo Mercado Pago</li>
            <li>Verificação de segurança</li>
            <li>Confirmação final</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p><strong>Você receberá um e-mail quando o pagamento for confirmado.</strong></p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={handleVerificarStatus}>
            Verificar Status
          </Button>
          <Button onClick={handleVoltarInicio} style={{ background: '#3b82f6' }}>
            Voltar ao Início
          </Button>
        </div>
      </PendingCard>
    </Container>
  );
};

export default PaymentPending; 