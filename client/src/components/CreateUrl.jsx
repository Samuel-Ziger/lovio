import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const CreateUrl = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setUrl(value);
    
    if (value.length < 3) {
      setError('A URL deve ter pelo menos 3 caracteres');
    } else if (value.length > 50) {
      setError('A URL não pode ter mais de 50 caracteres');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error && url) {
      navigate(`/create/title?url=${url}`);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100%', py: 4 }}>
      <Grid container spacing={4} sx={{ height: '100%' }}>
        {/* Formulário */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#ff69b4', fontFamily: 'cursive' }}>
              Escolha o Nome da Sua Página
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Este será o endereço único do seu presente virtual
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome da Página"
                value={url}
                onChange={handleUrlChange}
                error={!!error}
                helperText={error || 'Use apenas letras, números e hífens'}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!!error || !url}
                sx={{
                  bgcolor: '#ff69b4',
                  '&:hover': {
                    bgcolor: '#ff1493'
                  }
                }}
              >
                Avançar
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#ff69b4', fontFamily: 'cursive' }}>
              Preview da Sua Página
            </Typography>

            <Box sx={{ 
              p: 3, 
              bgcolor: '#fff5f8', 
              borderRadius: 2,
              textAlign: 'center',
              mt: 2
            }}>
              <Typography variant="h6" gutterBottom>
                Como Ficará a URL:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'monospace',
                  color: '#ff69b4',
                  fontSize: '1.2rem'
                }}
              >
                {url ? `meusite.com/presente/${url}` : 'meusite.com/presente/seu-nome-aqui'}
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="textSecondary">
                Dicas para criar uma URL bonita:
              </Typography>
              <ul style={{ color: '#666', marginTop: '8px' }}>
                <li>Use o nome do seu amor</li>
                <li>Adicione uma data especial</li>
                <li>Use palavras românticas</li>
                <li>Mantenha simples e memorável</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUrl; 