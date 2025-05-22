const config = {
  backendUrl: import.meta.env.PROD
    ? 'https://presentenamorados.vercel.app/api'
    : 'http://localhost:5001',
  frontendUrl: import.meta.env.PROD
    ? 'https://presentenamorados.vercel.app'
    : 'http://localhost:5173'
};

export default config; 