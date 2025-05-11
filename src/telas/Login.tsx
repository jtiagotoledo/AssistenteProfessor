import React, { useContext, useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, ToastAndroid, NativeSyntheticEvent, TextInputChangeEventData, Image, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Context } from "../data/Provider";
import ConexaoInternet from "../componentes/ConexaoInternet";
import Globais from "../data/Globais";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { criarProfessor } from '../services/professores';

const Login = ({ navigation }: any) => {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const { email, setEmail, senha, setSenha, setIdUsuario, setIdProfessor, idProfessor } = useContext(Context);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)
    const { t } = useTranslation();

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

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);
    };

    const entrarConta = () => {
        if (email && senha) {
            auth()
                .signInWithEmailAndPassword(email, senha)
                .then(() => {
                    navigation.reset({ index: 0, routes: [{ name: "App" }] });
                }).catch(error => {
                    if (error.code === 'auth/invalid-credential') {
                        ToastAndroid.show(t('msg_001'), ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(t('msg_002') + error.message, ToastAndroid.SHORT);
                    }
                });
        } else {
            ToastAndroid.show(t('msg_003'), ToastAndroid.SHORT);
        }
    };

    const loginComGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const result: any = await GoogleSignin.signIn();

            if (result && result.data && result.data.idToken) {
                const idToken = result.data.idToken;
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                const userCredential = await auth().signInWithCredential(googleCredential);
                const nome = userCredential.user.displayName
                const email = userCredential.user.email
                const foto = userCredential.user.photoURL
                const uuid = userCredential.user.uid

                //salvando credenciais no firebase
                firestore().collection(userCredential.user.email ?? '').
                    doc('DadosUsuario').set({
                        nomeUsuario: nome,
                        emailUsuario: email,
                        fotoUsuario: foto,
                        iudUsuario: uuid
                    })

                //salvando credenciais no servidor próprio
                if (userCredential.additionalUserInfo?.isNewUser) {
                    const professor = await criarProfessor({ nome, email, uuid, foto });
                    setIdProfessor(professor.id)
                }

                //cria Estados do App
                firestore().collection(userCredential.user.email ?? '').doc('EstadosApp').set({
                    idPeriodo: '',
                    periodo: '',
                    idClasse: '',
                    classe: '',
                    data: '',
                    aba: 'Classes'
                })
                setIdUsuario(userCredential.user.email)
                navigation.reset({ index: 0, routes: [{ name: "App" }] });

            } else {
                ToastAndroid.show(t('msg_004'), ToastAndroid.LONG);
            }
        } catch (error: any) {
            if (error.code === 'SIGN_IN_CANCELLED') {
                ToastAndroid.show(t('msg_005'), ToastAndroid.SHORT);
            } else if (error.code === 'INSUFFICIENT_SCOPES') {
                ToastAndroid.show(t('msg_006'), ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(t('msg_007') + error.message, ToastAndroid.LONG);
            }
        }
    };

    const funcSenha = () => {
        if (email != '') {
            auth().sendPasswordResetEmail(email)
                .then(() => {
                    ToastAndroid.show(t('msg_008') + email + t('msg_009'), ToastAndroid.LONG);
                }).catch(error => {
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show(t('msg_010'), ToastAndroid.SHORT);
                    } else if (error.code === 'auth/user-not-found') {
                        ToastAndroid.show(t('msg_011'), ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show(t('msg_012') + error.message, ToastAndroid.SHORT);
                    }
                });
        } else {
            ToastAndroid.show(t('msg_013'), ToastAndroid.SHORT);
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
            <ConexaoInternet />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.picker}>
                    <Text>Selecione a linguaguem/ Select Language</Text>
                    <Picker
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue, itemIndex) => {
                            changeLanguage(itemValue);
                        }}
                    >
                        <Picker.Item label="Português" value="pt" />
                        <Picker.Item label="English" value="en" />
                    </Picker>
                </View>
                <TextInput style={styles.textInput}
                    onChange={onChangeInputEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder={t('email')}></TextInput>
                <View style={styles.containerSenha}>
                    <TextInput style={styles.textInputSenha}
                        onChange={onChangeInputSenha}
                        autoCapitalize='none'
                        secureTextEntry={!senhaVisivel}
                        autoCorrect={false}
                        placeholder={t('senha')}>
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
                <TouchableOpacity onPress={loginComGoogle} style={styles.googleButton}>
                    <Image
                        source={require('../../assets/google_icon.png')}
                        style={styles.googleLogo}
                    />
                    <Text style={styles.googleButtonText}>{t('Entrar com Google')}</Text>
                </TouchableOpacity>
                <View style={styles.containerText}>
                    <Text style={styles.text} onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: "NovaConta" }]
                    })}>{t('Criar uma conta')}
                    </Text>
                </View>
                <View style={styles.containerText}>
                    <Text style={styles.text}
                        onPress={() => funcSenha()}>{t('Esqueci minha senha')}
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
        borderRadius: 5,
        paddingLeft: 16,
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
    picker: {
        marginTop: 20,
        marginBottom: 20,
    }
});

export default Login;