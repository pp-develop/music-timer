import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_URL, BASE_URL } from '../config';
import { Platform } from 'react-native';
import { getAccessToken, getRefreshToken, saveTokens, isTokenExpired, clearTokens } from '../utils/tokenManager';
import { MAX_RETRIES } from '../utils/errorHandler';

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

// Web版セッション切れハンドラー
async function handleWebSessionExpired() {
  try {
    // セッションを削除してホームへリダイレクト
    await axios.delete('/auth/web/session');
  } catch (e) {
    console.error('Failed to delete session:', e);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

// リトライ設定
axiosRetry(axios, {
  retries: MAX_RETRIES, // 最大リトライ回数
  retryDelay: (retryCount) => {
    // リトライ回数に応じてリトライ間隔を設定（1秒, 2秒, 4秒）
    return retryCount * 1000;
  },
  retryCondition: async (error) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const isServiceUnavailable = status === 502 || status === 503 || status === 504;

    // 401エラーの場合
    if (status === 401) {
      // Web版: セッション切れなのでリトライせず、即座にログアウト
      if (Platform.OS === 'web') {
        await handleWebSessionExpired();
        return false; // リトライしない
      }

      // Native版: トークンリフレッシュを試みるのでリトライする
      if (!tokenRefreshed) {
        return true;
      } else {
        // リフレッシュ失敗済みの場合はログアウト
        await clearTokens();
        return false;
      }
    }

    // タイムアウトとサービス起動エラー
    return isTimeout ||
      isServiceUnavailable ||
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 500;
  },
  onRetry: async (retryCount, error, requestConfig) => {
    // 401 エラーの場合（Native版のみ到達）
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
export async function fetchWithRetry(url: string, method: string = 'GET', config: any = {}) {
  try {
    const response = await axios({ url, method, ...config });
    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

// トークンリフレッシュ関数（Native専用）
async function refreshAuthToken() {
  tokenRefreshed = true;

  try {
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
  } catch (error) {
    console.error('Token refresh failed:', error);
    await clearTokens();
    // tokenRefreshed は true のまま（retryCondition でログアウト処理が実行される）
  }
}
