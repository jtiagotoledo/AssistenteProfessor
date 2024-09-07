import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

import { atualizarNotas } from "../banco_dados/atualizarBD"

import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderNotas: React.FunctionComponent<HeaderComponentProps> = (props) => {

  const { setModalDelDataNotas, setModalMenu, flagLongPressDataNotas, dataSelec } = useContext(Context);

  const onPressBin = () => {
    flagLongPressDataNotas ? setModalDelDataNotas(true) : null
  }

  const onPressSave = () => {
    atualizarNotas()
  }

  return (
    <HeaderRNE
      backgroundColor={Globais.corPrimaria}
      style={styles.headerContainer}
      leftComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalMenu(true)}>
            <AntIcon name="menufold" color="white" size={24} />
          </TouchableOpacity>
        </View>
      }
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableWithoutFeedback onPress={onPressSave}>
            <FontAwesomeIcon
              style={styles.icon}
              selectable={false}
              name="save"
              color={dataSelec !== '' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onPressBin}>
            <FontAwesomeIcon
              style={styles.icon}
              selectable={false}
              name="trash-o"
              color={flagLongPressDataNotas ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24} />
          </TouchableWithoutFeedback>
        </View>
      }
      centerComponent={{ text: 'Notas', style: styles.heading }}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,

  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HeaderNotas;