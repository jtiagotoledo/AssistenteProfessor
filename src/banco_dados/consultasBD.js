import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";

const consultasBD = () => {

  const { idUsuario, setListaPeriodos, setIdPeriodoSelec, setIdClasseSelec,
    setNomePeriodoSelec, idPeriodoSelec, setListaClasses, idClasseSelec, setListaAlunos,
    dataSelec, setListaFrequencia } = useContext(Context)

  useEffect(() => {
    //recuperar dados dos estados do app
    const unsub = firestore().collection(idUsuario)
      .doc('EstadosApp').onSnapshot(snapShot => {
        setIdPeriodoSelec(snapShot.data()?.idPeriodo)
        setNomePeriodoSelec(snapShot.data()?.periodo)
        setIdClasseSelec(snapShot.data()?.idClasse)
      })
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    //consulta da lista de períodos do DB.
    const unsub = firestore().collection(idUsuario)
      .where(firestore.FieldPath.documentId(), "!=", "EstadosApp")
      .onSnapshot(querySnapshot => {
        const periodos = [];
        querySnapshot.forEach(documentSnapshot => {
          let label = documentSnapshot.data().periodo
          let value = documentSnapshot.data().periodo
          let idPeriodo = documentSnapshot.data().idPeriodo
          let periodo = documentSnapshot.data().periodo
          periodos.push({ label: label, value: value, idPeriodo: idPeriodo, periodo: periodo });
        });
        setListaPeriodos(periodos)
      });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    //consulta da lista de classes do DB.
    const unsub = firestore().collection(idUsuario).doc(idPeriodoSelec)
      .collection('Classes').orderBy('classe')
      .onSnapshot(docSnapshot => {
        const classes = [];
        docSnapshot.forEach((item) => {
          classes.push(item.data())
        });
        setListaClasses(classes);
      });
    return () => {
      unsub();
    };
  }, [idPeriodoSelec]);

  useEffect(() => {
    setListaAlunos([])
    //consulta da lista de alunos do DB.
    const unsub = firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('ListaAlunos')
      .orderBy('numero').
      onSnapshot(docSnapshot => {
        const alunos = [];
        docSnapshot.forEach(item => {
          (docSnapshot.size, 'dentro do consultaAlunos');
          alunos.push(item.data())
        })
        setListaAlunos(alunos)
      });
    return () => {
      unsub();
    };
  }, [idClasseSelec]);

  useEffect(() => {
    const unsub = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')
    .orderBy('numero').onSnapshot(docSnapshot => {
        const alunos = []
        docSnapshot.forEach((docSnapshot) => {
          let frequencias = docSnapshot.data().frequencias
          if (dataSelec != '') {
            let idx = frequencias.findIndex((item) => item.data == dataSelec)
            if (idx != -1) {
              let frequencia = frequencias[idx].freq
              alunos.push({ ...docSnapshot.data(), frequencia });
            }
          }
        });
        setListaFrequencia(alunos)
      })
      return () => {
        unsub();
      };
  }, [idPeriodoSelec, idClasseSelec, dataSelec])
}

export default consultasBD