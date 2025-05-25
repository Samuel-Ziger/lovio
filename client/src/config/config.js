const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
};

export default config; 