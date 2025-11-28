/**
 * Spotify プレイリストを開く（フォールバック）
 *
 * このファイルは通常使用されることはありませんが、Expo Router の仕様により必須です。
 * プラットフォーム固有のファイル（openSpotify.android.ts、openSpotify.web.ts）が存在する場合でも、
 * フォールバック用のファイル（プラットフォーム拡張子なし）が必要になります。
 *
 * 現在の使用状況:
 * - Android: openSpotify.android.ts が優先的に使用される
 * - Web: openSpotify.web.ts が優先的に使用される
 * - iOS等その他: このファイルが使用される（念のため）
 *
 * 実装内容: openSpotify.web.ts と同等の内容
 *
 * @param playlistId - SpotifyプレイリストのID
 */
export const openSpotify = (playlistId: string): void => {
  window.open(`https://open.spotify.com/playlist/${playlistId}?go=1`, '_blank');
};
