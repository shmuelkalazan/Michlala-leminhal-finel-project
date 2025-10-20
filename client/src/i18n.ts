import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationHE from './locales/he/translation.json';
import translationES from './locales/es/translation.json';
import translationAR from './locales/ar/translation.json';


const resources = {
    en: { translation: translationEN },
    fr: { translation: translationFR },
    he: { translation: translationHE },
    es: { translation: translationES },
    ar: { translation: translationAR },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, 
        },
    });

export default i18n;
