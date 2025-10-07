import api from './api';

// POST /auth/login
export const login = async dados => {
  try {
    const resposta = await api.post('/auth/login', dados);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao fazer login', erro);
    throw erro;
  }
};

// POST /auth/google
export const loginComGoogle = async idToken => {
  try {
    const resposta = await api.post('/auth/google', { idToken });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao fazer login com Google', erro);
    throw erro;
  }
};

// POST /auth/refresh
export const refreshAccessToken = async refreshToken => {
  try {
    const resposta = await api.post('/auth/refresh', { token: refreshToken });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao renovar token de acesso', erro);
    throw erro;
  }
};

// POST /auth/esqueci-senha
export const esqueciSenha = async email => {
  try {
    const resposta = await api.post('/auth/esqueci-senha', { email });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao solicitar trocar senha', erro);
    throw erro;
  }
};
