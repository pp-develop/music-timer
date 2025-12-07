/**
 * SoundCloud プレイリストを開く（フォールバック）
 *
 * このファイルは通常使用されることはありませんが、Expo Router の仕様により必須です。
 * プラットフォーム固有のファイル（openSoundCloud.android.ts、openSoundCloud.web.ts）が存在する場合でも、
 * フォールバック用のファイル（プラットフォーム拡張子なし）が必要になります。
 *
 * 現在の使用状況:
 * - Android: openSoundCloud.android.ts が優先的に使用される
 * - Web: openSoundCloud.web.ts が優先的に使用される
 * - iOS等その他: このファイルが使用される（念のため）
 *
 * 実装内容: openSoundCloud.web.ts と同等の内容
 *
 * @param playlistId - SoundCloudプレイリストのID
 */
export const openSoundCloud = (playlistId: string): void => {
  window.open(`https://soundcloud.com/${playlistId}`, '_blank');
};
