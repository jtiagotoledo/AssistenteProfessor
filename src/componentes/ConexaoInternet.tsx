import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Globais from '../data/Globais';

const { width } = Dimensions.get('window');

export default function ConexaoInternet() {
  const netInfo = useNetInfo();
  const [messageConnection, setMessageConnection] = useState('Connected');

  useEffect(() => {
    setMessageConnection(netInfo.isConnected ? 'Com internet' : 'Sem internet');
  }, [netInfo]);

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
