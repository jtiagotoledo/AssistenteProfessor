import { FloatingAction } from "react-native-floating-action";
import React, { useContext } from 'react';
import { View, ToastAndroid, Dimensions, StyleSheet } from "react-native";
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import FontIAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const FabFrequencia = () => {
  const { setModalCalendarioFreq, flagLoadAlunos, idClasseSelec } = useContext(Context);
  
  // Função para abrir o calendário
  const abrirCalendário = () => {
    if (idClasseSelec !== '' && flagLoadAlunos !== 'vazio') {
      setModalCalendarioFreq(true);
    } else if (idClasseSelec === '') {
      ToastAndroid.show('Selecione uma classe primeiro...', ToastAndroid.SHORT);
    }
    if (flagLoadAlunos === 'vazio') {
      ToastAndroid.show('Primeiro, adicione os alunos nessa classe...', ToastAndroid.SHORT);
    }
  };

  // Ações do FloatingAction
  const actions = [
    {
      text: "Adicionar data",
      textBackground: Globais.corPrimaria,
      color: Globais.corPrimaria,
      icon: <FontIAwesomeIcon name={'calendar-plus-o'} size={24} color={'white'} />,
      name: "data",
      position: 1
    }
  ];

  // Responsividade com base na largura da tela
  const { width, height } = Dimensions.get('window');
  const actionPosition = width < 350 ? 'right' : 'left'; // Ajusta a posição com base na largura da tela

  return (
    <View style={styles.container}>
      <FloatingAction
        color={Globais.corPrimaria}
        overrideWithAction={true}
        actions={actions}
        onPressItem={abrirCalendário}
        position={actionPosition} // Definindo a posição como string ('left' ou 'right')
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});

export default FabFrequencia;
