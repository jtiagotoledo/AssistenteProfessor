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
import { buscarFrequenciasPorClasse } from '../services/frequencia';
import { buscarNotasPorClasse } from '../services/nota';
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
        if (!idPeriodoSelec) {
          setListaClasses({})
          return
        }
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
    // carregar flatList alunos
    const carregarAlunosFrequenciasENotas = async () => {
      try {
        if (!idClasseSelec||!idPeriodoSelec) {
          setListaAlunos({})
          return
        }

        // 1. Buscar alunos da classe
        const alunos = await buscarAlunosPorClasse(idClasseSelec);
        const alunosFormatados = alunos.map(a => ({
          idAluno: a.id,
          nome: a.nome,
          numero: a.numero,
          mediaNotas: 0,  // será calculado
          porcFreq: 0,    // será calculado
          inativo: a.inativo,
          idClasseSelec: a.id_classe,
        }));

        // 2. Buscar todas as frequências da classe
        const todasFreqs = await buscarFrequenciasPorClasse(idClasseSelec);

        // 3. Buscar todas as notas da classe
        const todasNotas = await buscarNotasPorClasse(idClasseSelec);

        // 4. Para cada aluno, calcular porcentagem de frequência e média de notas
        const alunosComDados = alunosFormatados.map(aluno => {
          // Frequências
          const freqAluno = todasFreqs.filter(f => f.id_aluno === aluno.idAluno);
          const totalFreq = freqAluno.length;
          const presencas = freqAluno.filter(f => f.presente).length;
          const porcFreq = totalFreq === 0 ? 0 : ((presencas / totalFreq) * 100).toFixed(2);

          // Notas
          const notasAluno = todasNotas.filter(n => n.id_aluno === aluno.idAluno);
          const notasValidas = notasAluno.filter(n => n.nota !== null && !isNaN(parseFloat(n.nota)));

          const totalNotas = notasValidas.length;
          const somaNotas = notasValidas.reduce((sum, n) => sum + parseFloat(n.nota), 0);

          const mediaNotas = totalNotas === 0 ? 0 : (somaNotas / totalNotas).toFixed(2);

          return {
            ...aluno,
            porcFreq,
            mediaNotas
          };
        });
        setListaAlunos(alunosComDados);

      } catch (erro) {
        console.error('Erro ao carregar dados de alunos:', erro);
      }
    };

    carregarAlunosFrequenciasENotas();
  }, [idClasseSelec, recarregarAlunos]);


  useEffect(() => {
    // buscar as frequencias dos alunos por classe e data
    if (!idClasseSelec || !dataSelec) {
      setListaFrequencia({});
      return;
    }
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
    if (!idClasseSelec || !dataSelec){
      setListaNotas({});
      return;
    } 

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

}

export default consultasBD