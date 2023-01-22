import React from "react";
import { Header } from "./components/Header";
import { Home } from "./screens/Home";
import { SpecifyTime } from "./screens/SpecifyTime";
import { Footer } from "./components/Footer";
import { SpecifyForm } from "./components/SpecifyForm";
import { DeletePlaylist } from "./components/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Header />
      <SpecifyForm />
      <DeletePlaylist />
      <Home />
      <SpecifyTime />
      <Footer />
    </SafeAreaProvider>
  );
}