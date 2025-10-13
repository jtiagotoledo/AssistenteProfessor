import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Context } from '../data/Provider';
import FlatListClasses from '../listas/FlatListClasses';
import Globais from '../data/Globais';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import HeaderMapa from '../componentes/HeaderMapa';
import { Divider } from 'react-native-paper';
import {
  buscarMapaDeSala,
  salvarMapaDeSala,
  deletarMapaDeSala,
} from '../services/mapaSala';

type AssentoData = { pos: number; alunoId: string | null };
type Aluno = { id: string; nome: string; numero: number; foto_url: string };

interface AssentoComDadosCompletos extends AssentoData {
  aluno: Aluno | null;
}

interface AssentoProps {
  item: AssentoComDadosCompletos;
  abrirModal: (pos: number) => void;
  styles: any;
}

const MemoizedAssento: React.FC<AssentoProps> = React.memo(
  ({ item, abrirModal, styles }) => {
    const aluno = item.aluno;
    return (
      <TouchableOpacity
        onPress={() => abrirModal(item.pos)}
        style={[styles.assento, aluno && styles.assentoOcupado]}>
        {aluno ? (
          <View style={styles.assentoContent}>
            <Image source={{ uri: aluno.foto_url }} style={styles.alunoFoto} />
            <View style={styles.alunoTextContainer}>
              <Text style={styles.alunoNumero}>{aluno.numero}</Text>
              <Text style={styles.alunoNome} numberOfLines={3}>
                {aluno.nome}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.assentoText}>Vazio</Text>
        )}
      </TouchableOpacity>
    );
  },
);

