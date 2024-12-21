import React, { useContext } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity, View, Dimensions } from 'react-native';
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
    <View style={styles.itemHeader}>
      <Text style={[styles.title, { color: textColor }]}>{item.numero}</Text>
      <Text style={[styles.title, { color: textColor, flex: 1 }]}>{item.nome}</Text>
    </View>
    <View style={styles.itemFooter}>
      <Text style={styles.smallText}>Média: {item.mediaNotas || '...'}</Text>
      <Text style={styles.smallText}>%Freq: {item.porcFreq || '...'}</Text>
    </View>
  </TouchableOpacity>
);

const FlatListAlunos = (props:any) => {
  const { idClasseSelec, setNumAlunoSelec, setFlagLongPressClasse, listaAlunos, setFlagLongPressAluno,
    selectedIdAluno, setSelectedIdAluno, setNomeAlunoSelec, setIdAlunoSelec, setAlunoInativo } = useContext(Context);

  const onPressItem = (item: any) => {
    selectedIdAluno === '' || selectedIdAluno !== item.idAluno ? setSelectedIdAluno(item.idAluno) : setSelectedIdAluno('');
    setIdAlunoSelec(item.idAluno);
    setNomeAlunoSelec(item.nome);
    setNumAlunoSelec(item.numero.toString());
    setFlagLongPressAluno(false);
  };

  const onLongPressItem = (item: any) => {
    setSelectedIdAluno(item.idAluno);
    setIdAlunoSelec(item.idAluno);
    setNomeAlunoSelec(item.nome);
    setNumAlunoSelec(item.numero.toString());
    setAlunoInativo(item.inativo);
    setFlagLongPressAluno(true);
    setFlagLongPressClasse(false);
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.inativo
      ? Globais.corAlunoInativo
      : item.idAluno === selectedIdAluno
        ? Globais.corPrimaria
        : Globais.corTerciaria;
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

  return (
    <SafeAreaView style={styles.container}>
      {idClasseSelec !== '' && (
        <FlatList
          {...props}
          data={listaAlunos}
          renderItem={renderItem}
          keyExtractor={item => item.idAluno}
          extraData={selectedIdAluno}
        />
      )}
    </SafeAreaView>
  );
};

export default FlatListAlunos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globais.corSecundaria,
  },
  item: {
    padding: Dimensions.get('window').width * 0.03, // Proporcional à largura da tela
    marginVertical: 4,
    marginHorizontal: '2%',
    borderRadius: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 4,
  },
  title: {
    fontSize: Dimensions.get('window').width * 0.045, // Proporcional à largura da tela
  },
  smallText: {
    fontSize: Dimensions.get('window').width * 0.035,
  },
});
