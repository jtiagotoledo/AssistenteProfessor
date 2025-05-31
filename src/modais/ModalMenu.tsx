import React, { useContext, useState } from 'react';
import { Image, Text, View, StyleSheet, Button, Modal, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
// import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import HeaderMenu from '../componentes/HeaderMenu';
import DropDown from "../listas/DropDownPeriodo";
import { Picker } from '@react-native-picker/picker';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { deletarProfessor } from '../services/professores';

const ModalMenu = ({ navigation }: any) => {
  const { modalMenu, setModalMenu, email, idProfessor, setIdProfessor } = useContext(Context);
  const { width, height } = Dimensions.get('window');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)
  const isLandscape = width > height;
  const { t } = useTranslation();

  const funcSair = () => {
    /* auth()
      .signOut()
      .then(() => [
        navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
        setIdUsuario(''),
        setModalMenu(!modalMenu)
      ]) */
  };

  const delProfessor = () => {
    deletarProfessor(idProfessor)
    navigation.reset({ index: 0, routes: [{ name: "Login" }] })
    setIdProfessor('')
    setModalMenu(!modalMenu)
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
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
          <HeaderMenu title={t('Menu')} />
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.authContainer}>
              <Text style={styles.textStyle}>{email}</Text>
            </View>
            <View style={styles.dropDownContainer}>
              <DropDown />
              <Text>Selecione a linguaguem/ Select Language</Text>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) => {
                  changeLanguage(itemValue);
                }}
              >
                <Picker.Item label="Português" value="pt" />
                <Picker.Item label="English" value="en" />
              </Picker>
              <View style={styles.containerButton}>
                <View style={styles.button}>
                  <Button color={Globais.corPrimaria} title={t('Sair')} onPress={funcSair} />
                </View>
                <View style={styles.button}>
                  <Button color={Globais.corPrimaria} title={t('Excluir conta')} onPress={delProfessor} />
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
