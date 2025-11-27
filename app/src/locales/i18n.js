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
    // Web/ネイティブ共通: getLocales()を使用（Expo SDK 49+推奨）
    try {
        const deviceLocales = Localization.getLocales();
        if (deviceLocales && deviceLocales.length > 0) {
            const primaryLocale = deviceLocales[0];
            console.log('Device locale:', primaryLocale);
            return primaryLocale.languageCode || fallbackLanguage;
        }
    } catch (error) {
        console.warn('Failed to get device locale:', error);
    }

    return fallbackLanguage;
};

let defaultLanguage = getInitialLanguage();

console.log('=== i18n Initialization ===');
console.log('Platform:', Platform.OS);
console.log('Selected language:', defaultLanguage);
console.log('===========================');

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
