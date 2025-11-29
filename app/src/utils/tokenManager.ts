import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export type ServiceType = 'spotify' | 'soundcloud';

const getTokenKey = (service: ServiceType, type: 'access' | 'refresh' | 'expiry'): string => {
  return `${service}_${type}_token`;
};

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// トークンの保存（ネイティブのみ）
export async function saveTokens(tokenPair: TokenPair, service: ServiceType): Promise<void> {
  try {
    await SecureStore.setItemAsync(getTokenKey(service, 'access'), tokenPair.access_token);
    await SecureStore.setItemAsync(getTokenKey(service, 'refresh'), tokenPair.refresh_token);
    const expiryTime = Date.now() + tokenPair.expires_in * 1000;
    await SecureStore.setItemAsync(getTokenKey(service, 'expiry'), expiryTime.toString());
  } catch (error) {
    console.error('Failed to save tokens:', error);
    throw error;
  }
}

// アクセストークンの取得（ネイティブのみ）
export async function getAccessToken(service: ServiceType): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(getTokenKey(service, 'access'));
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

// リフレッシュトークンの取得（ネイティブのみ）
export async function getRefreshToken(service: ServiceType): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(getTokenKey(service, 'refresh'));
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

// トークンの有効期限チェック（ネイティブのみ）
export async function isTokenExpired(service: ServiceType): Promise<boolean> {
  try {
    const expiryStr = await SecureStore.getItemAsync(getTokenKey(service, 'expiry'));

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
export async function clearTokens(service: ServiceType): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(getTokenKey(service, 'access'));
    await SecureStore.deleteItemAsync(getTokenKey(service, 'refresh'));
    await SecureStore.deleteItemAsync(getTokenKey(service, 'expiry'));

    // トークンをクリアしたらログイン画面へリダイレクト
    // 認証が必要な画面から自動的にログアウトさせる
    router.replace('/');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    // エラーが発生してもログイン画面へリダイレクト
    router.replace('/');
  }
}
