import { axios } from '../../../lib/axos';

export type Response = {
    playlistIDs: Array<any>;
    httpStatus: number;
};

export function getPlaylist(): Promise<Response> {
    return new Promise((resolve, reject) => {
        const response: Response = {
            playlistIDs: [],
            httpStatus: 0
        };

        axios.get('/playlist')
            .then(function (res) {
                response.playlistIDs = res.data
                response.httpStatus = res.status
                resolve(response)
            })
            .catch(function (error) {
                response.httpStatus = error.response.status
            })
            .finally(function () {
                resolve(response)
            });
    });
};
