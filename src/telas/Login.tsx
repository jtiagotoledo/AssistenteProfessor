import React, { useContext } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";

const Login = ({ navigation }: any) => {
    const { email, setEmail, senha, setSenha } = useContext(Context);

    const entrarConta = () => {
        auth()
            .signInWithEmailAndPassword(email, senha)
            .then(() => {
                navigation.reset({ index: 0, routes: [{ name: "App" }] })
            }).catch(error => {
                console.log('error',error);
                
                if (error.code === 'auth/invalid-credential') {
                    ToastAndroid.show('Este e-mail não está cadastrado ou senha incorreta', ToastAndroid.SHORT)
                }
            });
    }

    const funcSenha = () => {
        //redefinir senha com link no email
        if (email != '') {
            auth().sendPasswordResetEmail(email)
                .then(() => {
                    ToastAndroid.show('Enviamos para ' + email + ', instruções para alterar a senha.', ToastAndroid.LONG)
                }).catch(error => {
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show('Email inválido', ToastAndroid.SHORT)
                    }
                });
        } else {
            ToastAndroid.show('Digite o email no campo acima!', ToastAndroid.SHORT)
        }

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
                placeholder='Email'></TextInput>
            <TextInput style={styles.textInput}
                onChange={onChangeInputSenha}
                autoCapitalize='none'
                secureTextEntry={true}
                autoCorrect={false}
                placeholder='Senha'></TextInput>
            <TouchableOpacity
                style={styles.button}
                onPress={entrarConta}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.containerText}>
                <Text style={styles.text} onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: "NovaConta" }]
                })}>Criar uma conta
                </Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.text}
                    onPress={() => funcSenha()}>Esqueci minha senha
                </Text>
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

export default Login;