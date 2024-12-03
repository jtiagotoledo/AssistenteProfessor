import React, { useContext, useEffect, useRef, useState } from 'react'
import { Keyboard, SafeAreaView, FlatList, View, Text, StyleSheet, AppState, TextInput } from 'react-native'
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { atualizarNotas } from "../banco_dados/atualizarBD"

type ItemData = {
  nome: string;
  numero: string;
  nota: string;
  idAluno: string;
};

const FlatListNotas = () => {
  const flatListRef = useRef<FlatList>(null);
  const listaNotasRef = useRef({})
  const textInputRefs = useRef<TextInput[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [textNota, setTextNota] = useState('');
  const { idClasseSelec, dataSelec, listaNotas, setTecladoAtivo,
    idUsuario, idPeriodoSelec} = useContext(Context)

  useEffect(()=>{
    //mantem uma cópia da lista de notas para salvar quando o app é fechado
    listaNotasRef.current = listaNotas
  },[textNota])

  useEffect(() => {
    //monitoramento do app, se fechado ele chama a função para salvar as notas.
    const handleAppStateChange = (nextAppState:any) => {
      if (nextAppState === 'background' && listaNotasRef.current!==undefined) {
        atualizarNotas(listaNotasRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTecladoAtivo('none')
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTecladoAtivo('flex')
      })
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const onChangeNota = (item: ItemData, nota: string) => {
    const index = listaNotas.findIndex((el: any) => el.idAluno === item.idAluno);
    listaNotas[index].nota = nota
    setTextNota(nota)
  }

  const salvarNota = () =>{
    atualizarNotas(listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
  }


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
          <Text style={[styles.title]}>{item.numero} {item.nome}</Text>
        </View>
        <View>
          <TextInput
            ref={(ref) => (textInputRefs.current[parseInt(item.numero)] = ref!)}
            style={styles.itemNota}
            placeholder='Nota'
            inputMode='numeric'
            onChangeText={(text) => onChangeNota(item, text)}
            defaultValue={item.nota}
            onBlur={()=> salvarNota()}
            onFocus={() => [scrollToItem(item.idAluno, item.numero)]}
            onSubmitEditing={() => nextItem(item.idAluno)}
            selection={selection}
            onSelectionChange={(syntheticEvent) => onSelectionChange(syntheticEvent)}>
          </TextInput>
        </View>
      </View>
    );
  };

  const renderCarregamento = () => {
    if (idClasseSelec != '') {
      if (dataSelec != '') {
        return (
          <FlatList
            data={listaNotas}
            renderItem={renderItem}
            ref={flatListRef}
            keyExtractor={item => item.idAluno}
            contentContainerStyle={{ paddingBottom: 300 }}
            keyboardShouldPersistTaps='handled'
          />
        )
      } else {
        return (
          <View>
            <Text style={styles.textLoad}>Selecione uma data...</Text>
          </View>
        )
      }
    } else {
      return (
        <View>
          <Text style={styles.textLoad}>Selecione uma Classe...</Text>
        </View>
      )
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
    marginTop: 16
  },
  containerItem: {
    flexDirection: 'row',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: Globais.corTerciaria,
  },
  itemNota: {
    width: 80,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: Globais.corTerciaria,
  },
  title: {
    fontSize: 24,
  },
  titleFrequencia: {
    fontSize: 24,
    textAlign: 'center',
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

export default FlatListNotas;