import React, { useContext } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
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

const Frequencia = () => {
    const { dataSelec, setModalCalendarioFreq, valueAtividade, setValueAtividade,
        nomePeriodoSelec, setFlagLongPressDataFreq } = useContext(Context);

    function formatarData(data:String) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    const renderHeader = () => (
        <TouchableOpacity onPress={() => setFlagLongPressDataFreq(false)}  activeOpacity={1}>
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
                        value={valueAtividade.atividade}
                        onChangeText={(text) => setValueAtividade({ atividade: text })}
                        style={styles.textInput}
                    />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderFrequencia title="Frequência" />
            <ConexaoInternet />
            <Text style={styles.textLoad}>
                {nomePeriodoSelec != undefined ? 'Período: ' + nomePeriodoSelec : 'Selecione um período'}
            </Text>
            <FlatListClasses />
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
});

export default Frequencia;
