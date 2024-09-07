import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";


export async function atualizarFrequencia(listaFreq, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {
  
  const batch = firestore().batch()

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  Object.values(listaFreq).forEach(valor => {

    let datas = valor.frequencias

    //modificando o array
    datas.map((item) => {
      if (item.data == dataSelec) {
        item.freq = valor.frequencia
      }
    })
    
    //atualizando o BD com o novo array
    batch.update(listaAlunosRef.doc(valor.idAluno),{
      frequencias: datas
    })
  })
  
  try {
    // Commit do batch
    await batch.commit();
    console.log('Batch write successfully executed!');
  } catch (error) {
    console.error('Error performing batch write: ', error);
  }
}

