/**
 * 統一的な認証プロバイダー
 *
 * パスに基づいて必要な認証プロバイダーのみをマウントし、
 * 無駄なAPIリクエストを削減します。
 */

import React, { ReactNode, FC } from 'react';
import { usePathname } from 'expo-router';
import { SpotifyAuthProvider } from './useSpotifyAuth';
import { SoundCloudAuthProvider } from './useSoundCloudAuth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * パスに基づいて適切な認証プロバイダーをマウント
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const pathname = usePathname();

  // ホーム画面では両方の認証状態が必要（サービス選択画面）
  const isHomePage = pathname === '/' || pathname === '/index';
  const isSpotifyPage = pathname.startsWith('/spotify');
  const isSoundCloudPage = pathname.startsWith('/soundcloud');

  const needsSpotify = isHomePage || isSpotifyPage;
  const needsSoundCloud = isHomePage || isSoundCloudPage;

  // 両方必要（ホーム画面）
  if (needsSpotify && needsSoundCloud) {
    return (
      <SpotifyAuthProvider>
        <SoundCloudAuthProvider>
          {children}
        </SoundCloudAuthProvider>
      </SpotifyAuthProvider>
    );
  }

  // Spotifyのみ
  if (needsSpotify) {
    return <SpotifyAuthProvider>{children}</SpotifyAuthProvider>;
  }

  // SoundCloudのみ
  if (needsSoundCloud) {
    return <SoundCloudAuthProvider>{children}</SoundCloudAuthProvider>;
  }

  // 認証不要（エラーページなど）
  return <>{children}</>;
};
