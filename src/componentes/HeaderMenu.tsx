import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import Globais from '../data/Globais';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Context } from "../data/Provider";

const { width } = Dimensions.get('window');

type HeaderComponentProps = {
  title: string;
  view?: string;
};

const HeaderMenu: React.FunctionComponent<HeaderComponentProps> = ({ title }) => {
  const { setModalMenu } = useContext(Context);

  return (
    <HeaderRNE
      backgroundColor={Globais.corPrimaria}
      containerStyle={[styles.headerContainer, { backgroundColor: Globais.corPrimaria }]}
      leftComponent={
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setModalMenu(false)}>
            <AntIcon name="menufold" color="white" size={24} />
          </TouchableOpacity>
        </View>
      }
      centerComponent={{
        text: title,
        style: styles.heading,
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
});

export default HeaderMenu;
