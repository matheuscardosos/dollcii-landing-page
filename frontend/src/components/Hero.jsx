import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import { FLAVORS, brl } from "../data/menu";
import { useStore } from "../context/StoreContext";
import { FlavorStage } from "./FlavorStage";
import { useBag } from "../context/BagContext";
import { scrollToId } from "./SmoothScroll";
import { ease } from "./Reveal";

const SwapWord = ({ flavor }) => (
  <span className="relative inline-grid overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
    <AnimatePresence initial={false}>
      <motion.span
        key={flavor.id}
        style={{ gridArea: "1 / 1", color: flavor.accent }}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-110%" }}
        transition={{ duration: 0.9, ease }}
      >
        {flavor.word}
      </motion.span>
    </AnimatePresence>
  </span>
);

const Line = ({ children, i }) => (
  <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
    <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease, delay: 0.3 + i * 0.1 }}>
      {children}
    </motion.span>
  </span>
);

const FlavorSwitch = ({ active, onPick }) => (
  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Escolha o sabor">
    {FLAVORS.map((f) => {
      const on = active.id === f.id;
      return (
        <button
          key={f.id}
          role="tab"
          aria-selected={on}
          data-testid={`hero-flavor-switch-${f.id}`}
          onClick={() => onPick(f)}
          className={`flex h-11 items-center gap-2.5 rounded-full border pl-3 pr-4 text-sm font-semibold transition-colors duration-300 ${on ? "border-ink bg-ink text-white" : "hairline bg-white text-ink hover:bg-paper"}`}
        >
          <img src={f.fruit} alt="" className="h-5 w-5 object-contain" />
          {f.name}
        </button>
      );
    })}
  </div>
);

const FlavorCard = ({ flavor }) => {
  const { add } = useBag();
  const { catalog } = useStore();
  const product = catalog.find((p) => p.id === flavor.productId);
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1 }} className="flex w-full min-w-0 items-center gap-4 sm:gap-6 rounded-[22px] sm:rounded-[26px] border hairline bg-white p-2.5 pl-5 sm:p-3 sm:pl-6 sm:w-fit" data-testid="hero-flavor-card">
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-mono text-[9px] sm:text-[10px] uppercase leading-none tracking-[0.2em] text-ink-soft">Nº {flavor.n} · {flavor.full}</p>
        <p className="mt-2 truncate text-xs leading-snug text-ink-soft sm:text-sm">{flavor.line}</p>
      </div>
      <button data-testid="hero-add-flavor" onClick={() => product && add(product)} className="flex h-11 sm:h-12 shrink-0 items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]" style={{ background: flavor.accent }}>
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {brl(product?.price)}
      </button>
    </motion.div>
  );
};

export const Hero = () => {
  const [flavor, setFlavor] = useState(FLAVORS[0]);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (manual) return undefined;
    const t = setInterval(() => setFlavor((f) => FLAVORS[(FLAVORS.indexOf(f) + 1) % FLAVORS.length]), 6500);
    return () => clearInterval(t);
  }, [manual]);

  const pick = (f) => {
    setManual(true);
    setFlavor(f);
  };

  // Sem isso a troca automatica so comeca a baixar a foto do proximo sabor
  // na hora de mostrar, e a primeira volta engasga.
  useEffect(() => {
    const proximo = FLAVORS[(FLAVORS.indexOf(flavor) + 1) % FLAVORS.length];
    [proximo.pop, ...proximo.pieces.map((p) => p.src)].forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [flavor]);

  return (
    <section id="topo" data-testid="hero-section" className="relative overflow-hidden bg-white pt-[76px]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-14 lg:pb-6 xl:min-h-[calc(100svh-76px)] xl:pb-0">
        <div className="relative z-10 min-w-0 pt-10 lg:col-span-6 lg:pt-4 xl:pt-0">
          <h1 data-testid="hero-title" className="font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[4rem] xl:text-[5.4rem] 2xl:text-[6.2rem]">
            <Line i={0}>Feito de</Line>
            <Line i={1}><SwapWord flavor={flavor} /></Line>
            <Line i={2}>de verdade.</Line>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1, ease }} className="mt-5 sm:mt-7 max-w-md text-sm sm:text-base leading-relaxed text-ink-soft lg:text-lg">
            Receita de chef, ingrediente escolhido a dedo e a cremosidade no ponto. Geladinho gourmet feito à mão em Montes Claros.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1, ease }} className="mt-7 sm:mt-9 flex flex-col gap-5 lg:gap-6">
            <FlavorSwitch active={flavor} onPick={pick} />
            <div className="flex flex-wrap items-center gap-3">
              <button data-testid="hero-primary-cta" onClick={() => scrollToId("cardapio")} className="group flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-2 text-sm font-semibold text-white transition-colors hover:bg-berry">
                Pedir agora
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-[-45deg]"><ArrowRight className="h-4 w-4" /></span>
              </button>
              <button data-testid="hero-secondary-cta" onClick={() => scrollToId("sabores")} className="h-14 rounded-full border hairline px-6 text-sm font-semibold transition-colors hover:bg-paper">
                Conhecer os sabores
              </button>
            </div>
          </motion.div>
        </div>

        <div className="relative min-w-0 lg:col-span-6">
          <FlavorStage flavor={flavor} className="mx-auto aspect-[4/5] w-full max-w-[520px] lg:aspect-auto lg:h-[min(64vh,600px)] xl:h-[min(78vh,760px)] lg:max-w-none" />
        </div>

        <div className="min-w-0 lg:col-span-12 lg:pb-8 xl:pb-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <FlavorCard flavor={flavor} />
            <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft lg:flex">
              <ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Role para descobrir
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
