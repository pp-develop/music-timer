import { Header } from "./components/Header";
import { Home } from "./screens/Home";
import { SpecifyTime } from "./screens/SpecifyTime";
import { Footer } from "./components/Footer";
import { OAuthButton } from "./components/OAuthButton";
import { SpecifyForm } from "./components/SpecifyForm";
import { DeletePlaylist } from "./components/DeletePlaylistButton";

export const App = () => {
  return (
    <div>
      <OAuthButton />
      <SpecifyForm/>
      <DeletePlaylist />
      <Header />
      <Home />
      <SpecifyTime />
      <Footer />
    </div>
  );
}