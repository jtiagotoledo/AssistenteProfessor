import axios from 'axios';

const API_URL = 'https://assistente-professor.duckdns.org:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;