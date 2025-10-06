import api from './api';

export const criarNota = async ({id_data_nota, id_aluno, nota}) => {
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
    const resposta = await api.put(`/notas/${id}`, {nota});
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar nota:', erro);
    throw erro;
  }
};

export const buscarNotasPorClasse = async idClasse => {
  try {
    const resposta = await api.get(`/notas/classe/${idClasse}/todas`);
    return resposta.data; // deve retornar array de { id_aluno, nota, id_data_nota }
  } catch (erro) {
    console.error('Erro ao buscar notas da classe:', erro);
    return []; // retorna array vazio em caso de erro, para evitar quebrar o map
  }
};
