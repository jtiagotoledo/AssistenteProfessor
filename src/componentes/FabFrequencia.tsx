import React, { useContext } from 'react';
import { View, ToastAndroid, StyleSheet, Dimensions } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import FontIAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../data/Provider';
import Globais from '../data/Globais';

const { width, height } = Dimensions.get('window'); // Captura as dimensões da tela

const FabNotas = () => {
  const { setModalCalendarioNota, flagLoadAlunos, idClasseSelec } = useContext(Context);

  const abrirCalendario = () => {
    if (idClasseSelec !== '' && flagLoadAlunos !== 'vazio') {
      setModalCalendarioNota(true);
    } else if (idClasseSelec === '') {
      ToastAndroid.show('Selecione uma classe primeiro...', ToastAndroid.SHORT);
    }
    if (flagLoadAlunos === 'vazio') {
      ToastAndroid.show('Primeiro, adicione os alunos nessa classe...', ToastAndroid.SHORT);
    }
  };

  const actions = [
    {
      text: 'Adicionar data',
      textBackground: Globais.corPrimaria,
      color: Globais.corPrimaria,
      icon: <FontIAwesomeIcon name={'calendar-plus-o'} size={width * 0.06} color="white" />,
      name: 'data',
      position: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <FloatingAction
        color={Globais.corPrimaria}
        overrideWithAction={true}
        actions={actions}
        onPressItem={abrirCalendario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center', // Centraliza o FAB horizontalmente
    paddingBottom: height * 0.05, // Define espaçamento responsivo na parte inferior
  },
});

export default FabNotas;
