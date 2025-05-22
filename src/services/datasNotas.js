import api from './api';

// Criar nova data de nota (sem o campo título)
export const criarDataNota = async ({ data, id_classe }) => {
  try {
    const resposta = await api.post('/datas-notas', {
      data,
      id_classe,
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar data de nota:', erro);
    throw erro;
  }
};

// Buscar todas as datas de nota por classe
export const buscarDatasNotaPorClasse = async (id_classe) => {
  try {
    const resposta = await api.get(`/datas-notas/${id_classe}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar datas de nota:', erro);
    throw erro;
  }
};

// Buscar título específico por data e classe
export const buscarTituloPorDataEClasse = async (data, id_classe) => {
  try {
    const resposta = await api.get('/datas-notas/buscar-titulo', {
      params: { data, id_classe }
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar título:', erro);
    throw erro;
  }
};

// Atualizar título
export const atualizarTitulo = async (id, titulo) => {
  try {
    const resposta = await api.put(`/datas-notas/${id}`, { titulo });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar título:', erro);
    throw erro;
  }
};

// Buscar ID e título por data e classe
export const buscarIdTituloPorDataEClasse = async (data, id_classe) => {
  try {
    const resposta = await api.get('/datas-notas/buscar-id-titulo', {
      params: { data, id_classe }
    });
    return resposta.data;  // { id: '...', titulo: '...' }
  } catch (erro) {
    console.error('Erro ao buscar ID e título por data e classe:', erro);
    throw erro;
  }
};
