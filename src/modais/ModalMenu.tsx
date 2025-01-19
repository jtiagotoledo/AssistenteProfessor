import React, { useContext } from 'react';
import { 
  Image, 
  Text, 
  View, 
  StyleSheet, 
  Button, 
  Modal, 
  TouchableWithoutFeedback, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import HeaderMenu from '../componentes/HeaderMenu';
import DropDown from "../listas/DropDownPeriodo";
import { deleteUser } from "../banco_dados/deletarBD";

const ModalMenu = ({ navigation }: any) => {
  const { modalMenu, setModalMenu, setIdUsuario, idUsuario } = useContext(Context);
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  const funcSair = () => {
    auth()
      .signOut()
      .then(() => [
        navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
        setIdUsuario('')
      ])
      
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalMenu}
        onRequestClose={() => {
          setModalMenu(!modalMenu);
        }}>
        <TouchableWithoutFeedback onPress={() => { setModalMenu(!modalMenu) }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalView, isLandscape && styles.modalLandscape]}>
          <HeaderMenu title="Menu" />
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.authContainer}>
              <Text style={styles.textStyle}>{auth().currentUser?.email}</Text>
            </View>
            <View style={styles.dropDownContainer}>
              <DropDown />
              <View style={styles.containerButton}>
                <View style={styles.button}>
                  <Button color={Globais.corPrimaria} title='SAIR' onPress={funcSair} />
                </View>
                <View style={styles.button}>
                  <Button color={Globais.corPrimaria} title='Excluir Conta' onPress={() => deleteUser(navigation, idUsuario)} />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: Globais.corTerciaria,
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalLandscape: {
    width: '50%',
  },
  modalContent: {
    padding: 16,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropDownContainer: {
    marginBottom: 40,
  },
  authContainer: {
    marginBottom: 16,
  },
  containerButton: {
    marginTop: 36,
  },
  button: {
    marginBottom: 16,
  },
});

export default ModalMenu;
