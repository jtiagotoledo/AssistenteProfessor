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

export const atualizarAluno = async (id, dados) => {
  try {
    const corpoRequisicao = {
      numero: dados.numero,
      nome: dados.nome,
      inativo: dados.inativo,
      id_classe: dados.id_classe,
    };

    if (dados.media_notas !== undefined) {
      corpoRequisicao.media_notas = dados.media_notas;
    }
    if (dados.porc_frequencia !== undefined) {
      corpoRequisicao.porc_frequencia = dados.porc_frequencia;
    }

    const resposta = await api.put(`/alunos/${id}`, corpoRequisicao);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
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

// Deletar aluno pelo ID
export const deletarAluno = async (id) => {
  try {
    const resposta = await api.delete(`/alunos/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao deletar aluno:', erro);
    throw erro;
  }
};