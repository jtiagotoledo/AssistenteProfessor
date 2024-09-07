import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";


export function atualizarFrequencia(listaFreq, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {

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
    listaAlunosRef.doc(valor.idAluno).update({
      frequencias: datas
    }).then(console.log('salvo com sucesso'))
    .catch(console.log('erro ao salvar frequência'))
  })
}

