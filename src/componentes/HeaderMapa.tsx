import React, { useContext } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

import AntIcon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderMapa: React.FunctionComponent<HeaderComponentProps> = (props) => {
  const { setModalMenu } = useContext(Context);
  const { t } = useTranslation();

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

export default HeaderMapa;
