import { axios } from '../../../lib/axos';
import { Response } from '../types/index';

export type AuthzResponse = {
    authzUrl: string;
    httpStatus: number;
};

export function authz(): Promise<AuthzResponse> {
    return new Promise((resolve) => {

        const response: AuthzResponse = {
            authzUrl: "",
            httpStatus: 0,
        };

        axios.get('/authz-url', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
        })
            .then(function (res) {
                response.authzUrl = res.data.url;
                response.httpStatus = res.status
            })
            .catch(function (error) {
                console.log(error);
                response.httpStatus = error.status
            })
            .finally(function () {
                return resolve(response)
            });
    });
};

export function auth(): Promise<Response> {
    return new Promise((resolve) => {

        const response :Response = {
            httpStatus : 0
        }

        axios.get('/auth', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                "Access-Control-Allow-Credentials": 'true',
            },
            withCredentials: true,
        })
            .then(function (res) {
                response.httpStatus = res.status
            })
            .catch(function (error) {
                response.httpStatus = error.status
            })
            .finally(function () {
                return resolve(response)
            });
    });
};

export function logout(): Promise<Response> {
    return new Promise((resolve) => {

        const response: Response = {
            httpStatus: 0,
        };

        axios.delete('/session', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                "Access-Control-Allow-Credentials": 'true',
            },
            withCredentials: true,
        })
            .then(function (res) {
                response.httpStatus = res.status
            })
            .catch(function (error) {
                response.httpStatus = error.status
            })
            .finally(function () {
                return resolve(response)
            });
    });
};