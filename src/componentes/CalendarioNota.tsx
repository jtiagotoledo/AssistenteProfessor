import React, { useContext, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import firestore from '@react-native-firebase/firestore';

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
    setDataSelec, modalCalendarioNota, setModalCalendarioNota } = useContext(Context);
  const { flagLoadCalendarioNotas, setflagLoadCalendarioNotas, setFlagLoadNotas,
    listaDatasNotas, setListaDatasNotas, setRecarregarNotas, recarregarCalendarioNotas,
    setRecarregarCalendarioNotas, listaDatasMarcadasNotas, setListaDatasMarcadasNotas,
    idUsuario, nomePeriodoSelec, nomeClasseSelec, setRecarregarAlunos } = useContext(Context)

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

      /* essa consulta no BD retorna as datas ainda não 
      incluídas na lista de datas. */
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
      }).catch((erro) => {
        console.error(erro);
      })
      setListaDatasNotas(datas);
      setListaDatasMarcadasNotas(datasMarcadas)
    }
    data()
  }, [idClasseSelec, recarregarCalendarioNotas]);

  const onPressAddData = async () => {

    setModalCalendarioNota(!modalCalendarioNota);

    //adiciona data na lista de notas
    datasNotasRef.doc(dataSelec).set({});

    //adiciona frequencia na lista de alunos
    listaAlunosRef.get().then((snapshot) => {
      snapshot.forEach((docSnapshot) => {
        listaAlunosRef.doc(docSnapshot.data().idAluno).update({
          notas: firestore.FieldValue.arrayUnion({
            data: dataSelec,
            nota: ''
          })
        })
      })
    }).catch((erro) => {
      console.error(erro);
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

    setRecarregarNotas('recarregarNotas')
    setRecarregarAlunos('recarregar')

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
            <View style={styles.container}>
              <Calendar
                onDayPress={(day:any) => {
                  setDataSelec(day.dateString);
                  setFlagLoadNotas('carregando');
                  setRecarregarNotas('recarregarFrequencia');
                  if (listaDatasNotas.includes(day.dateString)) {
                    setModalCalendarioNota(!modalCalendarioNota)

                    //atualizando o estado da data
                    firestore().collection(idUsuario).
                      doc('EstadosApp').update({
                        idPeriodo: idPeriodoSelec,
                        periodo: nomePeriodoSelec,
                        idClasse: idClasseSelec,
                        classe: nomeClasseSelec,
                        data: day.dateString,
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
          )
      }
    }
  }

  return (
    <View>
      {renderCarregamento()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
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
  }
});

export default CalendarioNota;