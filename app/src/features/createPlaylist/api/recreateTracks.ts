import { fetchWithRetry } from '../../../lib/axos';

export async function RecreateTracks() {
    await fetchWithRetry('/reset-tracks', 'POST', {
        timeout: 0
    })
}
