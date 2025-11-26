import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const isProd = process.env.ENVIRONMENT === 'production';

const getUrl = (envKey: string) => {
    if (isProd) {
        // 本番環境: 必須、なければエラー
        const url = Constants.expoConfig?.extra?.[envKey];
        if (!url) {
            throw new Error(`[Production] ${envKey} is required in app.json extra`);
        }
        return url;
    }
    // 開発環境: 警告のみ
    const url = process.env[envKey];
    if (!url) {
        console.warn(`[Development] ${envKey} is not defined in .env file`);
    }
    return url || '';
};

export const API_URL = isWeb ? getUrl('API_URL') : getUrl('NATIVE_API_URL');
export const BASE_URL = isWeb ? getUrl('BASE_URL') : getUrl('NATIVE_BASE_URL');

// console.log('=== Configuration ===');
// console.log('Environment:', isProd ? 'production' : 'development');
// console.log('Platform:', Platform.OS);
// console.log('API_URL:', API_URL);
// console.log('BASE_URL:', BASE_URL);
// console.log('=====================');

export const GOOGLE_ANALYTICS_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID || '';
export const MAX_CONTAINER_WIDTH = 400; // コンテナの最大幅
export const MAX_INPUT_WIDTH = 360;     // 入力フィールドの最大幅
export const MIN_ARTIST_ITEM_SIZE = 100; // アーティストアイテムの最小サイズ
export const MAX_ARTIST_ITEM_SIZE = 120; // アーティストアイテムの最大サイズ
export const ERROR_MESSAGE_DISPLAY_DURATION = 6000; // エラーメッセージの表示時間（ミリ秒）　6秒
