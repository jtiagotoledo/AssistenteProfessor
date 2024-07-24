import React, {createContext, useState} from "react";
import auth from '@react-native-firebase/auth';

export const Context = createContext();

export default function Provider ({children}){
    const[email,setEmail]=useState('');
    const[idUsuario,setIdUsuario]=useState(auth().currentUser?.email);
    const[senha,setSenha]=useState('');
    const[idPeriodoSelec,setIdPeriodoSelec]=useState('');
    const[idClasseSelec,setIdClasseSelec]=useState('');
    const[dataSelec,setDataSelec]=useState('');

    return(
        <Context.Provider value={{
            email,setEmail,
            senha,setSenha,
            idUsuario,setIdUsuario,
            idPeriodoSelec,setIdPeriodoSelec,
            idClasseSelec,setIdClasseSelec,
            dataSelec,setDataSelec
            }}>
            {children}
        </Context.Provider>
    )

}