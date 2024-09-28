import { fetchWithRetry } from '../../../lib/axos';

export async function InitTracksData() {
    await fetchWithRetry('/tracks/init', 'POST', {
        timeout: 0
    })
}
