import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid
} from '@mui/material';

const CreateTitle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customUrl = searchParams.get('url');

  const [formData, setFormData] = useState({
    title: '',
    startDate: ''
  });

  const [previewData, setPreviewData] = useState({
    title: '',
    startDate: null,
    timeSince: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setPreviewData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'startDate' && value) {
      const startDate = new Date(value);
      const now = new Date();
      const diff = now - startDate;
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

      setPreviewData(prev => ({
        ...prev,
        startDate: startDate,
        timeSince: `${years} anos, ${months} meses e ${days} dias`
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.startDate) {
      navigate(`/create/message?url=${customUrl}&title=${encodeURIComponent(formData.title)}&date=${formData.startDate}`);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100%', py: 4 }}>
      <Grid container spacing={4} sx={{ height: '100%' }}>
        {/* Formulário */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#ff69b4', fontFamily: 'cursive' }}>
              Título e Data Especial
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Título da Página"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                helperText="Ex: Nosso Amor, Para Sempre, etc."
              />

              <TextField
                fullWidth
                label="Data de Início"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                helperText="Data do início do namoro, pedido, etc."
                InputLabelProps={{ shrink: true }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!formData.title || !formData.startDate}
                sx={{
                  bgcolor: '#ff69b4',
                  '&:hover': {
                    bgcolor: '#ff1493'
                  }
                }}
              >
                Próximo
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
              <Typography variant="h4" gutterBottom sx={{ fontFamily: 'cursive' }}>
                {previewData.title || 'Seu Título Aqui'}
              </Typography>

              {previewData.startDate && (
                <>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Juntos desde {new Date(previewData.startDate).toLocaleDateString('pt-BR')}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#ff69b4', fontWeight: 'bold' }}>
                    {previewData.timeSince} de amor! 💖
                  </Typography>
                </>
              )}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="textSecondary">
                Dicas para o título:
              </Typography>
              <ul style={{ color: '#666', marginTop: '8px' }}>
                <li>Seja criativo e romântico</li>
                <li>Use apelidos carinhosos</li>
                <li>Inclua uma frase especial</li>
                <li>Mantenha simples e significativo</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateTitle; 