
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';
import myResources from './resources';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: myResources,
    // detection: {
    //   order: ['querystring', 'navigator'],
    //   lookupQuerystring: 'lng'
    // },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['ru', 'en', 'es'],
    debug: true,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n;