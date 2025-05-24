import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Classes from '../telas/Classes';
import Frequencia from '../telas/Frequencia';
import Notas from '../telas/Notas';
import Globais from '../data/Globais';
import { Context } from "../data/Provider";
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

type RouteNames = 'Classes' | 'Frequencia' | 'Notas' ;

const App = ({ navigation }: any) => {
  const { setDataSelec, setRecarregarAlunos, setRecarregarFrequencia, setRecarregarNotas } = useContext(Context);
  const { t } = useTranslation();

 
  return (
      <Tab.Navigator
        screenOptions={({ route }) => {

          const icons: Record<RouteNames, string> = {
            Classes: 'book',
            Frequencia: 'calendar',
            Notas: 'pencil',
          };

          return {
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              const iconName = icons[route.name as RouteNames];
              return <Icon name={iconName} color={color} size={size} />;
            },
            tabBarActiveTintColor: Globais.corPrimaria,
            tabBarInactiveTintColor: 'gray',
          };
        }}
      >
        <Tab.Screen
          name="Classes"
          component={Classes}
          options={{
            tabBarLabel:t('Classes'),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setRecarregarAlunos((prev:any)=>!prev)
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
            tabBarLabel:t('Frequência'),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setDataSelec(null)
                  setRecarregarFrequencia((prev:any)=>!prev)
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
            tabBarLabel:t('Notas'),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={(e) => {
                  setDataSelec(null)
                  setRecarregarNotas((prev:any)=>!prev)
                  if (props.onPress) props.onPress(e); // Chama comportamento padrão
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default App;
