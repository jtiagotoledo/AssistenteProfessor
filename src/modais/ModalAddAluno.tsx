import { Text, View, StyleSheet, Pressable, TextInput, Modal, NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid, TouchableOpacity, Image } from "react-native"
import React, { useState, useContext } from 'react';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIstoIcon from 'react-native-vector-icons/Fontisto';
import { useTranslation } from 'react-i18next';
import { criarAluno } from '../services/alunos';
import { launchImageLibrary } from 'react-native-image-picker';

const ModalAddAluno = () => {

  const [valueNumero, setValueNumero] = useState<string>('')
  const [valueNome, setValueNome] = useState<string>('')
  const { idPeriodoSelec, idClasseSelec, modalAddAluno, setModalAddAluno,
    idUsuario, alunoInativo, setAlunoInativo, setRecarregarAlunos } = useContext(Context)
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const { t } = useTranslation();

  const onChangeInputNumero = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValueNumero(event.nativeEvent.text);
  }
  const onChangeInputNome = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValueNome(event.nativeEvent.text);
  }

  const escolherImagem = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.didCancel || !result.assets?.[0]) return;

    const imageUri = result.assets[0].uri;
    if (imageUri) {
      setFotoUri(imageUri);
    }
  };

  const onPressAddAluno = async () => {
    if (valueNumero !== '' && valueNome !== '' && idClasseSelec) {
      try {
        setModalAddAluno(false);

        const novoAluno = {
          numero: valueNumero,
          nome: valueNome,
          media_notas: null,
          porc_frequencia: null,
          inativo: alunoInativo,
          id_classe: idClasseSelec,
          foto: fotoUri
            ? {
              uri: fotoUri.startsWith('file://') ? fotoUri : 'file://' + fotoUri,
              name: `${valueNumero}.jpg`,
              type: 'image/jpeg',
            }
            : null,
        };

        await criarAluno(novoAluno);
        setRecarregarAlunos((prev:any) => !prev);
        setAlunoInativo(false);
        setFotoUri(null);
      } catch (error) {
        ToastAndroid.show(t('msg_039'), ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(t('msg_022'), ToastAndroid.SHORT);
    }
  };

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
              <TouchableOpacity onPress={() => [setModalAddAluno(!modalAddAluno), setAlunoInativo(false)/* , setFotoUri(null) */]}>
                <MaterialIcon name="cancel" color="black" size={25}></MaterialIcon>
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalText, { marginBottom: 30 }]}>{t('Adicione um novo aluno:')}</Text>
            <Text style={styles.modalText}>{t('Foto')}</Text>
            <TouchableOpacity onPress={escolherImagem} style={{ alignSelf: 'center', marginBottom: 16 }}>
              {fotoUri ? (
                <View style={{ borderRadius: 50, overflow: 'hidden', width: 100, height: 100 }}>
                  <Image
                    source={{ uri: fotoUri }}
                    style={{ width: 100, height: 100 }}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={{
                  width: 100, height: 100, borderRadius: 50,
                  backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
                }}>
                  <MaterialIcon name="photo-camera" size={32} color="#666" />
                </View>
              )}
            </TouchableOpacity>
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
    fontSize: 18,
  },
  textInput: {
    backgroundColor: 'white',
    minWidth: 100,
    marginBottom: 20
  }
});

export default ModalAddAluno