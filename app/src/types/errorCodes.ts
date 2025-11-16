// エラーコード定義
export const ErrorCodes = {
  NOT_ENOUGH_TRACKS: 'NOT_ENOUGH_TRACKS',
  NO_FAVORITE_TRACKS: 'NO_FAVORITE_TRACKS',
  TRACKS_NOT_FOUND: 'TRACKS_NOT_FOUND',
  SPOTIFY_RATE_LIMIT: 'SPOTIFY_RATE_LIMIT',
  PLAYLIST_QUOTA_EXCEEDED: 'PLAYLIST_QUOTA_EXCEEDED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  PLAYLIST_CREATION_FAILED: 'PLAYLIST_CREATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// エラーコードを翻訳キーに変換する関数
export const getErrorMessageKey = (code?: string): string => {
  if (!code) {
    return 'error.default';
  }

  // エラーコードから翻訳キーを生成
  return `error.${code.toLowerCase()}`;
};
