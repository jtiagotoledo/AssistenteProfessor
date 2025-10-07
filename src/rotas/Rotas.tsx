import App from './App';
import Login from '../telas/Login';
import NovaConta from '../telas/NovaConta';
import RedefinirSenha from '../telas/RedefinirSenha';

import { jwtDecode } from 'jwt-decode';
import { Context } from '../data/Provider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { recuperarTokens, renovarAccessToken } from '../utils/tokenStorage';
import { Linking } from 'react-native';
import 'react-native-url-polyfill/auto';

interface MeuTokenPayload {
  id: string;
  nome: string;
  email: string;
  exp: number;
  iat: number;
}

const Stack = createNativeStackNavigator();

function Rotas() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [deepLinkData, setDeepLinkData] = useState<{ token: string | null }>({
    token: null,
  });

  const { setEmail, setIdProfessor, setNome } = useContext(Context);

  // 🔹 Verifica o token e autenticação
  useEffect(() => {
    const verificarToken = async () => {
      try {
        const tokens = await recuperarTokens();

        if (tokens?.accessToken) {
          const decoded = jwtDecode<MeuTokenPayload>(tokens.accessToken);
          const agora = Math.floor(Date.now() / 1000);

          if (decoded.exp && decoded.exp > agora) {
            setIsAuthenticated(true);
            setIdProfessor(decoded.id);
            setNome(decoded.nome);
            setEmail(decoded.email);
            return;
          } else {
            // tenta renovar
            const novoAccessToken = await renovarAccessToken();
            if (novoAccessToken) {
              const novoDecoded = jwtDecode<MeuTokenPayload>(novoAccessToken);
              setIsAuthenticated(true);
              setIdProfessor(novoDecoded.id);
              setNome(novoDecoded.nome);
              setEmail(novoDecoded.email);
              return;
            }
          }
        }

        setIsAuthenticated(false);
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setIsAuthenticated(false);
      }
    };

    verificarToken();
  }, [setEmail, setIdProfessor, setNome]);

  // 🔹 Captura de deep link (funciona em todos os estados do app)
  useEffect(() => {
    const handleDeepLink = (event: any) => {
      const url = event.url;
      console.log('🔗 URL recebida:', url);

      if (url.includes('redefinir-senha')) {
        const token = url.split('/').pop();
        console.log('🟢 Token extraído do link:', token);
        setDeepLinkData({ token: token || null });
      }
    };

    // Captura quando o app já está aberto
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Captura quando o app foi aberto pelo link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          deepLinkData.token
            ? 'RedefinirSenha'
            : isAuthenticated
            ? 'App'
            : 'Login'
        }
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NovaConta" component={NovaConta} />
        <Stack.Screen name="App" component={App} />
        <Stack.Screen
          name="RedefinirSenha"
          component={RedefinirSenha}
          initialParams={{ token: deepLinkData.token }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Rotas;
