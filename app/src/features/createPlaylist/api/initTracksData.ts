import { fetchWithRetry } from '../../../lib/axos';

/**
 * お気に入りトラックの初期化
 */
export async function InitFavoriteTracksData() {
    await fetchWithRetry('/tracks/init/favorites', 'POST', {
        timeout: 0
    });
}

/**
 * フォローアーティストのトラック初期化
 */
export async function InitFollowedArtistsTracksData() {
    await fetchWithRetry('/tracks/init/followed-artists', 'POST', {
        timeout: 0
    });
}
