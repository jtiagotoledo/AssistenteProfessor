import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity } from "react-native"
import React, { useState, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { atualizarPeriodo } from '../services/periodos';


const ModalEditPeriodo = () => {

  const [valuePeriodo, setValuePeriodo] = useState<string>('')
  const { modalEditPeriodo, setModalEditPeriodo, idPeriodoSelec,
    idUsuario, setRecarregarPeriodos, setNomePeriodoSelec, setIdPeriodoSelec, nomePeriodoSelec } = useContext(Context)
  const { t } = useTranslation();

  const onChangeInputPeriodo = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValuePeriodo(event.nativeEvent.text);
  }

  const onPressEditPeriodo = async () => {
    if (valuePeriodo != '') {
      setModalEditPeriodo(false);
      try {
        await atualizarPeriodo(idPeriodoSelec, valuePeriodo);
        setRecarregarPeriodos((prev:any)=>!prev)
        setIdPeriodoSelec(idPeriodoSelec)
        setNomePeriodoSelec(valuePeriodo);
      } catch (error) {
        console.log('Erro', 'Não foi possível atualizar.');
      }
    } else {
      ToastAndroid.show(
        t('msg_026'),
        ToastAndroid.SHORT)
    }
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditPeriodo}
        onRequestClose={() => {
          setModalEditPeriodo(!modalEditPeriodo);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => setModalEditPeriodo(!modalEditPeriodo)}>
                <MaterialIcon name="cancel" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Edite o nome do período:')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder='Nome do período'
              defaultValue={nomePeriodoSelec}
              onChange={onChangeInputPeriodo}>
            </TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onPressEditPeriodo()}>
              <Text style={styles.textStyle}>{t('Editar')}</Text>
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
    color: 'black',
    fontSize: 18,
  },
  textInput: {
    backgroundColor: 'white',
    minWidth: 100,
    marginBottom: 20
  }

});

export default ModalEditPeriodo;