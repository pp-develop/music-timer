import { fetchWithRetry } from '../../../lib/axos';

export function UpdateFavoriteTracks() {
    fetchWithRetry('/tracks/favorite-tracks', 'POST', {
        timeout: 0
    })
}
