import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { FLAVORS, brl } from "../data/menu";
import { useStore } from "../context/StoreContext";
import { useBag } from "../context/BagContext";
import { FlavorStage } from "./FlavorStage";
import { Eyebrow, H2, Reveal, Section } from "./Reveal";

const Block = ({ f, onActive }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const { add } = useBag();
  const { catalog } = useStore();
  const product = catalog.find((p) => p.id === f.productId);

  useEffect(() => {
    if (inView) onActive(f.id);
  }, [inView, f.id, onActive]);

  return (
    <article ref={ref} data-testid={`flavor-block-${f.id}`} className="flex flex-col justify-center border-t hairline py-10 sm:py-14 lg:min-h-[74vh] lg:py-0">
      <div className="mb-6 sm:mb-8 lg:hidden">
        <FlavorStage flavor={f} className="aspect-[4/5] sm:aspect-square w-full max-w-[280px] sm:max-w-sm mx-auto" />
      </div>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs" style={{ color: f.accent }}>Nº {f.n}</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        <h3 className="mt-4 sm:mt-6 font-display text-3xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{f.full}</h3>
        <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-ink-soft lg:text-lg">{f.story}</p>
        <ul className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
          {f.notes.map((n) => (
            <li key={n} className="rounded-full bg-paper px-3.5 py-2 text-xs font-semibold">{n}</li>
          ))}
        </ul>
        <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-5">
          <button data-testid={`flavor-add-${f.id}`} onClick={() => product && add(product)} className="flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5" style={{ background: f.accent }}>
            <Plus className="h-4 w-4" /> Adicionar à sacola
          </button>
          <span className="font-display text-2xl font-bold">{brl(product?.price)}</span>
        </div>
      </Reveal>
    </article>
  );
};

export const Flavors = () => {
  const [active, setActive] = useState(FLAVORS[0].id);
  const current = FLAVORS.find((f) => f.id === active);

  return (
    <Section id="sabores" data-testid="flavors-section" className="relative py-24 lg:py-36">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <Eyebrow>Os sabores assinatura</Eyebrow>
          <H2 className="mt-5 max-w-4xl" lines={["Quatro receitas,", <span key="b">uma obsessão: <span className="text-berry">a fruta.</span></span>]} />
        </div>
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-28 h-[76vh]">
            <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-paper">
              <FlavorStage flavor={current} className="h-full w-full" />
              <span className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]" data-testid="flavor-sticky-label">Nº {current.n} {current.name}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          {FLAVORS.map((f) => (
            <Block key={f.id} f={f} onActive={setActive} />
          ))}
        </div>
      </div>
    </Section>
  );
};
