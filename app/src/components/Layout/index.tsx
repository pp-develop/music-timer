import React from "react";
import { Header } from "../Parts/Header"
import { Description } from "../Parts/Description";
import { Form } from "../../features/createPlaylist";
import { DeletePlaylist } from "../../features/deletePlaylist/components/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Header />
      <Description />
      <Form />
      <DeletePlaylist />
    </SafeAreaProvider>
  );
}