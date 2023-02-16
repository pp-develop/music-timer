import { axios } from '../../../lib/axos';
import { Response } from '../types/index'

export function CreatePlaylist(minute: string): Promise<Response> {
    return new Promise((resolve) => {

        const createPlaylist: Response = {
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
                createPlaylist.httpStatus = error.response.status
            })
            .finally(function () {
                resolve(createPlaylist)
            });
    });
};
