import React, { useContext, useEffect } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window'); // Captura a largura e altura da tela

LocaleConfig.locales.br = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan.", "Fev.", "Mar", "Abr", "Mai", "Jun", "Jul.", "Ago", "Set.", "Out.", "Nov.", "Dez."],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
};

LocaleConfig.defaultLocale = "br";

const CalendarioNota = () => {

  let datasMarcadas: any = {}
  const datas: any[] = [];

  const { idPeriodoSelec, idClasseSelec, dataSelec,
    setDataSelec, modalCalendarioNota, setModalCalendarioNota,
    flagLoadCalendarioNotas, setflagLoadCalendarioNotas, setFlagLoadNotas,
    listaDatasNotas, setListaDatasNotas, setRecarregarNotas, recarregarCalendarioNotas,
    setRecarregarCalendarioNotas, listaDatasMarcadasNotas, setListaDatasMarcadasNotas,
    idUsuario, nomePeriodoSelec, nomeClasseSelec } = useContext(Context)

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  let datasNotasRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasNotas')

  useEffect(() => {
    const data = async () => {
      setflagLoadCalendarioNotas('carregando');
      setListaDatasNotas('');
      setListaDatasMarcadasNotas({})
      setRecarregarCalendarioNotas('');

      datasNotasRef.get().then(snapshot => {
        if (snapshot.empty) {
          setflagLoadCalendarioNotas('carregado');
        }
        snapshot.forEach((documentSnapshot, index) => {
          datas.push(documentSnapshot.id);
          datasMarcadas[documentSnapshot.id] = { selected: true }
          if (snapshot.size - index == 1) {
            setflagLoadCalendarioNotas('carregado')
          }
        });
      })
      setListaDatasNotas(datas);
      setListaDatasMarcadasNotas(datasMarcadas)
    }
    data()
  }, [idClasseSelec, recarregarCalendarioNotas]);

  const onPressAddData = async () => {

    setModalCalendarioNota(!modalCalendarioNota);
    setflagLoadCalendarioNotas('inicio')

    //adiciona data na lista de notas
    datasNotasRef.doc(dataSelec).set({})

    //adiciona notas na lista de alunos
    listaAlunosRef.get().then((snapshot) => {
      snapshot.forEach((docSnapshot) => {
        listaAlunosRef.doc(docSnapshot.data().idAluno).update({
          notas: firestore.FieldValue.arrayUnion({
            data: dataSelec,
            nota: ''
          })
        })
      })
    })

    //atualizando o estado da data
    firestore().collection(idUsuario).
      doc('EstadosApp').update({
        idPeriodo: idPeriodoSelec,
        periodo: nomePeriodoSelec,
        idClasse: idClasseSelec,
        classe: nomeClasseSelec,
        data: dataSelec
      })
    setRecarregarNotas('recarregarNotas');
  }

  const renderCarregamento = () => {
    if (idClasseSelec != '') {
      switch (flagLoadCalendarioNotas) {
        case 'carregando':
          return (
            <View>
              <Text style={styles.textLoad}>Carregando...</Text>
            </View>
          )
        case 'carregado':
          return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.container}>
                <Calendar
                  style={styles.calendar} // Estilo ajustado para responsividade
                  onDayPress={(day:any) => {
                    setDataSelec(day.dateString);
                    setFlagLoadNotas('carregando');
                    setRecarregarNotas('recarregarNotas');
                    if (listaDatasNotas.includes(day.dateString)) {
                      setModalCalendarioNota(!modalCalendarioNota)

                      //atualizando o estado da data
                      firestore().collection(idUsuario).
                        doc('EstadosApp').update({
                          idPeriodo: idPeriodoSelec,
                          periodo: nomePeriodoSelec,
                          idClasse: idClasseSelec,
                          classe: nomeClasseSelec,
                          data: day.dateString
                        })
                    }
                  }}
                  markedDates={listaDatasMarcadasNotas}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => [onPressAddData(), setflagLoadCalendarioNotas('carregando')]}>
                  <Text style={styles.textStyle}>Criar data</Text>
                </Pressable>
              </View>
            </ScrollView>
          )
      }
    }
  }

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={styles.mainContainer}>
      {renderCarregamento()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  mainContainer: {
    paddingVertical: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    marginBottom: 24,
    paddingHorizontal: width * 0.05, // Margem responsiva
  },
  calendar: {
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Globais.corPrimaria,
    marginTop: 24,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
    textAlign: 'center',
  }
});

export default CalendarioNota;
