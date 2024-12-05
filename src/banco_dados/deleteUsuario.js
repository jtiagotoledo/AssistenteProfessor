import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { Alert } from 'react-native';

export const deleteUser = async (navigation, idUsuario) => {
  const user = auth().currentUser;
  const db = getFirestore();

  const deleteDadosUsuario = async () =>{
    try {
        const collectionRef = collection(db, idUsuario);
    
        const querySnapshot = await getDocs(collectionRef);
    
        const deletePromises = querySnapshot.docs.map((document) =>
          deleteDoc(doc(db, idUsuario, document.id))
        );
    
        await Promise.all(deletePromises);
        console.log('Coleção deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar a coleção:', error);
      }
  }

  if (user) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDadosUsuario()
              await user.delete();
              Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.', [
                {
                  text: 'OK',
                  onPress: () => navigation.replace('Login'), // Redirecionar para a tela de login
                },
              ]);
            } catch (error) {
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Erro de Autenticação',
                  'Por motivos de segurança, é necessário fazer login novamente para excluir sua conta.', 
                  [
                    {
                        text:'OK',
                        onPress: () => navigation.replace('Login'),
                    }
                  ]);
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente mais tarde.');
              }
            }
          },
        },
      ]
    );
  } else {
    Alert.alert('Erro', 'Nenhum usuário autenticado encontrado.');
  }
};
