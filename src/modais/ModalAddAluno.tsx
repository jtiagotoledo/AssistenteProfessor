import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity } from "react-native"
import React, { useState, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIstoIcon from 'react-native-vector-icons/Fontisto';
import { useTranslation } from 'react-i18next';

const ModalAddAluno = () => {

  const [valueNumero, setValueNumero] = useState<string>('')
  const [valueNome, setValueNome] = useState<string>('')
  const { idPeriodoSelec, idClasseSelec, modalAddAluno, setModalAddAluno,
    idUsuario, alunoInativo, setAlunoInativo } = useContext(Context)
  const { t } = useTranslation();

  const onChangeInputNumero = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValueNumero(event.nativeEvent.text);
  }
  const onChangeInputNome = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValueNome(event.nativeEvent.text);
  }

  const onPressAddAluno = async () => {
    // consulta para verificar se o número do aluno já existe
    firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('ListaAlunos')
      .where('numero', '==', parseInt(valueNumero))
      .get().then((snapshot) => {
        snapshot.empty ? addAluno() :
          ToastAndroid.show(
            t('msg_021'),
            ToastAndroid.SHORT)
      })

    // inclusão do aluno no BD
    const addAluno = async () => {
      if (valueNumero != '' && valueNome != '') {
        setModalAddAluno(!modalAddAluno)
        const refDoc = firestore().collection(idUsuario).doc(idPeriodoSelec).collection('Classes').doc(idClasseSelec).collection('ListaAlunos')
        const idAluno = (await refDoc.add({})).id
        await refDoc.doc(idAluno).set({
          numero: parseInt(valueNumero),
          nome: valueNome,
          inativo: alunoInativo,
          idAluno: idAluno,
          porcFreq:'...',
          mediaNotas:'...',
          frequencias: [],
          notas: [],
        })
        setValueNome('')
        setValueNumero('')
        setAlunoInativo(false)
      } else {
        ToastAndroid.show(
          t('msg_022'),
          ToastAndroid.SHORT)
      }
    }
  }

  const renderIconCheck = () => {
    return (
      alunoInativo ? <FontIstoIcon name="checkbox-active" color="black" size={20} /> :
        <FontIstoIcon name="checkbox-passive" color="black" size={20} />
    )
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddAluno}
        onRequestClose={() => {
          setModalAddAluno(!modalAddAluno);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => [setModalAddAluno(!modalAddAluno), setAlunoInativo(false)]}>
                <MaterialIcon name="cancel" color="black" size={25}></MaterialIcon>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Adicione um novo aluno:')}</Text>
            <TextInput placeholder={t('Número')} onChange={onChangeInputNumero} style={styles.textInput} keyboardType='numeric'></TextInput>
            <TextInput placeholder={t('Nome')} onChange={onChangeInputNome} style={styles.textInput}></TextInput>
            <TouchableOpacity style={styles.iconCheckContainer} onPress={() => setAlunoInativo(!alunoInativo)}>
              {renderIconCheck()}
              <Text style={[styles.textStyle, styles.textCheck]}>{t('Aluno inativo?')}</Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onPressAddAluno()}>
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
  iconCheckContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  textCheck: {
    marginLeft: 16
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
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 18
  },
  textInput: {
    backgroundColor: 'white',
    minWidth: 100,
    marginBottom: 20
  }
});

export default ModalAddAluno