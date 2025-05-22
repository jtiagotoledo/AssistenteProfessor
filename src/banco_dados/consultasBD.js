import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import { buscarProfessorPorId } from '../services/professores';
import { buscarPeriodosPorProfessor } from '../services/periodos';
import { buscarClassesPorPeriodo } from '../services/classes';
import { buscarAlunosPorClasse } from '../services/alunos';
import { buscarFrequenciasPorClasseEData } from '../services/frequencia';
import { buscarNotasPorClasseEData } from '../services/nota';
import { buscarDatasFrequenciaPorClasse } from '../services/datasFrequencia';
import { buscarDatasNotaPorClasse } from '../services/datasNotas';
import { buscarAtividadePorDataEClasse } from '../services/datasFrequencia';
import { buscarTituloPorDataEClasse } from '../services/datasNotas';
import auth from '@react-native-firebase/auth';

const consultasBD = () => {

  const { setNome, setEmail, idProfessor, setIdProfessor, setListaPeriodos, recarregarNotas, setListaDatasMarcadasFreq, recarregarDatasMarcadasNotas,
    recarregarFrequencia, idPeriodoSelec, setListaClasses, idClasseSelec, setListaAlunos, recarregarPeriodos, recarregarAlunos, setListaDatasMarcadasNotas,
    dataSelec, setListaFrequencia, setListaNotas, dataFreqSelec, dataNotaSelec, recarregarClasses, recarregarDadosProfessor, recarregarDatasMarcadasFreq, idDataFreq, idDataNota } = useContext(Context)

  useEffect(() => {
    // recupera dados dos professor e inicia os estados.
    const buscar = async () => {
      const id = auth().currentUser?.uid;

      if (id) {
        try {
          const result = await buscarProfessorPorId(id);
          setNome(result.nome)
          setEmail(result.email)
          setIdProfessor(result.id)
        } catch (erro) {
          console.error('Erro ao buscar professor:', erro);
        }
      }
    };
    buscar();
  }, [recarregarDadosProfessor]);

  useEffect(() => {
    // buscar todos os períodos do professor.
    const carregarPeriodos = async () => {
      try {
        if (!idProfessor) return;
        const periodos = await buscarPeriodosPorProfessor(idProfessor);
        const periodosFormatados = periodos.map((p) => ({
          label: p.nome,
          value: p.nome,
          idPeriodo: p.id,
          periodo: p.nome
        }));
        setListaPeriodos(periodosFormatados);
      } catch (error) {
        console.error('Erro ao carregar períodos', error);
      }
    };
    carregarPeriodos();
  }, [idProfessor, recarregarPeriodos]);

  useEffect(() => {
    // buscar todas as classes do período selecionado
    const carregarClasses = async () => {
      try {
        if (!idPeriodoSelec) return;
        const classes = await buscarClassesPorPeriodo(idPeriodoSelec);
        const classesFormatadas = classes.map((c) => ({
          idClasse: c.id,
          classe: c.nome,
          idPeriodo: c.id_periodo,
        }));
        setListaClasses(classesFormatadas);
      } catch (error) {
        console.error('Erro ao carregar classes', error);
      }
    };
    carregarClasses();
  }, [idPeriodoSelec, recarregarClasses]);


  useEffect(() => {
    // buscar todos os alunos da classe selecionada
    const carregarAlunos = async () => {
      try {
        if (!idClasseSelec) return;
        const alunos = await buscarAlunosPorClasse(idClasseSelec);

        const alunosFormatados = alunos.map((a) => ({
          idAluno: a.id,
          nome: a.nome,
          numero: a.numero,
          mediaNotas: a.media_notas,
          porcFreq: a.porc_frequencia,
          inativo: a.inativo,
          idClasseSelec: a.id_classe,
        }));

        setListaAlunos(alunosFormatados);
      } catch (error) {
        console.error('Erro ao carregar alunos', error);
      }
    };

    carregarAlunos();
  }, [idClasseSelec, recarregarAlunos]);

  useEffect(() => {
    // buscar as frequencias dos alunos por classe e data
    if (!idClasseSelec || !dataSelec) return;

    const carregarFrequencias = async () => {
      try {
        const dados = await buscarFrequenciasPorClasseEData(idClasseSelec, dataSelec);
        setListaFrequencia(dados);
      } catch (erro) {
        setError('Erro ao buscar frequências');
      }
    };

    carregarFrequencias();
  }, [recarregarFrequencia]);


  useEffect(() => {
    // Buscar as notas dos alunos por classe e data
    if (!idClasseSelec || !dataSelec) return;

    const carregarNotas = async () => {
      try {
        const dados = await buscarNotasPorClasseEData(idClasseSelec, dataSelec);
        setListaNotas(dados);
      } catch (erro) {
        setError('Erro ao buscar notas');
      }
    };

    carregarNotas();
  }, [recarregarNotas]);

  useEffect(() => {
    // Buscar todas as datas de frequencias por classe.
    if (!idClasseSelec) return;

    const buscarDatasFreq = async () => {
      try {
        const result = await buscarDatasFrequenciaPorClasse(idClasseSelec);
        const datas = result.map(item => item.data.substring(0, 10));
        const markedDates = datas.reduce((acc, date) => {
          acc[date] = {
            selected: true,
            selectedColor: Globais.corPrimaria,
          };
          return acc;
        }, {});
        setListaDatasMarcadasFreq(markedDates);
      } catch (err) {
        console.error('Erro ao buscar datas de frequência:', err);
      }
    };

    buscarDatasFreq();
  }, [idClasseSelec, recarregarDatasMarcadasFreq]);

  useEffect(() => {
    // Buscar todas as datas de notas por classe.
    if (!idClasseSelec) return;

    const buscarDatasNotas = async () => {
      try {
        const result = await buscarDatasNotaPorClasse(idClasseSelec);
        const datas = result.map(item => item.data.substring(0, 10));
        const markedDates = datas.reduce((acc, date) => {
          acc[date] = {
            selected: true,
            selectedColor: Globais.corPrimaria,
          };
          return acc;
        }, {});
        setListaDatasMarcadasNotas(markedDates);
      } catch (err) {
        console.error('Erro ao buscar datas de nota:', err);
      }
    };

    buscarDatasNotas();
  }, [idClasseSelec, recarregarDatasMarcadasNotas]);

/*   useEffect(() => {
    // retorna o texto das atividades desenvolvidas na data escolhida
    if (!idClasseSelec || !dataSelec) return;

    const buscarAtividade = async () => {
      try {
        const atividade = await buscarAtividadePorDataEClasse(dataSelec, idClasseSelec);
        setTextoAtividades(atividade.atividade);
        console.log('atividade', atividade);
      } catch (err) {
        console.error('Erro ao buscar atividade:', err);
      }
    };

    buscarAtividade();
  }, [idDataFreq]);

  useEffect(() => {
    //consulta ao BD retorna o texto do título da nota na data escolhida
    if (!idClasseSelec || !dataSelec) return;

    const buscarTituloNota = async () => {
      try {
        const titulo = await buscarTituloPorDataEClasse(dataSelec, idClasseSelec);
        setTextoTituloNotas(titulo);
        console.log('titulo', titulo);

      } catch (err) {
        console.error('Erro ao buscar título notas:', err);
      }
    };

    buscarTituloNota();
  }, [idDataNota]); */


}

export default consultasBD