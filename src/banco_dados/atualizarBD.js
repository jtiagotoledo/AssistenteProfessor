import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";


export function atualizarFrequencia(listaFreq,idUsuario,idPeriodoSelec,idClasseSelec) {

    let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

    
    Object.values(listaFreq).forEach(valor=>{
        console.log('valor',valor.frequencia);
        
    })
    
    
    /* //consulta ao array de frequencias
    listaAlunosRef.doc(idAluno).get().then((docSnapshot) => {
      let datas = docSnapshot.data()?.frequencias
      //modificando o array
      datas.map((item: any) => {
        if (item.data == dataSelec) {
          item.freq = statusFrequencia
        }
      })
      //atualizando o BD com o novo array
      listaAlunosRef.doc(idAluno).update({
        frequencias: datas
      })
    }) */
}

