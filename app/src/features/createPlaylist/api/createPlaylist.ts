import { fetchWithRetry } from '../../../lib/axos';

type Response = {
    playlistId: string;
    httpStatus: number;
    errorCode?: string;
};

export function CreatePlaylist(minute: string): Promise<Response> {
    return new Promise((resolve, reject) => {

        const createPlaylist: Response = {
            playlistId: "",
            httpStatus: 0
        };

        fetchWithRetry('/spotify/playlists', 'POST', {
            data: {
                'minute': parseInt(minute)
            },
            timeout: 16000
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
                createPlaylist.errorCode = error.response?.data?.code
                reject(createPlaylist)
            })
    });
};
