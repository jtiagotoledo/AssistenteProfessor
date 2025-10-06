import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Context} from '../data/Provider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Globais from '../data/Globais';
import {useTranslation} from 'react-i18next';
import {atualizarClasse} from '../services/classes';

const ModalEditClasse = () => {
  const [valueClasse, setValueClasse] = useState<string>('');
  const {
    modalEditClasse,
    setModalEditClasse,
    idPeriodoSelec,
    idClasseSelec,
    nomeClasseSelec,
    setFlagLongPressClasse,
    setNomeClasseSelec,
    setRecarregarClasses,
  } = useContext(Context);
  const {t} = useTranslation();

  const onChangeInputClasse = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    setValueClasse(event.nativeEvent.text);
  };

  const onPressEditClasse = async () => {
    // edição da classe no BD
    if (valueClasse != '') {
      setModalEditClasse(false);
      await atualizarClasse(idClasseSelec, valueClasse, idPeriodoSelec);
      setFlagLongPressClasse(false);
      setNomeClasseSelec(valueClasse);
      setRecarregarClasses((prev: any) => !prev);
    } else {
      ToastAndroid.show(t('msg_030'), ToastAndroid.SHORT);
    }
  };

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
              <TouchableOpacity
                onPress={() => setModalEditClasse(!modalEditClasse)}>
                <MaterialIcon name="cancel" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Edite o nome da classe:')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nome da classe"
              defaultValue={nomeClasseSelec}
              onChange={onChangeInputClasse}></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onPressEditClasse()}>
              <Text style={styles.textStyle}>{t('Editar')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    marginRight: 16,
  },
  containerIcon: {
    alignItems: 'flex-end',
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
    marginBottom: 20,
  },
});

export default ModalEditClasse;
