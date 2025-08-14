import React, { useContext, useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal } from "react-native";
import { Context } from "../data/Provider";
import Globais from "../data/Globais";

type Assento = { pos: number; alunoId: string | null; };
type Aluno = { id: string; nome: string; };

const Mapa = () => {
    const [colunas, setColunas] = useState(4);
    const [fileiras, setFileiras] = useState(5);
    const [mapa, setMapa] = useState<Assento[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [posSelecionada, setPosSelecionada] = useState<number | null>(null);

    const { dataSelec, setModalCalendarioNota, nomePeriodoSelec, setFlagLongPressDataNotas,
          textoTituloNotas, setTextoTituloNotas, idDataNota } = useContext(Context);

    useEffect(() => {
        const total = colunas * fileiras;
        const inicial = Array.from({ length: total }, (_, i) => ({ pos: i, alunoId: null }));
        setMapa(inicial);
        // Exemplo de alunos para testar a centralização
        setAlunos([
            { id: '1', nome: 'João' },
            { id: '2', nome: 'Maria' },
            { id: '3', nome: 'Pedro' },
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
            <View style={styles.mapaWrapper}>
                <FlatList
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
            </View>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Globais.corSecundaria,
        padding: 10,
    },
    mapaWrapper: {
        flex: 1, 
        alignItems: 'center', 
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
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

export default Mapa;