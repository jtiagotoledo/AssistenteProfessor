import React, { useContext, useState } from 'react';
import {  View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Context } from "../data/Provider";

const ExcluirUsuario = ({ navigation }: any) => {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const { email, setEmail, senha, setSenha } = useContext(Context);

    
    return (
        <View>
            <Text>Excluir Usuario</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 24,
        marginRight: 24,
    }
});

export default ExcluirUsuario;