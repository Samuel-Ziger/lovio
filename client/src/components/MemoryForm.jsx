import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

const themes = [
  { value: 'romantico', label: 'Romântico', color: '#ff69b4' },
  { value: 'moderno', label: 'Moderno', color: '#4a90e2' },
  { value: 'fofo', label: 'Fofo', color: '#ff9eb5' },
  { value: 'minimalista', label: 'Minimalista', color: '#2c3e50' }
];

const MemoryForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    partnerName: '',
    creatorName: '',
    specialDate: '',
    message: '',
    customUrl: '',
    theme: 'romantico'
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles]);
      // Criar URLs de preview
      const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await axios.post('http://localhost:5001/api/memories', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/memory/${response.data.customUrl}`);
    } catch (error) {
      console.error('Erro ao criar página:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Paper elevation={3} sx={{ p: 4, height: '100%', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <FavoriteIcon sx={{ color: themes.find(t => t.value === formData.theme)?.color }} />
        </Box>
        
        <Typography variant="h4" gutterBottom align="center" sx={{ color: themes.find(t => t.value === formData.theme)?.color }}>
          Criar Presente Virtual
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do(a) seu(sua) namorado(a)"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Seu nome"
                name="creatorName"
                value={formData.creatorName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data Especial"
                name="specialDate"
                type="date"
                value={formData.specialDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                helperText="Data do início do namoro, pedido, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sua mensagem romântica"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                helperText="Escreva uma mensagem especial para seu(sua) namorado(a)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tema</InputLabel>
                <Select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  label="Tema"
                >
                  {themes.map(theme => (
                    <MenuItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL Personalizada"
                name="customUrl"
                value={formData.customUrl}
                onChange={handleChange}
                helperText="Esta será a URL do seu presente (ex: amor-da-minha-vida)"
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  mb: 2
                }}
              >
                <input {...getInputProps()} />
                <Typography>
                  Arraste fotos do casal aqui ou clique para selecionar
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {previewUrls.map((url, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.8)'
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  bgcolor: themes.find(t => t.value === formData.theme)?.color,
                  '&:hover': {
                    bgcolor: themes.find(t => t.value === formData.theme)?.color,
                    opacity: 0.9
                  }
                }}
              >
                Criar Presente Virtual
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default MemoryForm; 