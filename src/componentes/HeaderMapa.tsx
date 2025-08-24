import React, { useContext } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';

import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Atualize o tipo para incluir a função onSave
type HeaderComponentProps = {
  title: string;
  view?: string;
  onSave: () => void; // A nova prop para a função de salvar
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
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={props.onSave}>
            <FontAwesomeIcon
                          style={styles.icon}
                          name="save"
                          color={'white'}
                          size={24}
                        />
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Globais.corPrimaria,
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