import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';

export default function RedefinirSenha({route}: any) {
  const {token} = route.params;
  const [novaSenha, setNovaSenha] = useState('');

  const trocarSenha = async () => {
    const res = await fetch('http://localhost:3000/auth/redefinir-senha', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token, novaSenha}),
    });
    const data = await res.json();
    Alert.alert(data.mensagem || data.erro);
  };

  return (
    <View style={{padding: 20}}>
      <Text>Digite a nova senha:</Text>
      <TextInput
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
        style={{borderWidth: 1, marginVertical: 10, padding: 5}}
      />
      <Button title="Redefinir senha" onPress={trocarSenha} />
    </View>
  );
}
