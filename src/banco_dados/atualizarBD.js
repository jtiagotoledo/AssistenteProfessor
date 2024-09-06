import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";


export function atualizarFrequencia(listaFreq, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {

    let listaAlunosRef = firestore().collection(idUsuario)
        .doc(idPeriodoSelec).collection('Classes')
        .doc(idClasseSelec).collection('ListaAlunos')


    Object.values(listaFreq).forEach(valor => {
        console.log('nome', valor.nome);
        console.log('----------');
        
        
        let datas = valor.frequencias
        console.log('datasAntes', datas);

        datas.map((item) => {
            if (item.data == dataSelec) {
                item.freq = valor.frequencia
            }
        })

        console.log('datasDepois', datas);
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