const Mapa = () => {
  const [colunas, setColunas] = useState(4);
  const [fileiras, setFileiras] = useState(5);
  const [mapa, setMapa] = useState<AssentoComDadosCompletos[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLayoutVisible, setModalLayoutVisible] = useState(false);
  const [posSelecionada, setPosSelecionada] = useState<number | null>(null);

  const { listaAlunos, idClasseSelec } = useContext(Context);

  useEffect(() => {
    const carregarDadosCompletos = async () => {
      if (!idClasseSelec) {
        setMapa([]);
        setAlunos([]);
        return;
      }

      try {
        const alunosMapeados = listaAlunos
          ? listaAlunos.map((aluno: any) => ({
              id: aluno.idAluno,
              nome: aluno.nome,
              numero: aluno.numero,
              foto_url: aluno.foto_url,
            }))
          : [];
        setAlunos(alunosMapeados);

        const dadosDoMapa = await buscarMapaDeSala(idClasseSelec);
        let assentosDoBackend: AssentoData[] = [];

        if (dadosDoMapa && dadosDoMapa.assentos) {
          try {
            const parsedAssentos = JSON.parse(dadosDoMapa.assentos);
            if (Array.isArray(parsedAssentos)) {
              assentosDoBackend = parsedAssentos;
              setColunas(dadosDoMapa.colunas);
              setFileiras(dadosDoMapa.fileiras);
            }
          } catch (parseError) {
            console.error('Erro ao fazer JSON.parse:', parseError);
          }
        }

        if (!assentosDoBackend || assentosDoBackend.length === 0) {
          const total = colunas * fileiras;
          assentosDoBackend = Array.from({ length: total }, (_, i) => ({
            pos: i,
            alunoId: null,
          }));
        }

        const alunosPorId = new Map<string, Aluno>(
          alunosMapeados.map((aluno: any) => [aluno.id, aluno]),
        );
        const mapaComDadosCompletos = assentosDoBackend.map(
          (assento: AssentoData) => ({
            ...assento,
            aluno: assento.alunoId
              ? alunosPorId.get(assento.alunoId) ?? null
              : null,
          }),
        );

        setMapa(mapaComDadosCompletos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar o mapa de sala.');
        setMapa([]);
      }
    };
    carregarDadosCompletos();
  }, [idClasseSelec]);

  const abrirModal = (pos: number) => {
    setPosSelecionada(pos);
    setModalVisible(true);
  };

  const selecionarAluno = (alunoId: string) => {
    const novoMapa = mapa.map(item =>
      item.pos === posSelecionada
        ? { ...item, alunoId, aluno: alunos.find(a => a.id === alunoId) ?? null }
        : item,
    );
    setMapa(novoMapa);
    setModalVisible(false);
  };

  const limparAssento = () => {
    const novoMapa = mapa.map(item =>
      item.pos === posSelecionada
        ? { ...item, alunoId: null, aluno: null }
        : item,
    );
    setMapa(novoMapa);
    setModalVisible(false);
  };

  const salvarMapa = async () => {
    if (!idClasseSelec) {
      Alert.alert('Aviso', 'Selecione uma classe para salvar o mapa.');
      return;
    }
    try {
      const nomeMapa = 'Mapa Padrão';
      const assentosParaSalvar = mapa.map(item => ({
        pos: item.pos,
        alunoId: item.alunoId,
      }));
      await salvarMapaDeSala(
        idClasseSelec,
        nomeMapa,
        colunas,
        fileiras,
        assentosParaSalvar,
      );
      Alert.alert('Sucesso!', 'Mapa de sala salvo com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar mapa:', error);
      Alert.alert('Erro', 'Não foi possível salvar o mapa de sala.');
    }
  };

  // Função chamada quando o layout é alterado
  const confirmarMudancaLayout = async (novoValor: number, tipo: 'colunas' | 'fileiras') => {
    if (!idClasseSelec) {
      tipo === 'colunas' ? setColunas(novoValor) : setFileiras(novoValor);
      return;
    }

    Alert.alert(
      'Alterar layout',
      'Alterar o número de fileiras ou colunas apagará todos os assentos salvos. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await deletarMapaDeSala(idClasseSelec);
              tipo === 'colunas' ? setColunas(novoValor) : setFileiras(novoValor);

              const total = 
                (tipo === 'colunas' ? novoValor : colunas) *
                (tipo === 'fileiras' ? novoValor : fileiras);
              const novoMapa = Array.from({ length: total }, (_, i) => ({
                pos: i,
                alunoId: null,
                aluno: null,
              }));
              setMapa(novoMapa);
              Alert.alert('Mapa limpo', 'Os assentos foram redefinidos.');
            } catch (err) {
              console.error('Erro ao deletar mapa:', err);
              Alert.alert('Erro', 'Não foi possível limpar o mapa de sala.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <HeaderMapa title="Mapa de Sala" onSave={salvarMapa} />
      <FlatListClasses />
      <Divider style={styles.divider} />

      <ScrollView horizontal contentContainerStyle={styles.scrollHorizontal}>
        <FlatList
          key={colunas}
          contentContainerStyle={styles.flatListContainer}
          data={mapa}
          keyExtractor={item => item.pos.toString()}
          numColumns={colunas}
          renderItem={({ item }) => (
            <MemoizedAssento
              item={item}
              abrirModal={abrirModal}
              styles={styles}
            />
          )}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalLayoutVisible(true)}>
        <Icon name={'cog'} style={styles.fabIcon} />
      </TouchableOpacity>

      {/* MODAL DE ESCOLHER ALUNO */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione um aluno</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {alunos.map(aluno => (
                <TouchableOpacity
                  key={aluno.id}
                  onPress={() => selecionarAluno(aluno.id)}
                  style={styles.modalItem}>
                  <Text>{aluno.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={limparAssento}
              style={[styles.modalItem, styles.limparAssentoButton]}>
              <Text style={styles.limparAssentoText}>Limpar Assento</Text>
            </TouchableOpacity>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIGURAÇÃO */}
      <Modal visible={modalLayoutVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Configurar Layout</Text>

            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Colunas: {colunas}</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={colunas}
                onValueChange={value => confirmarMudancaLayout(value, 'colunas')}
                minimumTrackTintColor="#03A9F4"
                maximumTrackTintColor="#d3d3d3"
              />
            </View>

            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Fileiras: {fileiras}</Text>
              <Slider
                style={{ flex: 1 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={fileiras}
                onValueChange={value => confirmarMudancaLayout(value, 'fileiras')}
                minimumTrackTintColor="#03A9F4"
                maximumTrackTintColor="#d3d3d3"
              />
            </View>

            <Button title="Fechar" onPress={() => setModalLayoutVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// === estilos mantidos iguais ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Globais.corSecundaria },
  scrollHorizontal: { flexGrow: 1, justifyContent: 'center' },
  flatListContainer: { alignItems: 'center', justifyContent: 'center' },
  assento: {
    borderWidth: 1,
    borderColor: '#333',
    margin: 5,
    width: 120,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  assentoOcupado: { backgroundColor: 'white' },
  assentoContent: { alignItems: 'center', justifyContent: 'center', padding: 5 },
  alunoFoto: { width: 70, height: 70, borderRadius: 35, marginBottom: 4 },
  alunoTextContainer: { flexDirection: 'row', alignItems: 'center' },
  alunoNumero: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  alunoNome: { fontSize: 14, color: 'black' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: 'white', borderRadius: 10, padding: 15 },
  modalTitle: { fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginBottom: 10 },
  modalItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  limparAssentoButton: { marginTop: 10, borderWidth: 1, borderColor: '#cc0000', borderRadius: 5, alignItems: 'center' },
  limparAssentoText: { color: '#cc0000' },
  controlRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  controlLabel: { fontSize: 16, marginRight: 10 },
  fab: {
    position: 'absolute',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: Globais.corPrimaria,
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: { fontSize: 25, color: 'white' },
  divider: { backgroundColor: Globais.corPrimaria },
});

export default Mapa;
