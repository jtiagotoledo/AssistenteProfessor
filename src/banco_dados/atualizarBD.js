import { ToastAndroid } from "react-native";
import firestore from '@react-native-firebase/firestore';

export async function atualizarFrequencia(listaFreq, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {

  const batch = firestore().batch()

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  Object.values(listaFreq).forEach(valor => {

    let datas = valor.frequencias

    //modificando o array de frequências
    datas.map((item) => {
      if (item.data == dataSelec) {
        item.freq = valor.frequencia
      }
    })

    //atualizando o BD com o novo array
    batch.update(listaAlunosRef.doc(valor.idAluno), {
      frequencias: datas
    })

    //contagem e cálculo da porcentagem de frequência
    let contFreq = 0, porcFreq 
    let qntDatas = Object.keys(datas).length

    datas.forEach((item) => {
      if (item.freq === 'P') contFreq += 1
    })

    if(qntDatas>0){
      porcFreq = ((contFreq/qntDatas)*100).toFixed(1).toString()
    }else{
      porcFreq = '...'
    }

    console.log('porcFreq',porcFreq);
    
    
  })

  try {
    //executa gravação em lote
    await batch.commit();
    ToastAndroid.show(
      'Frequência salva com sucesso!',
      ToastAndroid.SHORT)
  } catch (error) {
    ToastAndroid.show(
      'Erro ao salvar frequência:' + error,
      ToastAndroid.SHORT)
  }
}

