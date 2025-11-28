/**
 * Spotify プレイリストを開く（Web専用）
 *
 * このファイルは Web プラットフォームで使用されます。
 * window.open() を使用して新しいタブでSpotifyプレイリストを開きます。
 *
 * @param playlistId - SpotifyプレイリストのID
 */
export const openSpotify = (playlistId: string): void => {
  window.open(`https://open.spotify.com/playlist/${playlistId}?go=1`, '_blank');
};
