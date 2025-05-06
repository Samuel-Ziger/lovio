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
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  ArrowBack,
  ArrowForward,
  Lightbulb,
  Favorite,
} from '@mui/icons-material';

const CreateMessage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    // Recuperar dados do localStorage
    const savedTitle = localStorage.getItem('title');
    const savedDate = localStorage.getItem('date');
    if (savedTitle) setTitle(savedTitle);
    if (savedDate) setDate(savedDate);
  }, []);

  const handleFormat = (format) => {
    setFormatting(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleNext = () => {
    localStorage.setItem('message', message);
    navigate('/create/image');
  };

  const handleBack = () => {
    navigate('/create/title');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Editor */}
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
              Sua Mensagem de Amor
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Formatar texto:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Tooltip title="Negrito">
                  <IconButton 
                    onClick={() => handleFormat('bold')}
                    color={formatting.bold ? 'primary' : 'default'}
                  >
                    <FormatBold />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Itálico">
                  <IconButton 
                    onClick={() => handleFormat('italic')}
                    color={formatting.italic ? 'primary' : 'default'}
                  >
                    <FormatItalic />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sublinhado">
                  <IconButton 
                    onClick={() => handleFormat('underline')}
                    color={formatting.underline ? 'primary' : 'default'}
                  >
                    <FormatUnderlined />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem de amor aqui..."
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ff69b4',
                  },
                },
              }}
            />

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
                disabled={!message.trim()}
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
                <Divider sx={{ my: 2 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontStyle: formatting.italic ? 'italic' : 'normal',
                    fontWeight: formatting.bold ? 'bold' : 'normal',
                    textDecoration: formatting.underline ? 'underline' : 'none'
                  }}
                >
                  {message || 'Sua mensagem aparecerá aqui...'}
                </Typography>
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
                <Lightbulb /> Dicas para sua mensagem
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Seja sincero e autêntico" 
                    secondary="Escreva do coração, sem medo de expressar seus sentimentos"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mencione momentos especiais" 
                    secondary="Lembre-se de momentos únicos que vocês compartilharam"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Favorite sx={{ color: '#ff69b4' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use formatação com moderação" 
                    secondary="Destaque apenas as partes mais importantes da sua mensagem"
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

export default CreateMessage; 