import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/soundcloud/auth/api/auth';
import { Platform } from 'react-native';
import { getAccessToken } from '../utils/tokenManager';

export interface SoundCloudAuthContextProps {
  loading: boolean;
  isAuthenticated: boolean;
  setAuthState: (state: boolean) => void;
}

const SoundCloudAuthContext = createContext<SoundCloudAuthContextProps | null>(null);

const useProvideSoundCloudAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        // ネイティブの場合はトークンの存在をまずチェック
        if (Platform.OS !== 'web') {
          const token = await getAccessToken('soundcloud');
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
        console.error('SoundCloud auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, []);

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
