import React, { useContext, useEffect } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Dimensions, ToastAndroid } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { criarDataFrequencia } from '../services/datasFrequencia';
import { buscarAlunosPorClasse } from '../services/alunos';
import { criarFrequencia } from '../services/frequencia';


const { width } = Dimensions.get('window'); // Captura a largura e altura da tela

LocaleConfig.locales.br = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan.", "Fev.", "Mar", "Abr", "Mai", "Jun", "Jul.", "Ago", "Set.", "Out.", "Nov.", "Dez."],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
};

LocaleConfig.locales.en = {
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthNamesShort: ["Jan.", "Feb.", "Mar", "Apr", "May", "Jun", "Jul.", "Aug", "Sep.", "Oct.", "Nov.", "Dec."],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."]
};

const CalendarioFrequencia = () => {
  const { t } = useTranslation();

  const { idClasseSelec, dataSelec, setDataSelec, modalCalendarioFreq, setModalCalendarioFreq,
    setflagLoadCalendarioFreq, setRecarregarDatasMarcadasFreq, setRecarregarFrequencia, listaDatasMarcadasFreq } = useContext(Context)

  useEffect(() => {
    if (i18n.language === 'pt') {
      LocaleConfig.defaultLocale = 'br';
    } else if (i18n.language === 'en') {
      LocaleConfig.defaultLocale = 'en';
    }
  }, [i18n.language]);

  const onPressAddData = async () => {
    if (dataSelec && idClasseSelec) {
      try {
        setModalCalendarioFreq(false);
        // Cria a data da frequência
        const novaData = await criarDataFrequencia({ data: dataSelec, id_classe: idClasseSelec });

        // Busca os alunos da classe
        const alunos = await buscarAlunosPorClasse(idClasseSelec);

        // Para cada aluno, cria um registro de frequência com "presente: true"
        await Promise.all(
          alunos.map((aluno: any) =>
            criarFrequencia({
              id_data_frequencia: novaData.id,
              id_aluno: aluno.id,
              presente: true
            })
          )
        );
        setRecarregarFrequencia((prev: any) => !prev);
        ToastAndroid.show('Data criada!', ToastAndroid.SHORT);
      } catch (error) {
        ToastAndroid.show('Erro ao criar data!', ToastAndroid.SHORT);
      }
    };
  }

  const renderCarregamento = () => {
    if (idClasseSelec != '') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Calendar
              style={styles.calendar}
              onDayPress={(day: any) => {
                setDataSelec(day.dateString);
                setRecarregarFrequencia('recarregarFrequencia');
                if (listaDatasMarcadasFreq[day.dateString]?.selected) {
                  setModalCalendarioFreq(!modalCalendarioFreq);
                }
              }}
              markedDates={listaDatasMarcadasFreq}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => [onPressAddData(), setRecarregarDatasMarcadasFreq((prev: any) => !prev)]}>
              <Text style={styles.textStyle}>{t('Criar data')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      )
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

export default CalendarioFrequencia;
