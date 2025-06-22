import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mercadopagoService } from '../services/mercadopagoService';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessCard = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 6px solid #10b981;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #10b981;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #059669;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processarSucesso = async () => {
      try {
        const payment_id = searchParams.get('payment_id');
        const status = searchParams.get('status');
        
        if (payment_id) {
          // Verificar status real do pagamento no Mercado Pago
          const payment = await mercadopagoService.verificarPagamento(payment_id);
          console.log('Status do pagamento:', payment);
          
          if (payment.status === 'approved') {
            const dados = mercadopagoService.processarSucesso(payment_id, 'approved');
            setSiteData(dados);
          } else if (payment.status === 'pending') {
            setError('Pagamento pendente. Aguarde a confirmação.');
          } else {
            setError('Pagamento não foi aprovado.');
          }
        } else if (status) {
          // Fallback para quando não há payment_id
          const dados = mercadopagoService.processarSucesso('manual', status);
          setSiteData(dados);
        }
      } catch (error) {
        console.error('Erro ao processar sucesso:', error);
        setError('Erro ao processar o pagamento. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    processarSucesso();
  }, [searchParams]);

  const handleVerSite = () => {
    if (siteData) {
      navigate(`/site/${siteData.slug}`);
    }
  };

  const handleCriarNovo = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container>
        <SuccessCard>
          <LoadingSpinner />
          <Title>Processando Pagamento...</Title>
          <Message>Aguarde enquanto verificamos o status do seu pagamento.</Message>
        </SuccessCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SuccessCard style={{ borderLeftColor: '#ef4444' }}>
          <Title style={{ color: '#ef4444' }}>⚠️ Atenção</Title>
          <Message>{error}</Message>
          <Button onClick={handleCriarNovo} style={{ background: '#3b82f6' }}>
            Tentar Novamente
          </Button>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <SuccessCard>
        <Title>🎉 Pagamento Aprovado!</Title>
        <Message>
          Seu site foi criado com sucesso e está pronto para ser compartilhado!
        </Message>
        
        {siteData && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>Detalhes do Site:</h3>
            <p><strong>Nome:</strong> {siteData.nome_site}</p>
            <p><strong>Plano:</strong> {siteData.plano}</p>
            <p><strong>URL:</strong> {window.location.origin}/site/{siteData.slug}</p>
            <p><strong>Data de Criação:</strong> {new Date(siteData.data_criacao).toLocaleDateString('pt-BR')}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={handleVerSite}>
            Ver Meu Site
          </Button>
          <Button onClick={handleCriarNovo} style={{ background: '#3b82f6' }}>
            Criar Novo Site
          </Button>
        </div>
      </SuccessCard>
    </Container>
  );
};

export default PaymentSuccess; 