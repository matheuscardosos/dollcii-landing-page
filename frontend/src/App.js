import "@/App.css";
import { Toaster } from "./components/ui/sonner";
import { BagProvider } from "./context/BagContext";
import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Flavors } from "./components/Flavors";
import { Menu } from "./components/Menu";
import { Historia } from "./components/Historia";
import { Footer } from "./components/Footer";
import { BagDrawer } from "./components/BagDrawer";
import { CheckoutPage } from "./components/CheckoutPage";
import { MascotQuiz } from "./components/MascotQuiz";
import { CookieBanner } from "./components/CookieBanner";

function App() {
  return (
    <BagProvider>
      <div className="min-h-screen overflow-x-clip bg-white">
        <SmoothScroll />
        <Header />
        <main>
          <Hero />
          <Flavors />
          <Menu />
          <Historia />
        </main>
        <Footer />
        <BagDrawer />
        <CheckoutPage />
        <MascotQuiz />
        <CookieBanner />
        <Toaster position="bottom-center" richColors={false} toastOptions={{ className: "!rounded-full !bg-ink !text-white !border-none" }} />
      </div>
    </BagProvider>
  );
}

export default App;
