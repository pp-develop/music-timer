import React from "react";
import { Header } from "./features/Header";
import { Description } from "./features/Description";
import { Home } from "./components/Home";
import { SpecifyTime } from "./components/SpecifyTime";
import { Footer } from "./features/Footer";
import { SpecifyForm } from "./features/createPlaylist/components/SpecifyForm";
import { DeletePlaylist } from "./features/deletePlaylist/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Header />
      <Description />
      <SpecifyForm />
      <DeletePlaylist />

      <Home />
      <SpecifyTime />
      <Footer />
    </SafeAreaProvider>
  );
}