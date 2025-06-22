import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { keyframes } from '@mui/system';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f8 0%, #fff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Corações flutuantes de fundo */}
      {[...Array(20)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            color: 'rgba(255, 105, 180, 0.2)',
            animation: `${float} ${3 + index % 3}s infinite ease-in-out`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`,
            zIndex: 0
          }}
        >
          💕
        </Box>
      ))}

      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              animation: `${pulse} 2s infinite ease-in-out`,
              mb: 4
            }}
          >
            <FavoriteIcon sx={{ fontSize: 80, color: '#ff69b4' }} />
          </Box>

          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: 'cursive',
              color: '#ff69b4',
              mb: 3
            }}
          >
            Lovio
          </Typography>

          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ mb: 4 }}
          >
            Sites Personalizados de Presente
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Crie uma página especial para celebrar seu amor, aniversário, casamento ou qualquer momento especial. 
            Personalize com fotos, mensagens, músicas e muito mais!
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/create/url')}
            sx={{
              bgcolor: '#ff69b4',
              fontSize: '1.2rem',
              py: 2,
              px: 4,
              '&:hover': {
                bgcolor: '#ff1493'
              }
            }}
          >
            Criar Meu Presente
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 