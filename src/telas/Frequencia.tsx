import React, { useContext } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Divider } from "react-native-paper";

import { Context } from "../data/Provider";
import ModalCalendarioFrequencia from "../modais/ModalCalendarioFrequencia";
import ModalDelDataFreq from "../modais/ModalDelDataFreq";
import Globais from "../data/Globais";
import HeaderFrequencia from "../componentes/HeaderFrequencia";
import FlatListFrequencia from "../listas/FlatListFrequencia";
import FlatListClasses from "../listas/FlatListClasses";
import FabFrequencia from "../componentes/FabFrequencia";

const Frequencia = () => {
    const { dataSelec, setModalCalendarioFreq, valueAtividade, setValueAtividade, nomePeriodoSelec } = useContext(Context);

    const renderHeader = () => (
        <>
            <Text style={styles.textLoad}>
                {nomePeriodoSelec != undefined ? 'Período: ' + nomePeriodoSelec : 'Selecione um período'}
            </Text>
            <FlatListClasses />
            <Divider style={styles.divider} />
            <View style={styles.containerText}>
                <Text
                    style={styles.text}
                    onPress={() => setModalCalendarioFreq(true)}>
                    {dataSelec || 'Selecione uma data'}
                </Text>
            </View>
            <Divider style={styles.divider} />
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
        </>
    );

    return (
        <View style={styles.container}>
            <HeaderFrequencia title="Frequência" />
            <FlatListFrequencia
                ListHeaderComponent={renderHeader}
                // Defina os dados e o renderItem da FlatListFrequencia
                data={[]} // Substitua pelos seus dados
                renderItem={() => null} // Substitua pela sua lógica de renderização
                contentContainerStyle={styles.listContent}
            />
            {/* Modais e FAB */}
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
        fontSize: 20,
        padding: 5,
        color: Globais.corTextoEscuro,
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
