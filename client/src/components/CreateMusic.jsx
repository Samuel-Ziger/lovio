import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Favorite,
  MusicNote,
  Spotify,
} from '@mui/icons-material';

const CreateMusic = () => {
  const navigate = useNavigate();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    // Recuperar dados do localStorage
    const savedTitle = localStorage.getItem('title');
    const savedDate = localStorage.getItem('date');
    const savedMessage = localStorage.getItem('message');
    const savedImages = localStorage.getItem('images');
    const savedEmojis = localStorage.getItem('emojis');
    if (savedTitle) setTitle(savedTitle);
    if (savedDate) setDate(savedDate);
    if (savedMessage) setMessage(savedMessage);
    if (savedImages) setImages(JSON.parse(savedImages));
    if (savedEmojis) setEmojis(JSON.parse(savedEmojis));
  }, []);

  const validateSpotifyUrl = (url) => {
    const spotifyRegex = /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?$/;
    return spotifyRegex.test(url);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setSpotifyUrl(url);
    setError('');
    
    if (url) {
      if (validateSpotifyUrl(url)) {
        setIsValid(true);
      } else {
        setIsValid(false);
        setError('Por favor, insira uma URL válida do Spotify');
      }
    } else {
      setIsValid(false);
    }
  };

  const handleNext = () => {
    localStorage.setItem('spotifyUrl', spotifyUrl);
    navigate('/create/plan');
  };

  const handleBack = () => {
    navigate('/create/emoji');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Seleção de Música */}
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
              Sua Música Especial
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 2 }}
              >
                Cole o link da sua música, álbum ou playlist do Spotify
              </Typography>

              <TextField
                fullWidth
                value={spotifyUrl}
                onChange={handleUrlChange}
                placeholder="https://open.spotify.com/track/..."
                variant="outlined"
                error={!!error}
                helperText={error}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ff69b4',
                    },
                  },
                }}
              />

              {isValid && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-icon': {
                      color: '#ff69b4'
                    }
                  }}
                >
                  URL do Spotify válida!
                </Alert>
              )}
            </Box>

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
                disabled={!isValid}
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
                {emojis.length > 0 && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2,
                      mb: 2
                    }}
                  >
                    {emojis.map((emoji, index) => (
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
                {isValid && (
                  <Box 
                    sx={{ 
                      mt: 2,
                      p: 2,
                      bgcolor: '#1DB954',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Spotify sx={{ color: 'white' }} />
                    <Typography variant="body2" color="white">
                      Música do Spotify adicionada!
                    </Typography>
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
                <MusicNote /> Dicas para sua música
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Escolha uma música significativa" 
                    secondary="Selecione uma música que tenha um significado especial para vocês"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use o Spotify" 
                    secondary="Copie o link da música diretamente do aplicativo ou site do Spotify"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Verifique o link" 
                    secondary="Certifique-se de que o link começa com 'https://open.spotify.com/'"
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

export default CreateMusic; 