import { useEffect, useState } from "react";
import "@/App.css";
import { Toaster } from "./components/ui/sonner";
import { BagProvider } from "./context/BagContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
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
import { AdminPanel } from "./components/AdminPanel";

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

const PROTEGIDAS = ["/conta", "/painel"];

const Routes = () => {
  const [route, go] = useHashRoute();
  const { signed, isAdmin } = useAuth();

  useEffect(() => {
    // Sessao encerrada, ou cliente tentando o painel da loja: volta pro site.
    if (PROTEGIDAS.includes(route) && !signed) go("/");
    else if (route === "/painel" && !isAdmin) go("/conta");
  }, [route, signed, isAdmin, go]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route === "/painel" && signed && isAdmin) return <AdminPanel onBack={() => go("/")} />;
  if (route === "/conta" && signed) return <Account onBack={() => go("/")} />;
  return <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BagProvider>
          <Routes />
          <BagDrawer />
          <CheckoutPage />
          <Toaster position="bottom-center" richColors={false} toastOptions={{ className: "!rounded-full !bg-ink !text-white !border-none" }} />
        </BagProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
