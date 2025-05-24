import api from './api';

// GET /professores
export const buscarTodosProfessores = async () => {
  try {
    const resposta = await api.get('/professores');
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar todos os professores', erro);
    throw erro;
  }
};

// GET /professores/:id
export const buscarProfessorPorId = async (id) => {
  try {
    const resposta = await api.get(`/professores/uuid/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao buscar professor com id ${id}`, erro);
    throw erro;
  }
};

// POST /professores
export const criarProfessor = async (dados) => {
  try {
    const resposta = await api.post('/professores', dados);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar professor', erro);
    throw erro;
  }
};

// PUT /professores/:id
export const atualizarProfessor = async (id, dados) => {
  try {
    const resposta = await api.put(`/professores/${id}`, dados);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao atualizar professor com id ${id}`, erro);
    throw erro;
  }
};

// DELETE /professores/:id
export const deletarProfessor = async (id) => {
  try {
    const resposta = await api.delete(`/professores/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error(`Erro ao deletar professor com id ${id}`, erro);
    throw erro;
  }
};

