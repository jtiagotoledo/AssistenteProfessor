import React, { useContext, useState } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import firestore from '@react-native-firebase/firestore';
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';

const NovaConta = ({ navigation }: any) => {
    const { email, setEmail, senha, setSenha, setIdUsuario } = useContext(Context);
    const [senhaVisivel, setSenhaVisivel] = useState(false); // Estado para alternar a visibilidade da senha
    const { t } = useTranslation();

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
        if (email && senha) {
            auth()
                .createUserWithEmailAndPassword(email, senha)
                .then(() => {
                    ToastAndroid.show(t('msg_014'), ToastAndroid.SHORT)
                    navigation.reset({ index: 0, routes: [{ name: "App" }] })
                    setIdUsuario(email)
                    criarCaminhoSalvarEstados()
                }).catch(error => {

                    if (error.code === 'auth/email-already-in-use') {
                        ToastAndroid.show(t('msg_015'), ToastAndroid.SHORT)
                    }
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show(t('msg_010'), ToastAndroid.SHORT)
                    }
                    if (error.code === 'auth/weak-password') {
                        ToastAndroid.show(t('msg_016'), ToastAndroid.SHORT)
                    }
                });
        } else {
            ToastAndroid.show(t('msg_003'), ToastAndroid.SHORT)
        }
    }

    const onChangeInputEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEmail(event.nativeEvent.text);
    }

    const onChangeInputSenha = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSenha(event.nativeEvent.text);
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
            </View>
            <TextInput
                style={styles.textInput}
                onChange={onChangeInputEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                placeholder={t('Digite um Email válido')}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.textInputPassword}
                    onChange={onChangeInputSenha}
                    autoCapitalize='none'
                    secureTextEntry={!senhaVisivel}
                    autoCorrect={false}
                    placeholder={t('Crie uma senha')}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                    <Icon
                        name={senhaVisivel ? "eye-off" : "eye"}
                        size={24}
                        color={Globais.corPrimaria}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={criarConta}>
                <Text style={styles.buttonText}>{t('Criar conta')}</Text>
            </TouchableOpacity>
            <View style={styles.containerText}>
                <Text style={styles.text} onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }]
                })}>{t('Já possui uma conta?')}</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
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
        borderRadius: 10,
        padding: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Globais.corSecundaria,
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    textInputPassword: {
        flex: 1,
        paddingVertical: 10,
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
