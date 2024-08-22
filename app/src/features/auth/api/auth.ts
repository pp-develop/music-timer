import { fetchWithRetry, axios } from '../../../lib/axos';
import { Response } from '../types/index';

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

        fetchWithRetry('/authz-url')
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

        fetchWithRetry('/auth')
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
    return new Promise((resolve, reject) => {

        const response: Response = {
            httpStatus: 0,
        };

        fetchWithRetry('/session', "DELETE")
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