import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/spotify/auth/api/auth';
import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { getAccessToken } from '../utils/tokenManager';
import { authEvents, AUTH_EVENTS } from '../utils/authEvents';

export interface SpotifyAuthContextProps {
  loading: boolean;
  isAuthenticated: boolean;
  setAuthState: (state: boolean) => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextProps | null>(null);

const useProvideSpotifyAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // Spotify認証が必要なページかどうか
  const needsAuth = pathname === '/' || pathname === '/index' ||
                    pathname === '/auth' || pathname.startsWith('/spotify');

  // Spotify認証クリアイベントをリッスン
  useEffect(() => {
    const handleAuthCleared = () => {
      setIsAuthenticated(false);
    };

    authEvents.on(AUTH_EVENTS.SPOTIFY_CLEARED, handleAuthCleared);
    return () => {
      authEvents.off(AUTH_EVENTS.SPOTIFY_CLEARED, handleAuthCleared);
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
          const token = await getAccessToken('spotify');
          if (!token) {
            // トークンがない場合は未認証（無駄なAPI呼び出しを避ける）
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
        }

        // Web・Native共通: サーバーでSpotify認証状態を確認
        const response = await auth();
        setIsAuthenticated(response.authenticated);
      } catch (error: any) {
        // エラー時は何もしない（isAuthenticatedはfalseのまま）
        console.error('Spotify auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, [needsAuth]);

  const setAuthState = (state: boolean) => setIsAuthenticated(state);

  return { loading, isAuthenticated, setAuthState };
};

interface SpotifyAuthProviderProps {
  children: ReactNode;
}

export const SpotifyAuthProvider: FC<SpotifyAuthProviderProps> = ({ children }) => {
  const auth = useProvideSpotifyAuth();

  return (
    <SpotifyAuthContext.Provider value={auth}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = (): SpotifyAuthContextProps => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error("useSpotifyAuth must be used within a SpotifyAuthProvider");
  }
  return context;
};
