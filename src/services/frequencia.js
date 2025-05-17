import api from './api';

export const criarFrequencia = async ({ id_data_frequencia, id_aluno, presente }) => {
  try {
    const resposta = await api.post('/frequencias', {
      id_data_frequencia,
      id_aluno,
      presente,
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar frequência:', erro);
    throw erro;
  }
};