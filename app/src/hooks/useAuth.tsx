import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/auth/api/auth';
import { Platform } from 'react-native';
import { getAccessToken } from '../utils/tokenManager';
import { handleApiError } from '../utils/errorHandler';

interface AuthContextProps {
  loading: boolean;
  isAuthenticated: boolean;
  setAuthState: (state: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const useProvideAuth = () => {
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
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, []);

  const setAuthState = (state: boolean) => setIsAuthenticated(state);

  return { loading, isAuthenticated, setAuthState };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const auth = useProvideAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
