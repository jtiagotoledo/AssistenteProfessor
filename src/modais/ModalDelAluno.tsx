import { Text, View, StyleSheet, Pressable, Modal, TouchableOpacity } from "react-native"
import React, { useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";
import Icon from 'react-native-vector-icons/FontAwesome';
import Globais from "../data/Globais";

const ModalDelAluno = () => {

  const { idPeriodoSelec, idClasseSelec, modalDelAluno,
    setModalDelAluno, idUsuario, setRecarregarAlunos,
    setFlagLongPressAluno, setNumAlunoSelec, setSelectedIdAluno,
    idAlunoSelec, setRecarregarFrequencia, setRecarregarNotas } = useContext(Context);

  const deletarAluno = () => {
    //deletar aluno da lista de alunos
    firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('ListaAlunos')
      .doc(idAlunoSelec).delete()
    setModalDelAluno(!modalDelAluno)
    setFlagLongPressAluno(false)
    setNumAlunoSelec('')
    setSelectedIdAluno('')
    setRecarregarAlunos(idUsuario)

    //deletar aluno da lista de frequencias
    firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('Frequencia')
      .onSnapshot(snapshot => {
        snapshot.forEach(docSnapshot => {
          const data = docSnapshot.id
          firestore().collection(idUsuario)
            .doc(idPeriodoSelec).collection('Classes')
            .doc(idClasseSelec).collection('Frequencia')
            .doc(data).collection('Alunos')
            .doc(idAlunoSelec).delete()
        })
        setRecarregarFrequencia('recarregar')
      })

    //deletar aluno da lista de notas
    firestore().collection(idUsuario)
      .doc(idPeriodoSelec).collection('Classes')
      .doc(idClasseSelec).collection('Notas')
      .onSnapshot(snapshot => {
        snapshot.forEach(docSnapshot => {
          const data = docSnapshot.id
          firestore().collection(idUsuario)
            .doc(idPeriodoSelec).collection('Classes')
            .doc(idClasseSelec).collection('Notas')
            .doc(data).collection('Alunos')
            .doc(idAlunoSelec).delete()
        })
        setRecarregarNotas('recarregar')
      })
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDelAluno}
        onRequestClose={() => {
          setModalDelAluno(!modalDelAluno);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => setModalDelAluno(!modalDelAluno)}>
                <Icon name="cancel-circle" color="black" size={20}></Icon>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Deseja realmente excluir o aluno?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={deletarAluno}>
              <Text style={styles.textStyle}>Ok</Text>
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
    alignItems: 'flex-end',
    marginBottom: 24,
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
    fontSize: 18,
  },
});

export default ModalDelAluno