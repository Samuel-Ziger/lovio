import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Favorite,
  EmojiEmotions,
} from '@mui/icons-material';

const emojis = [
  { emoji: '❤️', name: 'Coração Vermelho' },
  { emoji: '💕', name: 'Dois Corações' },
  { emoji: '💖', name: 'Coração Brilhante' },
  { emoji: '💝', name: 'Coração com Laço' },
  { emoji: '💓', name: 'Coração Pulsante' },
  { emoji: '💗', name: 'Coração Crescente' },
  { emoji: '💘', name: 'Coração com Flecha' },
  { emoji: '💞', name: 'Corações Girando' },
  { emoji: '💟', name: 'Decoração de Coração' },
  { emoji: '💌', name: 'Carta de Amor' },
  { emoji: '💋', name: 'Beijo' },
  { emoji: '💍', name: 'Anel' },
  { emoji: '🌹', name: 'Rosa' },
  { emoji: '✨', name: 'Brilhos' },
  { emoji: '🎀', name: 'Laço' },
  { emoji: '🎁', name: 'Presente' },
];

const CreateEmoji = () => {
  const navigate = useNavigate();
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Recuperar dados do localStorage
    const savedTitle = localStorage.getItem('title');
    const savedDate = localStorage.getItem('date');
    const savedMessage = localStorage.getItem('message');
    const savedImages = localStorage.getItem('images');
    if (savedTitle) setTitle(savedTitle);
    if (savedDate) setDate(savedDate);
    if (savedMessage) setMessage(savedMessage);
    if (savedImages) setImages(JSON.parse(savedImages));
  }, []);

  const handleEmojiClick = (emoji) => {
    setSelectedEmojis(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji);
      }
      if (prev.length < 3) {
        return [...prev, emoji];
      }
      return prev;
    });
  };

  const handleNext = () => {
    localStorage.setItem('emojis', JSON.stringify(selectedEmojis));
    navigate('/create/plan');
  };

  const handleBack = () => {
    navigate('/create/image');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Seleção de Emojis */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #fff 0%, #fff5f8 100%)',
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
              Escolha seus Emojis
            </Typography>

            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              align="center"
              sx={{ mb: 3 }}
            >
              Selecione até 3 emojis para decorar sua página
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {emojis.map((item) => (
                <Grid item xs={3} sm={2} key={item.emoji}>
                  <Tooltip title={item.name}>
                    <IconButton
                      onClick={() => handleEmojiClick(item.emoji)}
                      sx={{
                        fontSize: '2rem',
                        width: '100%',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        transform: selectedEmojis.includes(item.emoji) 
                          ? 'scale(1.2)' 
                          : 'scale(1)',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {item.emoji}
                    </IconButton>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
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
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={selectedEmojis.length === 0}
                sx={{
                  background: 'linear-gradient(45deg, #ff69b4 30%, #ff9eb5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff1493 30%, #ff69b4 90%)',
                  },
                }}
              >
                Próximo
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #fff5f8 0%, #fff 100%)',
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: '#ff69b4',
                fontFamily: 'cursive',
                textAlign: 'center',
                mb: 3
              }}
            >
              Preview
            </Typography>

            <Card 
              sx={{ 
                mb: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 20px rgba(255, 105, 180, 0.1)'
              }}
            >
              <CardContent>
                {title && (
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#ff69b4',
                      fontFamily: 'cursive'
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {date && (
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    gutterBottom
                  >
                    {date}
                  </Typography>
                )}
                {message && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      mb: 2
                    }}
                  >
                    {message}
                  </Typography>
                )}
                {images.length > 0 && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {images.map((image, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          component="img"
                          src={image}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 140,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {selectedEmojis.length > 0 && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 2
                    }}
                  >
                    {selectedEmojis.map((emoji, index) => (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: '2rem',
                          animation: 'bounce 1s infinite',
                          '@keyframes bounce': {
                            '0%, 100%': {
                              transform: 'translateY(0)',
                            },
                            '50%': {
                              transform: 'translateY(-10px)',
                            },
                          },
                          animationDelay: `${index * 0.2}s`,
                        }}
                      >
                        {emoji}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#ff69b4'
                }}
              >
                <EmojiEmotions /> Dicas para os emojis
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Escolha com significado" 
                    secondary="Selecione emojis que representem seus sentimentos"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mantenha a harmonia" 
                    secondary="Combine emojis que façam sentido juntos"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Não exagere" 
                    secondary="Três emojis são suficientes para criar um visual bonito"
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateEmoji; 