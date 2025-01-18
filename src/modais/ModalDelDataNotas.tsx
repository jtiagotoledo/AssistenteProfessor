import { Text, View, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native"
import React, { useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Globais from "../data/Globais";
import { deleteDataNotas } from "../banco_dados/deletarBD";


const ModalDelDataNotas = () => {

  const { idPeriodoSelec, idClasseSelec, idUsuario, dataSelec, modalDelDataNotas, setValueNota, setListaNotas,
    setModalDelDataNotas, setFlagLongPressDataNotas, setDataSelec, setIdClasseSelec } = useContext(Context);

  const deletarData = async () => {
    await deleteDataNotas(idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
    setListaNotas('')
    setValueNota('')
    setDataSelec('')
    setIdClasseSelec('')
    setModalDelDataNotas(!modalDelDataNotas)
    setFlagLongPressDataNotas(false)


    //deletando o estado da data
    firestore().collection(idUsuario).
      doc('EstadosApp').update({
        data: ''
      })
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDelDataNotas}
        onRequestClose={() => {
          setModalDelDataNotas(!modalDelDataNotas);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => setModalDelDataNotas(!modalDelDataNotas)}>
                <MaterialIcon name="cancel" color="black" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Deseja realmente excluir a data?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={deletarData}>
              <Text style={styles.textStyle}>Ok</Text>
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
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ModalDelDataNotas;