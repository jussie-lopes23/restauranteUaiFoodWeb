import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  // Define a URL base para todas as requisições
  baseURL: 'http://localhost:3001/api', // A URL do back-end
});

export default api;