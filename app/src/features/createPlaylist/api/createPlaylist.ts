import { fetchWithRetry } from '../../../lib/axos';

type Response = {
    playlistId: string;
    httpStatus: number;
};

export function CreatePlaylist(minute: string): Promise<Response> {
    return new Promise((resolve, reject) => {

        const createPlaylist: Response = {
            playlistId: "",
            httpStatus: 0
        };

        fetchWithRetry('/playlist', 'POST', {
            data: {
                'minute': parseInt(minute)
            },
            timeout: 15000
        })
            .then(function (response) {
                if (response.status == 201) {
                    createPlaylist.playlistId = response.data
                    createPlaylist.httpStatus = response.status
                }
                resolve(createPlaylist)
            })
            .catch(function (error) {
                createPlaylist.httpStatus = error.response?.status
                reject(createPlaylist)
            })
    });
};
