import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Dropdown } from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";

const DropDownPeriodo = () => {
  const [valuePSelec, setValuePSelec] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const { setIdPeriodoSelec, setFlagLongPressAluno, idUsuario, setModalMenu, setFlagLongPressClasse, setModalDelPeriodo, 
    listaPeriodos, setNomePeriodoSelec, nomePeriodoSelec, setModalEditPeriodo } = useContext(Context)

  const onChangePeriodo = (item: any) => {
    setValuePSelec(item.periodo);
    setNomePeriodoSelec(item.periodo)
    setIdPeriodoSelec(item.idPeriodo);
    setIsFocus(false);
    setFlagLongPressClasse(false)
    setFlagLongPressAluno(false)
    setModalMenu(false);

    //Salvando estado do período
    firestore().collection(idUsuario).
      doc('EstadosApp').set({
        idPeriodo: item.idPeriodo,
        periodo: item.periodo,
        idClasse: '',
        classe: '',
        data: '',
        aba: 'Classes'
      })
  }

  const renderLabel = () => {
    if (valuePSelec || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Globais.corTextoEscuro }]}>
          Selecione o período:
        </Text>
      );
    }
    if (valuePSelec || !isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Globais.corTextoEscuro }]}>
          Período Selecionado:
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Globais.corPrimaria }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={listaPeriodos}
        value={nomePeriodoSelec}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Selecione o período' : '...'}
        searchPlaceholder="Procurar..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => { onChangePeriodo(item) }}
        renderRightIcon={() => (
          <View style={styles.containerIcon}>
            <TouchableOpacity onPress={() => setModalEditPeriodo(true)}>
              <AntIcon
                style={styles.icon}
                color={isFocus ? Globais.corPrimaria : 'black'}
                name="edit"
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalDelPeriodo(true)}>
              <FontAwesomeIcon
                style={styles.icon}
                color={isFocus ? Globais.corPrimaria : 'black'}
                name="trash-o"
                size={20}
              />
            </TouchableOpacity>
          </View>

        )}
      />
    </View>
  )
}
export default DropDownPeriodo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Globais.corTerciaria,
    padding: 8,
    width: '100%'
  },
  containerIcon: {
    flexDirection: 'row'
  },
  dropdown: {
    height: 80,
    borderColor: Globais.corPrimaria,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    position: 'absolute',
    backgroundColor: Globais.corTerciaria,
    left: 22,
    top: 4,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});