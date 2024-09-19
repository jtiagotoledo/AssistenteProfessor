import React, { useContext, useEffect } from 'react'
import { SafeAreaView, FlatList, Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { atualizarNotas } from "../banco_dados/atualizarBD"


type ItemData = {
  classe: string;
  idClasse: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  onLongPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, onLongPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.title, { color: textColor }]}>{item.classe}</Text>
  </TouchableOpacity>
);

const FlatListClasses = () => {
  const { idPeriodoSelec, idClasseSelec, setIdClasseSelec, listaClasses, idUsuario, setFlagLongPressClasse, listaNotas, dataSelec,
    setSelectedIdAluno, setNumAlunoSelec, setFlagLongPressAluno, nomePeriodoSelec, setFlagLongPressDataFreq, setFlagLongPressDataNotas, setNomeClasseSelec } = useContext(Context)

  useEffect(() => {
    //continuar
    //monitoramento para salvar frequência e nota
    if(listaNotas!==undefined){
      atualizarNotas(listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
    }
    console.log('idClasseSelec',idClasseSelec);
    console.log('listaNotas',listaNotas);

  }, [idClasseSelec])

  const onPressItem = (item: any) => {
    setIdClasseSelec(item.idClasse)
    setNomeClasseSelec(item.classe)
    setFlagLongPressClasse(false)
    setFlagLongPressAluno(false)
    setFlagLongPressDataFreq(false)
    setFlagLongPressDataNotas(false)
    setSelectedIdAluno('')
    setNumAlunoSelec('')

    //salvando estado da classe
    firestore().collection(idUsuario).
      doc('EstadosApp').update({
        idPeriodo: idPeriodoSelec,
        periodo: nomePeriodoSelec,
        idClasse: item.idClasse,
        classe: item.classe,
        data: ''
      })
  }

  const onLongPressItem = (item: any) => {
    setIdClasseSelec(item.idClasse)
    setNomeClasseSelec(item.classe)
    setFlagLongPressClasse(true)
  }

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.idClasse === idClasseSelec ? Globais.corPrimaria : Globais.corTerciaria;
    const color = item.idClasse === idClasseSelec ? Globais.corTextoClaro : Globais.corTextoEscuro;

    return (
      <Item
        item={item}
        onPress={() => onPressItem(item)}
        onLongPress={() => onLongPressItem(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const renderCarregamento = () => {
    if (idPeriodoSelec != '') {
      return (
        <SafeAreaView >
          <FlatList
            horizontal={true}
            data={listaClasses}
            renderItem={renderItem}
            keyExtractor={item => item.idClasse}
          />
        </SafeAreaView>
      )
    }
  }

  return (
    <View>
      {renderCarregamento()}
    </View>
  );
};

const styles = StyleSheet.create({

  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 40
  },
  title: {
    fontSize: 20,

  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
  }
});

export default FlatListClasses;