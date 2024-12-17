import React, { useContext, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

LocaleConfig.locales.br = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan.", "Fev.", "Mar", "Abr", "Mai", "Jun", "Jul.", "Ago", "Set.", "Out.", "Nov.", "Dez."],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
};

LocaleConfig.defaultLocale = "br";

const CalendarioNota = () => {
  let datasMarcadas: any = {};
  const datas: any[] = [];

  const { idPeriodoSelec, idClasseSelec, dataSelec, setDataSelec, modalCalendarioNota, setModalCalendarioNota } = useContext(Context);
  const { flagLoadCalendarioNotas, setflagLoadCalendarioNotas, setFlagLoadNotas, listaDatasNotas, setListaDatasNotas, setRecarregarNotas, recarregarCalendarioNotas, setRecarregarCalendarioNotas, listaDatasMarcadasNotas, setListaDatasMarcadasNotas, idUsuario, nomePeriodoSelec, nomeClasseSelec } = useContext(Context);

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos');

  let datasNotasRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasNotas');

  useEffect(() => {
    const data = async () => {
      setflagLoadCalendarioNotas('carregando');
      setListaDatasNotas('');
      setListaDatasMarcadasNotas({});
      setRecarregarCalendarioNotas('');

      datasNotasRef.get().then(snapshot => {
        if (snapshot.empty) {
          setflagLoadCalendarioNotas('carregado');
        }
        snapshot.forEach((documentSnapshot, index) => {
          datas.push(documentSnapshot.id);
          datasMarcadas[documentSnapshot.id] = { selected: true };
          if (snapshot.size - index === 1) {
            setflagLoadCalendarioNotas('carregado');
          }
        });
      }).catch((erro) => {
        console.error(erro);
      });
      setListaDatasNotas(datas);
      setListaDatasMarcadasNotas(datasMarcadas);
    };
    data();
  }, [idClasseSelec, recarregarCalendarioNotas]);

  const onPressAddData = async () => {
    setModalCalendarioNota(!modalCalendarioNota);

    datasNotasRef.doc(dataSelec).set({});
    listaAlunosRef.get().then((snapshot) => {
      snapshot.forEach((docSnapshot) => {
        listaAlunosRef.doc(docSnapshot.data().idAluno).update({
          notas: firestore.FieldValue.arrayUnion({
            data: dataSelec,
            nota: ''
          })
        });
      });
    }).catch((erro) => {
      console.error(erro);
    });

    firestore().collection(idUsuario).doc('EstadosApp').update({
      idPeriodo: idPeriodoSelec,
      periodo: nomePeriodoSelec,
      idClasse: idClasseSelec,
      classe: nomeClasseSelec,
      data: dataSelec
    });

    setRecarregarNotas('recarregarNotas');
  };

  const renderCarregamento = () => {
    if (idClasseSelec !== '') {
      switch (flagLoadCalendarioNotas) {
        case 'carregando':
          return (
            <View style={styles.centeredContainer}>
              <Text style={styles.textLoad}>Carregando...</Text>
            </View>
          );
        case 'carregado':
          return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Calendar
                style={styles.calendar}
                onDayPress={(day: any) => {
                  setDataSelec(day.dateString);
                  setFlagLoadNotas('carregando');
                  setRecarregarNotas('recarregarNotas');
                  if (listaDatasNotas.includes(day.dateString)) {
                    setModalCalendarioNota(!modalCalendarioNota);

                    firestore().collection(idUsuario).doc('EstadosApp').update({
                      idPeriodo: idPeriodoSelec,
                      periodo: nomePeriodoSelec,
                      idClasse: idClasseSelec,
                      classe: nomeClasseSelec,
                      data: day.dateString,
                    });
                  }
                }}
                markedDates={listaDatasMarcadasNotas}
              />
              <View style={styles.buttonWrapper}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => [onPressAddData(), setflagLoadCalendarioNotas('carregando')]}
                >
                  <Text style={styles.textStyle}>Criar data</Text>
                </Pressable>
              </View>
            </ScrollView>
          );
      }
    }
  };

  return (
    <View style={styles.container}>
      {renderCarregamento()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 24,
    paddingHorizontal: width * 0.05,
  },
  calendar: {
    width: '100%',
    alignSelf: 'center',
  },
  buttonWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '80%',
  },
  buttonClose: {
    backgroundColor: Globais.corPrimaria,
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
  },
});

export default CalendarioNota;
