import api from './api';

// Buscar todas as classes de um período
export const buscarClassesPorPeriodo = async (id_periodo) => {
  try {
    const resposta = await api.get(`/classes/${id_periodo}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar classes do período:', erro);
    throw erro;
  }
};

// Criar nova classe
export const criarClasse = async (nome, id_periodo) => {
  try {
    const resposta = await api.post('/classes', {
      nome,
      id_periodo
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar nova classe:', erro);
    throw erro;
  }
};

// Atualizar uma classe
export const atualizarClasse = async (id, nome, id_periodo) => {
  try {
    const resposta = await api.put(`/classes/${id}`, {
      nome,
      id_periodo
    });
    return resposta.data; 
  } catch (erro) {
    console.error('Erro ao atualizar classe:', erro);
    throw erro; 
  }
};

// Deletar classe pelo ID
export const deletarClasse = async (id) => {
  try {
    const resposta = await api.delete(`/classes/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao deletar classe:', erro);
    throw erro;
  }
};
