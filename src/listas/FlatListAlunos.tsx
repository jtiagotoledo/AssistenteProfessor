import React, { useContext, useMemo } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';

type ItemData = {
  nome: string;
  numero: string;
  inativo: string;
  idAluno: string;
  mediaNotas: string;
  porcFreq: string;
  foto_url?: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  onLongPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = React.memo(({ item, onPress, onLongPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.itemHeader}>
      {item.foto_url ? (
        <FastImage
          style={styles.avatar}
          source={{
            uri: item.foto_url,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]} />
      )}
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={[styles.title, { color: textColor }]}>
          {item.numero + '  '}{item.nome}
        </Text>
      </View>
    </View>
    <View style={styles.itemFooter}>
      <Text style={styles.smallText}>{`${item.mediaNotas != null ? item.mediaNotas : '...'} ${'Média'}`}</Text>
      <Text style={styles.smallText}>{`${item.porcFreq != null ? item.porcFreq + '%' : '...'} ${'Frequência'}`}</Text>
    </View>
  </TouchableOpacity>
));

const FlatListAlunos = (props: any) => {
  const {
    setNumAlunoSelec, setFlagLongPressClasse, listaAlunos,
    setFlagLongPressAluno, selectedIdAluno, setSelectedIdAluno,
    setNomeAlunoSelec, setIdAlunoSelec, setAlunoInativo
  } = useContext(Context);

  const { t } = useTranslation();

  const onPressItem = (item: ItemData) => {
    selectedIdAluno === '' || selectedIdAluno !== item.idAluno
      ? setSelectedIdAluno(item.idAluno)
      : setSelectedIdAluno('');
    setIdAlunoSelec(item.idAluno);
    setNomeAlunoSelec(item.nome);
    setNumAlunoSelec(item.numero.toString());
    setFlagLongPressAluno(false);
  };

  const onLongPressItem = (item: ItemData) => {
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

    const color = item.idAluno === selectedIdAluno
      ? Globais.corTextoClaro
      : Globais.corTextoEscuro;

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

  const keyExtractor = useMemo(() => (item: ItemData, index: number) => (
    item.idAluno ? item.idAluno.toString() : index.toString()
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        {...props}
        data={listaAlunos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectedIdAluno}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />
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
    padding: Dimensions.get('window').width * 0.03,
    marginVertical: 4,
    marginHorizontal: '2%',
    borderRadius: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 4,
  },
  title: {
    fontSize: Dimensions.get('window').width * 0.045,
    fontWeight: '500',
  },
  smallText: {
    fontSize: Dimensions.get('window').width * 0.035,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  avatarPlaceholder: {
    backgroundColor: '#aaa',
  },
});
