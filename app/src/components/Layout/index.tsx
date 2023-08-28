import React, { useContext, useEffect } from "react";
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

export const App = () => {
  const { isLogin, login, logout } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const response = await auth();

      if (response.httpStatus == 200) {
        setLoginStatus()
        login()
      } else {
        setLogoutStatus()
        logout()
      }
    })()
  }, [])

  return (
    <SafeAreaProvider>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <Header />

      {isLogin ?
        <>
          <Form />
          <DeletePlaylist />
        </> :
        <>
          <Description />
          <LoginButton />
        </>
      }

    </SafeAreaProvider>
  );
}