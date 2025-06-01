import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; 

export const salvarTokens = async (accessToken: string, refreshToken: string) => {
  await Keychain.setGenericPassword('auth', JSON.stringify({ accessToken, refreshToken }));
};

export const recuperarTokens = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return JSON.parse(credentials.password);
  }
  return { accessToken: null, refreshToken: null };
};

export const limparTokens = async () => {
  await Keychain.resetGenericPassword();
};

export const renovarAccessToken = async () => {
  const { refreshToken } = await recuperarTokens();
  if (!refreshToken) {
    console.warn('Refresh token ausente');
    return null;
  }

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken: novoAccessToken, refreshToken: novoRefreshToken } = response.data;

    await salvarTokens(novoAccessToken, novoRefreshToken);
    return novoAccessToken;
  } catch (error) {
    console.error('Erro ao renovar accessToken', error);
    await limparTokens();
    return null;
  }
};

export const verificarValidadeAccessToken = async () => {
  const { accessToken } = await recuperarTokens();
  if (!accessToken) return false;

  try {
    const decoded: any = jwtDecode(accessToken);
    const agora = Math.floor(Date.now() / 1000);
    return decoded.exp > agora;
  } catch {
    return false;
  }
};
