import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_URL, BASE_URL } from '../config';
import { Platform } from 'react-native';
import { getAccessToken, getRefreshToken, saveTokens, isTokenExpired, clearTokens } from '../utils/tokenManager';

let tokenRefreshed = false; // トークンが更新されたかどうかを示すフラグ

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': BASE_URL,
    'Access-Control-Allow-Headers': '*',
  },
  // Web版のみCookie認証を有効化
  withCredentials: Platform.OS === 'web',
  timeout: 8000, // タイムアウト時間を設定（8秒）
});

// リクエストインターセプター（ネイティブのみJWT認証ヘッダー追加）
axios.interceptors.request.use(
  async (config) => {
    // ネイティブプラットフォームの場合のみ、JWTトークンをヘッダーに追加
    if (Platform.OS !== 'web') {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    // Web版はCookieで自動的に認証されるため、何もしない
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// リトライ設定
axiosRetry(axios, {
  retries: 3, // 最大リトライ回数
  retryDelay: (retryCount) => {
    // リトライ回数に応じてリトライ間隔を設定（1秒, 2秒, 4秒）
    return retryCount * 1000;
  },
  retryCondition: async (error) => {
    // トークンがリフレッシュされた場合はリトライしない
    if (tokenRefreshed) {
      // プラットフォームごとに異なる処理
      if (Platform.OS === 'web') {
        await axios.delete('/auth/web/session');
        window.location.href = '/';
      } else {
        await clearTokens();
      }
      return false;
    }

    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const isServiceUnavailable = status === 502 || status === 503 || status === 504;

    // タイムアウトとサービス起動エラーを追加
    return isTimeout ||
      isServiceUnavailable ||
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 401 ||
      status === 500;
  },
  onRetry: async (retryCount, error, requestConfig) => {
    // 401 エラーの場合にトークンを更新
    if (error.response && error.response?.status === 401) {
      if (!tokenRefreshed) {
        console.log(`Retry refresh auth token`);
        await refreshAuthToken();
      }
      return;
    }

    // タイムアウトやサービス起動待ちの場合
    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const status = error.response?.status;

    if (isTimeout || status === 503 || status === 502 || status === 504) {
      console.log(`Service is starting or slow to respond... Retry ${retryCount}/3`);
    }
  }
});

// リクエストのラッパー関数
export async function fetchWithRetry(url, method = 'GET', config = {}) {
  try {
    const response = await axios({ url, method, ...config });
    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

// トークンリフレッシュ関数（プラットフォームごとに分岐）
async function refreshAuthToken() {
  tokenRefreshed = true;

  try {
    if (Platform.OS === 'web') {
      // Web: セッションベース認証のリフレッシュ（既存の処理）
      await axios.get('/auth/status');
    } else {
      // Native: JWTトークンのリフレッシュ
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // トークンが期限切れかチェック
      const expired = await isTokenExpired();
      if (!expired) {
        tokenRefreshed = false; // まだ有効なのでフラグをリセット
        return;
      }

      // リフレッシュエンドポイントを呼び出し
      const response = await axios.post('/auth/native/refresh', {
        refresh_token: refreshToken,
      });

      const newTokenPair = response.data;
      await saveTokens(newTokenPair);

      tokenRefreshed = false; // 成功したのでフラグをリセット
      console.log('Token refreshed successfully');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    if (Platform.OS !== 'web') {
      await clearTokens();
    }
    // エラーをスローしない: retryCondition で tokenRefreshed === true が検出され、
    // プラットフォーム別のログアウト処理（Web: セッション削除+リダイレクト、Native: トークンクリア）が実行される
  }
}
