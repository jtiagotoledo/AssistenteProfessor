import React, { useContext, useCallback, useRef, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AppState } from "react-native";
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
        nomePeriodoSelec, setFlagLongPressDataFreq, setDataSelec } = useContext(Context);

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
                    <TextInput
                        multiline
                        placeholder="Descreva as atividades realizadas..."
                        onChangeText={(text) => onChangeAtividades(text)}
                        style={styles.textInput}
                        onBlur={() => atualizarAtividades(textoAtividadesRef.current, idUsuario, idPeriodoSelec, idClasseSelec, dataSelec)}
                    />
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
    textInput: {
        width: '90%',
        backgroundColor: Globais.corTextoClaro,
        padding: 8,
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
    saveButton: {
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Frequencia;
