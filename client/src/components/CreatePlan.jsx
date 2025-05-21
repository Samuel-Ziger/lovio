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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Modal,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Favorite,
  CheckCircle,
  Star,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 19,99',
    features: [
      'Página personalizada',
      'Até 5 fotos',
      'Música do Spotify',
      'Emojis animados',
      'Link personalizado',
      'QR Code',
    ],
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 39,90',
    features: [
      'Tudo do plano Básico',
      'Até 15 fotos',
      'Múltiplas músicas',
      'Temas exclusivos',
      'Efeitos especiais',
      'Suporte prioritário',
      'Sem marca d\'água',
    ],
    recommended: true,
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    price: 'R$ 59,90',
    features: [
      'Tudo do plano Premium',
      'Fotos ilimitadas',
      'Playlist personalizada',
      'Vídeo de fundo',
      'Domínio personalizado',
      'Suporte 24/7',
      'Atualizações gratuitas',
    ],
    recommended: false,
  },
];

const CreatePlan = () => {
  const navigate = useNavigate();
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [spotifyUrl, setSpotifyUrl] = useState('');

  useEffect(() => {
    // Recuperar dados do localStorage
    const savedTitle = localStorage.getItem('title');
    const savedDate = localStorage.getItem('date');
    const savedMessage = localStorage.getItem('message');
    const savedImages = localStorage.getItem('images');
    const savedEmojis = localStorage.getItem('emojis');
    const savedSpotifyUrl = localStorage.getItem('spotifyUrl');

    console.log('Dados recuperados no useEffect:', {
      savedTitle,
      savedDate,
      savedMessage,
      savedImages,
      savedEmojis,
      savedSpotifyUrl
    });

    if (savedTitle) setTitle(savedTitle);
    if (savedDate) setDate(savedDate);
    if (savedMessage) setMessage(savedMessage);
    if (savedImages) setImages(JSON.parse(savedImages));
    if (savedEmojis) setEmojis(JSON.parse(savedEmojis));
    if (savedSpotifyUrl) setSpotifyUrl(savedSpotifyUrl);
  }, []);

  const handleNext = () => {
    if (selectedPlanIndex !== null) {
      const selectedPlan = plans[selectedPlanIndex].id;
      console.log('Salvando plano no localStorage:', selectedPlan);
      localStorage.setItem('plan', selectedPlan);
      
      // Verificar se todos os dados necessários estão presentes
      const title = localStorage.getItem('title');
      const date = localStorage.getItem('date');
      const message = localStorage.getItem('message');
      const images = localStorage.getItem('images');
      const emojis = localStorage.getItem('emojis');
      const spotifyUrl = localStorage.getItem('spotifyUrl');
      
      console.log('Dados no localStorage antes da validação:', {
        plan: selectedPlan,
        title,
        date,
        message,
        images,
        emojis,
        spotifyUrl
      });

      // Verificar se os dados estão vazios ou undefined
      if (!title || title === 'undefined' || title === 'null') {
        alert('Por favor, preencha o título.');
        return;
      }
      if (!date || date === 'undefined' || date === 'null') {
        alert('Por favor, preencha a data.');
        return;
      }
      if (!message || message === 'undefined' || message === 'null') {
        alert('Por favor, preencha a mensagem.');
        return;
      }

      // Se chegou aqui, todos os dados estão preenchidos
      console.log('Todos os dados estão preenchidos, redirecionando para pagamento...');
      navigate('/create/payment');
    }
  };

  const handleBack = () => {
    navigate('/create/emoji');
  };

  const handleNextPlan = () => {
    setCurrentPlanIndex((prev) => (prev + 1) % plans.length);
  };

  const handlePrevPlan = () => {
    setCurrentPlanIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const handlePlanClick = (index) => {
    setSelectedPlanIndex(index);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    outline: 'none',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Modal
        open={true}
        onClose={() => {}}
        aria-labelledby="plan-selection-modal"
        sx={{
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box sx={modalStyle}>
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
            Escolha seu Plano
          </Typography>

          <Box sx={{ position: 'relative', mb: 4 }}>
            <IconButton
              onClick={handlePrevPlan}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#fff5f8',
                },
                zIndex: 1,
              }}
            >
              <NavigateBefore />
            </IconButton>

            <Box sx={{ px: 4 }}>
              <Card
                onClick={() => handlePlanClick(currentPlanIndex)}
                sx={{
                  position: 'relative',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(255, 105, 180, 0.2)',
                  },
                  ...(selectedPlanIndex === currentPlanIndex && {
                    border: '2px solid #ff69b4',
                    boxShadow: '0 8px 24px rgba(255, 105, 180, 0.2)',
                  }),
                }}
              >
                <CardContent>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ff69b4' }}>
                        {plans[currentPlanIndex].name}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff69b4' }}>
                        {plans[currentPlanIndex].price}
                      </Typography>
                    </Box>
                    <List dense>
                      {plans[currentPlanIndex].features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ color: '#ff69b4', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    {plans[currentPlanIndex].recommended && (
                      <Box
                        sx={{
                          mt: 2,
                          bgcolor: '#ff69b4',
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          justifyContent: 'center',
                        }}
                      >
                        <Star sx={{ fontSize: 16 }} />
                        Plano Recomendado
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <IconButton
              onClick={handleNextPlan}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#fff5f8',
                },
                zIndex: 1,
              }}
            >
              <NavigateNext />
            </IconButton>
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
              onClick={handleNext}
              disabled={selectedPlanIndex === null}
              sx={{
                background: 'linear-gradient(45deg, #ff69b4 30%, #ff9eb5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff1493 30%, #ff69b4 90%)',
                },
                minWidth: 180,
              }}
            >
              PIX
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Preview */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
                {spotifyUrl && (
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
                <Star /> Por que escolher um plano?
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Recursos exclusivos" 
                    secondary="Acesse recursos especiais para tornar seu presente ainda mais especial"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sem anúncios" 
                    secondary="Desfrute de uma experiência limpa e sem interrupções"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Suporte prioritário" 
                    secondary="Receba ajuda rápida sempre que precisar"
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

export default CreatePlan; 