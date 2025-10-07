import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Globais from '../data/Globais';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  route: any;
  navigation: any;
}

export default function RedefinirSenha({ route, navigation }: Props) {
  const { token } = route.params;
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const trocarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha ambos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'https://assistente-professor.duckdns.org:3000/auth/redefinir-senha',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, novaSenha }),
        },
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Erro', data.erro || 'Erro ao redefinir senha');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Redefinir Senha</Text>

      {/* Campo: Nova senha */}
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={!mostrarSenha}
          placeholder="Nova senha"
          placeholderTextColor="#888"
          style={styles.input}
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
        <TouchableOpacity
          style={styles.iconeOlho}
          onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Icon
            name={mostrarSenha ? 'eye-off' : 'eye'}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Campo: Confirmar senha */}
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={!mostrarConfirmar}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#888"
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity
          style={styles.iconeOlho}
          onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
          <Icon
            name={mostrarConfirmar ? 'eye-slash' : 'eye'}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.botao, loading && { opacity: 0.7 }]}
        onPress={trocarSenha}
        disabled={loading}>
        <Text style={styles.botaoTexto}>
          {loading ? 'Redefinindo...' : 'Redefinir senha'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Globais.corPrimaria,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Globais.corSecundaria,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
  iconeOlho: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  botao: {
    width: '100%',
    height: 50,
    backgroundColor: Globais.corPrimaria,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
