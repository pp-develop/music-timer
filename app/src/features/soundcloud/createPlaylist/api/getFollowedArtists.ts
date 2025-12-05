import { fetchWithRetry } from '../../../../lib/axos';

export type Artist = {
    ID: string;
    Name: string;
    Color: string;
};

type Response = {
    artists: Artist[];
    httpStatus: number;
};

export function GetFollowedArtists(): Promise<Response> {
    return new Promise((resolve, reject) => {

        const getArtists: Response = {
            artists: [],
            httpStatus: 0
        };

        fetchWithRetry('/soundcloud/artists', 'GET', {
            data: {
            },
        })
            .then(function (response) {
                if (response.status == 200) {
                    getArtists.artists = response.data.map((item: any) => (
                        {
                            ID: item.id,
                            Name: item.name,
                            ImageUrl: item.image_url
                        }));
                    getArtists.httpStatus = response.status;
                }
                resolve(getArtists)
            })
            .catch(function (error) {
                getArtists.httpStatus = error.response?.status
                reject(getArtists)
            })
    });
};
