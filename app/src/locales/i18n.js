// i18n.js
import * as Localization from 'expo-localization';

const locales = {
    en: require('./en.json'),
    ja: require('./ja.json'),
};

const fallbackLanguage = 'en'; // フォールバックの言語

const getLanguageResource = (language) => {
    const selectedLocale = locales[language] || locales[fallbackLanguage];
    return selectedLocale;
};

let defaultLanguage = Localization.locale.split('-')[0]; // デフォルトの言語をブラウザの言語から取得する

// デフォルトの言語を設定する関数
export const setDefaultLanguage = (language) => {
    defaultLanguage = language;
};

export const t = (key) => {
    const selectedLocale = getLanguageResource(defaultLanguage);
    return selectedLocale[key] || key;
};
