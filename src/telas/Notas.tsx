import React, { useContext, useCallback, useRef, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AppState, ToastAndroid } from "react-native";
import { Divider } from "react-native-paper";

import { Context } from "../data/Provider";
import ModalCalendarioNota from "../modais/ModalCalendarioNota";
import ModalDelDataNotas from "../modais/ModalDelDataNotas";
import Globais from "../data/Globais";
import FlatListNotas from "../listas/FlatListNotas";
import FlatListClasses from "../listas/FlatListClasses";
import FabNotas from "../componentes/FabNotas";
import HeaderNotas from "../componentes/HeaderNotas";
import ConexaoInternet from "../componentes/ConexaoInternet";
import { atualizarNotas } from "../banco_dados/atualizarBD"
import { atualizarTituloNotas } from "../banco_dados/atualizarBD"

const Notas = () => {
    const dataTempRef = useRef('')
    const textoTituloNotasRef = useRef('')
    const listaNotasRef = useRef({})
    const [dataTemp, setDataTemp] = useState()
    const { dataSelec, setModalCalendarioNota, setDataSelec,
        nomePeriodoSelec, setFlagLongPressDataNotas, textoTituloNotas,
        listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, valueNota } = useContext(Context);

    const onPressFab = () => {
        atualizarNotas(listaNotas, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)
    }

    useEffect(() => {
        //mantem uma cópia da lista de notas para salvar quando a aba é trocada
        listaNotasRef.current = listaNotas
    }, [valueNota])

    useFocusEffect(
        useCallback(() => {
            setDataTemp(dataSelec)
            return () => {
                atualizarNotas(listaNotasRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTemp)
                atualizarTituloNotas(textoTituloNotasRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTempRef.current)
                setDataSelec('')
            };
        }, [])
    );

    useEffect(() => {
        //monitoramento do app, se fechado ele chama a função para salvar o título das notas.
        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'background' && textoTituloNotasRef.current !== undefined) {
                atualizarTituloNotas(textoTituloNotasRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTempRef.current)
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    function onChangeTituloNotas(text: string) {
        // mantem cópia do texto e dataSelec para salvar quando troca de aba
        textoTituloNotasRef.current = text
        dataTempRef.current = dataSelec
    }

    function formatarData(data: String) {
        if (typeof data === "string" && data.includes("-")) {
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}/${ano}`;
        } else {
            return 'Selecione uma data...'
        }
    }

    const renderHeader = () => (
        <TouchableOpacity onPress={() => setFlagLongPressDataNotas(false)} activeOpacity={1}>
            <Text style={styles.textLoad}>
                {nomePeriodoSelec ? `Período: ${nomePeriodoSelec}` : "Selecione um período"}
            </Text>
            <FlatListClasses />
            <Divider style={styles.divider} />
            <View style={styles.containerText}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalCalendarioNota(true)}
                    onLongPress={() => setFlagLongPressDataNotas(true)}>
                    <Text style={styles.text}>
                        {formatarData(dataSelec)}
                    </Text>
                </TouchableOpacity>
            </View>
            {dataSelec && (
                <View style={styles.containerInput}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            multiline
                            placeholder="Título da avaliação..."
                            onChangeText={(text) => onChangeTituloNotas(text)}
                            defaultValue={textoTituloNotas}
                            style={styles.textInput}
                        />
                        <TouchableOpacity
                            style={styles.saveButtonInside}
                            onPress={() => {
                                if (textoTituloNotasRef.current.trim() === '') {
                                    ToastAndroid.show('Por favor, preencha a atividade antes de salvar.', ToastAndroid.SHORT);
                                } else {
                                    atualizarTituloNotas(
                                        textoTituloNotasRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec
                                    );
                                    ToastAndroid.show('Atividade salva com sucesso!', ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Text style={styles.saveButtonTextInside}>Salvar{'\n'} título</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderNotas title="Notas" />
            <ConexaoInternet />
            <FlatListNotas
                ListHeaderComponent={renderHeader}
                data={[]}
                renderItem={() => null}
                contentContainerStyle={styles.listContent}
            />
            <ModalCalendarioNota />
            <ModalDelDataNotas />
            <FabNotas onPress={() => onPressFab()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Globais.corSecundaria,
    },
    listContent: {
        flexGrow: 1,
    },
    containerText: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 16,
    },
    text: {
        fontSize: 24,
        padding: 5,
        color: Globais.corTextoClaro,
    },
    divider: {
        backgroundColor: Globais.corPrimaria,
    },
    containerInput: {
        marginVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
    },
    textLoad: {
        fontSize: 24,
        color: Globais.corTextoClaro,
        textAlign: "center",
    },
    inputWrapper: {
        width: '90%',
    },
    textInput: {
        width: '100%',
        backgroundColor: Globais.corTextoClaro,
        padding: 8,
        paddingRight: 80, // Deixa espaço para o botão "Salvar"
        fontSize: 16,
        borderRadius: 5,
    },
    saveButtonInside: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        backgroundColor: Globais.corSecundaria, // Cor do botão
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonTextInside: {
        color: Globais.corTextoClaro, // Cor do texto
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center', // Centraliza o texto dentro do botão
        flexWrap: 'wrap',
    },
});

export default Notas;
