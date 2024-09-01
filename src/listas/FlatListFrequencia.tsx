import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

type ItemData = {
  nome: string;
  numero: string;
  frequencia: string;
  idAluno: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <View style={styles.containerItem}>
    <View style={[styles.item, styles.nome, { flexDirection: 'row' }]}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.titleNum]}>{item.numero}</Text>
      </View>
      <View style={{ flex: 10, justifyContent: 'center' }}>
        <Text style={[styles.titleNome]}>{item.nome}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text style={[styles.titleFrequencia]}>{item.frequencia}</Text>
      </TouchableOpacity>
    </View>
  </View>

);

const FlatListFrequencia = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const { idPeriodoSelec, idClasseSelec, setNumAlunoSelec, recarregarFrequencia,
    dataSelec, flagLoadFrequencia, setFlagLoadFrequencia, setRecarregarFrequencia,
    listaFrequencia, setListaFrequencia, idUsuario, setRecarregarAlunos } = useContext(Context)

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  useEffect(() => {
    listaAlunosRef.orderBy('numero').
      get().then(docSnapshot => {
        const alunos: any[] = []
        docSnapshot.forEach((docSnapshot) => {
          let frequencias = docSnapshot.data().frequencias
          if (dataSelec != '') {
            let idx = frequencias.findIndex((item: any) => item.data == dataSelec)
            if (idx != -1) {
              let frequencia = frequencias[idx].freq
              alunos.push({ ...docSnapshot.data(), frequencia });
            }
          }
        });
        setListaFrequencia(alunos)
      })
  }, [idPeriodoSelec, idClasseSelec, dataSelec, recarregarFrequencia])

  const onPressItemFreq = (item: any) => {
    const idAluno = item.idAluno;
    const index = listaFrequencia.findIndex((el: any) => el.idAluno === idAluno);
    let statusFrequencia = item.frequencia == 'P' ? 'A' : 'P'
    listaFrequencia[index].frequencia = statusFrequencia
    setSelectedId(item.idAluno);
    setNumAlunoSelec(item.numero.toString());

    //consulta ao array de frequencias
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
    }).catch((erro) => {
      console.error(erro);
    })

  }

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.numero === selectedId ? Globais.corPrimaria : Globais.corTerciaria;
    const color = item.numero === selectedId ? Globais.corTextoClaro : Globais.corTextoEscuro;

    return (
      <Item
        item={item}
        onPress={() => onPressItemFreq(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const renderCarregamento = () => {
    if (idClasseSelec != '') {
      if (dataSelec != '') {
        return (
          <FlatList
            data={listaFrequencia}
            renderItem={renderItem}
            keyExtractor={item => item.idAluno}
            contentContainerStyle={{ paddingBottom: 120 }}
            extraData={selectedId}
          />
        )
      }
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderCarregamento()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8
  },
  containerItem: {
    flexDirection: 'row',
  },
  item: {
    padding: 2,
    marginVertical: 2,
    marginHorizontal: 8,
    paddingLeft: 16,
    backgroundColor: Globais.corTerciaria,
  },
  titleNum: {
    fontSize: 20,
  },
  titleNome: {
    fontSize: 20,
    paddingLeft: 16
  },
  titleFrequencia: {
    padding: 8,
    fontSize: 20,
    backgroundColor: Globais.corSecundaria,
    color: Globais.corTextoClaro
  },
  nome: {
    flex: 3
  },
  frequencia: {
    flex: 1
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
  }
});

export default FlatListFrequencia;