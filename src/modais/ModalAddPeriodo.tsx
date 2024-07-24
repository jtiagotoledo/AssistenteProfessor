import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity } from "react-native"
import React, { useState, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ModalAddPeriodo = () => {

  const [valuePeriodo, setValuePeriodo] = useState<string>('')
  const { modalAddPeriodo, setModalAddPeriodo, idUsuario, setNomePeriodoSelec, setRecarregarPeriodo,
    setIdPeriodoSelec } = useContext(Context)

  const onChangeInputPeriodo = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValuePeriodo(event.nativeEvent.text);
  }

  const onPressAddPeriodo = async () => {
    // consulta para verificar se o período já existe
    firestore().collection(idUsuario)
      .where('periodo', '==', valuePeriodo)
      .get().then((snapshot) => {
        snapshot.empty ? addPeriodo() :
          ToastAndroid.show(
            'O período informado já existe',
            ToastAndroid.SHORT)
      }).catch((erro) => {
        console.error(erro);
      })

    const addPeriodo = async () => {
      if (valuePeriodo != '') {
        setNomePeriodoSelec(valuePeriodo)
        const refDoc = firestore().collection(idUsuario);
        const idPeriodo = (await refDoc.add({})).id
        refDoc.doc(idPeriodo).set({
          periodo: valuePeriodo,
          idPeriodo: idPeriodo
        })
        await setIdPeriodoSelec(idPeriodo);
        setRecarregarPeriodo('recarregar')
        setModalAddPeriodo(!modalAddPeriodo);

        //atualizando o estado do período
        firestore().collection(idUsuario).
          doc('EstadosApp').set({
            idPeriodo: idPeriodo,
            periodo: valuePeriodo,
            idClasse: '',
            classe: '',
            data: '',
            aba: 'Classes'
          })
      }
      else {
        ToastAndroid.show(
          'Digite o nome do período!',
          ToastAndroid.SHORT)
      }
    }



  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddPeriodo}
        onRequestClose={() => {
          setModalAddPeriodo(!modalAddPeriodo);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => setModalAddPeriodo(!modalAddPeriodo)}>
                <MaterialIcon name="cancel" color="white" size={20}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Crie um novo período:</Text>
            <TextInput placeholder='Nome do período' onChange={onChangeInputPeriodo} style={styles.textInput}></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onPressAddPeriodo}>
              <Text style={styles.textStyle}>Criar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    marginRight: 16
  },
  containerIcon: {
    alignItems: 'flex-end'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: Globais.corTerciaria,
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Globais.corPrimaria,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  textInput: {
    backgroundColor: 'white',
    minWidth: 100,
    marginBottom: 20
  }
});

export default ModalAddPeriodo