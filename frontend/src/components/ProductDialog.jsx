import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { brl } from "../data/menu";
import { useBag } from "../context/BagContext";
import { useStore } from "../context/StoreContext";

export const ProductDialog = ({ product, onClose }) => {
  const { add } = useBag();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product]);

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="product-dialog" data-lenis-prevent className="max-h-[92svh] max-w-3xl overflow-y-auto rounded-[28px] border-none bg-white p-0 sm:rounded-[28px]">
        {product && (
          <div className="grid md:grid-cols-2">
            <div className="flex aspect-square items-center justify-center p-10 md:aspect-auto" style={{ background: product.tint }}>
              {product.img ? (
                <img src={product.img} alt={product.name} className="max-h-[360px] w-auto max-w-full object-contain drop-shadow-[0_30px_30px_rgba(17,17,17,0.16)]" />
              ) : (
                <span className="font-display text-3xl font-bold tracking-[-0.03em] text-ink/25">{product.name}</span>
              )}
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span key={t} className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold">{t}</span>
                ))}
              </div>
              <DialogTitle className="mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.03em]">{product.name}</DialogTitle>
              <DialogDescription className="mt-3 text-base leading-relaxed text-ink-soft">{product.desc}</DialogDescription>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">Ingredientes</p>
              <p className="mt-2 text-sm leading-relaxed">{product.ingredients}</p>
              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <div className="flex items-center rounded-full border hairline">
                  <button data-testid="product-dialog-decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center" aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
                  <span data-testid="product-dialog-qty" className="w-6 text-center font-semibold">{qty}</span>
                  <button data-testid="product-dialog-increase" onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center" aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
                </div>
                <button
                  data-testid="product-dialog-add"
                  onClick={() => {
                    add(product, qty);
                    onClose();
                  }}
                  className="h-12 flex-1 rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-berry"
                >
                  Adicionar · {brl(product.price * qty)}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
