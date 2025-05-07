import api from './api';

export const buscarMensagens = async () => {
  try {
    const resposta = await api.get('/mensagens');
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar mensagens:', erro);
    throw erro;
  }
};