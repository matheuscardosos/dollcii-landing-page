import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { brl } from "../data/menu";
import { useBag } from "../context/BagContext";
import { useStore } from "../context/StoreContext";

export const ProductCard = ({ p, onOpen }) => {
  const { add } = useBag();
  // So perguntamos se tem ou nao tem. A quantidade e assunto do painel.
  const { isAvailable, isLow } = useStore();
  const esgotado = !isAvailable(p.id);
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
        <button onClick={() => onOpen(p)} data-testid={`product-open-${p.id}`} className="relative flex aspect-[4/5] w-full items-center justify-center p-4 sm:p-8" aria-label={`Ver detalhes de ${p.name}`}>
          {p.img ? (
            <img src={p.img} alt={p.name} loading="lazy" className={`max-h-full w-auto max-w-full object-contain drop-shadow-[0_24px_28px_rgba(17,17,17,0.14)] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:rotate-[-4deg] group-hover:scale-[1.06] ${esgotado ? "opacity-40 saturate-0" : ""}`} />
          ) : (
            <span className="font-display text-2xl font-bold tracking-[-0.03em] text-ink/25 sm:text-4xl">{p.name}</span>
          )}
        </button>
        <div className="pointer-events-none absolute left-2 top-2 sm:left-4 sm:top-4 flex flex-wrap gap-1">
          {esgotado ? (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[9px] sm:text-[11px] font-semibold text-white">Esgotado</span>
          ) : (
            <>
              {isLow(p.id) && (
                <span className="rounded-full bg-berry px-2.5 py-1 text-[9px] sm:text-[11px] font-semibold text-white">Últimas unidades</span>
              )}
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-ink">{t}</span>
              ))}
            </>
          )}
        </div>
        <button
          data-testid={`add-to-cart-button-${p.id}`}
          onClick={() => add(p)}
          disabled={esgotado}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 grid h-9 w-9 sm:h-12 sm:w-12 place-items-center rounded-full bg-ink text-white shadow-lg transition-[transform,background-color] duration-300 hover:scale-110 hover:bg-berry disabled:pointer-events-none disabled:opacity-30"
          aria-label={esgotado ? `${p.name} esgotado` : `Adicionar ${p.name} à sacola`}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
      <div className="mt-2 sm:mt-4 flex items-start justify-between gap-2 sm:gap-4 px-0.5 sm:px-1">
        <div className="min-w-0">
          <h3 className="font-display text-sm sm:text-xl font-bold leading-tight tracking-[-0.02em] truncate">{p.name}</h3>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-relaxed text-ink-soft line-clamp-2">{p.desc}</p>
        </div>
        <span className="whitespace-nowrap pt-0.5 text-xs sm:text-base font-semibold shrink-0" data-testid={`product-price-${p.id}`}>{brl(p.price)}</span>
      </div>
    </motion.article>
  );
};
