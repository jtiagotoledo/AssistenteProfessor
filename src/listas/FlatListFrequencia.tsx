import React, { useContext, useState } from 'react'
import { SafeAreaView, FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { atualizarFrequencia } from "../banco_dados/atualizarBD"

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



const FlatListFrequencia = () => {
  const [statusFreq, setStatusFreq] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const { idClasseSelec, setNumAlunoSelec, dataSelec, listaFrequencia,
    idUsuario, idPeriodoSelec} = useContext(Context)

  const onPressItemFreq = (item: any) => {
    const idAluno = item.idAluno;
    const index = listaFrequencia.findIndex((el: any) => el.idAluno === idAluno);
    setStatusFreq(item.frequencia == 'P' ? 'A' : 'P')
    let _statusFrequencia = item.frequencia == 'P' ? 'A' : 'P'
    listaFrequencia[index].frequencia = _statusFrequencia
    setSelectedId(item.idAluno);
    setNumAlunoSelec(item.numero.toString());
    atualizarFrequencia(listaFrequencia, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
  }

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