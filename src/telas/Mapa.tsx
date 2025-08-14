import React, { useContext, useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, StatusBar } from "react-native";
import { Context } from "../data/Provider";
import FlatListClasses from "../listas/FlatListClasses";
import Globais from "../data/Globais";
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';

// Definição dos tipos
type Assento = { pos: number; alunoId: string | null; };
type Aluno = { id: string; nome: string; };

const Mapa = () => {
    // ... Estados do componente
    const [colunas, setColunas] = useState(4);
    const [fileiras, setFileiras] = useState(5);
    const [mapa, setMapa] = useState<Assento[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLayoutVisible, setModalLayoutVisible] = useState(false);
    const [posSelecionada, setPosSelecionada] = useState<number | null>(null);

    // Contexto (substitua com seus próprios dados, se necessário)
    const { dataSelec, setModalCalendarioNota, nomePeriodoSelec, setFlagLongPressDataNotas,
          textoTituloNotas, setTextoTituloNotas, idDataNota } = useContext(Context);

    useEffect(() => {
        const total = colunas * fileiras;
        const inicial = Array.from({ length: total }, (_, i) => ({ pos: i, alunoId: null }));
        setMapa(inicial);
        setAlunos([
            { id: '1', nome: 'João' },
            { id: '2', nome: 'Maria' },
            { id: '3', 'nome': 'Pedro' },
            { id: '4', nome: 'Ana' },
        ]);
    }, [colunas, fileiras]);

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

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: StatusBar.currentHeight }} />

            <FlatListClasses />

            <ScrollView horizontal={true} contentContainerStyle={styles.scrollHorizontal}>
                <FlatList
                    key={colunas}
                    contentContainerStyle={styles.flatListContainer}
                    data={mapa}
                    keyExtractor={(item) => item.pos.toString()}
                    numColumns={colunas}
                    renderItem={({ item }) => {
                        const aluno = alunos.find(a => a.id === item.alunoId);
                        return (
                            <TouchableOpacity
                                onPress={() => abrirModal(item.pos)}
                                style={[styles.assento, aluno && styles.assentoOcupado]}
                            >
                                <Text style={styles.assentoText}>{aluno ? aluno.nome : "Vazio"}</Text>
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
                        {/* Slider para Colunas */}
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
        padding: 10,
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
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    assentoOcupado: {
        backgroundColor: '#d0f0c0',
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
});

export default Mapa;