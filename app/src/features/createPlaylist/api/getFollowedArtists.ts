import { fetchWithRetry } from '../../../lib/axos';

export type Artist = {
    ID: string;
    Name: string;
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

        fetchWithRetry('/artists', 'GET', {
            data: {
            },
        })
            .then(function (response) {
                if (response.status == 200) {
                    getArtists.artists = response.data.map((item: any) => (
                        {
                            ID: item.ID,
                            Name: item.Name,
                            ImageUrl: item.ImageUrl
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
