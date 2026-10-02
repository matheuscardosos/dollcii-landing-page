import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { brl } from "../data/menu";
import { useBag } from "../context/BagContext";

export const ProductCard = ({ p, onOpen }) => {
  const { add } = useBag();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`product-card-${p.id}`}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-paper transition-colors duration-500" style={{ "--tint": p.tint }}>
        <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: p.tint }} />
        <button onClick={() => onOpen(p)} data-testid={`product-open-${p.id}`} className="relative flex aspect-[4/5] w-full items-center justify-center p-8" aria-label={`Ver detalhes de ${p.name}`}>
          <img src={p.img} alt={p.name} loading="lazy" className="max-h-full w-auto max-w-full object-contain drop-shadow-[0_24px_28px_rgba(17,17,17,0.14)] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:rotate-[-4deg] group-hover:scale-[1.06]" />
        </button>
        <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink">{t}</span>
          ))}
        </div>
        <button
          data-testid={`add-to-cart-button-${p.id}`}
          onClick={() => add(p)}
          className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-ink text-white shadow-lg transition-[transform,background-color] duration-300 hover:scale-110 hover:bg-berry"
          aria-label={`Adicionar ${p.name} à sacola`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em]">{p.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
        </div>
        <span className="whitespace-nowrap pt-0.5 font-semibold" data-testid={`product-price-${p.id}`}>{brl(p.price)}</span>
      </div>
    </motion.article>
  );
};
