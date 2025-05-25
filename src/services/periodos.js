import api from './api'; 

// Buscar todos os períodos de um professor
export const buscarPeriodosPorProfessor = async (id_professor) => {
  try {
    const resposta = await api.get(`/periodos/${id_professor}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar períodos do professor:', erro);
    throw erro;
  }
};

// Criar novo período
export const criarPeriodo = async (nome, id_professor) => {
  try {
    const resposta = await api.post('/periodos', {
      nome,
      id_professor
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar novo período:', erro);
    throw erro;
  }
};

// Atualizar um período
export const atualizarPeriodo = async (id, nome) => {
  try {
    const resposta = await api.put(`/periodos/${id}`, { nome });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar período:', erro);
    throw erro;
  }
};

// Deletar período pelo ID
export const deletarPeriodo = async (id) => {
  try {
    const resposta = await api.delete(`/periodos/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao deletar período:', erro);
    throw erro;
  }
};
