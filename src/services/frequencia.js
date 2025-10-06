import api from './api';

export const criarFrequencia = async ({
  id_data_frequencia,
  id_aluno,
  presente,
}) => {
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

// Buscar frequências por classe e data
export const buscarFrequenciasPorClasseEData = async (id_classe, data) => {
  try {
    const resposta = await api.get(
      `/frequencias/classe/${id_classe}/data/${data}`,
    );
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar frequências:', erro);
    throw erro;
  }
};

export const atualizarFrequencia = async (id, presente) => {
  try {
    const resposta = await api.put(`/frequencias/${id}`, {presente});
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar frequência:', erro);
    throw erro;
  }
};

// Buscar porcentagem de frequência de um aluno numa classe
export const buscarPorcentagemFrequencia = async (id_aluno, id_classe) => {
  try {
    const resposta = await api.get('/frequencias/porcentagem', {
      params: {id_aluno, id_classe},
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar porcentagem de frequência:', erro);
    throw erro;
  }
};

export const buscarFrequenciasPorClasse = async id_classe => {
  try {
    const resposta = await api.get(`/frequencias/classe/${id_classe}/todas`);
    return resposta.data; // array de { id_aluno, presente, id_data_frequencia }
  } catch (erro) {
    console.error('Erro ao buscar frequências da classe:', erro);
    throw erro;
  }
};
