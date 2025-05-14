import api from './api';

// Buscar todos os alunos de uma classe
export const buscarAlunosPorClasse = async (id_classe) => {
  try {
    const resposta = await api.get(`/alunos/${id_classe}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar alunos da classe:', erro);
    throw erro;
  }
};

// Criar novo aluno
export const criarAluno = async ({ numero, nome, media_notas, porc_frequencia, inativo = false, id_classe }) => {
  try {
    const resposta = await api.post('/alunos', {
      numero,
      nome,
      media_notas,
      porc_frequencia,
      inativo,
      id_classe
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao criar aluno:', erro);
    throw erro;
  }
};

// Atualizar aluno
export const atualizarAluno = async (id, { numero, nome, media_notas, porc_frequencia, inativo, id_classe }) => {
  try {
    const resposta = await api.put(`/alunos/${id}`, {
      numero,
      nome,
      media_notas,
      porc_frequencia,
      inativo,
      id_classe
    });
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
    throw erro;
  }
};

// Deletar aluno
export const deletarAluno = async (id) => {
  try {
    const resposta = await api.delete(`/alunos/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao deletar aluno:', erro);
    throw erro;
  }
};

// Buscar um aluno específico (caso use o endpoint /alunos/id/:id)
export const buscarAlunoPorId = async (id) => {
  try {
    const resposta = await api.get(`/alunos/id/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar aluno:', erro);
    throw erro;
  }
};