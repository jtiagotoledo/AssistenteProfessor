import {useEffect, useContext} from "react";
import firestore from '@react-native-firebase/firestore';
import {Context} from "../data/Provider";

const consultaPeriodos = () =>{

    const {  idUsuario, setListaPeriodos } = useContext(Context)

    useEffect(() => {
        console.log('consultaPeriodos');
        const unsub = firestore().collection(idUsuario)
          .where(firestore.FieldPath.documentId(), "!=", "EstadosApp")
          .onSnapshot(querySnapshot => {
            const periodos = [];
            console.log(querySnapshot.size, 'size');
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
      }, [])
}

export default consultaPeriodos