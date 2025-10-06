import App from './App';
import Login from '../telas/Login';
import NovaConta from '../telas/NovaConta';
import {jwtDecode} from 'jwt-decode';
import {Context} from '../data/Provider';
import 'react-native-url-polyfill/auto';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext, useEffect, useState} from 'react';
import {recuperarTokens, renovarAccessToken} from '../utils/tokenStorage';
import RedefinirSenha from '../telas/RedefinirSenha';

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
  const {setEmail, setIdProfessor, setNome} = useContext(Context);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const tokens = await recuperarTokens();

        if (tokens && tokens.accessToken) {
          const decoded = jwtDecode<MeuTokenPayload>(tokens.accessToken);
          const agora = Math.floor(Date.now() / 1000);

          if (decoded.exp && decoded.exp > agora) {
            setIsAuthenticated(true);
            setIdProfessor(decoded.id);
            setNome(decoded.nome);
            setEmail(decoded.email);
            return;
          } else {
            // Tenta renovar
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
  }, [setIsAuthenticated, setIdProfessor, setNome, setEmail]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'App' : 'Login'}
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={App} />
        <Stack.Screen name="NovaConta" component={NovaConta} />
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Rotas;
