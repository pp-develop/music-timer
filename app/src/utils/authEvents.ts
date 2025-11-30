import { EventEmitter } from 'events';

/**
 * 認証イベントエミッター
 *
 * 認証状態の変更をアプリ全体に通知するためのイベントシステム。
 * tokenManager と useSpotifyAuth の間を疎結合に保つ。
 *
 * イベント:
 * - 'auth:cleared': トークンがクリアされた時に発行
 */
export const authEvents = new EventEmitter();

// イベント名の定数
export const AUTH_EVENTS = {
  CLEARED: 'auth:cleared',
} as const;
