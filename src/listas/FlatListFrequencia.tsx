import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Context} from '../data/Provider';
import Globais from '../data/Globais';
import {atualizarFrequencia} from '../services/frequencia';

type ItemData = {
  nome: string;
  numero: string;
  presente: number;
  idAluno: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const FlatListFrequencia = (props: any) => {
  const [selectedId, setSelectedId] = useState<string>();
  const {
    setRecarregarFrequencia,
    setNumAlunoSelec,
    dataSelec,
    listaFrequencia,
    setFlagLongPressDataFreq,
  } = useContext(Context);

  const onPressItemFreq = async (item: any) => {
    setSelectedId(item.idAluno);
    setNumAlunoSelec(item.numero.toString());
    setFlagLongPressDataFreq(false);

    try {
      await atualizarFrequencia(item.id, !item.presente);
      setRecarregarFrequencia((prev: any) => !prev);
    } catch (erro) {
      console.error('Erro ao atualizar frequência:', erro);
    }
  };

  const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
    <View style={styles.containerItem}>
      <View style={[styles.item, styles.nome, {flexDirection: 'row'}]}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.titleNum]}>{item.numero}</Text>
        </View>
        <View style={{flex: 10, justifyContent: 'center'}}>
          <Text style={[styles.titleNome]}>{item.nome}</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={[styles.item]}>
          <Text style={[styles.titleFrequencia]}>
            {item.presente == 1 ? 'P' : 'A'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor =
      item.numero === selectedId ? Globais.corPrimaria : Globais.corTerciaria;
    const color =
      item.numero === selectedId
        ? Globais.corTextoClaro
        : Globais.corTextoEscuro;

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
    return (
      <FlatList
        {...props}
        data={listaFrequencia}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={{paddingBottom: 120}}
        extraData={selectedId}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>{renderCarregamento()}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  containerItem: {
    flexDirection: 'row',
  },
  item: {
    padding: 2,
    marginVertical: 2,
    marginHorizontal: 8,
    paddingLeft: 8,
    backgroundColor: Globais.corTerciaria,
  },
  titleNum: {
    fontSize: 20,
    color: Globais.corTextoEscuro,
  },
  titleNome: {
    fontSize: 20,
    paddingLeft: 8,
    color: Globais.corTextoEscuro,
  },
  titleFrequencia: {
    padding: 8,
    fontSize: 20,
    backgroundColor: Globais.corSecundaria,
    color: Globais.corTextoClaro,
  },
  nome: {
    flex: 3,
  },
  frequencia: {
    flex: 1,
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
  },
});

export default FlatListFrequencia;
