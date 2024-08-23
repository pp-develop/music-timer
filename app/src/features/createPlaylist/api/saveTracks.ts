import { fetchWithRetry } from '../../../lib/axos';

export function SaveTracks() {
    fetchWithRetry('/tracks', 'POST', {
        data: {
            'includeFavoriteArtists': true,
        },
        timeout: 0
    })
}
