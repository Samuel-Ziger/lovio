import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import moment from 'moment';
import QRCode from 'react-qr-code';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';

const themes = {
  romantico: {
    primary: '#ff69b4',
    secondary: '#ff9eb5',
    background: '#fff5f8'
  },
  moderno: {
    primary: '#4a90e2',
    secondary: '#6ba4e7',
    background: '#f5f9ff'
  },
  fofo: {
    primary: '#ff9eb5',
    secondary: '#ffb6c1',
    background: '#fff0f3'
  },
  minimalista: {
    primary: '#2c3e50',
    secondary: '#34495e',
    background: '#f5f6f7'
  }
};

const MemoryPage = () => {
  const { customUrl } = useParams();
  const [memory, setMemory] = useState(null);
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/memories/${customUrl}`);
        setMemory(response.data);
      } catch (error) {
        console.error('Erro ao carregar página:', error);
      }
    };

    fetchMemory();
  }, [customUrl]);

  useEffect(() => {
    if (memory?.specialDate) {
      const updateTimeSince = () => {
        const specialDate = moment(memory.specialDate);
        const now = moment();
        const duration = moment.duration(now.diff(specialDate));
        
        const years = duration.years();
        const months = duration.months();
        const days = duration.days();
        
        setTimeSince(`${years} anos, ${months} meses e ${days} dias`);
      };

      updateTimeSince();
      const interval = setInterval(updateTimeSince, 86400000); // Atualiza diariamente
      return () => clearInterval(interval);
    }
  }, [memory]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Confira nosso presente virtual de amor! 💖`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent('Presente Virtual de Amor')}&body=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
      case 'instagram':
        // Instagram não permite compartilhamento direto via URL
        navigator.clipboard.writeText(url);
        alert('Link copiado! Cole no seu Instagram.');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
    }
  };

  if (!memory) {
    return <Typography>Carregando...</Typography>;
  }

  const theme = themes[memory.theme] || themes.romantico;

  return (
    <Box sx={{ bgcolor: theme.background, minHeight: '100%', py: 4 }}>
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            height: '100%',
            background: `linear-gradient(135deg, ${theme.background} 0%, white 100%)`
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <FavoriteIcon 
                  sx={{ 
                    color: theme.primary,
                    fontSize: 40,
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }} 
                />
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    color: theme.primary,
                    fontFamily: 'cursive'
                  }}
                >
                  {memory.partnerName} & {memory.creatorName}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="textSecondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Juntos desde {moment(memory.specialDate).format('DD/MM/YYYY')}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mt: 2,
                    color: theme.secondary,
                    fontWeight: 'bold'
                  }}
                >
                  {timeSince} de amor! 💖
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  color: theme.primary,
                  textAlign: 'center',
                  fontFamily: 'cursive'
                }}
              >
                Nossa História em Imagens
              </Typography>
              <Grid container spacing={2}>
                {memory.images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={image.url}
                        alt={image.caption}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          {image.caption}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.background} 0%, white 100%)`
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: theme.primary,
                    fontFamily: 'cursive',
                    mb: 3
                  }}
                >
                  Mensagem Especial
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    lineHeight: 1.8
                  }}
                >
                  {memory.message}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: theme.primary }}
                >
                  QR Code do Presente
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 1
                }}>
                  <QRCode value={`${window.location.origin}/memory/${customUrl}`} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ color: theme.primary }}
                >
                  Compartilhe o Amor
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton 
                    onClick={() => handleShare('whatsapp')}
                    sx={{ color: '#25D366' }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare('email')}
                    sx={{ color: theme.primary }}
                  >
                    <EmailIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare('instagram')}
                    sx={{ color: '#E1306C' }}
                  >
                    <InstagramIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleShare('copy')}
                    sx={{ color: theme.primary }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  Feito com 💖 por {memory.creatorName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default MemoryPage; 