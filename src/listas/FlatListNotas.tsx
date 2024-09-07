import React, { useContext, useEffect, useRef, useState } from 'react'
import { Keyboard, SafeAreaView, FlatList, View, Text, StyleSheet, StatusBar, TextInput } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

type ItemData = {
  nome: string;
  numero: string;
  nota: string;
  idAluno: string;
};

const FlatListNotas = () => {
  const alunos: any[] = []
  const flatListRef = useRef<FlatList>(null);
  const textInputRefs = useRef<TextInput[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [textNota, setTextNota] = useState('');
  const [idNota, setIdNota] = useState('');
  const { idPeriodoSelec, idClasseSelec, dataSelec, listaNotas, 
    idUsuario, setTecladoAtivo } = useContext(Context)

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  const onChangeNota = (item: ItemData, text: string) => {
    const index = listaNotas.findIndex((el: any) => el.idAluno === item.idAluno);
    listaNotas[index].nota = text
    setTextNota(text)
    setIdNota(item.idAluno)
  }

  const salvarNota = (idAluno: string) => {
    if (textNota != '') {
      //consulta ao array de notas
      listaAlunosRef.doc(idAluno).get().then((docSnapshot) => {
        let datas = docSnapshot.data()?.notas

        //modificando o array
        datas.map((item: any) => {
          if (item.data == dataSelec) {
            item.nota = textNota
          }
        })
        //atulaizando o BD com o novo array
        listaAlunosRef.doc(idAluno).update({
          notas: datas
        })
      }).catch((erro) => {
        console.error(erro);
      })
    }
  }

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



  const renderItem = ({ item }: { item: ItemData }) => {
    const scrollToItem = (itemId: any, itemNumero: any) => {
      const index = listaNotas.findIndex((item: any) => item.idAluno === itemId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    };

    const nextItem = (itemId: any, itemNumero: any, itemNota: any) => {
      const index = listaNotas.findIndex((item: any) => item.idAluno === itemId);
      const numProxAluno = listaNotas[index + 1]?.numero
      console.log('numAluno', numProxAluno);

      setTimeout(() => {
        if (index !== -1 && flatListRef.current && listaNotas[index + 1] != null) {
          textInputRefs.current[numProxAluno]?.focus()
          const sizeText = listaNotas[numProxAluno]?.nota.length || 0
          setSelection({ start: sizeText || 0, end: sizeText || 0 })
        }
      }, 300)
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
            onFocus={() => [scrollToItem(item.idAluno, item.numero)]}
            onBlur={() => [salvarNota(item.idAluno)]}
            onSubmitEditing={() => [nextItem(item.idAluno, item.numero, item.nota), salvarNota(item.idAluno)]}
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