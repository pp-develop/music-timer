import { fetchWithRetry, axios } from '../../../../lib/axos';
import { Response } from '../types/index';
import { Platform } from 'react-native';
import { authEvents, AUTH_EVENTS } from '../../../../utils/authEvents';

export type AuthzResponse = {
    authzUrl: string;
    httpStatus: number;
};

export function authz(): Promise<AuthzResponse> {
    return new Promise((resolve, reject) => {

        const response: AuthzResponse = {
            authzUrl: "",
            httpStatus: 0,
        };

        // プラットフォームに応じてエンドポイントを切り替え
        const endpoint = Platform.OS === 'web'
            ? '/api/soundcloud/auth/web/authz-url'     // Web: Cookie認証
            : '/api/soundcloud/auth/native/authz-url'; // Native: JWT認証

        fetchWithRetry(endpoint)
            .then(function (res) {
                response.authzUrl = res.data.url;
                response.httpStatus = res.status
                resolve(response)
            })
            .catch(function (error) {
                response.httpStatus = error.response?.status
                reject(response);
            })
    });
};

export type AuthStatusResponse = {
    authenticated: boolean;
    httpStatus: number;
};

export function auth(): Promise<AuthStatusResponse> {
    return new Promise((resolve, reject) => {

        const response: AuthStatusResponse = {
            authenticated: false,
            httpStatus: 0
        }

        // プラットフォームに応じてエンドポイントを切り替え
        const endpoint = Platform.OS === 'web'
            ? '/api/soundcloud/auth/web/status'     // Web: Cookie認証
            : '/api/soundcloud/auth/native/status'; // Native: JWT認証

        fetchWithRetry(endpoint, 'GET')
            .then(function (res) {
                response.httpStatus = res.status;
                response.authenticated = res.data.authenticated ?? false;
                resolve(response);
            })
            .catch(function (error) {
                response.httpStatus = error.response?.status;
                // エラー時は何もしない（authenticatedはfalseのまま）
                resolve(response);
            })
    });
};

export function logout(): Promise<Response> {
    return new Promise(async (resolve, reject) => {

        const response: Response = {
            httpStatus: 0,
        };

        try {
            // プラットフォームに応じてログアウト処理を切り替え
            if (Platform.OS === 'web') {
                // Web: セッション削除 + イベント発行
                const res = await fetchWithRetry('/api/soundcloud/auth/web/session', 'DELETE');
                response.httpStatus = res.status;
                authEvents.emit(AUTH_EVENTS.SOUNDCLOUD_CLEARED);
            } else {
                // Native: ローカルのトークンをクリア（clearTokens内でイベント発行）
                const { clearTokens } = await import('../../../../utils/tokenManager');
                await clearTokens('soundcloud');
                response.httpStatus = 200;
            }
            resolve(response);
        } catch (error: any) {
            response.httpStatus = error.response?.status || 500;
            reject(response);
        }
    });
};
