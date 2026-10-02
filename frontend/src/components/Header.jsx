import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { useBag } from "../context/BagContext";
import { scrollToId } from "./SmoothScroll";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";

const LINKS = [
  { id: "sabores", label: "Sabores" },
  { id: "cardapio", label: "Cardápio" },
  { id: "processo", label: "Processo" },
  { id: "lojas", label: "Lojas" },
];

const BagButton = () => {
  const { count, setOpen } = useBag();
  return (
    <button data-testid="cart-toggle-button" onClick={() => setOpen(true)} className="flex h-11 items-center gap-2 rounded-full bg-ink pl-4 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-berry">
      <ShoppingBag className="h-4 w-4" />
      <span className="hidden sm:inline">Sacola</span>
      <motion.span key={count} initial={{ scale: 0.6 }} animate={{ scale: 1 }} data-testid="cart-count-badge" className="grid h-8 min-w-8 place-items-center rounded-full bg-white px-2 font-mono text-xs text-ink">
        {count}
      </motion.span>
    </button>
  );
};

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setMenu(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-xl transition-shadow duration-500 ${scrolled ? "shadow-[0_1px_0_rgba(17,17,17,0.08)]" : ""}`}
    >
      <div className="relative mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
        <button data-testid="nav-brand-logo" onClick={() => go("topo")} aria-label="Dollcii, início">
          <Logo />
        </button>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border hairline bg-white p-1 lg:flex">
          {LINKS.map((l) => (
            <button key={l.id} data-testid={`nav-link-${l.id}`} onClick={() => go(l.id)} className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper">
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button data-testid="nav-order-now" onClick={() => go("cardapio")} className="hidden h-11 rounded-full border hairline px-5 text-sm font-semibold transition-colors hover:bg-paper md:block">
            Pedir agora
          </button>
          <BagButton />
          <button data-testid="nav-mobile-menu" onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center rounded-full border hairline lg:hidden" aria-label="Abrir menu">
            <MenuIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="top" className="bg-white pb-10 pt-16" data-testid="mobile-menu">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col px-2">
            {LINKS.map((l) => (
              <button key={l.id} data-testid={`mobile-link-${l.id}`} onClick={() => go(l.id)} className="border-b hairline py-4 text-left font-display text-4xl font-bold tracking-tight">
                {l.label}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
};
