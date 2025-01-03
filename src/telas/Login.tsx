import React, { useContext, useState } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";
import Globais from "../data/Globais";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Login = ({ navigation }: any) => {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const { email, setEmail, senha, setSenha } = useContext(Context);

    const entrarConta = () => {
        if(email && senha){
            auth()
                .signInWithEmailAndPassword(email, senha)
                .then(() => {
                    navigation.reset({ index: 0, routes: [{ name: "App" }] })
                }).catch(error => {
                    if (error.code === 'auth/invalid-credential') {
                        ToastAndroid.show('Este e-mail não está cadastrado ou senha incorreta', ToastAndroid.SHORT)
                    }
                });
        }else{
            ToastAndroid.show('Email e senha devem ser preenchidos', ToastAndroid.SHORT)
        }
    }

    const funcSenha = () => {
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
        marginBottom:30,
        backgroundColor: Globais.corSecundaria,
    },
    iconContainer: {
        marginLeft: 10,
    },
    textInputSenha: {
        flex:1,
        backgroundColor: Globais.corSecundaria,
    }
});

export default Login;
