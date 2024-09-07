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

const CalendarioFrequencia = () => {

  let datasMarcadas: any = {}
  const datas: any[] = [];

  const { idPeriodoSelec, idClasseSelec, dataSelec,
    setDataSelec, modalCalendarioFreq, setModalCalendarioFreq,
    flagLoadCalendarioFreq, setflagLoadCalendarioFreq, setFlagLoadFrequencia,
    listaDatasFreq, setListaDatasFreq, setRecarregarFrequencia, recarregarCalendarioFreq,
    setRecarregarCalendarioFreq, listaDatasMarcadasFreq, setListaDatasMarcadasFreq,
    idUsuario, nomePeriodoSelec, nomeClasseSelec, setRecarregarAlunos } = useContext(Context)

  let listaAlunosRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('ListaAlunos')

  let datasFrequenciasRef = firestore().collection(idUsuario)
    .doc(idPeriodoSelec).collection('Classes')
    .doc(idClasseSelec).collection('DatasFrequencias')

  useEffect(() => {
    const data = async () => {
      setflagLoadCalendarioFreq('carregando');
      setListaDatasFreq('');
      setListaDatasMarcadasFreq({})
      setRecarregarCalendarioFreq('');

      /* essa consulta no BD retorna as datas ainda não 
      incluídas na lista de datas. */
      datasFrequenciasRef.get().then(snapshot => {
        if (snapshot.empty) {
          setflagLoadCalendarioFreq('carregado');
        }
        snapshot.forEach((documentSnapshot, index) => {
          datas.push(documentSnapshot.id);
          datasMarcadas[documentSnapshot.id] = { selected: true }
          if (snapshot.size - index == 1) {
            setflagLoadCalendarioFreq('carregado')
          }
        });
      }).catch((erro) => {
        console.error(erro);
      })
      setListaDatasFreq(datas);
      setListaDatasMarcadasFreq(datasMarcadas)
    }
    data()
  }, [idClasseSelec, recarregarCalendarioFreq]);

  const onPressAddData = async () => {

    setModalCalendarioFreq(!modalCalendarioFreq);
    setflagLoadCalendarioFreq('inicio')

    //adiciona data na lista de frequencias
    datasFrequenciasRef.doc(dataSelec).set({})

    //adiciona frequencia na lista de alunos
    listaAlunosRef.get().then((snapshot) => {
      snapshot.forEach((docSnapshot) => {
        listaAlunosRef.doc(docSnapshot.data().idAluno).update({
          frequencias: firestore.FieldValue.arrayUnion({
            data: dataSelec,
            freq: 'P'
          })
        })
      })
    }).catch((erro)=>{
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
    setRecarregarFrequencia('recarregar');
  }

  const renderCarregamento = () => {
    if (idClasseSelec != '') {
      switch (flagLoadCalendarioFreq) {
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
                  setFlagLoadFrequencia('carregando');
                  setRecarregarFrequencia('recarregarFrequencia');
                  if (listaDatasFreq.includes(day.dateString)) {
                    setModalCalendarioFreq(!modalCalendarioFreq)

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
                markedDates={listaDatasMarcadasFreq}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => [onPressAddData(), setflagLoadCalendarioFreq('carregando')]}>
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

export default CalendarioFrequencia;