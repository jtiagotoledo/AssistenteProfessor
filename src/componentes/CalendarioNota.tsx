import React, {useContext, useEffect} from 'react';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Context} from '../data/Provider';
import Globais from '../data/Globais';
import {useTranslation} from 'react-i18next';
import i18n from '../../i18n';
import {criarDataNota} from '../services/datasNotas';
import {buscarAlunosPorClasse} from '../services/alunos';
import {criarNota} from '../services/nota';
import {buscarIdTituloPorDataEClasse} from '../services/datasNotas';
import {atualizarTitulo} from '../services/datasNotas';

const {width} = Dimensions.get('window'); // Captura a largura e altura da tela

LocaleConfig.locales.br = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan.',
    'Fev.',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul.',
    'Ago',
    'Set.',
    'Out.',
    'Nov.',
    'Dez.',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
};

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul.',
    'Aug',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

if (i18n.language == 'pt') LocaleConfig.defaultLocale = 'br';
if (i18n.language == 'en') LocaleConfig.defaultLocale = 'en';

const CalendarioNota = () => {
  const {t} = useTranslation();
  const {
    idClasseSelec,
    dataSelec,
    setDataSelec,
    modalCalendarioNota,
    setModalCalendarioNota,
    textoTituloNotas,
    setRecarregarDatasMarcadasNotas,
    setRecarregarNotas,
    listaDatasMarcadasNotas,
    setIdDataNota,
    setTextoTituloNotas,
  } = useContext(Context);

  useEffect(() => {
    if (i18n.language === 'pt') {
      LocaleConfig.defaultLocale = 'br';
    } else if (i18n.language === 'en') {
      LocaleConfig.defaultLocale = 'en';
    }
  }, [i18n.language]);

  function onChangeTituloNotas(text: string) {
    setTextoTituloNotas(text);
  }

  const onPressAddData = async () => {
    if (!textoTituloNotas || textoTituloNotas.trim() === '') {
      ToastAndroid.show(
        'Digite um título para a avaliação.',
        ToastAndroid.SHORT,
      );
      return;
    }

    if (dataSelec && idClasseSelec) {
      try {
        setModalCalendarioNota(false); // Fecha modal do calendário de notas

        // Cria a data da nota
        const novaDataNota = await criarDataNota({
          data: dataSelec,
          id_classe: idClasseSelec,
        });
        setIdDataNota(novaDataNota.id);

        // Busca os alunos da classe
        const alunos = await buscarAlunosPorClasse(idClasseSelec);

        // Para cada aluno, cria um registro de nota inicial
        await Promise.all(
          alunos.map((aluno: any) =>
            criarNota({
              id_data_nota: novaDataNota.id,
              id_aluno: aluno.id,
              nota: null,
            }),
          ),
        );

        // Registra o titulo da nota no banco de dados
        await atualizarTitulo(novaDataNota.id, textoTituloNotas);

        setRecarregarNotas((prev: any) => !prev);
        ToastAndroid.show('Data de nota criada!', ToastAndroid.SHORT);
      } catch (error) {
        ToastAndroid.show('Erro ao criar data de nota!', ToastAndroid.SHORT);
      }
    }
  };

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
                  if (listaDatasMarcadasNotas[day.dateString]?.selected) {
                    setRecarregarNotas((prev: any) => !prev);
                    try {
                      const resposta = await buscarIdTituloPorDataEClasse(
                        day.dateString,
                        idClasseSelec,
                      );
                      console.log('ID encontrado:', resposta);
                      setIdDataNota(resposta.id);
                      setTextoTituloNotas(resposta.titulo);
                      setModalCalendarioNota(!modalCalendarioNota);
                    } catch (erro) {
                      console.log('Data não encontrada ou erro:', erro);
                    }
                  }
                };

                verificarId();
              }}
              markedDates={listaDatasMarcadasNotas}
            />
            <TextInput
              multiline
              placeholder={t('Título da avaliação') + '...'}
              onChangeText={text => onChangeTituloNotas(text)}
              style={styles.textInput}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => [
                onPressAddData(),
                setRecarregarDatasMarcadasNotas((prev: any) => !prev),
              ]}>
              <Text style={styles.textStyle}>{t('Criar data')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <ScrollView
      style={styles.mainScroll}
      contentContainerStyle={styles.mainContainer}>
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
  },
});

export default CalendarioNota;
