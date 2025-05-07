import axios from 'axios';

const API_URL = 'http://assistente-professor.duckdns.org:3000';

const api = axios.create({
  baseURL: API_URL,
});

export default api;