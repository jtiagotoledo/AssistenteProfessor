import { Image, Text, View, StyleSheet, Button, Modal, TouchableWithoutFeedback } from "react-native"
import React, { useContext } from 'react';
import auth from '@react-native-firebase/auth';
import {Context} from "../data/Provider";
import Globais from "../data/Globais";
import HeaderMenu from '../componentes/HeaderMenu'
import DropDown from "../listas/DropDownPeriodo";
import { deleteUser } from "../banco_dados/deleteUsuario";

const ModalMenu = ({navigation}:any) =>{

    const {modalMenu,setModalMenu,setIdUsuario, idUsuario} = useContext(Context)

    const funcSair = () =>{
      //logout
      auth().signOut()
        .then(()=>[
          navigation.reset({index:0,routes:[{name:"Login"}]}),
          setIdUsuario('')
        ]).catch((erro)=>{
          console.error(erro);
        })
    }

    
    return(
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={modalMenu}
                onRequestClose={() => {
                setModalMenu(!modalMenu);
                }}>
                <TouchableWithoutFeedback onPress={() => {setModalMenu(!modalMenu)}}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View>
                    <HeaderMenu title="Configurações"></HeaderMenu>
                  </View>
                  <View style={styles.modalComponentes}>
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
                      <DropDown ></DropDown>
                    <View style={styles.containerButton}>
                      <View style={styles.button}>
                        <Button color={Globais.corPrimaria} title='SAIR' onPress={funcSair}></Button>
                      </View>
                      <View style={styles.button}>
                        <Button color={Globais.corPrimaria} title='Excluir Conta' onPress={()=>deleteUser(navigation, idUsuario)}></Button>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalView: {
    backgroundColor: Globais.corTerciaria,
    position:'absolute',
    top:0,
    height:'100%',
    width:'75%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalComponentes:{
    padding: 16,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize:18
  },
  logo: {
    width: 150, 
    height: 150, 
    resizeMode: "contain", 
    marginBottom:16,
  },
  logoContainer:{
    flexDirection:"row",
    justifyContent:"center"
  },
  dropDownContainer:{
    marginBottom:40
  },
  authContainer:{
    marginBottom:16
  },
  containerButton:{
    marginTop:36
  },
  button:{
    marginBottom:16,
  }
});

export default ModalMenu