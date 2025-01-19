import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity } from "react-native"
import React, { useState, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Globais from "../data/Globais";


const ModalEditClasse = () => {

  const [valueClasse, setValueClasse] = useState<string>('')
  const { modalEditClasse, setModalEditClasse, idPeriodoSelec, idUsuario, setIdClasseSelec, idClasseSelec,
    nomeClasseSelec, setFlagLongPressClasse } = useContext(Context)

  const onChangeInputClasse = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValueClasse(event.nativeEvent.text);
  }

  const onPressEditClasse = async () => {

    // consulta para verificar se a classe já existe
    firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .where('classe', '==', valueClasse)
      .get().then((snapshot) => {
        snapshot.empty ? editarAluno() :
          ToastAndroid.show(
            'A classe informada já existe',
            ToastAndroid.SHORT)
      })

    // edição da classe no BD
    const editarAluno = () => {
      if (valueClasse != '') {
        firestore().collection(idUsuario)
          .doc(idPeriodoSelec).collection('Classes')
          .doc(idClasseSelec).update({
            classe: valueClasse
          })
        setIdClasseSelec(idClasseSelec);
        setModalEditClasse(!modalEditClasse);
        setFlagLongPressClasse(false)

        //atualizando o estado da classe
        firestore().collection(idUsuario).
          doc('EstadosApp').set({
            classe: valueClasse
          })
        setValueClasse('')

      } else {
        ToastAndroid.show(
          'O campo nome da classe é obrigatório!',
          ToastAndroid.SHORT)
      }
    }
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditClasse}
        onRequestClose={() => {
          setModalEditClasse(!modalEditClasse);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => setModalEditClasse(!modalEditClasse)}>
                <MaterialIcon name="cancel" color="white" size={20}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Edite o nome da classe:</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Nome da classe'
              defaultValue={nomeClasseSelec}
              onChange={onChangeInputClasse}>
            </TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>onPressEditClasse()}>
              <Text style={styles.textStyle}>Editar</Text>
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

export default ModalEditClasse;