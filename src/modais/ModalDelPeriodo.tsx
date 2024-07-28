import { Text, View, StyleSheet, Pressable, Modal, TouchableOpacity} from "react-native"
import React, { useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Context} from "../data/Provider";
import Globais from "../data/Globais";

const ModalDelPeriodo = () =>{

    const { modalDelPeriodo, setModalDelPeriodo, idUsuario, setIdPeriodoSelec,idPeriodoSelec} = useContext(Context);

    const deletarClasse = ()=> {
      firestore().collection(idUsuario)
      .doc(idPeriodoSelec).delete()
      setModalDelPeriodo(!modalDelPeriodo)
      setIdPeriodoSelec('')

      //deletando o estado do período
      firestore().collection(idUsuario).
      doc('EstadosApp').update({
        periodo:'',
        classe:'',
        idPeriodo:'',
        idClasse:'',
        data:''
      })
    }
    
    return(
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalDelPeriodo}
                onRequestClose={() => {
                  setModalDelPeriodo(!modalDelPeriodo);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.containerIcon}>
                            <TouchableOpacity  onPress={()=>setModalDelPeriodo(!modalDelPeriodo)}>
                                <MaterialIcon name="cancel" color="black" size={20}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalText}>Deseja realmente excluir o período?</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={deletarClasse}>
                            <Text style={styles.textStyle}>Ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:16,
      marginBottom:16,
      marginRight:16
    },
    containerIcon:{
      alignItems:'flex-end',
      marginBottom:24,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
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
      marginBottom: 24,
      textAlign: 'center',
      fontSize:18,
    },
  });

export default ModalDelPeriodo;