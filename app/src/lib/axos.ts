import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_URL, BASE_URL } from '../config';
import { t } from './../locales/i18n';

let tokenRefreshed = false; // トークンが更新されたかどうかを示すフラグ

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': BASE_URL,
    'Access-Control-Allow-Headers': '*',
    "Access-Control-Allow-Credentials": 'true',
  },
  withCredentials: true,
  timeout: 8000, // タイムアウト時間を設定（8秒）
});

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
      await axios.delete('/session');
      window.location.href = '/';
      return false;
    }
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 401;
  },
  onRetry: async (retryCount, error, requestConfig) => {
    // 401 エラーの場合にトークンを更新
    if (error.response && error.response?.status === 401) {
      if (!tokenRefreshed) {
        console.log(`Retry refresh auth token`);
        await refreshAuthToken();
      }
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

async function refreshAuthToken() {
  tokenRefreshed = true; // トークンの更新を試みたことを記録
  try {
    await axios.get('/auth');
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
}
