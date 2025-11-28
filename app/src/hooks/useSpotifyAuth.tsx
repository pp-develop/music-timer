import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/spotify/auth/api/auth';
import { Platform } from 'react-native';
import { getAccessToken } from '../utils/tokenManager';

export interface SpotifyAuthContextProps {
  loading: boolean;
  isAuthenticated: boolean;
  setAuthState: (state: boolean) => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextProps | null>(null);

const useProvideSpotifyAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        // ネイティブの場合はトークンの存在をまずチェック
        if (Platform.OS !== 'web') {
          const token = await getAccessToken();
          if (token) {
            // トークンが存在する場合は認証済みと判断
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        }

        // Web または ネイティブでトークンがない場合はサーバーに確認
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
  }, []);

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
