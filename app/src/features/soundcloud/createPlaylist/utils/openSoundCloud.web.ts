/**
 * SoundCloud プレイリストを開く（Web専用）
 *
 * このファイルは Web プラットフォームで使用されます。
 * window.open() を使用して新しいタブでSoundCloudプレイリストを開きます。
 *
 * @param playlistId - SoundCloudプレイリストのID
 */
export const openSoundCloud = (playlistId: string): void => {
  window.open(`https://soundcloud.com/${playlistId}`, '_blank');
};
