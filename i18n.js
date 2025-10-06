import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './src/locales/en.json';
import pt from './src/locales/pt.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    pt: {
      translation: pt,
    },
  },
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
