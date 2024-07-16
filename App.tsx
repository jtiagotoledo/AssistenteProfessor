import React from 'react';
import {
  Button,
  StyleSheet,Text,View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () =>{

  const adicionarDB = ()=>{
    firestore().collection('teste').doc('teste2').set({
      
    })
  }
  

  return(
    <View>
      <Text>oi</Text>
      <Button  title='aperte' onPress={adicionarDB}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
