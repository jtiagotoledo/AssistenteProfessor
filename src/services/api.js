import axios from 'axios';
import {renovarAccessToken, recuperarTokens} from '../utils/tokenStorage';

const api = axios.create({
  baseURL: 'https://assistente-professor.duckdns.org:3000',
});

// Interceptor de request: adiciona accessToken
api.interceptors.request.use(async config => {
  const {accessToken} = await recuperarTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor de response: tenta renovar se 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const novoAccessToken = await renovarAccessToken();
      if (novoAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${novoAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
