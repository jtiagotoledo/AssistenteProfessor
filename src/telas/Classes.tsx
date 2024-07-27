import { useContext, useEffect } from "react";
import { View, StyleSheet, Text} from "react-native"
import { Divider } from "react-native-paper";

import FabClasses from "../componentes/FabClasses";
import FlatListAlunos from "../listas/FlatListAlunos";
import FlatListClasses from "../listas/FlatListClasses";
import HeaderClasses from "../componentes/HeaderClasses";
import ConexaoInternet from "../componentes/ConexaoInternet";
import Globais from "../data/Globais";
import consultaPeriodos from "../banco_dados/consultas"

import ModalAddPeriodo from "../modais/ModalAddPeriodo";
import ModalAddClasse from "../modais/ModalAddClasse";
import ModalAddAluno from "../modais/ModalAddAluno";
import ModalEditPeriodo from "../modais/ModalEditPeriodo";
import ModalEditClasse from "../modais/ModalEditClasse";
import ModalEditAluno from "../modais/ModalEditAluno";
import ModalDelPeriodo from "../modais/ModalDelPeriodo";
import ModalDelClasse from "../modais/ModalDelClasse";
import ModalDelAluno from "../modais/ModalDelAluno";
import ModalMenu from "../modais/ModalMenu";

import firestore from '@react-native-firebase/firestore';
import {Context} from "../data/Provider";


function Classes({navigation}:any) {
  const {nomePeriodoSelec,idUsuario,setIdPeriodoSelec,setIdClasseSelec,
    setNomePeriodoSelec} = useContext(Context)

  consultaPeriodos()

  useEffect(()=>{
    //recuperar dados dos estados do app
    firestore().collection(idUsuario)
    .doc('EstadosApp').onSnapshot(snapShot=>{
      setIdPeriodoSelec(snapShot.data()?.idPeriodo)
      setNomePeriodoSelec(snapShot.data()?.periodo)
      setIdClasseSelec(snapShot.data()?.idClasse)
    })
  },[])
    
  return (
    <View style={styles.container}>
      <HeaderClasses title="Classes"></HeaderClasses>
      <ConexaoInternet></ConexaoInternet>
      <Text style={styles.textLoad}>{nomePeriodoSelec!=''?'Período: '+nomePeriodoSelec:'Adicione um período'}</Text>
      <Divider style={styles.divider}></Divider>
      <FlatListClasses></FlatListClasses>
      <Divider style={styles.divider}></Divider>
      <FlatListAlunos></FlatListAlunos>
      <ModalAddPeriodo></ModalAddPeriodo>
      <ModalAddClasse></ModalAddClasse>
      <ModalAddAluno></ModalAddAluno>
      <ModalEditPeriodo></ModalEditPeriodo>
      <ModalEditClasse></ModalEditClasse>
      <ModalEditAluno></ModalEditAluno>
      <ModalDelPeriodo></ModalDelPeriodo>
      <ModalDelClasse></ModalDelClasse>
      <ModalDelAluno></ModalDelAluno>
      <ModalMenu navigation={navigation}></ModalMenu>
      <FabClasses></FabClasses>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: Globais.corSecundaria,
    flex:1,
  },
  
  text:{
    fontSize:20,
    padding:5,
    color: Globais.corTextoEscuro,
  },
  divider:{
    backgroundColor: Globais.corPrimaria,
  },
  textLoad:{
    fontSize:24,
    color:Globais.corTextoClaro,
  }
});

export default Classes;