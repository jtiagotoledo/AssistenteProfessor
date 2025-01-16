import firestore from '@react-native-firebase/firestore';

export async function atualizarAtividades(texto,idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {
  firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasFrequencias')
    .doc(dataSelec).set({
      atividade: texto
    })
}

export async function atualizarTituloNotas(texto,idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {
  firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasNotas')
    .doc(dataSelec).set({
      tituloNota: texto
    })
}

export async function atualizarFrequencia(listaFreq, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {
  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  const batch = firestore().batch()

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

    if (qntDatas > 0) {
      porcFreq = ((contFreq / qntDatas) * 100).toFixed(1).toString()
    } else {
      porcFreq = '...'
    }

    //atualizando a frequência no BD
    batch.update(listaAlunosRef.doc(valor.idAluno), {
      porcFreq
    })

  })

  try {
    //executa gravação em lote
    await batch.commit();
  } catch (error) {
  }
}

export async function atualizarNotas(listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) {
  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

    const batch = firestore().batch()

  Object.values(listaNotas).forEach(valor => {
    let datas = valor.notas

    //modificando o array de notas
    datas.map((item) => {
      if (item.data == dataSelec) {
        item.nota = valor.nota
      }
    })

    //atualizando o BD com o novo array
    batch.update(listaAlunosRef.doc(valor.idAluno), {
      notas: datas
    })

    //cálculo da média das notas
    let somaNotas = 0, mediaNotas
    let qntDatas = Object.keys(datas).length

    datas.forEach((item) => {
      item.nota !== '' ? somaNotas += parseFloat(item.nota) : null
    })

    if (qntDatas > 0) {
      mediaNotas = (somaNotas / qntDatas).toFixed(1).toString()
    } else {
      mediaNotas = '...'
    }

    //atualizando a média no BD
    batch.update(listaAlunosRef.doc(valor.idAluno), {
      mediaNotas
    })

  })

  try {
    //executa gravação em lote
    await batch.commit();
  } catch (error) {
  }
}

