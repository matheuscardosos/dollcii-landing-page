import { useEffect, useState } from "react";
import "@/App.css";
import { Toaster } from "./components/ui/sonner";
import { BagProvider } from "./context/BagContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import { Account } from "./components/Account";

// Rota por hash: o GitHub Pages nao reescreve URL, entao caminho real daria 404.
const useHashRoute = () => {
  const [route, setRoute] = useState(() => window.location.hash.replace("#", "") || "/");
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return [route, (to) => { window.location.hash = to; }];
};

const Landing = () => (
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
    <MascotQuiz />
    <CookieBanner />
  </div>
);

const Routes = () => {
  const [route, go] = useHashRoute();
  const { signed } = useAuth();

  // Sessao encerrada enquanto estava na area logada: volta pro site.
  useEffect(() => {
    if (route === "/conta" && !signed) go("/");
  }, [route, signed, go]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route === "/conta" && signed) return <Account onBack={() => go("/")} />;
  return <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <BagProvider>
        <Routes />
        <BagDrawer />
        <CheckoutPage />
        <Toaster position="bottom-center" richColors={false} toastOptions={{ className: "!rounded-full !bg-ink !text-white !border-none" }} />
      </BagProvider>
    </AuthProvider>
  );
}

export default App;
