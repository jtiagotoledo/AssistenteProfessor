import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const { width } = Dimensions.get('window');

export default function ConexaoInternet() {
  const netInfo = useNetInfo();
  const [messageConnection, setMessageConnection] = useState('Connected');
  const { t } = useTranslation();

  useEffect(() => {
    setMessageConnection(netInfo.isConnected ? t('Com internet') : t('Sem internet'));
  }, [netInfo,i18n.language]);

  return (
    !netInfo.isConnected ? (
      <View style={styles.containerComponent}>
        <Text style={styles.textMessageConnection}>{messageConnection}</Text>
      </View>
    ) : null
  );
}

const styles = StyleSheet.create({
  containerComponent: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globais.corAlerta,
    paddingHorizontal: width * 0.05, // Margem responsiva
  },
  textMessageConnection: {
    fontSize: width > 400 ? 14 : 12, // Ajuste do tamanho do texto com base na largura da tela
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});
