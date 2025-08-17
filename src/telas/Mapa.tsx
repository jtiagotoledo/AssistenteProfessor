import React, { useContext, useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, StatusBar, Image, Alert } from "react-native";
import { Context } from "../data/Provider";
import FlatListClasses from "../listas/FlatListClasses";
import Globais from "../data/Globais";
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import HeaderMapa from "../componentes/HeaderMapa";
import { Divider } from "react-native-paper";
import { buscarMapaDeSala, salvarMapaDeSala } from "../services/mapaSala"; // Importe os novos serviços

type Assento = { pos: number; alunoId: string | null; };
type Aluno = { id: string; nome: string; numero: number; foto_url: string; };

const Mapa = () => {
    const [colunas, setColunas] = useState(4);
    const [fileiras, setFileiras] = useState(5);
    const [mapa, setMapa] = useState<Assento[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLayoutVisible, setModalLayoutVisible] = useState(false);
    const [posSelecionada, setPosSelecionada] = useState<number | null>(null);

    // Assumindo que idClasseSelec e listaAlunos estão no seu contexto
    const { listaAlunos, idClasseSelec } = useContext(Context);

    // useEffect para carregar os alunos do contexto
    useEffect(() => {
        if (listaAlunos && listaAlunos.length > 0) {
            const alunosMapeados = listaAlunos.map((aluno: any) => ({
                id: aluno.idAluno,
                nome: aluno.nome,
                numero: aluno.numero,
                foto_url: aluno.foto_url,
            }));
            setAlunos(alunosMapeados);
        }
    }, [listaAlunos]);

    // Novo useEffect para carregar o mapa do back-end
    useEffect(() => {
        const carregarMapa = async () => {
            if (!idClasseSelec) return; // Não faz nada se a classe não estiver selecionada

            try {
                const dadosDoMapa = await buscarMapaDeSala(idClasseSelec);

                if (dadosDoMapa) {
                    const assentosCarregados = JSON.parse(dadosDoMapa.assentos);
                    console.log("Dados do mapa recebidos:", dadosDoMapa);
                    console.log("Array de assentos parseado:", assentosCarregados);

                    setColunas(dadosDoMapa.colunas);
                    setFileiras(dadosDoMapa.fileiras);
                    setMapa(assentosCarregados);
                } else {
                    // Inicializa com o layout padrão se nenhum mapa for encontrado
                    const total = colunas * fileiras;
                    const inicial = Array.from({ length: total }, (_, i) => ({ pos: i, alunoId: null }));
                    setMapa(inicial);
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar o mapa de sala. Tentando iniciar com padrão.');
                const total = colunas * fileiras;
                const inicial = Array.from({ length: total }, (_, i) => ({ pos: i, alunoId: null }));
                setMapa(inicial);
            }
        };
        carregarMapa();
    }, [idClasseSelec]); // Dependência: recarrega quando a classe selecionada muda

    const abrirModal = (pos: number) => {
        setPosSelecionada(pos);
        setModalVisible(true);
    };

    const selecionarAluno = (alunoId: string) => {
        const novoMapa = mapa.map(item =>
            item.pos === posSelecionada ? { ...item, alunoId } : item
        );
        setMapa(novoMapa);
        setModalVisible(false);
    };

   // Nova função para salvar o mapa
const salvarMapa = async () => {
    if (!idClasseSelec) {
        Alert.alert('Aviso', 'Selecione uma classe para salvar o mapa.');
        return;
    }

    try {
        const nomeMapa = "Mapa Padrao"; 

        await salvarMapaDeSala(idClasseSelec, nomeMapa, colunas, fileiras, mapa);

        Alert.alert('Sucesso!', 'Mapa de sala salvo com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar mapa:', error);
        Alert.alert('Erro', 'Não foi possível salvar o mapa de sala.');
    }
};

    return (
        <View style={styles.container}>
            <HeaderMapa title="Mapa de Sala"></HeaderMapa>
            <FlatListClasses />
            <Divider style={styles.divider}></Divider>

            <View style={styles.buttonContainer}>
                <Button title="Salvar Organização" onPress={salvarMapa} />
            </View>

            <ScrollView horizontal={true} contentContainerStyle={styles.scrollHorizontal}>
                <FlatList
                    key={colunas}
                    contentContainerStyle={styles.flatListContainer}
                    data={mapa}
                    keyExtractor={(item) => (item && item.pos !== undefined) ? item.pos.toString() : `placeholder-${Math.random()}`}
                    numColumns={colunas}
                    renderItem={({ item }) => {
                        const aluno = alunos.find(a => a.id === item.alunoId);
                        return (
                            <TouchableOpacity
                                onPress={() => abrirModal(item.pos)}
                                style={[styles.assento, aluno && styles.assentoOcupado]}
                            >
                                {aluno ? (
                                    <View style={styles.assentoContent}>
                                        <Image
                                            source={{ uri: aluno.foto_url }}
                                            style={styles.alunoFoto}
                                        />
                                        <View style={styles.alunoTextContainer}>
                                            <Text style={styles.alunoNumero}>{aluno.numero}</Text>
                                            <Text style={styles.alunoNome} numberOfLines={3}>{aluno.nome}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.assentoText}>Vazio</Text>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalLayoutVisible(true)}
            >
                <Icon name={'cog'} style={styles.fabIcon} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Selecione um aluno</Text>
                        {alunos.map(aluno => (
                            <TouchableOpacity
                                key={aluno.id}
                                onPress={() => selecionarAluno(aluno.id)}
                                style={styles.modalItem}
                            >
                                <Text>{aluno.nome}</Text>
                            </TouchableOpacity>
                        ))}
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal visible={modalLayoutVisible} transparent={true} animationType="slide">
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
                                onValueChange={value => setColunas(value)}
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
                                onValueChange={value => setFileiras(value)}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Globais.corSecundaria,
    },
    buttonContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    scrollHorizontal: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    flatListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        elevation: 2,
    },
    assentoOcupado: {
        backgroundColor: 'white',
    },
    assentoContent: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    alunoFoto: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 4,
        resizeMode: 'cover',
    },
    alunoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alunoNumero: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    alunoNome: {
        fontSize: 14,
        textAlign: 'center',
        flexShrink: 1,
        color: 'black',
    },
    assentoText: {
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    controlLabel: {
        fontSize: 16,
        marginRight: 10,
        minWidth: 80,
    },
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabIcon: {
        fontSize: 25,
        color: 'white',
    },
    divider: {
        backgroundColor: Globais.corPrimaria,
    },
});

export default Mapa;