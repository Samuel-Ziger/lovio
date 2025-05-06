import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Delete,
  Image,
  PhotoCamera,
  Favorite,
} from '@mui/icons-material';

const CreateImage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Recuperar dados do localStorage
    const savedTitle = localStorage.getItem('title');
    const savedDate = localStorage.getItem('date');
    const savedMessage = localStorage.getItem('message');
    if (savedTitle) setTitle(savedTitle);
    if (savedDate) setDate(savedDate);
    if (savedMessage) setMessage(savedMessage);
  }, []);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleNext = () => {
    // Aqui você pode implementar o upload das imagens para o servidor
    // Por enquanto, vamos apenas salvar os dados no localStorage
    localStorage.setItem('images', JSON.stringify(images.map(img => img.preview)));
    navigate('/create/emoji');
  };

  const handleBack = () => {
    navigate('/create/message');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Upload de Imagens */}
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
              Suas Fotos Especiais
            </Typography>

            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ff69b4',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'rgba(255, 105, 180, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 180, 0.05)',
                },
                mb: 3
              }}
            >
              <input {...getInputProps()} />
              <PhotoCamera sx={{ fontSize: 48, color: '#ff69b4', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {isDragActive
                  ? 'Solte as imagens aqui...'
                  : 'Arraste e solte imagens aqui, ou clique para selecionar'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Suporta JPG, PNG e GIF (máx. 5MB)
              </Typography>
            </Box>

            {images.length > 0 && (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {images.map((image, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={image.preview}
                        alt={`Imagem ${index + 1}`}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

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
                disabled={images.length === 0}
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
                  <Grid container spacing={2}>
                    {images.map((image, index) => (
                      <Grid item xs={6} key={index}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={image.preview}
                          alt={`Preview ${index + 1}`}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
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
                <Image /> Dicas para suas fotos
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Escolha fotos de qualidade" 
                    secondary="Selecione imagens nítidas e bem iluminadas"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mantenha um tema consistente" 
                    secondary="Escolha fotos que contam uma história"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Limite o número de fotos" 
                    secondary="Selecione as mais significativas (recomendado: 4-6 fotos)"
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

export default CreateImage; 