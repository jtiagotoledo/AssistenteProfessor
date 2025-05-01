import { FloatingAction } from "react-native-floating-action";
import React, { useContext } from 'react';
import { View, ToastAndroid } from "react-native";
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import FontIAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const FabFrequencia = () => {

  const { setModalCalendarioFreq, flagLoadAlunos, listaAlunos, idClasseSelec } = useContext(Context);
  const { t } = useTranslation();

  const onPressFab = () => {
    if (idClasseSelec != '' && listaAlunos.length > 0) {
      setModalCalendarioFreq(true)
    } else if (idClasseSelec == '') {
      ToastAndroid.show(t('msg_032'), ToastAndroid.SHORT)
    } else if (listaAlunos.length == 0) {
      ToastAndroid.show(t('msg_033'), ToastAndroid.SHORT)
    }
  }

  const actions = [
    {
      text: t("Adicionar data"),
      textBackground: Globais.corPrimaria,
      color: Globais.corPrimaria,
      icon: <FontIAwesomeIcon name={'calendar-plus-o'} size={24} color={'white'}></FontIAwesomeIcon>,
      name: "data",
      position: 1
    }
  ]

  return (
    <View>
      <FloatingAction
        color={Globais.corPrimaria}
        overrideWithAction={true}
        actions={actions}
        onPressItem={() => onPressFab()}
      />
    </View>
  )
}

export default FabFrequencia;