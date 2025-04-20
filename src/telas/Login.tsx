import React, { useContext, useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, SignInResponse } from '@react-native-google-signin/google-signin';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const Login = ({ navigation }: any) => {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const { email, setEmail, senha, setSenha } = useContext(Context);
    const { t } = useTranslation();
    i18n.changeLanguage('en');

    useEffect(() => {
        const setupGoogleSignin = async () => {
            try {
                GoogleSignin.configure({
                    webClientId: '1000578379733-ahmcfl9ot3gn7p87c1ed4v3ejinhvkii.apps.googleusercontent.com',
                });
                console.log('GoogleSignin configurado com sucesso!');
            } catch (error: any) {
                console.error('Erro ao configurar GoogleSignin:', error.message);
            }
        };

        setupGoogleSignin();
    }, []);

    const entrarConta = () => {
        if (email && senha) {
            auth()
                .signInWithEmailAndPassword(email, senha)
                .then(() => {
                    console.log('Usuário logado com email e senha!');
                    navigation.reset({ index: 0, routes: [{ name: "App" }] });
                }).catch(error => {
                    console.error('Erro ao logar com email e senha:', error);
                    if (error.code === 'auth/invalid-credential') {
                        ToastAndroid.show('Este e-mail não está cadastrado ou senha incorreta', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Erro ao logar: ' + error.message, ToastAndroid.SHORT);
                    }
                });
        } else {
            ToastAndroid.show('Email e senha devem ser preenchidos', ToastAndroid.SHORT);
        }
    };

    const loginComGoogle = async () => {
        try {
            console.log('Tentando login com Google...');
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const result: any = await GoogleSignin.signIn();

            if (result && result.data && result.data.idToken) {
                console.log('ID Token recebido:', result.data.idToken);
                const idToken = result.data.idToken;
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                const userCredential = await auth().signInWithCredential(googleCredential);

                //salvando credenciais no BD
                firestore().collection(userCredential.user.email ?? '').
                    doc('DadosUsuario').set({
                        nomeUsuario: userCredential.user.displayName,
                        emailUsuario: userCredential.user.email,
                        fotoUsuario: userCredential.user.photoURL,
                        iudUsuario: userCredential.user.uid
                    })

                console.log('Usuário logado com Google:', userCredential.user);
                navigation.reset({ index: 0, routes: [{ name: "App" }] });
            } else {
                console.error('Erro: ID Token não encontrado no resultado do login do Google', result);
                ToastAndroid.show('Erro ao logar com Google: ID Token não encontrado', ToastAndroid.LONG);
            }
        } catch (error: any) {
            console.error('Erro no login com Google:', error);
            if (error.code === 'SIGN_IN_CANCELLED') {
                ToastAndroid.show('Login com Google cancelado pelo usuário', ToastAndroid.SHORT);
            } else if (error.code === 'INSUFFICIENT_SCOPES') {
                ToastAndroid.show('Você não concedeu permissões suficientes ao Google', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Erro ao logar com Google: ' + error.message, ToastAndroid.LONG);
            }
        }
    };

    const funcSenha = () => {
        if (email != '') {
            auth().sendPasswordResetEmail(email)
                .then(() => {
                    ToastAndroid.show('Enviamos para ' + email + ', instruções para alterar a senha.', ToastAndroid.LONG);
                }).catch(error => {
                    console.error('Erro ao enviar email de recuperação de senha:', error);
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show('Email inválido', ToastAndroid.SHORT);
                    } else if (error.code === 'auth/user-not-found') {
                        ToastAndroid.show('Não há usuário cadastrado com este email', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Erro ao enviar email: ' + error.message, ToastAndroid.SHORT);
                    }
                });
        } else {
            ToastAndroid.show('Digite o email no campo acima!', ToastAndroid.SHORT);
        }
    };

    const onChangeInputEmail = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setEmail(event.nativeEvent.text);
    };

    const onChangeInputSenha = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSenha(event.nativeEvent.text);
    };

    const alternarVisibilidadeSenha = () => {
        setSenhaVisivel(!senhaVisivel);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                    placeholder='Email'></TextInput>
                <View style={styles.containerSenha}>
                    <TextInput style={styles.textInputSenha}
                        onChange={onChangeInputSenha}
                        autoCapitalize='none'
                        secureTextEntry={!senhaVisivel}
                        autoCorrect={false}
                        placeholder='Senha'>
                    </TextInput>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={alternarVisibilidadeSenha}
                    >
                        <Ionicons
                            name={senhaVisivel ? 'eye' : 'eye-off'}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={entrarConta}>
                    <Text style={styles.buttonText}>{t('entrar')}</Text>
                </TouchableOpacity>
                <View style={styles.containerText}>
                    <Text style={styles.text} onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: "NovaConta" }]
                    })}>Criar uma conta
                    </Text>
                </View>
                <TouchableOpacity onPress={loginComGoogle} style={styles.googleButton}>
                    <Image
                        source={require('../../assets/google_icon.png')} // coloque o ícone do Google nessa pasta
                        style={styles.googleLogo}
                    />
                    <Text style={styles.googleButtonText}>Entrar com Google</Text>
                </TouchableOpacity>
                <View style={styles.containerText}>
                    <Text style={styles.text}
                        onPress={() => funcSenha()}>Esqueci minha senha
                    </Text>
                </View>
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
        borderRadius: 5
    },
    text: {
        color: Globais.corPrimaria,
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 24
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginBottom: 16,
        marginTop: 16
    },
    logoContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        backgroundColor: Globais.corPrimaria,
        padding: 10,
        borderRadius: 5,
        marginBottom: 24

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    containerSenha: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 30,
        backgroundColor: Globais.corSecundaria,
    },
    iconContainer: {
        marginLeft: 10,
    },
    textInputSenha: {
        flex: 1,
        backgroundColor: Globais.corSecundaria,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    googleLogo: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default Login;