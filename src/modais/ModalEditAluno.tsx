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
import React, {useState, useContext, useEffect} from 'react';
import {Context} from '../data/Provider';
import Globais from '../data/Globais';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIstoIcon from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';
import {atualizarAluno} from '../services/alunos';

type AlunoData = {
  numero: number;
  nome: string;
  inativo: boolean;
  id_classe: string;
  media_notas?: number;
  porc_frequencia?: number;
};

const ModalEditAluno = () => {
  const {
    modalEditAluno,
    setModalEditAluno,
    setIdAlunoSelec,
    idUsuario,
    idClasseSelec,
    numAlunoSelec,
    nomeAlunoSelec,
    alunoInativo,
    setAlunoInativo,
    setFlagLongPressAluno,
    idAlunoSelec,
    setRecarregarAlunos,
  } = useContext(Context);
  const [valueNomeAluno, setValueNomeAluno] = useState<string>('');
  const [valueNumAluno, setValueNumAluno] = useState<string>('');
  const {t} = useTranslation();

  useEffect(() => {
    setValueNomeAluno(nomeAlunoSelec);
    setValueNumAluno(numAlunoSelec);
  }, [nomeAlunoSelec, numAlunoSelec]);

  const onChangeInputAlunoNome = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    setValueNomeAluno(event.nativeEvent.text);
  };

  const onChangeInputAlunoNum = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    setValueNumAluno(event.nativeEvent.text);
  };

  const onPressEditAluno = async () => {
    if (
      valueNomeAluno.trim() !== '' &&
      valueNumAluno.trim() !== '' &&
      idClasseSelec
    ) {
      try {
        setModalEditAluno(false);

        const alunoAtualizado: AlunoData = {
          nome: valueNomeAluno,
          numero: parseInt(valueNumAluno, 10),
          inativo: alunoInativo,
          id_classe: idClasseSelec,
        };

        await atualizarAluno(idAlunoSelec, alunoAtualizado);

        setAlunoInativo(false);
        setFlagLongPressAluno(false);
        setRecarregarAlunos((prev: boolean) => !prev);
      } catch (error) {
        ToastAndroid.show(t('msg_040'), ToastAndroid.SHORT);
        console.error('Erro ao editar aluno:', error);
      }
    } else {
      ToastAndroid.show(t('msg_027'), ToastAndroid.SHORT);
    }
  };

  const renderIconCheck = () => {
    return alunoInativo ? (
      <FontIstoIcon name="checkbox-active" color="black" size={20} />
    ) : (
      <FontIstoIcon name="checkbox-passive" color="black" size={20} />
    );
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditAluno}
        onRequestClose={() => {
          setModalEditAluno(!modalEditAluno);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity
                onPress={() => [
                  setModalEditAluno(!modalEditAluno),
                  setAlunoInativo(false),
                  setFlagLongPressAluno(false),
                ]}>
                <MaterialIcon name="cancel" color="black" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{t('Edite o nome do aluno:')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Número do aluno"
              defaultValue={numAlunoSelec}
              onChange={onChangeInputAlunoNum}></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="Nome do aluno"
              defaultValue={nomeAlunoSelec}
              onChange={onChangeInputAlunoNome}></TextInput>
            <TouchableOpacity
              style={styles.iconCheckContainer}
              onPress={() => setAlunoInativo(!alunoInativo)}>
              {renderIconCheck()}
              <Text style={[styles.textStyle, styles.textCheck]}>
                {t('Aluno inativo?')}
              </Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => [
                onPressEditAluno(),
                setFlagLongPressAluno(false),
              ]}>
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
  iconCheckContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  textCheck: {
    marginLeft: 16,
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
    marginBottom: 20,
  },
});

export default ModalEditAluno;
