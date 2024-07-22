import React, { useContext } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import firestore from '@react-native-firebase/firestore';
import Globais from '../data/Globais';

const NovaConta = ({ navigation }: any) => {
    const { email, setEmail, senha, setSenha, setIdUsuario } = useContext(Context);

    const criarCaminhoSalvarEstados = () => {
        firestore().collection(email)
            .doc('EstadosApp').set({
                idPeriodo: '',
                periodo: '',
                idClasse: '',
                classe: '',
                data: '',
                aba: 'Classes'
            })
    }

    const criarConta = () => {
        auth()
            .createUserWithEmailAndPassword(email, senha)
            .then(() => {
                ToastAndroid.show('Conta criada com sucesso', ToastAndroid.SHORT)
                navigation.reset({ index: 0, routes: [{ name: "App" }] })
                setIdUsuario(email)
                criarCaminhoSalvarEstados()
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    ToastAndroid.show('Este Email já está em uso', ToastAndroid.SHORT)
                }
                if (error.code === 'auth/invalid-email') {
                    ToastAndroid.show('Email inválido', ToastAndroid.SHORT)
                }
            });
    }

    const onChangeInputEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEmail(event.nativeEvent.text);
    }

    const onChangeInputSenha = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSenha(event.nativeEvent.text);
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
            </View>
            <TextInput style={styles.textInput}
                onChange={onChangeInputEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Digite um Email válido'></TextInput>
            <TextInput style={styles.textInput}
                onChange={onChangeInputSenha}
                autoCapitalize='none'
                secureTextEntry={true}
                autoCorrect={false}
                placeholder='Crie uma senha'></TextInput>
            <TouchableOpacity
                style={styles.button}
                onPress={criarConta}>
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
            <View style={styles.containerText}>
                <Text style={styles.text} onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }]
                })}>Já possui uma conta?</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 24,
        marginRight: 24,
    },
    containerText: {
        alignItems: 'center'
    },
    textInput: {
        backgroundColor: Globais.corSecundaria,
        marginBottom: 8,
        borderRadius: 10
    },
    text: {
        color: Globais.corPrimaria,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginBottom: 16,
    },
    logoContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        backgroundColor: Globais.corPrimaria,
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default NovaConta;