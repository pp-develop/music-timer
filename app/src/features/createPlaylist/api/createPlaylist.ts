import { axios } from '../../../lib/axos';

type Response = {
    playlistId: string;
    httpStatus: number;
};

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
