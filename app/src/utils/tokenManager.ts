import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// トークンの保存（ネイティブのみ）
export async function saveTokens(tokenPair: TokenPair): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenPair.access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenPair.refresh_token);
    const expiryTime = Date.now() + tokenPair.expires_in * 1000;
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to save tokens:', error);
    throw error;
  }
}

// アクセストークンの取得（ネイティブのみ）
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

// リフレッシュトークンの取得（ネイティブのみ）
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

// トークンの有効期限チェック（ネイティブのみ）
export async function isTokenExpired(): Promise<boolean> {
  try {
    const expiryStr = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);

    if (!expiryStr) return true;

    const expiryTime = parseInt(expiryStr, 10);
    // 5分前をバッファとして設定
    return Date.now() >= expiryTime - 5 * 60 * 1000;
  } catch (error) {
    console.error('Failed to check token expiry:', error);
    return true;
  }
}

// トークンのクリア（ログアウト時、ネイティブのみ）
export async function clearTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);

    // トークンをクリアしたらログイン画面へリダイレクト
    // 認証が必要な画面から自動的にログアウトさせる
    router.replace('/');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    // エラーが発生してもログイン画面へリダイレクト
    router.replace('/');
  }
}
