import React, { useContext, useCallback, useRef, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AppState, Alert, ToastAndroid } from "react-native";
import { Divider } from "react-native-paper";

import { Context } from "../data/Provider";
import ModalCalendarioFrequencia from "../modais/ModalCalendarioFrequencia";
import ModalDelDataFreq from "../modais/ModalDelDataFreq";
import Globais from "../data/Globais";
import HeaderFrequencia from "../componentes/HeaderFrequencia";
import FlatListFrequencia from "../listas/FlatListFrequencia";
import FlatListClasses from "../listas/FlatListClasses";
import FabFrequencia from "../componentes/FabFrequencia";
import ConexaoInternet from "../componentes/ConexaoInternet";
import { atualizarAtividades } from "../banco_dados/atualizarBD"

const Frequencia = () => {
    const dataTempRef = useRef('')
    const textoAtividadesRef = useRef('')
    const { dataSelec, setModalCalendarioFreq, idUsuario, idPeriodoSelec, idClasseSelec,
        nomePeriodoSelec, setFlagLongPressDataFreq, setDataSelec, textoAtividades } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            return () => {
                atualizarAtividades(textoAtividadesRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTempRef.current)
                setDataSelec('')
            };
        }, [])
    );

    useEffect(() => {
        //monitoramento do app, se fechado ele chama a função para salvar as atividades.
        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'background' && textoAtividadesRef.current !== undefined) {
                atualizarAtividades(textoAtividadesRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTempRef.current)
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    function onChangeAtividades(text: string) {
        // mantem cópia do texto e dataSelec para salvar quando troca de aba
        textoAtividadesRef.current = text
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
        <TouchableOpacity onPress={() => setFlagLongPressDataFreq(false)} activeOpacity={1}>
            <Text style={styles.textLoad}>
                {nomePeriodoSelec != undefined ? 'Período: ' + nomePeriodoSelec : 'Selecione um período'}
            </Text>
            <FlatListClasses />
            <Divider style={styles.divider} />
            <View style={styles.containerText}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalCalendarioFreq(true)}
                    onLongPress={() => setFlagLongPressDataFreq(true)}>
                    <Text style={styles.text} >
                        {formatarData(dataSelec)}
                    </Text>
                </TouchableOpacity>
            </View>
            {dataSelec && (
                <View style={styles.containerInput}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            multiline
                            placeholder="Descreva as atividades realizadas..."
                            onChangeText={(text) => onChangeAtividades(text)}
                            defaultValue={textoAtividades}
                            style={styles.textInput}
                        />
                        <TouchableOpacity
                            style={styles.saveButtonInside}
                            onPress={() => {
                                if (textoAtividadesRef.current.trim() === '') {
                                    ToastAndroid.show('Por favor, preencha a atividade antes de salvar.',ToastAndroid.SHORT);
                                } else {
                                    atualizarAtividades(
                                        textoAtividadesRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataTempRef.current
                                    );
                                    ToastAndroid.show('Atividade salva com sucesso!',ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Text style={styles.saveButtonTextInside}>Salvar{'\n'} Atividade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderFrequencia title="Frequência" />
            <ConexaoInternet />
            <FlatListFrequencia
                ListHeaderComponent={renderHeader}
                data={[]}
                renderItem={() => null}
                contentContainerStyle={styles.listContent}
            />
            <ModalCalendarioFrequencia />
            <ModalDelDataFreq />
            <FabFrequencia />
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
        flexDirection: 'row',
        justifyContent: 'center',
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
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textLoad: {
        fontSize: 24,
        color: Globais.corTextoClaro,
        textAlign: 'center',
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
        right: 10,
        bottom: 10,
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

export default Frequencia;
