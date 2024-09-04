import { useEffect, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";


export function atualizarFrequencia(listaFreq,idUsuario,idPeriodoSelec,idClasseSelec) {

    let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

    console.log('ddd',listaFreq,idUsuario,idPeriodoSelec,idClasseSelec);
    
    
}

