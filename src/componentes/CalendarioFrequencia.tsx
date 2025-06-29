import React, { useContext, useEffect } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Dimensions, ToastAndroid, TextInput } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Context } from "../data/Provider";
import Globais from '../data/Globais';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { criarDataFrequencia } from '../services/datasFrequencia';
import { buscarAlunosPorClasse } from '../services/alunos';
import { criarFrequencia } from '../services/frequencia';
import { buscarIdAtivPorDataEClasse } from '../services/datasFrequencia';
import { atualizarAtividade } from '../services/datasFrequencia';

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
  const { idClasseSelec, dataSelec, setDataSelec, modalCalendarioFreq, setModalCalendarioFreq, setDataFreqSelec,
    setRecarregarDatasMarcadasFreq, setRecarregarFrequencia, listaDatasMarcadasFreq, setIdDataFreq, setTextoAtividades, textoAtividades } = useContext(Context)

  useEffect(() => {
    if (i18n.language === 'pt') {
      LocaleConfig.defaultLocale = 'br';
    } else if (i18n.language === 'en') {
      LocaleConfig.defaultLocale = 'en';
    }
  }, [i18n.language]);

  function onChangeAtividades(text: string) {
    setTextoAtividades(text)
  }

  const onPressAddData = async () => {
    if (!textoAtividades || textoAtividades.trim() === '') {
      ToastAndroid.show('A atividade não deve estar em branco', ToastAndroid.SHORT);
      return;
    }

    if (dataSelec && idClasseSelec) {
      try {
        setModalCalendarioFreq(false);
        // Cria a data da frequência
        const novaData = await criarDataFrequencia({ data: dataSelec, id_classe: idClasseSelec });
        setIdDataFreq(novaData.id)

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

        // Registra a atividade no banco de dados
        console.log(novaData.id, textoAtividades);

        await atualizarAtividade(novaData.id, textoAtividades)

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
                const verificarId = async () => {
                  if (listaDatasMarcadasFreq[day.dateString]?.selected) {
                    setRecarregarFrequencia((prev: any) => !prev);
                    try {
                      const resposta = await buscarIdAtivPorDataEClasse(day.dateString, idClasseSelec);
                      console.log('ID encontrado:', resposta);
                      setIdDataFreq(resposta.id);
                      setTextoAtividades(resposta.atividade);
                      setModalCalendarioFreq(!modalCalendarioFreq);
                    } catch (erro) {
                      console.log('Data não encontrada ou erro:', erro);
                    }
                  }
                };

                verificarId();
              }}
              markedDates={listaDatasMarcadasFreq}
            />
            <TextInput
              multiline
              placeholder={t('Descreva a atividade') + "..."}
              onChangeText={(text:any) => onChangeAtividades(text)}
              style={styles.textInput}
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
  },
  textInput: {
    marginTop: 30,
    width: '100%',
    backgroundColor: Globais.corTextoClaro,
    padding: 8,
    fontSize: 16,
    borderRadius: 5,
  }
});

export default CalendarioFrequencia;
