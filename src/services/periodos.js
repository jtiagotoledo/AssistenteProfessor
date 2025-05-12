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