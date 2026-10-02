import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { STORES } from "../data/menu";
import { Eyebrow, H2, Reveal, Section } from "./Reveal";

export const Stores = () => {
  const [id, setId] = useState(STORES[0].id);
  const s = STORES.find((x) => x.id === id);

  return (
    <Section id="lojas" data-testid="stores-section" className="py-24 lg:py-36">
      <Eyebrow>Nossas lojas</Eyebrow>
      <H2 className="mt-5" lines={["Venha provar", <span key="e" className="text-berry">pessoalmente.</span>]} />
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="flex flex-col" role="tablist">
            {STORES.map((x, i) => (
              <button key={x.id} data-testid={`store-locator-select-${x.id}`} onClick={() => setId(x.id)} className="group flex items-center justify-between border-t hairline py-6 text-left last:border-b">
                <span className="flex items-baseline gap-5">
                  <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
                  <span className={`font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] transition-colors duration-300 lg:text-4xl ${id === x.id ? "text-berry" : "text-ink group-hover:text-berry"}`}>{x.name}</span>
                </span>
                <ArrowUpRight className={`h-5 w-5 transition-transform duration-500 ${id === x.id ? "rotate-45 text-berry" : ""}`} />
              </button>
            ))}
          </div>
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="mt-8 space-y-3 text-sm" data-testid="store-details">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-berry" />{s.address}</p>
              <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-berry" />{s.hours}</p>
              <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-berry" />{s.phone}</p>
              <a data-testid="store-directions-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white transition-colors hover:bg-berry">
                Como chegar <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <Reveal delay={0.1} className="relative overflow-hidden rounded-[32px] bg-paper lg:col-span-7">
          <img src={process.env.PUBLIC_URL + "/img/loja.webp"} alt="Fachada da loja Dollcii" loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
          <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">Dollcii {s.name}</span>
        </Reveal>
      </div>
    </Section>
  );
};
