import { Header } from "./components/Header";
import { Home } from "./screens/Home";
import { SpecifyTime } from "./screens/SpecifyTime";
import { Footer } from "./components/Footer";

export const App = () => {
  return (
    <div>
      <Header />
      <Home />
      <SpecifyTime />
      <Footer />
    </div>
  );
}