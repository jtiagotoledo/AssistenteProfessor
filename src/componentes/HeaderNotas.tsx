import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text, Dimensions, ToastAndroid } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { atualizarNotas } from "../banco_dados/atualizarBD"

import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderFrequencia: React.FunctionComponent<HeaderComponentProps> = (props) => {
  const { setModalMenu, flagLongPressDataNotas, setModalDelDataNotas, dataSelec,
    listaNotas, idUsuario, idPeriodoSelec, idClasseSelec } = useContext(Context);
  const { t } = useTranslation();

  const onPressBin = () => {
    if (flagLongPressDataNotas) {
      setModalDelDataNotas(true);
    }
  };

  /* const onPressSave = () => {
    atualizarNotas(listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
    ToastAndroid.show(t('msg_034'), ToastAndroid.SHORT)
  }; */

  return (
    <HeaderRNE
      backgroundColor={Globais.corPrimaria}
      containerStyle={styles.headerContainer}
      leftComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalMenu(true)}>
            <AntIcon name="menufold" color="white" size={24} />
          </TouchableOpacity>
        </View>
      }
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableWithoutFeedback onPress={onPressBin}>
            <FontAwesomeIcon
              style={styles.icon}
              name="trash-o"
              color={flagLongPressDataNotas ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24}
            />
          </TouchableWithoutFeedback>
         {/*  <TouchableWithoutFeedback onPress={onPressSave}>
            <FontAwesomeIcon
              style={styles.icon}
              name="save"
              color={dataSelec ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24}
            />
          </TouchableWithoutFeedback> */}
        </View>
      }
      centerComponent={
        <View>
          <Text style={styles.heading}>{props.title}</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Globais.corPrimaria, // Garantia de aplicação da cor do tema
    alignItems: 'center',
    marginBottom: 2,
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  heading: {
    color: 'white',
    fontSize: width > 400 ? 24 : 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default HeaderFrequencia;
