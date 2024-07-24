import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Globais from '../data/Globais';

export default function ConexaoInternet() {
  const netInfo = useNetInfo();
  const [messageConnection, setMessageConnection] = useState('Connected');

  useEffect(() => {
    !netInfo.isConnected? setMessageConnection('Sem internet'): setMessageConnection('Com internet')
  }, [netInfo]);

  return (
    !netInfo.isConnected?
        <View style={styles.containerComponent}>
            <Text style={styles.textMessageConnection}>{messageConnection}</Text>
        </View>:null
  );
}

const styles = StyleSheet.create({
  containerComponent: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globais.corAlerta,
  },
  textMessageConnection: {fontSize: 12, fontWeight: 'bold', color: '#FFF'},
});