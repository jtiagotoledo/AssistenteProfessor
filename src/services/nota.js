import api from './api';

export const criarNota = async ({ id_data_nota, id_aluno, nota }) => {
  try {
    const resposta = await api.post('/notas', {
      id_data_nota,
      id_aluno,
      nota,
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar nota:', erro);
    throw erro;
  }
};
