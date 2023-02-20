import React from "react";
import { Header } from "../Parts/Header"
import { Head } from "../Parts/Head"
import { Description } from "../Parts/Description";
import { Form } from "../../features/createPlaylist";
import { DeletePlaylist } from "../../features/deletePlaylist/components/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelmetProvider } from 'react-helmet-async'

export const App = () => {
  return (
    <SafeAreaProvider>
      <HelmetProvider>
        <Head />
      </HelmetProvider>
      <Header />
      <Description />
      <Form />
      <DeletePlaylist />
    </SafeAreaProvider>
  );
}