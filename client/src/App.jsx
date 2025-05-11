import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomePage from './components/HomePage';
import CreateUrl from './components/CreateUrl';
import CreateTitle from './components/CreateTitle';
import CreateMessage from './components/CreateMessage';
import CreateImage from './components/CreateImage';
import CreateEmoji from './components/CreateEmoji';
import MemoryPage from './components/MemoryPage';
import CreatePlan from './components/CreatePlan';
import CreatePayment from './pages/CreatePayment';

const App = () => {
  return (
    <Router>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f8 0%, #fff 100%)'
      }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(45deg, #ff69b4 30%, #ff9eb5 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)'
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontFamily: 'cursive',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <FavoriteIcon /> Presente Virtual de Amor
            </Typography>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Criar Presente
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          flex: 1,
          width: '100%'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create/url" element={<CreateUrl />} />
            <Route path="/create/title" element={<CreateTitle />} />
            <Route path="/create/message" element={<CreateMessage />} />
            <Route path="/create/image" element={<CreateImage />} />
            <Route path="/create/emoji" element={<CreateEmoji />} />
            <Route path="/create/plan" element={<CreatePlan />} />
            <Route path="/create/payment" element={<CreatePayment />} />
            <Route path="/memory/:customUrl" element={<MemoryPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
