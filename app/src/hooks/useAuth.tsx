/**
 * 統一的な認証プロバイダー
 *
 * 常に両方の認証プロバイダーをマウントします。
 * パス遷移時のContext消失エラーを防ぐため、条件付きマウントは行いません。
 *
 * パフォーマンスへの影響は軽微:
 * - Native: トークンがなければAPI呼び出しをスキップ
 * - Web: セッションチェックAPIは軽量
 */

import React, { ReactNode, FC } from 'react';
import { SpotifyAuthProvider } from './useSpotifyAuth';
import { SoundCloudAuthProvider } from './useSoundCloudAuth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 常に両方の認証プロバイダーをマウント
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  return (
    <SpotifyAuthProvider>
      <SoundCloudAuthProvider>
        {children}
      </SoundCloudAuthProvider>
    </SpotifyAuthProvider>
  );
};
