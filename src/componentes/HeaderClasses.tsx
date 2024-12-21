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

const HeaderClasses: React.FunctionComponent<HeaderComponentProps> = ({ title }) => {
  const {
    setModalMenu, flagLongPressAluno, setModalDelClasse, setModalDelAluno,
    flagLongPressClasse, setModalEditClasse, setModalEditAluno
  } = useContext(Context);

  const onPressBin = () => {
    if (flagLongPressClasse) setModalDelClasse(true);
    if (flagLongPressAluno) setModalDelAluno(true);
  };

  const onPressEdit = () => {
    if (flagLongPressClasse) setModalEditClasse(true);
    if (flagLongPressAluno) setModalEditAluno(true);
  };

  return (
    <HeaderRNE
      backgroundColor={Globais.corPrimaria}
      containerStyle={[styles.headerContainer, { backgroundColor: Globais.corPrimaria }]}
      leftComponent={
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setModalMenu(true)}>
            <AntIcon name="menufold" color="white" size={24} />
          </TouchableOpacity>
        </View>
      }
      centerComponent={{
        text: title,
        style: styles.heading,
      }}
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableWithoutFeedback onPress={onPressEdit}>
            <FontAwesomeIcon
              name="edit"
              selectable={false}
              style={styles.iconSpacing}
              color={flagLongPressClasse || flagLongPressAluno ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onPressBin}>
            <FontAwesomeIcon
              name="trash-o"
              selectable={false}
              style={styles.iconSpacing}
              color={flagLongPressClasse || flagLongPressAluno ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)'}
              size={24}
            />
          </TouchableWithoutFeedback>
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
  },
  heading: {
    color: 'white',
    fontSize: width > 400 ? 24 : 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSpacing: {
    marginHorizontal: 10, // Espaçamento entre os ícones
  },
});

export default HeaderClasses;
