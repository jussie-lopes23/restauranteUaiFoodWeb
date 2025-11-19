import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  // Define a URL base para todas as requisições
  baseURL: 'http://localhost:3001/api', 
});

export default api;