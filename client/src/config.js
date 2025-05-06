const config = {
  apiUrl: import.meta.env.PROD
    ? 'https://seu-projeto-backend.vercel.app'  // Substitua pela URL real do seu backend
    : 'http://localhost:5001'
};

export default config; 