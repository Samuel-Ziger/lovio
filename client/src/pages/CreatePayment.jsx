import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

const CreatePayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const iniciarPagamento = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se o servidor está online
        try {
          console.log('Verificando saúde do servidor...');
          const healthCheck = await api.get('/health');
          console.log('Servidor online:', healthCheck.data);
        } catch (error) {
          console.error('Erro ao verificar saúde do servidor:', error);
          throw new Error('Servidor indisponível. Por favor, tente novamente mais tarde.');
        }

        // Recuperar dados do localStorage
        const plan = localStorage.getItem('plan');
        const title = localStorage.getItem('title');
        const date = localStorage.getItem('date');
        const message = localStorage.getItem('message');
        const images = JSON.parse(localStorage.getItem('images') || '[]');
        const emojis = JSON.parse(localStorage.getItem('emojis') || '[]');
        const spotifyUrl = localStorage.getItem('spotifyUrl');

        console.log('Dados recuperados do localStorage:', {
          plan,
          title,
          date,
          message,
          images,
          emojis,
          spotifyUrl
        });

        // Validar dados obrigatórios
        const camposFaltantes = [];
        if (!plan) camposFaltantes.push('plano');
        if (!title) camposFaltantes.push('título');
        if (!date) camposFaltantes.push('data');
        if (!message) camposFaltantes.push('mensagem');

        if (camposFaltantes.length > 0) {
          throw new Error(`Campos obrigatórios não preenchidos: ${camposFaltantes.join(', ')}. Por favor, volte e preencha todos os campos.`);
        }

        // Preparar dados para o backend
        const dados_site = {
          plano: plan,
          nome_site: title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          dados_json: JSON.stringify({
            titulo: title,
            data: date,
            mensagem: message,
            imagens: images,
            emojis: emojis,
            musica: spotifyUrl
          })
        };

        console.log('Enviando dados para o backend:', dados_site);

        // Criar preferência de pagamento
        console.log('Criando preferência de pagamento...');
        const response = await api.post('/pagamento/preferencia', { dados_site });
        console.log('Resposta do servidor:', response.data);
        
        if (response.data && response.data.init_point) {
          console.log('Redirecionando para:', response.data.init_point);
          window.location.href = response.data.init_point;
        } else {
          throw new Error('Resposta inválida do servidor');
        }
      } catch (error) {
        console.error('Erro ao iniciar pagamento:', error);
        if (error.response) {
          // O servidor respondeu com um status de erro
          console.error('Resposta do servidor:', error.response.data);
          setError(error.response.data.error || error.response.data.message || 'Erro ao processar pagamento');
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          console.error('Sem resposta do servidor:', error.request);
          setError('Servidor não está respondendo. Por favor, tente novamente mais tarde.');
        } else {
          // Erro ao configurar a requisição
          console.error('Erro na requisição:', error.message);
          setError(error.message || 'Erro ao processar pagamento. Por favor, tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    iniciarPagamento();
  }, [navigate]);

  const handleBack = () => {
    navigate('/create/plan');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          background: 'linear-gradient(135deg, #fff5f8 0%, #fff 100%)',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#ff69b4',
            fontFamily: 'cursive',
            textAlign: 'center',
            mb: 3
          }}
        >
          Processando Pagamento
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', my: 4 }}>
          {loading ? (
            <CircularProgress sx={{ color: '#ff69b4' }} />
          ) : (
            <Typography variant="body1" color="text.secondary">
              {error ? 'Ocorreu um erro ao processar o pagamento.' : 'Você será redirecionado para a página de pagamento do Mercado Pago em instantes...'}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            disabled={loading}
            sx={{
              color: '#ff69b4',
              borderColor: '#ff69b4',
              '&:hover': {
                borderColor: '#ff1493',
                backgroundColor: 'rgba(255, 105, 180, 0.04)',
              },
            }}
          >
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePayment; 