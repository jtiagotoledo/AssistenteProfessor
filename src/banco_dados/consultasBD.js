import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";

const consultasBD = () => {

  const { idUsuario, setListaPeriodos, setIdPeriodoSelec, setIdClasseSelec,
    setNomePeriodoSelec, idPeriodoSelec, setListaClasses, idClasseSelec, setListaAlunos } = useContext(Context)

  useEffect(() => {
    console.log('consultaEstadosApp');
    //recuperar dados dos estados do app
    const unsub = firestore().collection(idUsuario)
      .doc('EstadosApp').onSnapshot(snapShot => {
        console.log('dentro do estadosApp');
        setIdPeriodoSelec(snapShot.data()?.idPeriodo)
        setNomePeriodoSelec(snapShot.data()?.periodo)
        setIdClasseSelec(snapShot.data()?.idClasse)
      })
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    console.log('consultaPeriodos');
    //consulta da lista de períodos do DB.
    const unsub = firestore().collection(idUsuario)
      .where(firestore.FieldPath.documentId(), "!=", "EstadosApp")
      .onSnapshot(querySnapshot => {
        const periodos = [];
        console.log(querySnapshot.size, 'dentro do consultaPeriodos');
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
    console.log('consultaClasses');
    //consulta da lista de classes do DB.
    const unsub = firestore().collection(idUsuario).doc(idPeriodoSelec)
      .collection('Classes').orderBy('classe')
      .onSnapshot(docSnapshot => {
        const classes = [];
        console.log(docSnapshot.size, 'dentro do consultaClasses');
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
    console.log('consultaAlunos');
    //consulta da lista de alunos do DB.
    const unsub = firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('ListaAlunos')
      .orderBy('numero').
      onSnapshot(docSnapshot => {
        const alunos = [];
        docSnapshot.forEach(item => {
          console.log(docSnapshot.size, 'dentro do consultaAlunos');
          alunos.push(item.data())
        })
        setListaAlunos(alunos)
      });
    return () => {
      unsub();
    };
  }, [idClasseSelec]);
}

export default consultasBD