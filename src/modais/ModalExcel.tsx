import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { Context } from '../data/Provider';

const ImportarAlunosModal = () => {
  const { modalExcel, setModalExcel } = useContext(Context);
  const [alunos, setAlunos] = useState<any[]>([]);

  const escolherArquivo = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles]
      });

      const path = file.uri.replace('file://', ''); // remove o prefixo em Android
      const fileData = await RNFS.readFile(path, 'base64');

      const workbook = XLSX.read(fileData, { type: 'base64' });
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(planilha);

      setAlunos(dados);
      console.log('Alunos importados:', dados);
      Alert.alert('Sucesso', `${dados.length} alunos importados.`);
      setModalExcel(false);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelado', 'Seleção de arquivo cancelada.');
      } else {
        console.error('Erro ao ler arquivo:', err);
        Alert.alert('Erro', 'Não foi possível ler o arquivo Excel.');
      }
    }
  };

  return (
    <Modal
      visible={modalExcel}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalExcel(false)}
    >
      <View style={styles.modalFundo}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitulo}>Importar Alunos</Text>

          <TouchableOpacity style={styles.botao} onPress={escolherArquivo}>
            <Text style={styles.botaoTexto}>Escolher Arquivo Excel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#ccc' }]}
            onPress={() => setModalExcel(false)}
          >
            <Text style={[styles.botaoTexto, { color: '#000' }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImportarAlunosModal;

const styles = StyleSheet.create({
  modalFundo: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10
  },
  botaoTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
