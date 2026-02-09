import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './locales/translations';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;