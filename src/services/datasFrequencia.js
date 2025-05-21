import api from './api';

// Criar nova data de frequência
export const criarDataFrequencia = async ({ data, id_classe }) => {
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
export const buscarDatasFrequenciaPorClasse = async (id_classe) => {
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
      params: { data, id_classe }
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar atividade:', erro);
    throw erro;
  }
};
