import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/menu";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { Eyebrow, H2 } from "./Reveal";

const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const Menu = () => {
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    const term = normalize(q.trim());
    return PRODUCTS.filter((p) => (cat === "todos" || p.cat === cat) && (!term || normalize(`${p.name} ${p.desc}`).includes(term)));
  }, [cat, q]);

  return (
    <section id="cardapio" data-testid="menu-section" className="border-t hairline bg-white py-24 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Cardápio</Eyebrow>
            <H2 className="mt-5" lines={["Escolha o seu", <span key="e" className="text-berry">favorito.</span>]} />
          </div>
          <label className="flex h-12 w-full items-center gap-3 rounded-full bg-paper px-5 lg:w-80">
            <Search className="h-4 w-4 text-ink-soft" />
            <input data-testid="menu-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar sabor" className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft" />
          </label>
        </div>

        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" data-lenis-prevent>
          <div className="flex w-max gap-1 rounded-full border hairline p-1">
            {CATEGORIES.map((c) => (
              <button key={c.id} data-testid={`menu-category-tab-${c.id}`} onClick={() => setCat(c.id)} className="relative h-10 rounded-full px-5 text-sm font-semibold">
                {cat === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`relative transition-colors duration-300 ${cat === c.id ? "text-white" : "text-ink"}`}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-8 sm:mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} onOpen={setOpen} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <p data-testid="menu-empty-state" className="py-20 text-center font-display text-2xl font-semibold text-ink-soft">Nenhum sabor encontrado. Que tal provar algo novo?</p>
        )}
      </div>
      <ProductDialog product={open} onClose={() => setOpen(null)} />
    </section>
  );
};
