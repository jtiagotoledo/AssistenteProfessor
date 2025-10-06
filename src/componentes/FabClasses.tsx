import {FloatingAction} from 'react-native-floating-action';
import React, {useContext} from 'react';
import {View, ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Context} from '../data/Provider';
import Globais from '../data/Globais';
import {useTranslation} from 'react-i18next';

const FabClasses = () => {
  const {
    setModalAddPeriodo,
    setModalAddClasse,
    setModalExcel,
    setModalAddAluno,
    idPeriodoSelec,
    idClasseSelec,
  } = useContext(Context);
  const {t} = useTranslation();

  const actions = [
    {
      text: t('Adicionar período'),
      textBackground: Globais.corPrimaria,
      textColor: Globais.corTextoClaro,
      color: Globais.corPrimaria,
      icon: <Icon name={'calendar'} color={'white'}></Icon>,
      name: 'periodo',
      position: 1,
    },
    {
      text: t('Adicionar classe'),
      textBackground: Globais.corPrimaria,
      textColor: Globais.corTextoClaro,
      color: Globais.corPrimaria,
      icon: <Icon name={'book'} color={'white'}></Icon>,
      name: 'classe',
      position: 2,
    },
    {
      text: t('Adicionar aluno'),
      textBackground: Globais.corPrimaria,
      textColor: Globais.corTextoClaro,
      color: Globais.corPrimaria,
      icon: <Icon name={'user'} color={'white'}></Icon>,
      name: 'aluno',
      position: 3,
    },
    {
      text: t('Adicionar vários alunos'),
      textBackground: Globais.corPrimaria,
      textColor: Globais.corTextoClaro,
      color: Globais.corPrimaria,
      icon: <Icon name={'users'} color={'white'}></Icon>,
      name: 'alunos',
      position: 4,
    },
  ];

  return (
    <View>
      <FloatingAction
        color={Globais.corPrimaria}
        actions={actions}
        floatingIcon={<Icon name={'plus'} size={18} color={'white'}></Icon>}
        onPressItem={name => {
          name == 'periodo' ? setModalAddPeriodo(true) : null;
          if (idPeriodoSelec != '') {
            name == 'classe' ? setModalAddClasse(true) : null;
          } else if (idPeriodoSelec != '' || name == 'classe') {
            ToastAndroid.show(t('msg_031'), ToastAndroid.SHORT);
          }
          if (idClasseSelec != '') {
            name == 'aluno' ? setModalAddAluno(true) : null;
          } else if (idClasseSelec != '' || name == 'aluno') {
            ToastAndroid.show(t('msg_032'), ToastAndroid.SHORT);
          }
          if (idClasseSelec != '') {
            name == 'alunos' ? setModalExcel(true) : null;
          } else if (idClasseSelec != '' || name == 'alunos') {
            ToastAndroid.show(t('msg_032'), ToastAndroid.SHORT);
          }
        }}
      />
    </View>
  );
};

export default FabClasses;
