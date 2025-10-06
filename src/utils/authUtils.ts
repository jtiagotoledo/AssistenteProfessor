import {jwtDecode} from 'jwt-decode';
import {recuperarTokens, salvarTokens} from './tokenStorage';
import axios from 'axios';

const API_URL = 'https://assistente-professor.duckdns.org:3000';

export const verificarValidadeAccessToken = async () => {
  const tokens = await recuperarTokens();

  if (!tokens?.accessToken) {
    return false;
  }

  const decoded = jwtDecode<{exp: number}>(tokens.accessToken);
  const agora = Math.floor(Date.now() / 1000);

  return decoded.exp > agora;
};

export const renovarAccessToken = async (): Promise<boolean> => {
  try {
    const tokens = await recuperarTokens();

    if (!tokens?.refreshToken) {
      console.warn('Refresh token ausente');
      return false;
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
    });

    const {accessToken, refreshToken} = response.data;

    await salvarTokens(accessToken, refreshToken);

    console.log('Token renovado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return false;
  }
};
