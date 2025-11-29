/**
 * SoundCloud プレイリストを開く（Android専用）
 *
 * このファイルは Android プラットフォームで使用されます。
 * Linking.openURL() を使用してSoundCloudアプリまたはブラウザでプレイリストを開きます。
 *
 * @param playlistId - SoundCloudプレイリストのID
 */
import { Linking } from 'react-native';

export const openSoundCloud = (playlistId: string): void => {
  Linking.openURL(`https://soundcloud.com/${playlistId}`);
};
