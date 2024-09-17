import { fetchWithRetry } from '../../../lib/axos';

type Response = {
    playlistId: string;
    httpStatus: number;
};

export function CreatePlaylistWithFavoriteTracks(minute: string, selectedArtistIds: any[]): Promise<Response> {
    return new Promise((resolve, reject) => {
        const createPlaylist: Response = {
            playlistId: "",
            httpStatus: 0
        };

        fetchWithRetry('/playlist', 'POST', {
            data: {
                'minute': parseInt(minute),
                'includeFavoriteTracks': true,
                'artistIds': selectedArtistIds,
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
                reject(createPlaylist)
            })
    });
};