import React, {useContext} from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {atualizarFotoAluno} from '../services/alunos';
import {Context} from '../data/Provider';
import Globais from '../data/Globais';

type Props = {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
  idAluno: string;
};

const ModalFotoAluno = ({visible, imageUrl, onClose, idAluno}: Props) => {
  const {setRecarregarAlunos} = useContext(Context);

  const handleEditarFoto = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});

    if (!result.didCancel && result.assets && result.assets[0].uri) {
      const novaFoto = {
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'image/jpeg',
        name: `${idAluno}.jpg`,
      };

      try {
        console.log('idAluno', idAluno);
        console.log('novaFoto', novaFoto);

        await atualizarFotoAluno(idAluno, novaFoto);
        setRecarregarAlunos((prev: boolean) => !prev);
        onClose();
      } catch (error) {
        console.error('Erro ao atualizar foto:', error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={
              imageUrl === 'local'
                ? require('../assets/user.png')
                : {uri: imageUrl}
            }
            style={styles.image}
            resizeMode="contain"
          />

          <TouchableOpacity onPress={handleEditarFoto} style={styles.button}>
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Trocar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <MaterialIcons name="close" size={20} color="#fff" />
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFotoAluno;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 125, // deixar redondo
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Globais.corPrimaria,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
