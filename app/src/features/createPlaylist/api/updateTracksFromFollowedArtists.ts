import { fetchWithRetry } from '../../../lib/axos';

export function UpdateTracksFromFollowedArtists() {
    fetchWithRetry('/tracks/followed-artists', 'POST', {
        timeout: 0
    })
}
