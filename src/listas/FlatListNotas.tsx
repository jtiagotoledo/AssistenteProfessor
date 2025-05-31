import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView, FlatList, View, Text, StyleSheet, AppState, TextInput } from 'react-native'
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
  const listaNotasRef = useRef({})
  const textInputRefs = useRef<TextInput[]>([]);
  const [notasEditadas, setNotasEditadas] = useState<Record<string, string>>({});
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [textNota, setTextNota] = useState('');
  const { idClasseSelec, dataSelec, listaNotas, setRecarregarNotas,
    idUsuario, idPeriodoSelec, setValueNota, valueNota } = useContext(Context)
  const { t } = useTranslation();

  useEffect(() => {
    //mantem uma cópia da lista de notas para salvar quando o app é fechado
    listaNotasRef.current = listaNotas
  }, [textNota])

  useEffect(() => {
    //monitoramento do app, se fechado ele chama a função para salvar as notas.
    const handleAppStateChange = (nextAppState: any) => {
      
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

 /*  const onChangeNota = (item: ItemData, nota: string) => {
    const index = listaNotas.findIndex((el: any) => el.idAluno === item.idAluno);
    listaNotas[index].nota = nota
    setTextNota(nota)
    setValueNota(nota)
  } */

  const handleNotaChange = (idItem:string, valor:string) => {
    setNotasEditadas((prev) => ({
      ...prev,
      [idItem]: valor,
    }));
  };

  const salvarNota = async (item: any) => {
    const notaDigitada = notasEditadas[item.id];
    const notaConvertida = parseFloat(notaDigitada);
    try {
      console.log(item.id, valueNota);
      await atualizarNota(item.id, notaConvertida);
      setRecarregarNotas((prev: any) => !prev);
    } catch (erro) {
      console.error('Erro ao atualizar nota:', erro);
    }
  };


  const renderItem = ({ item }: { item: ItemData }) => {

    const scrollToItem = (itemId: any, itemNumero: any) => {
      const index = listaNotas.findIndex((item: any) => item.idAluno === itemId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    };

    const nextItem = (itemId: any) => {
      const index = listaNotas.findIndex((item: any) => item.idAluno === itemId);
      const numProxAluno = listaNotas[index + 1]?.numero
      const sizeText = listaNotas[numProxAluno - 1]?.nota.length || 0
      setSelection({ start: sizeText || 0, end: sizeText || 0 })
      if (index !== -1 && flatListRef.current && listaNotas[index + 1] != null) {
        textInputRefs.current[numProxAluno]?.focus()
      }
    };

    const onSelectionChange = (event: any) => {
      const { nativeEvent } = event;
      const { selection } = nativeEvent
      setSelection(selection)
    };

    return (
      <View style={styles.containerItem}>
        <View style={[styles.item, styles.nome]}>
          <Text style={[styles.title]}>{item.numero + '  '} {item.nome}</Text>
        </View>
        <View>
          <TextInput
            ref={(ref) => (textInputRefs.current[parseInt(item.numero)] = ref!)}
            style={styles.itemNota}
            placeholder={t('Nota')}
            inputMode='numeric'
            value={notasEditadas[item.id]?.toString() ?? item.nota?.toString() ?? ''}
            onChangeText={(texto) => handleNotaChange(item.id, texto)}
            defaultValue={item.nota}
            onBlur={() => salvarNota(item)}
            onFocus={() => [scrollToItem(item.idAluno, item.numero)]}
            // onSubmitEditing={() => nextItem(item.idAluno)}
            selection={selection}
            onSelectionChange={(syntheticEvent) => onSelectionChange(syntheticEvent)}>
          </TextInput>
        </View>
      </View>
    );
  };

  const renderCarregamento = () => {
    return (
      <FlatList
        {...props}
        data={listaNotas}
        renderItem={renderItem}
        ref={flatListRef}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={{ paddingBottom: 300 }}
        keyboardShouldPersistTaps='handled'
      />
    )
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
  titleFrequencia: {
    fontSize: 24,
    textAlign: 'center',
  },
  nome: {
    flex: 3,
  },
  frequencia: {
    flex: 1
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
  }
});

export default FlatListNotas;