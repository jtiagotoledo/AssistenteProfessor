import React, { useContext } from 'react'
import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity, View } from 'react-native'
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

type ItemData = {
  nome: string;
  numero: string;
  inativo: string;
  idAluno: string;
  mediaNotas: string;
  porcFreq: string;
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
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: textColor }]}>{item.numero}      </Text>
      </View>
      <View style={{ flex: 10 }}>
        <Text style={[styles.title, { color: textColor }]}>{item.nome}</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 4 }}>
      <Text style={{ fontSize: 12 }}>Média: {item.mediaNotas || ' ...'}</Text>
      <Text style={{ fontSize: 12 }}>%Freq: {item.porcFreq || ' ...'}</Text>
    </View>
  </TouchableOpacity>
);

const FlatListAlunos = () => {
  const { idClasseSelec, setNumAlunoSelec, setFlagLongPressClasse, listaAlunos, setFlagLongPressAluno,
    selectedIdAluno, setSelectedIdAluno, setNomeAlunoSelec, setIdAlunoSelec, setAlunoInativo } = useContext(Context)

  const onPressItem = (item: any) => {
    selectedIdAluno === '' || selectedIdAluno !== item.idAluno ? setSelectedIdAluno(item.idAluno) : setSelectedIdAluno('')
    setIdAlunoSelec(item.idAluno)
    setNomeAlunoSelec(item.nome)
    setNumAlunoSelec(item.numero.toString())
    setFlagLongPressAluno(false)
  }

  const onLongPressItem = (item: any) => {
    setSelectedIdAluno(item.idAluno)
    setIdAlunoSelec(item.idAluno)
    setNomeAlunoSelec(item.nome)
    setNumAlunoSelec(item.numero.toString())
    setAlunoInativo(item.inativo)
    setFlagLongPressAluno(true)
    setFlagLongPressClasse(false)
  }

  const renderItem = ({ item }: { item: ItemData }) => {
    let backgroundColor = ''
    if (item.inativo) {
      backgroundColor = Globais.corAlunoInativo
    } else {
      backgroundColor = item.idAluno === selectedIdAluno ? Globais.corPrimaria : Globais.corTerciaria;
    }
    const color = item.idAluno === selectedIdAluno ? Globais.corTextoClaro : Globais.corTextoEscuro;

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
    if (idClasseSelec != '') {
      return (
        <FlatList
          data={listaAlunos}
          renderItem={renderItem}
          keyExtractor={item => item.idAluno}
          extraData={selectedIdAluno}
        />
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderCarregamento()}
    </SafeAreaView>
  );
};

export default FlatListAlunos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  item: {
    padding: 8,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
  }
});

