import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Context = createContext();

export default function Provider({ children }) {
    const [hydrated, setHydrated] = useState(false);

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [fotoProfessor, setFotoProfessor] = useState('');
    const [idProfessor, setIdProfessor] = useState('');
    const [idDataFreq, setIdDataFreq] = useState('');
    const [idDataNota, setIdDataNota] = useState('');
    const [senha, setSenha] = useState('');
    const [modalAddPeriodo, setModalAddPeriodo] = useState(false);
    const [modalAddClasse, setModalAddClasse] = useState(false);
    const [modalAddAluno, setModalAddAluno] = useState(false);
    const [modalEditPeriodo, setModalEditPeriodo] = useState(false);
    const [modalEditClasse, setModalEditClasse] = useState(false);
    const [modalEditAluno, setModalEditAluno] = useState(false);
    const [modalDelPeriodo, setModalDelPeriodo] = useState(false);
    const [modalDelClasse, setModalDelClasse] = useState(false);
    const [modalDelAluno, setModalDelAluno] = useState(false);
    const [modalDelDataFreq, setModalDelDataFreq] = useState(false);
    const [modalDelDataNotas, setModalDelDataNotas] = useState(false);
    const [modalCalendarioFreq, setModalCalendarioFreq] = useState(false);
    const [modalCalendarioNota, setModalCalendarioNota] = useState(false);
    const [modalMenu, setModalMenu] = useState(false);
    const [modalExcel, setModalExcel] = useState(false);
    const [tecladoAtivo, setTecladoAtivo] = useState('');
    const [flagLoadClasses, setflagLoadClasses] = useState('');
    const [flagLoadAlunos, setflagLoadAlunos] = useState('');
    const [flagLoadFrequencia, setFlagLoadFrequencia] = useState('');
    const [flagLoadNotas, setFlagLoadNotas] = useState('');
    const [flagLoadCalendarioFreq, setflagLoadCalendarioFreq] = useState('');
    const [flagLoadCalendarioNotas, setflagLoadCalendarioNotas] = useState('');
    const [flagLoadAbas, setFlagLoadAbas] = useState('');
    const [flagLongPressClasse, setFlagLongPressClasse] = useState(false);
    const [flagLongPressAluno, setFlagLongPressAluno] = useState(false);
    const [flagLongPressDataFreq, setFlagLongPressDataFreq] = useState(false);
    const [flagLongPressDataNotas, setFlagLongPressDataNotas] = useState(false);
    const [recarregarDadosProfessor, setRecarregarDadosProfessor] = useState(false);
    const [recarregarPeriodos, setRecarregarPeriodos] = useState(false);
    const [recarregarClasses, setRecarregarClasses] = useState(false);
    const [recarregarAlunos, setRecarregarAlunos] = useState(false);
    const [recarregarFrequencia, setRecarregarFrequencia] = useState(false);
    const [recarregarNotas, setRecarregarNotas] = useState(false);
    const [recarregarDatasMarcadasFreq, setRecarregarDatasMarcadasFreq] = useState(false);
    const [recarregarDatasMarcadasNotas, setRecarregarDatasMarcadasNotas] = useState(false);
    const [idPeriodoSelec, setIdPeriodoSelec] = useState('');
    const [nomePeriodoSelec, setNomePeriodoSelec] = useState('');
    const [idClasseSelec, setIdClasseSelec] = useState('');
    const [nomeClasseSelec, setNomeClasseSelec] = useState('');
    const [idAlunoSelec, setIdAlunoSelec] = useState('');
    const [numAlunoSelec, setNumAlunoSelec] = useState('');
    const [nomeAlunoSelec, setNomeAlunoSelec] = useState('');
    const [selectedIdAluno, setSelectedIdAluno] = useState('');
    const [alunoInativo, setAlunoInativo] = useState(false);
    const [dataSelec, setDataSelec] = useState('');
    const [abaSelec, setAbaSelec] = useState('');
    const [listaPeriodos, setListaPeriodos] = useState([]);
    const [listaClasses, setListaClasses] = useState({});
    const [listaAlunos, setListaAlunos] = useState({});
    const [listaFrequencia, setListaFrequencia] = useState({});
    const [listaNotas, setListaNotas] = useState({});
    const [listaDatasFreq, setListaDatasFreq] = useState('');
    const [listaDatasNotas, setListaDatasNotas] = useState('');
    const [listaDatasMarcadasFreq, setListaDatasMarcadasFreq] = useState({});
    const [listaDatasMarcadasNotas, setListaDatasMarcadasNotas] = useState({});
    const [valueAtividade, setValueAtividade] = useState([{ atividade: '' }]);
    const [valueNota, setValueNota] = useState([{ nota: '' }]);
    const [textoAtividades, setTextoAtividades] = useState('');
    const [textoTituloNotas, setTextoTituloNotas] = useState('');


    // Carregar do AsyncStorage 
    useEffect(() => {
        const carregarEstados = async () => {
            try {
                const periodo = await AsyncStorage.getItem('@idPeriodoSelec');
                const nomePeriodo = await AsyncStorage.getItem('@nomePeriodoSelec');
                const classe = await AsyncStorage.getItem('@idClasseSelec');
                if (periodo !== null) setIdPeriodoSelec(periodo);
                if (nomePeriodo !== null) setNomePeriodoSelec(nomePeriodo);
                if (classe !== null) setIdClasseSelec(classe);

                setHydrated(true);
            } catch (e) {
                console.error('Erro ao carregar estados:', e);
                setHydrated(true);
            }
        };

        carregarEstados();
    }, []);

    // Auto-save no AsyncStorage
    useEffect(() => {
        const salvarEstados = async () => {
            try {
                await AsyncStorage.setItem('@idPeriodoSelec', idPeriodoSelec);
                await AsyncStorage.setItem('@nomePeriodoSelec', nomePeriodoSelec);
                await AsyncStorage.setItem('@idClasseSelec', idClasseSelec);
            } catch (e) {
                console.error('Erro ao salvar estados:', e);
            }
        };

        if (hydrated) {
            salvarEstados();
        }
    }, [idPeriodoSelec, idClasseSelec, hydrated]);

    // Enquanto não carregou, não renderiza ---
    if (!hydrated) {
        return null; 
    }

    return (
        <Context.Provider value={{
            nome, setNome,
            email, setEmail,
            senha, setSenha,
            idUsuario, setIdUsuario,
            fotoProfessor, setFotoProfessor,
            idProfessor, setIdProfessor,
            idDataFreq, setIdDataFreq,
            idDataNota, setIdDataNota,
            modalAddPeriodo, setModalAddPeriodo,
            modalAddClasse, setModalAddClasse,
            modalAddAluno, setModalAddAluno,
            modalEditPeriodo, setModalEditPeriodo,
            modalEditClasse, setModalEditClasse,
            modalEditAluno, setModalEditAluno,
            modalDelPeriodo, setModalDelPeriodo,
            modalDelClasse, setModalDelClasse,
            modalDelAluno, setModalDelAluno,
            modalDelDataFreq, setModalDelDataFreq,
            modalDelDataNotas, setModalDelDataNotas,
            modalCalendarioFreq, setModalCalendarioFreq,
            modalCalendarioNota, setModalCalendarioNota,
            modalMenu, setModalMenu,
            modalExcel, setModalExcel,
            tecladoAtivo, setTecladoAtivo,
            flagLoadClasses, setflagLoadClasses,
            flagLoadAlunos, setflagLoadAlunos,
            flagLoadFrequencia, setFlagLoadFrequencia,
            flagLoadNotas, setFlagLoadNotas,
            flagLoadCalendarioFreq, setflagLoadCalendarioFreq,
            flagLoadCalendarioNotas, setflagLoadCalendarioNotas,
            flagLoadAbas, setFlagLoadAbas,
            flagLongPressClasse, setFlagLongPressClasse,
            flagLongPressAluno, setFlagLongPressAluno,
            flagLongPressDataFreq, setFlagLongPressDataFreq,
            flagLongPressDataNotas, setFlagLongPressDataNotas,
            recarregarDadosProfessor, setRecarregarDadosProfessor,
            recarregarPeriodos, setRecarregarPeriodos,
            recarregarClasses, setRecarregarClasses,
            recarregarAlunos, setRecarregarAlunos,
            recarregarFrequencia, setRecarregarFrequencia,
            recarregarNotas, setRecarregarNotas,
            recarregarDatasMarcadasFreq, setRecarregarDatasMarcadasFreq,
            recarregarDatasMarcadasNotas, setRecarregarDatasMarcadasNotas,
            idPeriodoSelec, setIdPeriodoSelec,
            nomePeriodoSelec, setNomePeriodoSelec,
            idClasseSelec, setIdClasseSelec,
            nomeClasseSelec, setNomeClasseSelec,
            idAlunoSelec, setIdAlunoSelec,
            numAlunoSelec, setNumAlunoSelec,
            nomeAlunoSelec, setNomeAlunoSelec,
            selectedIdAluno, setSelectedIdAluno,
            alunoInativo, setAlunoInativo,
            dataSelec, setDataSelec,
            abaSelec, setAbaSelec,
            listaPeriodos, setListaPeriodos,
            listaClasses, setListaClasses,
            listaAlunos, setListaAlunos,
            listaFrequencia, setListaFrequencia,
            listaNotas, setListaNotas,
            listaDatasNotas, setListaDatasNotas,
            listaDatasFreq, setListaDatasFreq,
            listaDatasMarcadasFreq, setListaDatasMarcadasFreq,
            listaDatasMarcadasNotas, setListaDatasMarcadasNotas,
            valueAtividade, setValueAtividade,
            valueNota, setValueNota,
            textoAtividades, setTextoAtividades,
            textoTituloNotas, setTextoTituloNotas
        }}>
            {children}
        </Context.Provider>
    )

}