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

// Buscar notas por classe e data
export const buscarNotasPorClasseEData = async (id_classe, data) => {
  try {
    const resposta = await api.get(`/notas/classe/${id_classe}/data/${data}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar notas:', erro);
    throw erro;
  }
};

export const atualizarNota = async (id, nota) => {
  try {
    const resposta = await api.put(`/notas/${id}`, { nota });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar nota:', erro);
    throw erro;
  }
};

