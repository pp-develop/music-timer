
import { useState, useEffect } from "react";
import { auth } from '../../src/features/auth/api/auth'

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  // 外部から状態をセットするための関数
  const setAuthState = (state: boolean) => {
    setIsAuthenticated(state);
  };


  return { loading, isAuthenticated, setAuthState };
};
