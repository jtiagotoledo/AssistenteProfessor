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
          await firestore()
            .collection(idUsuario)
            .doc(periodoDoc.id)
            .collection('Classes')
            .doc(classeDoc.id)
            .delete();
        }
  
        // Excluindo documento do período
        await firestore().collection(idUsuario).doc(periodoDoc.id).delete();
      }
      
      navigation.replace('Login')
    } catch (error) {
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
              await user.delete();
              await deleteDadosUsuario()
              Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.', [
                {
                  text: 'OK',
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

export const deleteClasse = async (idUsuario, idPeriodoSelec, idClasseSelec) => {
  try {
    const firestoreInstance = firestore();

    // Função para excluir todos os documentos de uma subcoleção
    const deleteSubcollection = async (collectionPath) => {
      const snapshot = await firestoreInstance.collection(collectionPath).get();
      const batch = firestoreInstance.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    };

    // Caminho base da classe
    const classPath = `${idUsuario}/${idPeriodoSelec}/Classes/${idClasseSelec}`;

    // Excluir subcoleções
    await deleteSubcollection(`${classPath}/ListaAlunos`);
    await deleteSubcollection(`${classPath}/DatasNotas`);
    await deleteSubcollection(`${classPath}/DatasFrequencias`);

    // Excluir documento da classe
    await firestoreInstance.collection(`${idUsuario}/${idPeriodoSelec}/Classes`).doc(idClasseSelec).delete();

  } catch (error) {
  }
};

export const deletePeriodo = async (idUsuario, idPeriodoSelec) => {
  try {
    const firestoreInstance = firestore();

    // Função para excluir todos os documentos de uma subcoleção
    const deleteSubcollection = async (collectionPath) => {
      const snapshot = await firestoreInstance.collection(collectionPath).get();
      const batch = firestoreInstance.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    };

    // Obter todas as classes do período
    const classesSnapshot = await firestoreInstance
      .collection(`${idUsuario}/${idPeriodoSelec}/Classes`)
      .get();

    // Iterar por cada classe e excluir suas subcoleções
    for (const classeDoc of classesSnapshot.docs) {
      const classPath = `${idUsuario}/${idPeriodoSelec}/Classes/${classeDoc.id}`;

      // Excluir subcoleções da classe
      await deleteSubcollection(`${classPath}/ListaAlunos`);
      await deleteSubcollection(`${classPath}/DatasNotas`);
      await deleteSubcollection(`${classPath}/DatasFrequencias`);

      // Excluir documento da classe
      await firestoreInstance.doc(classPath).delete();
    }

    // Excluir o documento do período
    await firestoreInstance.collection(idUsuario).doc(idPeriodoSelec).delete();

  } catch (error) {
  }
};

export const deleteDataFreq = async (idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) => {
  try {
    const firestoreInstance = firestore();

    // Caminho base da classe
    const classPath = `${idUsuario}/${idPeriodoSelec}/Classes/${idClasseSelec}`;
    const datasFrequenciasPath = `${classPath}/DatasFrequencias`;

    // Deletar o documento com ID correspondente à data
    const docRef = firestoreInstance.collection(datasFrequenciasPath).doc(dataSelec);
    await docRef.delete();


    // Deletar a data de cada aluno na subcoleção `ListaAlunos`
    const listaAlunosPath = `${classPath}/ListaAlunos`;
    const alunosSnapshot = await firestoreInstance.collection(listaAlunosPath).get();

    if (!alunosSnapshot.empty) {
      const batch = firestoreInstance.batch();

      for (const alunoDoc of alunosSnapshot.docs) {
        const alunoRef = alunoDoc.ref;
        const alunoData = alunoDoc.data();

        // Atualizar o array de frequências removendo a data
        const frequenciasAtualizadas = (alunoData.frequencias || []).filter(
          (frequencia) => frequencia.data !== dataSelec
        );

        // Atualizar apenas se houve mudança
        if (frequenciasAtualizadas.length !== alunoData.frequencias.length) {
          batch.update(alunoRef, { frequencias: frequenciasAtualizadas });
        }
      }

      await batch.commit();
    }

  } catch (error) {
  }
};

export const deleteDataNotas = async (idUsuario, idPeriodoSelec, idClasseSelec, dataSelec) => {
  try {
    const firestoreInstance = firestore();

    // Caminho base da classe
    const classPath = `${idUsuario}/${idPeriodoSelec}/Classes/${idClasseSelec}`;
    const datasNotasPath = `${classPath}/DatasNotas`;

    // Deletar o documento com ID correspondente à data
    const docRef = firestoreInstance.collection(datasNotasPath).doc(dataSelec);
    await docRef.delete();

    
    // Deletar a data de cada aluno na subcoleção `ListaAlunos`
    const listaAlunosPath = `${classPath}/ListaAlunos`;
    const alunosSnapshot = await firestoreInstance.collection(listaAlunosPath).get();

    if (!alunosSnapshot.empty) {
      const batch = firestoreInstance.batch();

      for (const alunoDoc of alunosSnapshot.docs) {
        const alunoRef = alunoDoc.ref;
        const alunoData = alunoDoc.data();

        // Atualizar o array de notas removendo a data
        const notasAtualizadas = (alunoData.notas || []).filter(
          (nota) => nota.data !== dataSelec
        );

        // Atualizar apenas se houve mudança
        if (notasAtualizadas.length !== alunoData.notas.length) {
          batch.update(alunoRef, { notas: notasAtualizadas });
        }
      }

      await batch.commit();
    }

  } catch (error) {
    return
  }
  
};




