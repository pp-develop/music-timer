import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/soundcloud/auth/api/auth';
import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { getAccessToken } from '../utils/tokenManager';
import { authEvents, AUTH_EVENTS } from '../utils/authEvents';

export interface SoundCloudAuthContextProps {
  loading: boolean;
  isAuthenticated: boolean;
  setAuthState: (state: boolean) => void;
}

const SoundCloudAuthContext = createContext<SoundCloudAuthContextProps | null>(null);

const useProvideSoundCloudAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // SoundCloud認証が必要なページかどうか
  const needsAuth = pathname === '/' || pathname === '/index' ||
                    pathname === '/auth' || pathname.startsWith('/soundcloud');

  // SoundCloud認証クリアイベントをリッスン
  useEffect(() => {
    const handleAuthCleared = () => {
      setIsAuthenticated(false);
    };

    authEvents.on(AUTH_EVENTS.SOUNDCLOUD_CLEARED, handleAuthCleared);
    return () => {
      authEvents.off(AUTH_EVENTS.SOUNDCLOUD_CLEARED, handleAuthCleared);
    };
  }, []);

  useEffect(() => {
    // 認証が不要なページではAPI呼び出しをスキップ
    if (!needsAuth) {
      setLoading(false);
      return;
    }

    const fetchAuth = async () => {
      try {
        // ネイティブの場合はトークンの存在をまずチェック
        if (Platform.OS !== 'web') {
          const token = await getAccessToken('soundcloud');
          if (!token) {
            // トークンがない場合は未認証（無駄なAPI呼び出しを避ける）
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
        }

        // Web・Native共通: サーバーでSoundCloud認証状態を確認
        const response = await auth();
        setIsAuthenticated(response.authenticated);
      } catch (error: any) {
        // エラー時は何もしない（isAuthenticatedはfalseのまま）
        console.error('SoundCloud auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, [needsAuth]);

  const setAuthState = (state: boolean) => setIsAuthenticated(state);

  return { loading, isAuthenticated, setAuthState };
};

interface SoundCloudAuthProviderProps {
  children: ReactNode;
}

export const SoundCloudAuthProvider: FC<SoundCloudAuthProviderProps> = ({ children }) => {
  const auth = useProvideSoundCloudAuth();

  return (
    <SoundCloudAuthContext.Provider value={auth}>
      {children}
    </SoundCloudAuthContext.Provider>
  );
};

export const useSoundCloudAuth = (): SoundCloudAuthContextProps => {
  const context = useContext(SoundCloudAuthContext);
  if (!context) {
    throw new Error("useSoundCloudAuth must be used within a SoundCloudAuthProvider");
  }
  return context;
};
