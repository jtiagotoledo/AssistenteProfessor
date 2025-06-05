import React, { useContext, useRef, useState } from 'react'
import { SafeAreaView, FlatList, View, Text, StyleSheet, TextInput } from 'react-native'
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import { atualizarNota } from "../services/nota"

type ItemData = {
  id: string,
  nome: string;
  numero: string;
  nota: string;
  idAluno: string;
};

const FlatListNotas = (props: any) => {
  const flatListRef = useRef<FlatList>(null);
  const textInputRefs = useRef<Record<string, TextInput | null>>({});
  const [notasEditadas, setNotasEditadas] = useState<Record<string, string>>({});
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const { listaNotas, setRecarregarNotas } = useContext(Context)
  const { t } = useTranslation();

  const handleNotaChange = (idItem: string, valor: string) => {
    setNotasEditadas((prev) => ({
      ...prev,
      [idItem]: valor,
    }));
  };

  const salvarNota = async (item: ItemData) => {
    const notaDigitada = notasEditadas[item.id];
    const notaConvertida = parseFloat(notaDigitada);
    if (!notaDigitada || isNaN(notaConvertida)) return; // evita salvar nota inválida
    try {
      await atualizarNota(item.id, notaConvertida);
      setRecarregarNotas((prev: any) => !prev);
    } catch (erro) {
      console.error('Erro ao atualizar nota:', erro);
    }
  };

  const scrollToItem = (itemId: string) => {
    const index = listaNotas.findIndex((item: any) => item.id === itemId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const nextItem = (idAtual: string) => {
    const indexAtual = listaNotas.findIndex((item: any) => item.id === idAtual);
    if (indexAtual !== -1) {
      salvarNota(listaNotas[indexAtual]); // salva antes de mudar o foco
      if (indexAtual < listaNotas.length - 1) {
        const proximoId = listaNotas[indexAtual + 1].id;
        const proximoInput = textInputRefs.current[proximoId];
        if (proximoInput) {
          proximoInput.focus();
        }
      }
    }
  };

  const onSelectionChange = (event: any) => {
    const { nativeEvent } = event;
    const { selection } = nativeEvent;
    setSelection(selection);
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    return (
      <View style={styles.containerItem}>
        <View style={[styles.item, styles.nome]}>
          <Text style={[styles.title]}>{item.numero + '  '} {item.nome}</Text>
        </View>
        <View>
          <TextInput
            ref={(ref) => (textInputRefs.current[item.id] = ref!)}
            style={styles.itemNota}
            placeholder={t('Nota')}
            inputMode='numeric'
            value={notasEditadas[item.id]?.toString() ?? item.nota?.toString() ?? ''}
            onChangeText={(texto) => handleNotaChange(item.id, texto)}
            defaultValue={item.nota}
            onFocus={() => scrollToItem(item.id)}
            onSubmitEditing={() => nextItem(item.id)}
            blurOnSubmit={false} 
            selection={selection}
            onSelectionChange={onSelectionChange}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        {...props}
        data={listaNotas}
        renderItem={renderItem}
        ref={flatListRef}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={{ paddingBottom: 300 }}
        keyboardShouldPersistTaps='handled'
      />
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
    marginHorizontal: 4,
    backgroundColor: Globais.corTerciaria,
  },
  itemNota: {
    width: 80,
    marginVertical: 2,
    marginHorizontal: 8,
    backgroundColor: Globais.corTerciaria,
  },
  title: {
    fontSize: 24,
    color: Globais.corTextoEscuro
  },
  nome: {
    flex: 3,
  },
});

export default FlatListNotas;
