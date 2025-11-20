import { fetchWithRetry, axios } from '../../../lib/axos';
import { Response } from '../types/index';
import { Platform } from 'react-native';

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
            ? '/auth/web/authz-url'     // Web: Cookie認証
            : '/auth/native/authz-url'; // Native: JWT認証

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

export function auth(): Promise<Response> {
    return new Promise((resolve, reject) => {

        const response: Response = {
            httpStatus: 0
        }

        fetchWithRetry('/auth/status')
            .then(function (res) {
                response.httpStatus = res.status
                resolve(response)
            })
            .catch(function (error) {
                response.httpStatus = error.response?.status
                reject(response);
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
                // Web: セッション削除
                const res = await fetchWithRetry('/auth/web/session', 'DELETE');
                response.httpStatus = res.status;
            } else {
                // Native: ローカルのトークンをクリア
                const { clearTokens } = await import('../../../utils/tokenManager');
                await clearTokens();
                response.httpStatus = 200;
            }
            resolve(response);
        } catch (error) {
            response.httpStatus = error.response?.status || 500;
            reject(response);
        }
    });
};