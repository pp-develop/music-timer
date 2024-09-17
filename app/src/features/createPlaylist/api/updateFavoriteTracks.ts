import { fetchWithRetry } from '../../../lib/axos';

export async function UpdateFavoriteTracks() {
    await fetchWithRetry('/tracks/favorite-tracks', 'POST', {
        timeout: 0
    })
}
