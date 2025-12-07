import { fetchWithRetry } from '../../../../lib/axos';

/**
 * お気に入りトラックが存在するかチェック
 * @returns true: 存在する, false: 存在しない or エラー
 */
export const CheckFavoritesExists = async (): Promise<boolean> => {
    try {
        const response = await fetchWithRetry(
            '/api/soundcloud/tracks/favorites/exists',
            'GET',
            { timeout: 5000 }
        );
        return response.data.exists;
    } catch {
        // エラー時はfalseとして扱う（安全側に倒す）
        return false;
    }
};
