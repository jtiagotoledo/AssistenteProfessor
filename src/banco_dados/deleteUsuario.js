import auth from '@react-native-firebase/auth';
import firestore, { collection } from '@react-native-firebase/firestore';

import { Alert } from 'react-native';

export const deleteUser = async (navigation, idUsuario) => {
  const user = auth().currentUser;

  const deleteDadosUsuario = async () => {
    try {
      const periodosSnapshot = await firestore().collection(idUsuario).get();
  
      for (const periodoDoc of periodosSnapshot.docs) {
        const classesSnapshot = await firestore()
          .collection(idUsuario)
          .doc(periodoDoc.id)
          .collection('Classes')
          .get();
  
        for (const classeDoc of classesSnapshot.docs) {
          // Excluindo subcoleção 'ListaAlunos'
          const alunosSnapshot = await firestore()
            .collection(idUsuario)
            .doc(periodoDoc.id)
            .collection('Classes')
            .doc(classeDoc.id)
            .collection('ListaAlunos')
            .get();
  
          for (const alunoDoc of alunosSnapshot.docs) {
            console.log('Deletando aluno:', alunoDoc.id);
            await firestore()
              .collection(idUsuario)
              .doc(periodoDoc.id)
              .collection('Classes')
              .doc(classeDoc.id)
              .collection('ListaAlunos')
              .doc(alunoDoc.id)
              .delete();
          }
  
          // Excluindo subcoleção 'DatasNotas'
          const notasSnapshot = await firestore()
            .collection(idUsuario)
            .doc(periodoDoc.id)
            .collection('Classes')
            .doc(classeDoc.id)
            .collection('DatasNotas')
            .get();
  
          for (const notaDoc of notasSnapshot.docs) {
            console.log('Deletando nota:', notaDoc.id);
            await firestore()
              .collection(idUsuario)
              .doc(periodoDoc.id)
              .collection('Classes')
              .doc(classeDoc.id)
              .collection('DatasNotas')
              .doc(notaDoc.id)
              .delete();
          }
  
          // Excluindo subcoleção 'DatasFrequencias'
          const frequenciasSnapshot = await firestore()
            .collection(idUsuario)
            .doc(periodoDoc.id)
            .collection('Classes')
            .doc(classeDoc.id)
            .collection('DatasFrequencias')
            .get();
  
          for (const frequenciaDoc of frequenciasSnapshot.docs) {
            console.log('Deletando frequência:', frequenciaDoc.id);
            await firestore()
              .collection(idUsuario)
              .doc(periodoDoc.id)
              .collection('Classes')
              .doc(classeDoc.id)
              .collection('DatasFrequencias')
              .doc(frequenciaDoc.id)
              .delete();
          }
  
          // Excluindo documento da classe
          console.log('Deletando classe:', classeDoc.id);
          await firestore()
            .collection(idUsuario)
            .doc(periodoDoc.id)
            .collection('Classes')
            .doc(classeDoc.id)
            .delete();
        }
  
        // Excluindo documento do período
        console.log('Deletando período:', periodoDoc.id);
        await firestore().collection(idUsuario).doc(periodoDoc.id).delete();
      }
  
      console.log('Todos os dados do usuário foram deletados com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar dados do usuário:', error);
    }
  };
  

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
