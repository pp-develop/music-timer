import { axios } from '../../../lib/axos';

export type Response = {
    httpStatus: number;
};

export function deletePlaylist(): Promise<Response> {
    return new Promise((resolve) => {

        const response: Response = {
            httpStatus: 0
        };

        axios.delete('/playlist')
            .then(function (res) {
                response.httpStatus = res.status
            })
            .catch(function (error) {
                response.httpStatus = error.status
            })
            .finally(function () {
                resolve(response)
            });
    });
};
