import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text, Dimensions } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderFrequencia: React.FunctionComponent<HeaderComponentProps> = (props) => {
  const {
    setModalMenu,
    flagLongPressDataFreq,
    setModalDelDataFreq,
  } = useContext(Context);

  const onPressBin = () => {
    if (flagLongPressDataFreq) {
      setModalDelDataFreq(true);
    }
  };

  return (
    <HeaderRNE
      backgroundColor={Globais.corPrimaria}
      containerStyle={[styles.headerContainer, { backgroundColor: Globais.corPrimaria }]}
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
              color={flagLongPressDataFreq ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24}
            />
          </TouchableWithoutFeedback>
        </View>
      }
      centerComponent={
        <View>
          <Text style={styles.heading}>Frequência</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
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
