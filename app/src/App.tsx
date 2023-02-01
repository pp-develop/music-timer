import React from "react";
import { Header } from "./components/Header";
import { Description } from "./components/Description";
import { Home } from "./screens/Home";
import { SpecifyTime } from "./screens/SpecifyTime";
import { Footer } from "./components/Footer";
import { SpecifyForm } from "./components/SpecifyForm";
import { DeletePlaylist } from "./components/DeletePlaylistButton";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CreatePlaylistButton } from './components/CreatePlaylistButton';
import { PlaylistDialog } from './components/PlaylistDialog';

export const App = () => {
  return (
    <SafeAreaProvider>
      <Header />
      <Description />
      <SpecifyForm />
      {/* <CreatePlaylistButton /> */}
      <DeletePlaylist />
      {/* <PlaylistDialog /> */}
      <Home />
      <SpecifyTime />
      <Footer />
    </SafeAreaProvider>
  );
}