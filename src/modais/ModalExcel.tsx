import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import removeAccents from 'remove-accents';
import Globais from '../data/Globais';
import {Context} from '../data/Provider';
import {importarAlunosEmLote} from '../services/alunos';

const ImportarAlunosModal = () => {
  const {modalExcel, setModalExcel, idClasseSelec, setRecarregarAlunos} =
    useContext(Context);
  const [carregando, setCarregando] = useState(false);

  const escolherArquivo = async () => {
    try {
      setCarregando(true);

      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const path = file.uri.replace('file://', '');
      const fileData = await RNFS.readFile(path, 'base64');

      const workbook = XLSX.read(fileData, {type: 'base64'});
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      const dadosOriginais = XLSX.utils.sheet_to_json(planilha);

      if (dadosOriginais.length > 50) {
        Alert.alert(
          'Erro',
          'O arquivo possui mais de 50 linhas. Por favor, envie um arquivo menor.',
        );
        return;
      }

      const dadosNormalizados = dadosOriginais.map((aluno: any) => {
        const novoAluno: any = {};
        Object.keys(aluno).forEach(chave => {
          const chaveNormalizada = removeAccents(chave.trim().toLowerCase());
          novoAluno[chaveNormalizada] = aluno[chave];
        });
        return {
          ...novoAluno,
          id_classe: idClasseSelec,
        };
      });

      const resposta = await importarAlunosEmLote(dadosNormalizados);

      console.log('Alunos importados:', resposta);
      Alert.alert(
        'Sucesso',
        `${
          resposta.importados?.length || dadosNormalizados.length
        } alunos importados com sucesso.`,
      );
      setModalExcel(false);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelado', 'Seleção de arquivo cancelada.');
      } else {
        console.error('Erro ao importar alunos:', err);
        Alert.alert('Erro', 'Não foi possível importar os alunos.');
      }
    } finally {
      setCarregando(false);
      setRecarregarAlunos((prev: any) => !prev);
    }
  };

  return (
    <Modal
      visible={modalExcel}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalExcel(false)}>
      <View style={styles.modalFundo}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitulo}>Importar Alunos</Text>
          <Text style={styles.modalTitulo}>
            Aviso: o arquivo deve estar como no modelo abaixo e deve ter
            nomáximo 50 linhas
          </Text>

          <Image
            source={require('../assets/modeloImportarAlunos.png')}
            style={styles.imagemModelo}
          />

          {carregando ? (
            <ActivityIndicator
              size="large"
              color={Globais.corPrimaria}
              style={{marginVertical: 20}}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.botao} onPress={escolherArquivo}>
                <Text style={styles.botaoTexto}>Escolher Arquivo Excel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => setModalExcel(false)}>
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: Globais.corTerciaria,
    borderRadius: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Globais.corTextoEscuro,
  },
  botao: {
    backgroundColor: Globais.corPrimaria,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  botaoTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imagemModelo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});
