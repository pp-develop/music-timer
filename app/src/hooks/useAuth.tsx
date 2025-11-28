/**
 * 互換性レイヤー: useAuth.tsx
 *
 * このファイルは既存のコードとの互換性を保つために存在します。
 * 実際の実装はuseSpotifyAuth.tsxにあります。
 *
 * 現在、Spotify認証のみサポートしているため、useAuth === useSpotifyAuth です。
 * 将来的にSoundCloudなど他のサービスを追加する際は、
 * このファイルでサービスを切り替えるロジックを実装するか、
 * 各コンポーネントで明示的にuseSpotifyAuth/useSoundCloudAuthを使用してください。
 */

export {
  useSpotifyAuth as useAuth,
  SpotifyAuthProvider as AuthProvider,
  type SpotifyAuthContextProps as AuthContextProps
} from './useSpotifyAuth';

/**
 * 注意:
 * index.tsx などのログイン画面では、まだこのuseAuthを使用していますが、
 * これは現状Spotify認証のみなので問題ありません。
 *
 * 将来的にマルチサービス対応する場合は、ログイン画面を
 * サービス選択画面に変更し、各サービスの認証を独立させる必要があります。
 */
