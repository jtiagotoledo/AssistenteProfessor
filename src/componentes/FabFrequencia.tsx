import { FloatingAction } from "react-native-floating-action";
import React, { useContext } from 'react';
import { View, ToastAndroid } from "react-native";
import {Context} from "../data/Provider";
import Globais from "../data/Globais";
import FontIAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const FabFrequencia = ()=>{

  const {setModalCalendarioFreq, flagLoadAlunos,
     idClasseSelec} = useContext(Context);

  const abrirCalendário = () =>{
    if(idClasseSelec!='' && flagLoadAlunos!='vazio'){
      setModalCalendarioFreq(true)
    }else if(idClasseSelec==''){
        ToastAndroid.show('Selecione uma classe primeiro...',ToastAndroid.SHORT)
    }
    if(flagLoadAlunos=='vazio'){
        ToastAndroid.show('Primeiro, adicione os alunos nessa classe...',ToastAndroid.SHORT)
    }
  }

  const actions = [
    {
      text: "Adicionar data",
      textBackground: Globais.corPrimaria,
      color: Globais.corPrimaria,
      icon: <FontIAwesomeIcon name={'calendar-plus-o'} size={24} color={'white'}></FontIAwesomeIcon>,
      name: "data",
      position: 1
    }
  ]

  return(
      <View>
          <FloatingAction
            color={Globais.corPrimaria}
            overrideWithAction={true}
            actions={actions}
            onPressItem={abrirCalendário}
          />
      </View>
  )
}

export default FabFrequencia;