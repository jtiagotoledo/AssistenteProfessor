import { View, StyleSheet, Modal, TouchableOpacity, Text } from "react-native"
import React, { useContext } from 'react';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import CalendarioNota from "../componentes/CalendarioNota";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const ModalCalendarioNota = () => {

  const { modalCalendarioNota, setModalCalendarioNota, dataSelec, setDataSelec } = useContext(Context)

  let dataAno = '', dataMes = '', dataDia = '', data = ''

  if (dataSelec) {
    dataAno = dataSelec.slice(0, 4);
    dataMes = dataSelec.slice(5, 7);
    dataDia = dataSelec.slice(8, 10);
    if(i18n.language=='pt') data = dataDia + '/' + dataMes + '/' + dataAno
    if(i18n.language=='en') data = dataMes + '/' + dataDia + '/' + dataAno
  }

  const renderData = () => {
    if (data != '') {
      return (
        <TouchableOpacity>
          <Text style={styles.text}>{data}</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCalendarioNota}
        onRequestClose={() => {
          setModalCalendarioNota(!modalCalendarioNota);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.containerIcon}>
              <TouchableOpacity onPress={() => [setModalCalendarioNota(!modalCalendarioNota),setDataSelec('')]}>
                <MaterialIcon name="cancel" color="black" size={25}/>
              </TouchableOpacity>
            </View>
            <View style={styles.containerText}>
              {renderData()}
            </View>
            <CalendarioNota></CalendarioNota>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  containerIcon: {
    alignItems: 'flex-end',
    marginBottom: 16,
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
  text: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    padding: 5,
    color: Globais.corTextoEscuro,
  },
  containerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default ModalCalendarioNota;