import Constants from 'expo-constants';

// 環境変数の優先順位:
// 1. process.env (開発時の .env ファイル)
// 2. Constants.expoConfig?.extra (app.json の extra フィールド、本番ビルド用)
// 3. デフォルト値 (ローカル開発用)
export const API_URL =
    process.env.API_URL ||
    Constants.expoConfig?.extra?.API_URL ||
    'http://localhost:8080';

export const BASE_URL =
    process.env.BASE_URL ||
    Constants.expoConfig?.extra?.BASE_URL ||
    'http://localhost:19006';

export const GOOGLE_ANALYTICS_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID || '';
export const MAX_CONTAINER_WIDTH = 400; // コンテナの最大幅
export const MAX_INPUT_WIDTH = 360;     // 入力フィールドの最大幅
export const MIN_ARTIST_ITEM_SIZE = 100; // アーティストアイテムの最小サイズ
export const MAX_ARTIST_ITEM_SIZE = 120; // アーティストアイテムの最大サイズ
export const ERROR_MESSAGE_DISPLAY_DURATION = 6000; // エラーメッセージの表示時間（ミリ秒）　6秒
