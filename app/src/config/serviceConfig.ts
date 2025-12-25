/**
 * サービス別の設定を一元管理
 */
export const SERVICE_CONFIG = {
  spotify: {
    color: '#1DB954',
    name: 'Spotify',
  },
  soundcloud: {
    color: '#FF5500',
    name: 'SoundCloud',
  },
} as const;

export type ServiceType = keyof typeof SERVICE_CONFIG;

/**
 * サービスのブランドカラーを取得
 * @param service サービスタイプ
 * @returns ブランドカラー（デフォルト: Spotifyの緑）
 */
export const getServiceColor = (service: ServiceType | null | undefined): string => {
  if (service && service in SERVICE_CONFIG) {
    return SERVICE_CONFIG[service].color;
  }
  return SERVICE_CONFIG.spotify.color;
};

/**
 * サービス名を取得
 * @param service サービスタイプ
 * @returns サービス名
 */
export const getServiceName = (service: ServiceType | null | undefined): string => {
  if (service && service in SERVICE_CONFIG) {
    return SERVICE_CONFIG[service].name;
  }
  return SERVICE_CONFIG.spotify.name;
};
