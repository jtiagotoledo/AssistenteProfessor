import { useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Divider } from "react-native-paper";

import FabClasses from "../componentes/FabClasses";
import FlatListAlunos from "../listas/FlatListAlunos";
import FlatListClasses from "../listas/FlatListClasses";
import HeaderClasses from "../componentes/HeaderClasses";
import ConexaoInternet from "../componentes/ConexaoInternet";
import Globais from "../data/Globais";
import consultasBD from "../banco_dados/consultasBD";

import ModalAddPeriodo from "../modais/ModalAddPeriodo";
import ModalAddClasse from "../modais/ModalAddClasse";
import ModalAddAluno from "../modais/ModalAddAluno";
import ModalEditPeriodo from "../modais/ModalEditPeriodo";
import ModalEditClasse from "../modais/ModalEditClasse";
import ModalEditAluno from "../modais/ModalEditAluno";
import ModalDelPeriodo from "../modais/ModalDelPeriodo";
import ModalDelClasse from "../modais/ModalDelClasse";
import ModalDelAluno from "../modais/ModalDelAluno";
import ModalMenu from "../modais/ModalMenu";
import ModalExcel from "../modais/ModalExcel";

import { useTranslation } from 'react-i18next';
import { Context } from "../data/Provider";
import { registrarAcesso } from '../services/acessos';
import React from "react";

function Classes({ navigation }: any) {
  const { nomePeriodoSelec, idProfessor, email } = useContext(Context);
  const { t } = useTranslation();

  consultasBD();

  useEffect(() => {
    // contador de acessos do professor - mariadb tabela acessos.
    const registrar = async () => {
      if (email == '') return;
      if (email && idProfessor) {
        await registrarAcesso(idProfessor, email);
      }
    };
    registrar();
  }, [idProfessor]);

  const renderHeader = () => (
    <>
      <Text style={styles.textLoad}>
        {nomePeriodoSelec ? t("Período") + ": " + nomePeriodoSelec : t("Adicione um período")}
      </Text>
      <FlatListClasses />
      <Divider style={styles.divider} />
    </>
  );

  return (
    <View style={styles.container}>
      <HeaderClasses title={t("Classes")} />
      <ConexaoInternet />
      <FlatListAlunos
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={() => null}
        contentContainerStyle={styles.listContent}
      />
      <ModalAddPeriodo />
      <ModalAddClasse />
      <ModalAddAluno />
      <ModalEditPeriodo />
      <ModalEditClasse />
      <ModalEditAluno />
      <ModalDelPeriodo />
      <ModalDelClasse />
      <ModalDelAluno />
      <ModalMenu navigation={navigation} />
      <ModalExcel />
      <FabClasses />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Globais.corSecundaria,
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    padding: 5,
    color: Globais.corTextoEscuro,
  },
  divider: {
    backgroundColor: Globais.corPrimaria,
  },
  textLoad: {
    fontSize: 24,
    color: Globais.corTextoClaro,
    textAlign: "center",
  },
});

export default Classes;
