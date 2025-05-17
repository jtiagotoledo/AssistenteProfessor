import api from './api';

// Buscar todas as datas de nota de uma classe
export const buscarDatasNotaPorClasse = async (id_classe) => {
  try {
    const resposta = await api.get(`/datas-notas/${id_classe}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar datas de nota:', erro);
    throw erro;
  }
};

// Criar nova data de nota
export const criarDataNota = async ({ data, id_classe }) => {
  try {
    const resposta = await api.post('/datas-notas', { data, id_classe });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar data de nota:', erro);
    throw erro;
  }
};
