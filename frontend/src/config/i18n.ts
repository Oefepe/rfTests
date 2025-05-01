import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { logError } from '../services';
import en from '../assets/i18n/en.json';
import fr from '../assets/i18n/fr.json';
import es from '../assets/i18n/es.json';
import ko from '../assets/i18n/ko.json';
import de from '../assets/i18n/de.json';
import it from '../assets/i18n/it.json';
import zhHansCN from '../assets/i18n/zh-Hans-CN.json';
import ja from '../assets/i18n/ja.json';
import ru from '../assets/i18n/ru.json';
import th from '../assets/i18n/th.json';
import tr from '../assets/i18n/tr.json';
import vi from '../assets/i18n/vi.json';
import hu from '../assets/i18n/hu.json';
import sv from '../assets/i18n/sv.json';
import hr from '../assets/i18n/hr.json';
import sl from '../assets/i18n/sl.json';

const logMissingKeys = (languages: readonly string[], namespace: string, key: string) => {
  logError({
    errorCode: 4032,
    message: 'No translation key found',
    context: { languages, namespace, key },
  });
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    react: {
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
    saveMissing: true,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    missingKeyHandler: logMissingKeys,
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      es: {
        translation: es,
      },
      ko: {
        translation: ko,
      },
      de: {
        translation: de,
      },
      it: {
        translation: it,
      },
      'zh-Hans-CN': {
        translation: zhHansCN,
      },
      ja: {
        translation: ja,
      },
      ru: {
        translation: ru,
      },
      th: {
        translation: th,
      },
      tr: {
        translation: tr,
      },
      vi: {
        translation: vi,
      },
      hu: {
        translation: hu,
      },
      sv: {
        translation: sv,
      },
      hr: {
        translation: hr,
      },
      sl: {
        translation: sl,
      },
    },
  });

export default i18n;
