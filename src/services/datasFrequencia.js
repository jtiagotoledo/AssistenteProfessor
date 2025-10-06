import api from './api';

// Criar nova data de frequência
export const criarDataFrequencia = async ({data, id_classe}) => {
  try {
    const resposta = await api.post('/datas-frequencia', {
      data,
      id_classe,
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar data de frequência:', erro);
    throw erro;
  }
};

// Buscar todas as datas de frequência por classe
export const buscarDatasFrequenciaPorClasse = async id_classe => {
  try {
    const resposta = await api.get(`/datas-frequencia/${id_classe}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar datas de frequência:', erro);
    throw erro;
  }
};

// Buscar atividade específica por data e classe
export const buscarAtividadePorDataEClasse = async (data, id_classe) => {
  try {
    const resposta = await api.get('/datas-frequencia/buscar-atividade', {
      params: {data, id_classe},
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar atividade:', erro);
    throw erro;
  }
};

// Atualizar atividade
export const atualizarAtividade = async (id, atividade) => {
  try {
    const resposta = await api.put(`/datas-frequencia/${id}`, {atividade});
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar atividade:', erro);
    throw erro;
  }
};

// Buscar ID e atividade por data e classe
export const buscarIdAtivPorDataEClasse = async (data, id_classe) => {
  try {
    const resposta = await api.get('/datas-frequencia/buscar-id-atividade', {
      params: {data, id_classe},
    });
    return resposta.data; // { id: '...' }
  } catch (erro) {
    console.error('Erro ao buscar ID por data e classe:', erro);
    throw erro;
  }
};

// Deletar data de frequência pelo ID
export const deletarDataFrequencia = async id => {
  try {
    const resposta = await api.delete(`/datas-frequencia/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao deletar data de frequência:', erro);
    throw erro;
  }
};
