import { FloatingAction } from "react-native-floating-action";
import React, { useContext } from 'react';
import { View, ToastAndroid, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";

// Obter as dimensões da tela
const { width, height } = Dimensions.get("window");

const actions = [
  {
    text: "Adicionar período",
    textBackground: Globais.corPrimaria,
    textColor: Globais.corTextoClaro,
    color: Globais.corPrimaria,
    icon: <Icon name={'calendar'} color={'white'} />,
    name: "periodo",
  },
  {
    text: "Adicionar classe",
    textBackground: Globais.corPrimaria,
    textColor: Globais.corTextoClaro,
    color: Globais.corPrimaria,
    icon: <Icon name={'book'} color={'white'} />,
    name: "classe",
  },
  {
    text: "Adicionar aluno",
    textBackground: Globais.corPrimaria,
    textColor: Globais.corTextoClaro,
    color: Globais.corPrimaria,
    icon: <Icon name={'user'} color={'white'} />,
    name: "aluno",
  },
];

const FabClasses = () => {
  const { setModalAddPeriodo, setModalAddClasse, setModalAddAluno, idPeriodoSelec, idClasseSelec } = useContext(Context);

  // Ajustando a posição do FloatingAction de acordo com o tamanho da tela
  // Calculando margens menores para telas maiores e maiores para telas menores
  const floatingButtonPosition = width < 400 
    ? { bottom: 5, right: 5 } // Para telas menores
    : { bottom: 10, right: 10 }; // Para telas maiores, mas ainda próximo da borda

  const iconSize = width < 400 ? 16 : 18;  // Ajuste no tamanho do ícone para telas menores

  const handlePressItem = (name:any) => {
    if (name === 'periodo') {
      setModalAddPeriodo(true);
    } else if (name === 'classe') {
      if (idPeriodoSelec === '') {
        ToastAndroid.show('Selecione um período primeiro!', ToastAndroid.SHORT);
      } else {
        setModalAddClasse(true);
      }
    } else if (name === 'aluno') {
      if (idClasseSelec === '') {
        ToastAndroid.show('Selecione uma classe primeiro!', ToastAndroid.SHORT);
      } else {
        setModalAddAluno(true);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Usando View para aplicar position absoluto */}
      <View style={{ position: 'absolute', bottom: floatingButtonPosition.bottom, right: floatingButtonPosition.right }}>
        <FloatingAction
          color={Globais.corPrimaria}
          actions={actions}
          floatingIcon={<Icon name={'plus'} size={iconSize} color={'white'} />} // Tamanho do ícone ajustável
          onPressItem={handlePressItem} // Lógica de controle de ações
        />
      </View>
    </View>
  );
};

export default FabClasses;
