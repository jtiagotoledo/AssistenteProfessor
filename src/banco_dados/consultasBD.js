import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import { buscarProfessorPorId } from '../services/professores';
import { buscarPeriodosPorProfessor } from '../services/periodos';
import { buscarClassesPorPeriodo } from '../services/classes';
import { buscarAlunosPorClasse } from '../services/alunos';
import { buscarFrequenciasPorClasseEData } from '../services/frequencia';
import { buscarNotasPorClasseEData } from '../services/nota';
import auth from '@react-native-firebase/auth';

const consultasBD = () => {

  const { setNome, setEmail, idProfessor, setIdProfessor, idUsuario, setListaPeriodos, recarregarNotas, setIdClasseSelec,
    recarregarFrequencia, idPeriodoSelec, setListaClasses, idClasseSelec, setListaAlunos, recarregarPeriodos, recarregarAlunos,
    dataSelec, setListaFrequencia, setListaNotas, setTextoAtividades, setTextoTituloNotas, recarregarClasses, recarregarDadosProfessor } = useContext(Context)

  const listaAlunosRef = firestore().collection(idUsuario ? idUsuario : ' ')
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

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
        console.log('dados',dados);
        
        setListaFrequencia(dados);
      } catch (erro) {
        setError('Erro ao buscar frequências');
      }
    };

    carregarFrequencias();
  }, [idClasseSelec, dataSelec, recarregarFrequencia]);


  useEffect(() => {
  // Buscar as notas dos alunos por classe e data
  if (!idClasseSelec || !dataSelec) return;

  const carregarNotas = async () => {
    try {
      const dados = await buscarNotasPorClasseEData(idClasseSelec, dataSelec);
      console.log('notas', dados);

      setListaNotas(dados);
    } catch (erro) {
      setError('Erro ao buscar notas');
    }
  };

  carregarNotas();
}, [idClasseSelec, dataSelec, recarregarNotas]);


  useEffect(() => {
    //consulta ao BD retorna o texto das atividades desenvolvidas na data escolhida
    const unsub = firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('DatasFrequencias')
      .onSnapshot(docSnapshot => {
        docSnapshot.forEach((docSnapshot) => {
          if (docSnapshot.id == dataSelec) {
            setTextoAtividades(docSnapshot.data().atividade)
          }
        });
      })
    return () => {
      unsub();
    };
  }, [dataSelec]);

  useEffect(() => {
    //consulta ao BD retorna o texto do título da nota na data escolhida
    const unsub = firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('DatasNotas')
      .onSnapshot(docSnapshot => {
        docSnapshot.forEach((docSnapshot) => {
          if (docSnapshot.id == dataSelec) {
            setTextoTituloNotas(docSnapshot.data().tituloNota)
          }
        });
      })
    return () => {
      unsub();
    };
  }, [dataSelec]);
}

export default consultasBD