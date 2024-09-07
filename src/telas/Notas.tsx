import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData } from "react-native"
import { Context } from "../data/Provider";
import { Divider } from "react-native-paper";

import ModalCalendarioNota from "../modais/ModalCalendarioNota";
import ModalDelDataNotas from "../modais/ModalDelDataNotas";
import Globais from "../data/Globais";
import FlatListClasses from "../listas/FlatListClasses";
import firestore from '@react-native-firebase/firestore';
import HeaderNotas from "../componentes/HeaderNotas";
import FlatListNotas from "../listas/FlatListNotas";
import FabNotas from "../componentes/FabNotas";

const Notas = () => {

    let datas: any[] = [];

    const { dataSelec, setModalCalendarioNota, idClasseSelec,
        idPeriodoSelec, idUsuario, setIdPeriodoSelec, setDataSelec,
        setIdClasseSelec, setValueAtividade, valueAtividade,
        setFlagLongPressDataNotas, nomePeriodoSelec, tecladoAtivo } = useContext(Context);

    let dataAno = '', dataMes = '', dataDia = '', data = ''

    let datasNotasRef = firestore().collection(idUsuario)
        .doc(idPeriodoSelec).collection('Classes')
        .doc(idClasseSelec).collection('DatasNotas')

    if (dataSelec != '') {
        dataAno = dataSelec.slice(0, 4);
        dataMes = dataSelec.slice(5, 7);
        dataDia = dataSelec.slice(8, 10);
        data = dataDia + '/' + dataMes + '/' + dataAno
    }

    const onChangeInputAtividades = (text: String) => {
        datasNotasRef.doc(dataSelec).set({ avaliacao: text })
        setValueAtividade({ avaliacao: text })
    }

    useEffect(() => {
        //recuperar dados dos estados do app
        firestore().collection(idUsuario)
            .doc('EstadosApp').onSnapshot(snapShot => {
                setIdPeriodoSelec(snapShot.data()?.idPeriodo)
                setIdClasseSelec(snapShot.data()?.idClasse)
                setDataSelec(snapShot.data()?.data)
            })
    }, [])

    useEffect(() => {
        const data = async () => {
            //Recuperar o título das avaliações da data selecionada no BD.
            datasNotasRef.doc(dataSelec).get().then((snapshot) => {
                snapshot.exists ?
                    setValueAtividade(snapshot.data()) : setValueAtividade('')
            }).catch((erro) => {
                console.error(erro);
            })
        }
        data()
    }, [dataSelec]);

    const renderData = () => {
        if (data != '') {
            return (
                <TouchableOpacity
                    onPress={() => [setModalCalendarioNota(true), setFlagLongPressDataNotas(false)]}
                    onLongPress={() => setFlagLongPressDataNotas(true)}>
                    <Text style={styles.text}>{data}</Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={styles.container}>
            <HeaderNotas title="Frequência"></HeaderNotas>
            <Text style={styles.textLoad}>{nomePeriodoSelec != undefined ? 'Período: ' + nomePeriodoSelec : 'Selecione um período'}</Text>
            <Divider style={styles.divider}></Divider>
            <FlatListClasses></FlatListClasses>
            <Divider style={styles.divider}></Divider>
            <View style={styles.containerText}>
                {renderData()}
            </View>
            <Divider style={styles.divider}></Divider>
            <View style={styles.containerInput}>
                {dataSelec != '' ?
                    <TextInput
                        multiline
                        placeholder="Título da avaliação..."
                        onChangeText={onChangeInputAtividades}
                        value={valueAtividade.avaliacao}
                        style={styles.textInput}></TextInput> : null}
            </View>
            <FlatListNotas></FlatListNotas>
            <ModalCalendarioNota></ModalCalendarioNota>
            <ModalDelDataNotas></ModalDelDataNotas>
            <View style={{ display: tecladoAtivo }}>
                <FabNotas></FabNotas>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Globais.corSecundaria,
        flex: 1,
    },
    containerText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    text: {
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        padding: 5,
        color: Globais.corTextoEscuro,
    },
    divider: {
        backgroundColor: Globais.corPrimaria,
    },
    textInput: {
        width: '90%',
        backgroundColor: Globais.corTextoClaro
    },
    containerInput: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textLoad: {
        fontSize: 24,
        color: Globais.corTextoClaro,
    }
});

export default Notas;