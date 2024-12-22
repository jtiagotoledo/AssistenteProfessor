import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Divider } from "react-native-paper";

import { Context } from "../data/Provider";
import ModalCalendarioNota from "../modais/ModalCalendarioNota";
import ModalDelDataNotas from "../modais/ModalDelDataNotas";
import Globais from "../data/Globais";
import FlatListNotas from "../listas/FlatListNotas";
import FlatListClasses from "../listas/FlatListClasses";
import FabNotas from "../componentes/FabNotas";
import HeaderNotas from "../componentes/HeaderNotas";

const Notas = () => {
    const {
        dataSelec, setModalCalendarioNota, valueAtividade,
        setValueAtividade, nomePeriodoSelec, setFlagLongPressDataNotas,
    } = useContext(Context);

    function formatarData(data:String) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    const renderHeader = () => (
        <TouchableOpacity onPress={() => setFlagLongPressDataNotas(false)}  activeOpacity={1}>
            <Text style={styles.textLoad}>
                {nomePeriodoSelec ? `Período: ${nomePeriodoSelec}` : "Selecione um período"}
            </Text>
            <FlatListClasses />
            <Divider style={styles.divider} />
            <View style={styles.containerText}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalCalendarioNota(true)}
                    onLongPress={()=>setFlagLongPressDataNotas(true)}>
                    <Text style={styles.text}>
                        {formatarData(dataSelec)|| 'Selecione uma data'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Divider style={styles.divider} />
            {dataSelec && (
                <View style={styles.containerInput}>
                    <TextInput
                        multiline
                        placeholder="Título da avaliação..."
                        value={valueAtividade.avaliacao}
                        onChangeText={(text) => setValueAtividade({ avaliacao: text })}
                        style={styles.textInput}
                    />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderNotas title="Notas" />
            <FlatListNotas
                ListHeaderComponent={renderHeader}
                data={[]}
                renderItem={() => null} 
                contentContainerStyle={styles.listContent}
            />
            <ModalCalendarioNota />
            <ModalDelDataNotas />
            <FabNotas />
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
    textInput: {
        width: "90%",
        backgroundColor: Globais.corTextoClaro,
        padding: 8,
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
});

export default Notas;
