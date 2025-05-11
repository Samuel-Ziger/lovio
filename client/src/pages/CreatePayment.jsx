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

const CreatePayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const iniciarPagamento = async () => {
      try {
        setLoading(true);
        setError(null);

        // Recuperar dados do localStorage
        const plan = localStorage.getItem('plan');
        const title = localStorage.getItem('title');
        const date = localStorage.getItem('date');
        const message = localStorage.getItem('message');
        const images = JSON.parse(localStorage.getItem('images') || '[]');
        const emojis = JSON.parse(localStorage.getItem('emojis') || '[]');
        const spotifyUrl = localStorage.getItem('spotifyUrl');

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

        // Criar preferência de pagamento
        const response = await axios.post('/api/pagamento/preferencia', dados_site);
        
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = response.data.init_point;
      } catch (error) {
        console.error('Erro ao iniciar pagamento:', error);
        setError('Erro ao processar pagamento. Por favor, tente novamente.');
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
              Você será redirecionado para a página de pagamento do Mercado Pago em instantes...
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