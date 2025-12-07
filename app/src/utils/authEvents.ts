/**
 * シンプルなイベントエミッター
 * React Native では Node.js の events モジュールが使えないため、カスタム実装
 */
type Listener = () => void;

class SimpleEventEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  emit(event: string): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener());
    }
  }
}

/**
 * 認証イベントエミッター
 *
 * 認証状態の変更をアプリ全体に通知するためのイベントシステム。
 * tokenManager と useSpotifyAuth/useSoundCloudAuth の間を疎結合に保つ。
 *
 * イベント:
 * - 'auth:spotify:cleared': Spotifyトークンがクリアされた時に発行
 * - 'auth:soundcloud:cleared': SoundCloudトークンがクリアされた時に発行
 */
export const authEvents = new SimpleEventEmitter();

// イベント名の定数（サービス別）
export const AUTH_EVENTS = {
  SPOTIFY_CLEARED: 'auth:spotify:cleared',
  SOUNDCLOUD_CLEARED: 'auth:soundcloud:cleared',
} as const;

// サービスタイプからイベント名へのマッピング
export const AUTH_CLEARED_EVENTS = {
  spotify: AUTH_EVENTS.SPOTIFY_CLEARED,
  soundcloud: AUTH_EVENTS.SOUNDCLOUD_CLEARED,
} as const;
