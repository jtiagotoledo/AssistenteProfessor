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
import {Context} from '../data/Provider';
import Globais from '../data/Globais';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {criarClasse} from '../services/classes';

const ModalAddClasse = () => {
  const [valueClasse, setValueClasse] = useState<string>('');
  const {
    modalAddClasse,
    setModalAddClasse,
    idPeriodoSelec,
    setIdClasseSelec,
    setNomeClasseSelec,
    setRecarregarClasses,
  } = useContext(Context);
  const {t} = useTranslation();

  const onChangeInputClasse = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    setValueClasse(event.nativeEvent.text);
  };

  // inclusão da classe no BD
  const onPressAddClasse = async () => {
    if (valueClasse != '' && idPeriodoSelec) {
      try {
        setModalAddClasse(false);
        const result = await criarClasse(valueClasse, idPeriodoSelec);
        setNomeClasseSelec(valueClasse);
        await setIdClasseSelec(result.id);
        setRecarregarClasses((prev: any) => !prev);
      } catch (error) {
        ToastAndroid.show(t('msg_037'), ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(t('msg_024'), ToastAndroid.SHORT);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAddClasse}
        onRequestClose={() => {
          setModalAddClasse(!modalAddClasse);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity
                onPress={() => setModalAddClasse(!modalAddClasse)}>
                <MaterialIcon name="cancel" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Crie uma nova classe:')}</Text>
            <TextInput
              placeholder={t('Nome da classe')}
              onChange={onChangeInputClasse}
              style={styles.textInput}></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onPressAddClasse()}>
              <Text style={styles.textStyle}>{t('Criar')}</Text>
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

export default ModalAddClasse;
