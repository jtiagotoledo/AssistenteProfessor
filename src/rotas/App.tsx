import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Classes from '../telas/Classes';
import Frequencia from '../telas/Frequencia';
import Notas from '../telas/Notas';
import Provider from "../data/Provider";
import Globais from '../data/Globais';
import firestore from '@react-native-firebase/firestore';
import { Context } from "../data/Provider";

const Tab = createBottomTabNavigator();

const App = ({ navigation }: any) => {

  const { idUsuario, idClasseSelec, idPeriodoSelec, setIdPeriodoSelec, setDataSelec,
    setIdClasseSelec} = useContext(Context);

  const estadosAppRef = firestore().collection(idUsuario?idUsuario:' ').doc('EstadosApp')

  let datasFrequenciasRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasFrequencias')

  let datasNotasRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasNotas')

  useEffect(() => {
    //recuperar a última aba selecionada
    estadosAppRef.onSnapshot(snapShot => {
      navigation.navigate('App', { screen: snapShot.data()?.aba })
    })
  }, [])

  const cliqueClasses = () => {
    //setar o nome da aba selecionada
    estadosAppRef.update({
      aba: 'Classes'
    })
  }

  const cliqueFrequencia = () => {
    //setar o nome da aba selecionada
    estadosAppRef.update({
      aba: 'Frequencia'
    })

    //recuperar dados dos estados do app
    estadosAppRef.get().then(snapShot => {
      setIdPeriodoSelec(snapShot.data()?.idPeriodo)
      setIdClasseSelec(snapShot.data()?.idClasse)

      //verificação se a data já existe no DB
      let datasFreq: any[] = [];

      datasFrequenciasRef.get().then(snapshot => {
        snapshot.forEach((documentSnapshot) => {
          datasFreq.push(documentSnapshot.id);
        });
        if (datasFreq.includes(snapShot.data()?.data)) {
          setDataSelec(snapShot.data()?.data)
        } else {
          setDataSelec('')

          firestore().collection(idUsuario).
            doc('EstadosApp').update({
              data: ''
            })
        }
      }).catch((erro) => {
        console.error(erro);
      })
    }).catch((erro) => {
      console.error(erro);
    })
  }

  const cliqueNotas = () => {
    //setar o nome da aba selecionada
    estadosAppRef.update({
      aba: 'Notas'
    })


    //recuperar dados dos estados do app
    estadosAppRef.get().then(snapShot => {
      setIdPeriodoSelec(snapShot.data()?.idPeriodo)
      setIdClasseSelec(snapShot.data()?.idClasse)

      //verificação se a data já existe no DB
      let datasNotas: any[] = [];
      datasNotasRef.get().then(snapshot => {
        snapshot.forEach((documentSnapshot) => {
          datasNotas.push(documentSnapshot.id);
        });
        if (datasNotas.includes(snapShot.data()?.data)) {
          setDataSelec(snapShot.data()?.data)
        } else {
          setDataSelec('')
          firestore().collection(idUsuario).
            doc('EstadosApp').update({
              data: ''
            })
        }
      }).catch((erro) => {
        console.error(erro);
      })
    }).catch((erro) => {
      console.error(erro);
    })
  }

  return (
    <Provider>
      <Tab.Navigator
        screenOptions={( {route} ) => ({
          headerShown: false,
          tabBarIcon: ({color,size}) => {
            let iconName = 'user';
            if (route.name === 'Classes') {
              iconName = 'book'
            } else if (route.name === 'Frequencia') {
              iconName = 'calendar'
            } else if (route.name === 'Notas') {
              iconName = 'pencil'
            }
            return <Icon name={iconName} color={color} size={size}/>;
          },
          tabBarActiveTintColor: Globais.corPrimaria,
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => [cliqueClasses()]} />
          )
        }} name="Classes" component={Classes}></Tab.Screen>
        <Tab.Screen options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => [cliqueFrequencia()]} />
          )
        }} name="Frequencia" component={Frequencia} />
        <Tab.Screen options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => [cliqueNotas()]} />
          )
        }} name="Notas" component={Notas} />
      </Tab.Navigator>
    </Provider>
  );
};

const styles = StyleSheet.create({
  iconDelete: {
    paddingRight: 16
  }
});

export default App;
