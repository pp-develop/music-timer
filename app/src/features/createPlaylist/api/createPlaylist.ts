import { axios } from '../../../lib/axos';

export type CreatePlaylistResponse = {
    playlistId: string;
    httpStatus: number;
};

export function createPlaylist(minute: string): Promise<CreatePlaylistResponse> {
    return new Promise((resolve) => {

        const createPlaylist: CreatePlaylistResponse = {
            playlistId: "",
            httpStatus: 0
        };

        axios.post('/playlist',
            {
                'minute': parseInt(minute)
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Credentials": 'true',
                },
                withCredentials: true,
            },
        )
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    createPlaylist.playlistId = response.data
                    createPlaylist.httpStatus = response.status
                }
            })
            .catch(function (error) {
                console.error(error);
                createPlaylist.httpStatus = error.status
            })
            .finally(function () {
                resolve(createPlaylist)
            });
    });
};
