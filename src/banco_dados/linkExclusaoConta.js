import { Linking } from 'react-native';

const handleDeepLink = (url) => {
  // Extrair a parte da URL após o esquema
  const routeName = url.replace('assistenteprofessor://', '');

  // Navegar para a tela correspondente
  navigation.navigate(routeName);
};

Linking.addEventListener('url', handleDeepLink);