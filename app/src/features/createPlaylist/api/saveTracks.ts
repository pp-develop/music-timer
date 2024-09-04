import { fetchWithRetry } from '../../../lib/axos';

export function SaveTracksFromFollowedArtists() {
    fetchWithRetry('/tracks/followed-artists', 'POST', {
        data: {
            'includeFavoriteArtists': true,
        },
        timeout: 0
    })
}
