/**
 * Spotify プレイリストを開く（Android専用）
 *
 * このファイルは Android プラットフォームで使用されます。
 * Linking.openURL() を使用してSpotifyアプリまたはブラウザでプレイリストを開きます。
 *
 * @param playlistId - SpotifyプレイリストのID
 */
import { Linking } from 'react-native';

export const openSpotify = (playlistId: string): void => {
  Linking.openURL(`https://open.spotify.com/playlist/${playlistId}`);
};
