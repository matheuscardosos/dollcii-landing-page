import "@/App.css";
import { Toaster } from "./components/ui/sonner";
import { BagProvider } from "./context/BagContext";
import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Flavors } from "./components/Flavors";
import { Bento } from "./components/Bento";
import { Menu } from "./components/Menu";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Stores } from "./components/Stores";
import { Footer } from "./components/Footer";
import { BagDrawer } from "./components/BagDrawer";
import { Checkout } from "./components/Checkout";
import { MascotQuiz } from "./components/MascotQuiz";

function App() {
  return (
    <BagProvider>
      <div className="min-h-screen overflow-x-clip bg-white">
        <SmoothScroll />
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Flavors />
          <Bento />
          <Menu />
          <Process />
          <Testimonials />
          <Stores />
        </main>
        <Footer />
        <BagDrawer />
        <Checkout />
        <MascotQuiz />
        <Toaster position="bottom-center" richColors={false} toastOptions={{ className: "!rounded-full !bg-ink !text-white !border-none" }} />
      </div>
    </BagProvider>
  );
}

export default App;
