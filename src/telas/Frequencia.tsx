import React, {
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AppState,
  Alert,
  ToastAndroid,
} from 'react-native';
import {Divider} from 'react-native-paper';

import {Context} from '../data/Provider';
import ModalCalendarioFrequencia from '../modais/ModalCalendarioFrequencia';
import ModalDelDataFreq from '../modais/ModalDelDataFreq';
import Globais from '../data/Globais';
import HeaderFrequencia from '../componentes/HeaderFrequencia';
import FlatListFrequencia from '../listas/FlatListFrequencia';
import FlatListClasses from '../listas/FlatListClasses';
import FabFrequencia from '../componentes/FabFrequencia';
import ConexaoInternet from '../componentes/ConexaoInternet';
import {useTranslation} from 'react-i18next';
import i18n from '../../i18n';
import {atualizarAtividade} from '../services/datasFrequencia';

const Frequencia = () => {
  const {
    dataSelec,
    setModalCalendarioFreq,
    nomePeriodoSelec,
    setFlagLongPressDataFreq,
    idDataFreq,
    textoAtividades,
    setTextoAtividades,
  } = useContext(Context);
  const {t} = useTranslation();

  useEffect(() => {
    setTextoAtividades('');
  }, [dataSelec]);

  function formatarData(data: String) {
    if (typeof data === 'string' && data.includes('-')) {
      const [ano, mes, dia] = data.split('-');
      if (i18n.language == 'pt') return `${dia}/${mes}/${ano}`;
      if (i18n.language == 'en') return `${mes}/${dia}/${ano}`;
    } else {
      return t('Selecione uma data') + '...';
    }
  }

  const renderHeader = () => (
    <TouchableOpacity
      onPress={() => setFlagLongPressDataFreq(false)}
      activeOpacity={1}>
      <Text style={styles.textLoad}>
        {nomePeriodoSelec != undefined
          ? t('Período') + ': ' + nomePeriodoSelec
          : t('Selecione um período') + '...'}
      </Text>
      <FlatListClasses />
      <Divider style={styles.divider} />
      <View style={styles.containerText}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalCalendarioFreq(true)}
          onLongPress={() => setFlagLongPressDataFreq(true)}>
          <Text style={styles.text}>{formatarData(dataSelec)}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textInputHighlight}>{textoAtividades}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderFrequencia title={t('Frequência')} />
      <ConexaoInternet />
      <FlatListFrequencia
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={() => null}
        contentContainerStyle={styles.listContent}
      />
      <ModalCalendarioFrequencia />
      <ModalDelDataFreq />
      <FabFrequencia />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globais.corSecundaria,
  },
  listContent: {
    flexGrow: 1,
  },
  containerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  text: {
    fontSize: 24,
    padding: 5,
    color: Globais.corTextoClaro,
  },
  divider: {
    backgroundColor: Globais.corPrimaria,
  },
  containerInput: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '90%',
  },
  textInput: {
    width: '100%',
    backgroundColor: Globais.corTextoClaro,
    padding: 8,
    paddingRight: 80, // Deixa espaço para o botão "Salvar"
    fontSize: 16,
    borderRadius: 5,
  },
  saveButtonInside: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: Globais.corSecundaria, // Cor do botão
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonTextInside: {
    color: Globais.corTextoClaro, // Cor do texto
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto dentro do botão
    flexWrap: 'wrap',
  },
  textInputHighlight: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 18,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2, // sombra leve para destacar
  },
});

export default Frequencia;
