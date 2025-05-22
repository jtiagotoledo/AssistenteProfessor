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
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { atualizarTitulo } from '../services/datasNotas';

const Notas = () => {
    const { dataSelec, setModalCalendarioNota, nomePeriodoSelec, setFlagLongPressDataNotas,
        textoTituloNotas, setTextoTituloNotas, idDataNota } = useContext(Context);
    const { t } = useTranslation();
    let titulo = ''

    useEffect(() => {
        setTextoTituloNotas('')
    }, [dataSelec]);

    function onChangeTituloNotas(text: string) {
        titulo = text
    }

    function formatarData(data: String) {
        if (typeof data === "string" && data.includes("-")) {
            const [ano, mes, dia] = data.split("-");
            if (i18n.language == 'pt') return `${dia}/${mes}/${ano}`;
            if (i18n.language == 'en') return `${mes}/${dia}/${ano}`;
        } else {
            return t("Selecione uma data") + '...'
        }
    }

    const renderHeader = () => (
        <TouchableOpacity onPress={() => setFlagLongPressDataNotas(false)} activeOpacity={1}>
            <Text style={styles.textLoad}>
                {nomePeriodoSelec != undefined ? t("Período") + ": " + nomePeriodoSelec : t('Selecione um período') + "..."}
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
                            placeholder={t('Título da avaliação') + "..."}
                            onChangeText={(text) => onChangeTituloNotas(text)}
                            defaultValue={textoTituloNotas}
                            style={styles.textInput}
                        />
                        <TouchableOpacity
                            style={styles.saveButtonInside}
                            onPress={async () => {
                                if (titulo.trim() === '') {
                                    ToastAndroid.show(t('msg_019'), ToastAndroid.SHORT);
                                } else {
                                    try {
                                        console.log('idDataNota',idDataNota,'titulo',titulo);
                                        
                                        const resultado = await atualizarTitulo(idDataNota, titulo);
                                        console.log('Atividade atualizada:', resultado);
                                        ToastAndroid.show(t("msg_018"), ToastAndroid.SHORT);
                                    } catch (erro) {
                                        console.error('Erro ao atualizar atividade:', erro);
                                    }

                                    ToastAndroid.show(t('msg_020'), ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Text style={styles.saveButtonTextInside}>{t('Salvar')}{'\n'} {t('Avaliação')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderNotas title={t('Notas')} />
            <ConexaoInternet />
            <FlatListNotas
                ListHeaderComponent={renderHeader}
                data={[]}
                renderItem={() => null}
                contentContainerStyle={styles.listContent}
            />
            <ModalCalendarioNota />
            <ModalDelDataNotas />
            <FabNotas onPress={() => null} />
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
