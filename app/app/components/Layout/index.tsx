import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { auth } from '../../features/auth/api/auth'
import { Header } from "../Parts/Header"
import { Head } from "../Parts/Head"
import { Description } from "../Parts/Description";
import { LoginButton } from "../../features/auth";
import { Form } from "../../features/createPlaylist";
import { DeletePlaylist } from "../../features/deletePlaylist/components/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelmetProvider } from 'react-helmet-async'
import { setLoginStatus, setLogoutStatus } from "../../hooks/useLoginStatus";
import { AuthContext } from "../../hooks/useContext";
import { useTheme } from '../../assets/ThemeContext';

export const App = () => {
  const theme = useTheme()
  const { isLogin, login, logout } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await auth();
        if (response.httpStatus === 200) {
          setLoginStatus();
          login();
        } else {
          setLogoutStatus();
          logout();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [])

  return (
    <SafeAreaProvider>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <Header />

      {isLoading && (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={theme.tertiary} />
        </View>
      )}

      {!isLoading && (
        <>
          {isLogin ? (
            <>
              <Form />
              <DeletePlaylist />
            </>
          ) : (
            <>
              <Description />
              <LoginButton />
            </>
          )}
        </>
      )}

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  indicator: {
    marginTop: '100px',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});