import { fetchWithRetry } from '../../../../lib/axos';

type Response = {
    playlistId: string;
    secretToken: string;
    httpStatus: number;
    errorCode?: string;
};

export function CreatePlaylistWithSpecifyArtists(minute: string, selectedArtistIds: any[]): Promise<Response> {
    return new Promise((resolve, reject) => {
        const createPlaylist: Response = {
            playlistId: "",
            secretToken: "",
            httpStatus: 0
        };

        fetchWithRetry('/soundcloud/playlists/from-artists', 'POST', {
            data: {
                'minute': parseInt(minute),
                'artistIds': selectedArtistIds
            },
            timeout: 16000
        })
            .then(function (response) {
                if (response.status == 201) {
                    createPlaylist.playlistId = response.data.playlist_id
                    createPlaylist.secretToken = response.data.secret_token || ""
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
