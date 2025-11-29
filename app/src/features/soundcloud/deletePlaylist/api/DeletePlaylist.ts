import { fetchWithRetry } from '../../../../lib/axos';
import { t } from '../../../../locales/i18n';

export type Response = {
    httpStatus: number;
};

export function deletePlaylist(): Promise<Response> {
    return new Promise((resolve, reject) => {
        const response: Response = {
            httpStatus: 0
        };

        fetchWithRetry('/soundcloud/playlists', 'DELETE')
            .then(function (res) {
                response.httpStatus = res.status
                resolve(response)
            })
            .catch(function (error) {
                reject(new Error(t('toast.playlistDeleteError')));
            })
    });
};
