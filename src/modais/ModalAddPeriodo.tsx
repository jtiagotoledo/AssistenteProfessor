import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity } from "react-native"
import React, { useState, useContext } from 'react';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { criarPeriodo } from '../services/periodos';


const ModalAddPeriodo = () => {

  const [valuePeriodo, setValuePeriodo] = useState<string>('')
  const { modalAddPeriodo, setModalAddPeriodo, idProfessor, setNomePeriodoSelec,
    setIdPeriodoSelec } = useContext(Context)
  const { t } = useTranslation();

  const onChangeInputPeriodo = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValuePeriodo(event.nativeEvent.text);
  }

  const onPressAddPeriodo = async () => {
    console.log(valuePeriodo,idProfessor);
    
    if (valuePeriodo !== '' && idProfessor) {
      try {
        setModalAddPeriodo(false);
        const result = await criarPeriodo(valuePeriodo, idProfessor);
        setIdPeriodoSelec(result.id);
        setNomePeriodoSelec(result.nome);
      } catch (error) {
        console.error('Erro ao criar período:', error);
        ToastAndroid.show(t('Erro ao criar período'), ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(t('msg_026'), ToastAndroid.SHORT);
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
                <MaterialIcon name="cancel" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Crie um novo período:')}</Text>
            <TextInput placeholder={t('Nome do período')} onChange={onChangeInputPeriodo} style={styles.textInput}></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onPressAddPeriodo}>
              <Text style={styles.textStyle}>{t('Criar')}</Text>
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

export default ModalAddPeriodo