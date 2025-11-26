// i18n.js
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';

const locales = {
    en: require('./en.json'),
    ja: require('./ja.json'),
};

const fallbackLanguage = 'en'; // フォールバックの言語

const getLanguageResource = (language) => {
    const selectedLocale = locales[language] || locales[fallbackLanguage];
    return selectedLocale;
};

// デフォルトの言語を取得
const getInitialLanguage = () => {
    // Web環境の場合
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang ? browserLang.split('-')[0] : fallbackLanguage;
    }
    // ネイティブ環境の場合
    return Localization.locale ? Localization.locale.split('-')[0] : fallbackLanguage;
};

let defaultLanguage = getInitialLanguage();

// デフォルトの言語を設定する関数
export const setDefaultLanguage = (language) => {
    defaultLanguage = language;
};

export const getDefaultLanguage = () => {
    return defaultLanguage;
  };

export const t = (key) => {
    const selectedLocale = getLanguageResource(defaultLanguage);
    return selectedLocale[key] || key;
};
