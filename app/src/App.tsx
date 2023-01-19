import { Header } from "./components/Header";
import { Home } from "./screens/Home";
import { SpecifyTime } from "./screens/SpecifyTime";
import { Footer } from "./components/Footer";
import { OAuthButton } from "./components/OAuthButton";

export const App = () => {
  return (
    <div>
      <OAuthButton />
      <Header />
      <Home />
      <SpecifyTime />
      <Footer />
    </div>
  );
}