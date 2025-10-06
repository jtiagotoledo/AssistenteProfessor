import api from './api';

// POST /professores/acesso
export const registrarAcesso = async (id_professor, email_professor) => {
  try {
    const resposta = await api.post('/professores/acesso', {
      id_professor,
      email_professor,
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao registrar acesso', erro);
    throw erro;
  }
};
