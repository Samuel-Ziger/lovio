import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff69b4', // Rosa quente
      light: '#ff9eb5',
      dark: '#c93a6d',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0', // Roxo
      light: '#d05ce3',
      dark: '#6a0080',
      contrastText: '#fff',
    },
    background: {
      default: '#fff5f8',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
    h2: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
    h3: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
    h4: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
    h5: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
    h6: {
      fontFamily: 'cursive',
      color: '#ff69b4',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 'bold',
        },
        contained: {
          boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

export default theme; 