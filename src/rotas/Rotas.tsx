import React, { useContext, useEffect } from 'react'
import App from './App';
import Login from '../telas/Login';
import NovaConta from '../telas/NovaConta';
import Provider from "../data/Provider";
import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Rotas() {

    return (
      <Provider>
        <NavigationContainer>
          <Stack.Navigator 
          initialRouteName={auth().currentUser?'App':'Login'}
          screenOptions={() => ({
              headerShown:false
              })
          }>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="App" component={App} />
            <Stack.Screen name="NovaConta" component={NovaConta} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
  
  export default Rotas;