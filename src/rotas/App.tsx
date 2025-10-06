import React, {useContext, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Classes from '../telas/Classes';
import Frequencia from '../telas/Frequencia';
import Notas from '../telas/Notas';
import Mapa from '../telas/Mapa';
import Globais from '../data/Globais';
import {Context} from '../data/Provider';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Linking} from 'react-native';

const Tab = createBottomTabNavigator();

type StackParamList = {
  Login: undefined;
  App: undefined;
  NovaConta: undefined;
  RedefinirSenha: {token?: string};
};

type RouteNames = 'Classes' | 'Frequencia' | 'Notas' | 'Mapa';
type RotasNavigationProp = NativeStackNavigationProp<StackParamList>;

const App = () => {
  const navigation = useNavigation<RotasNavigationProp>();
  const {
    setDataSelec,
    setRecarregarAlunos,
    setRecarregarFrequencia,
    setRecarregarNotas,
  } = useContext(Context);
  const {t} = useTranslation();

  useEffect(() => {
    const handleDeepLink = (event: any) => {
      const url = event.url;
      console.log('URL recebida:', url);

      if (url.includes('redefinir-senha')) {
        const token = url.split('/').pop();
        navigation.navigate('RedefinirSenha', {token});
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        const icons: Record<RouteNames, string> = {
          Classes: 'book',
          Frequencia: 'calendar',
          Notas: 'pencil',
          Mapa: 'users',
        };

        return {
          headerShown: false,
          tabBarIcon: ({color, size}) => {
            const iconName = icons[route.name as RouteNames];
            return <Icon name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: Globais.corPrimaria,
          tabBarInactiveTintColor: 'gray',
        };
      }}>
      <Tab.Screen
        name="Classes"
        component={Classes}
        options={{
          tabBarLabel: t('Classes'),
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={e => {
                setRecarregarAlunos((prev: any) => !prev);
                if (props.onPress) props.onPress(e);
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Frequencia"
        component={Frequencia}
        options={{
          tabBarLabel: t('Frequência'),
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={e => {
                setDataSelec(null);
                setRecarregarFrequencia((prev: any) => !prev);
                if (props.onPress) props.onPress(e); // Chama comportamento padrão
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notas"
        component={Notas}
        options={{
          tabBarLabel: t('Notas'),
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={e => {
                setDataSelec(null);
                setRecarregarNotas((prev: any) => !prev);
                if (props.onPress) props.onPress(e); // Chama comportamento padrão
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={Mapa}
        options={{
          tabBarLabel: t('Mapa de sala'),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
