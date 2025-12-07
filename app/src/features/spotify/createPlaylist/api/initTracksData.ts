import { fetchWithRetry } from '../../../../lib/axos';

// 実行中のPromiseを保持（重複実行防止）
let favoriteInitPromise: Promise<void> | null = null;
let followedArtistsInitPromise: Promise<void> | null = null;

/**
 * お気に入りトラックの初期化
 * 実行中に再度呼ばれた場合は同じPromiseを返す（重複実行防止）
 */
export function InitFavoriteTracksData(): Promise<void> {
    if (favoriteInitPromise) {
        return favoriteInitPromise;
    }

    favoriteInitPromise = fetchWithRetry('/api/spotify/tracks/init/favorites', 'POST', {
        timeout: 0
    }).finally(() => {
        favoriteInitPromise = null;
    });

    return favoriteInitPromise;
}

/**
 * フォローアーティストのトラック初期化
 * 実行中に再度呼ばれた場合は同じPromiseを返す（重複実行防止）
 */
export function InitFollowedArtistsTracksData(): Promise<void> {
    if (followedArtistsInitPromise) {
        return followedArtistsInitPromise;
    }

    followedArtistsInitPromise = fetchWithRetry('/api/spotify/tracks/init/followed-artists', 'POST', {
        timeout: 0
    }).finally(() => {
        followedArtistsInitPromise = null;
    });

    return followedArtistsInitPromise;
}
