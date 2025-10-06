import api from './api';

// URL para o endpoint de mapa de sala
const MAPA_SALA_URL = '/mapa-sala';

// Função para buscar o mapa de sala de uma classe específica
export const buscarMapaDeSala = async idClasse => {
  try {
    const resposta = await api.get(`${MAPA_SALA_URL}/${idClasse}`);
    return resposta.data;
  } catch (erro) {
    if (erro.response && erro.response.status === 404) {
      // O erro 404 significa que não há mapa salvo, o que é um cenário esperado
      return null;
    }
    console.error('Erro ao buscar mapa de sala:', erro);
    throw erro;
  }
};

// Função para salvar ou atualizar o mapa de sala
export const salvarMapaDeSala = async (
  idClasse,
  nome,
  colunas,
  fileiras,
  assentos,
) => {
  try {
    const dadosParaSalvar = {
      idClasse,
      nome,
      colunas,
      fileiras,
      assentos: JSON.stringify(assentos), // Envia como string JSON
    };
    const resposta = await api.post(MAPA_SALA_URL, dadosParaSalvar);
    return resposta.data;
  } catch (erro) {
    console.error('Erro ao salvar mapa de sala:', erro);
    throw erro;
  }
};
