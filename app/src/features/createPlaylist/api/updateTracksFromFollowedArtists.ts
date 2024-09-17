import { fetchWithRetry } from '../../../lib/axos';

export async function UpdateTracksFromFollowedArtists() {
    await fetchWithRetry('/tracks/followed-artists', 'POST', {
        timeout: 0
    })
}
