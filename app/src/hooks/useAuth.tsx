import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import { auth } from '../features/auth/api/auth';

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
        const response = await auth();
        if (response.httpStatus === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
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
