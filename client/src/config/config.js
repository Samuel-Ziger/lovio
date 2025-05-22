const config = {
  backendUrl: import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5001',
  frontendUrl: import.meta.env.PROD
    ? ''
    : 'http://localhost:5173'
};

export default config; 