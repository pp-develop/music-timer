import { axios } from '../../../lib/axos';

export type Artist = {
    ID: string;
    Name: string;
};

type Response = {
    artists: Artist[];
    httpStatus: number;
};

export function GetFollowedArtists(): Promise<Response> {
    return new Promise((resolve) => {

        const getArtists: Response = {
            artists: [],
            httpStatus: 0
        };

        axios.get('/artists',
            {
            },
        )
            .then(function (response) {
                if (response.status == 200) {
                    getArtists.artists = response.data.map((item: any) => (
                        {
                            ID: item.ID,
                            Name: item.Name
                        }));
                    getArtists.httpStatus = response.status;
                }
            })
            .catch(function (error) {
                getArtists.httpStatus = error.response.status
            })
            .finally(function () {
                resolve(getArtists)
            });
    });
};
