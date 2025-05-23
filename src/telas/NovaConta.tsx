import React, { useContext, useState } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import firestore from '@react-native-firebase/firestore';
import ConexaoInternet from "../componentes/ConexaoInternet";
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import { criarProfessor } from '../services/professores';

const NovaConta = ({ navigation }: any) => {
    const { nome, setNome, email, setEmail, senha, setSenha, setIdUsuario, setRecarregarDadosProfessor } = useContext(Context);
    const [senhaVisivel, setSenhaVisivel] = useState(false); // Estado para alternar a visibilidade da senha
    const [loading, setLoading] = useState(false);
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

    const criarConta = async () => {
        if (email && senha && nome) {
            try {
                setLoading(true);
                const userCredential = await auth().createUserWithEmailAndPassword(email, senha);
                const uuid = userCredential.user.uid;
                const foto = ''

                setIdUsuario(email);
                criarCaminhoSalvarEstados();
                const result = await criarProfessor({ nome, email, uuid, foto }); //servidor ubuntu
                setRecarregarDadosProfessor((prev: any) => !prev)
                navigation.reset({ index: 0, routes: [{ name: "App" }] });

                ToastAndroid.show(t('msg_014'), ToastAndroid.SHORT);
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    ToastAndroid.show(t('msg_015'), ToastAndroid.SHORT);
                } else if (error.code === 'auth/invalid-email') {
                    ToastAndroid.show(t('msg_010'), ToastAndroid.SHORT);
                } else if (error.code === 'auth/weak-password') {
                    ToastAndroid.show(t('msg_016'), ToastAndroid.SHORT);
                } else if (error.code === 'auth/network-request-failed') {
                    ToastAndroid.show(t('msg_035'), ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(t('msg_001'), ToastAndroid.SHORT); // mensagem genérica
                    console.error("Erro ao criar conta:", error);
                }
            } finally {
                setLoading(false);
            }
        } else {
            ToastAndroid.show(t('msg_003'), ToastAndroid.SHORT);
        }
    };

    const onChangeInputNome = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setNome(event.nativeEvent.text);
    }

    const onChangeInputEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEmail(event.nativeEvent.text);
    }

    const onChangeInputSenha = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSenha(event.nativeEvent.text);
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <ConexaoInternet />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                    />
                </View>
                <TextInput
                    style={styles.textInput}
                    onChange={onChangeInputNome}
                    keyboardType='default'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder={t('Digite seu nome')}
                />
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
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : null}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 24,
        marginRight: 24,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
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
