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

/**
 * Web版セッション切れハンドラー
 *
 * 401エラー発生時に呼び出され、以下の処理を実行する:
 * 1. サーバー側のセッションを削除 (DELETE /auth/web/session)
 * 2. ホームページ (/) へリダイレクト
 *
 * Web版はCookie/Session認証を使用しているため、セッションが切れた場合は
 * リトライせず、再ログインが必要となる。
 */
async function handleWebSessionExpired() {
  try {
    // サーバー側のセッションを削除
    await axios.delete('/auth/web/session');
  } catch (e) {
    console.error('Failed to delete session:', e);
  } finally {
    // ホームページへリダイレクト（再ログインが必要）
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

/**
 * axios-retry リトライ設定
 *
 * 【retryCondition と onRetry の違い】
 * - retryCondition: エラー発生時に「リトライするか判断」する関数（戻り値: true/false）
 *   → エラー発生時に必ず呼ばれる
 *   → return true: リトライする（onRetry が実行される）
 *   → return false: リトライしない（onRetry は実行されない）
 *
 * - onRetry: リトライする直前に「前処理を実行」する関数（戻り値: なし）
 *   → retryCondition が true を返した場合のみ呼ばれる
 *   → トークンリフレッシュやログ出力などを実行
 *
 * 【リトライ回数】
 * - 最大3回 (MAX_RETRIES = 3)
 * - リトライ間隔: 1秒 → 2秒 → 3秒 (retryCount * 1000ms)
 *
 * 【リトライされるエラー（全プラットフォーム共通）】
 * - タイムアウト: ECONNABORTED, ETIMEDOUT
 * - サービス起動エラー: 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout
 * - サーバーエラー: 500 Internal Server Error
 * - ネットワークエラー: axiosRetry.isNetworkOrIdempotentRequestError() に該当するエラー
 *   （ネットワーク接続エラー、またはGET/HEAD/OPTIONS/PUT/DELETEなどの冪等リクエスト）
 *
 * 【401 Unauthorized エラーの特別処理】
 * - Web版（Cookie/Session認証）:
 *   → retryCondition で return false を返してリトライしない
 *   → handleWebSessionExpired() でセッション削除 + ホームへリダイレクト
 *   → onRetry には到達しない（retryCondition が false を返すため）
 *
 * - Native版（JWT認証）:
 *   → retryCondition で return true を返してリトライを許可
 *   → onRetry で refreshAuthToken() を実行してトークンを更新
 *   → リフレッシュ成功時は元のリクエストをリトライ（最大3回）
 *   → リフレッシュ失敗時は tokenRefreshed フラグが true になり、次回リトライ時にログアウト
 *
 * 【例】
 * - Web版でプレイリスト作成時に500エラー → 最大3回リトライ（1秒、2秒、3秒間隔）
 * - Web版でプレイリスト作成時に401エラー → retryCondition で即座にログアウト（onRetry は実行されない）
 * - Native版でプレイリスト作成時に401エラー → retryCondition で true、onRetry でトークンリフレッシュ、最大3回リトライ
 */
axiosRetry(axios, {
  retries: MAX_RETRIES, // 最大リトライ回数（3回）
  retryDelay: (retryCount) => {
    // リトライ回数に応じてリトライ間隔を設定（1秒, 2秒, 3秒）
    return retryCount * 1000;
  },
  // エラー発生時に「リトライするか判断」する関数
  // return true → リトライする（onRetry が実行される）
  // return false → リトライしない（onRetry は実行されない）
  retryCondition: async (error) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const isServiceUnavailable = status === 502 || status === 503 || status === 504;

    // 【401エラーの場合: プラットフォーム別処理】
    if (status === 401) {
      // Web版: Cookie/Session認証のセッション切れ
      // → リトライせず、セッション削除してホームへリダイレクト
      if (Platform.OS === 'web') {
        await handleWebSessionExpired();
        return false; // リトライしない → onRetry は実行されない
      }

      // Native版: JWTトークンの有効期限切れ
      // → トークンリフレッシュを試みるためリトライを許可
      if (!tokenRefreshed) {
        return true; // リトライする → onRetry でトークンリフレッシュが実行される
      } else {
        // リフレッシュ失敗済みの場合はトークンをクリアしてログアウト
        await clearTokens();
        return false; // リトライしない → onRetry は実行されない
      }
    }

    // 【その他のエラー: 全プラットフォーム共通でリトライ】
    // - タイムアウトエラー (ECONNABORTED, ETIMEDOUT)
    // - サービス起動エラー (502, 503, 504)
    // - サーバーエラー (500)
    // - ネットワークエラー/冪等リクエストエラー
    return isTimeout ||
      isServiceUnavailable ||
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 500;
  },
  // リトライする直前に「前処理を実行」する関数
  // retryCondition が true を返した場合のみ呼ばれる
  // 【実行されるケース】
  // - Web版: 500エラー、502/503/504エラー、タイムアウトエラーなど
  // - Native版: 上記に加えて401エラー（トークンリフレッシュ）
  onRetry: async (retryCount, error, requestConfig) => {
    if (error.response && error.response?.status === 401) {
      // 【401エラーの場合（Native版のみ到達）】
      if (!tokenRefreshed) {
        console.log(`Retry refresh auth token`);
        await refreshAuthToken(); // トークンリフレッシュ後にリトライが実行される
      }
      return;
    }

    // 【タイムアウトやサービス起動待ちの場合（全プラットフォーム共通）】
    // Web版・Native版ともに、これらのエラーではここに到達する
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

/**
 * トークンリフレッシュ関数（Native版専用）
 *
 * 401エラー発生時に onRetry から呼び出され、以下の処理を実行する:
 * 1. リフレッシュトークンを取得
 * 2. アクセストークンの有効期限をチェック
 * 3. 期限切れの場合、/auth/native/refresh を呼び出して新しいトークンペアを取得
 * 4. 新しいトークンペアを保存
 *
 * 【動作フロー】
 * - 成功時: tokenRefreshed フラグを false にリセットし、元のリクエストがリトライされる
 * - 失敗時: tokenRefreshed フラグを true のままにし、retryCondition でログアウト処理が実行される
 *
 * 【注意】
 * Web版では使用されない（Web版は Cookie/Session 認証のためリフレッシュ不要）
 */
async function refreshAuthToken() {
  tokenRefreshed = true;

  try {
    // リフレッシュトークンを取得
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // アクセストークンが期限切れかチェック
    const expired = await isTokenExpired();
    if (!expired) {
      tokenRefreshed = false; // まだ有効なのでフラグをリセット
      return;
    }

    // リフレッシュエンドポイントを呼び出して新しいトークンペアを取得
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
    // tokenRefreshed は true のまま（次のリトライ時に retryCondition でログアウト処理が実行される）
  }
}
