import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { useBag } from "../context/BagContext";
import { brl, calcTotals, FREE_DELIVERY_FROM } from "../data/menu";
import { scrollToId } from "./SmoothScroll";

const Item = ({ i }) => {
  const { setQty, remove } = useBag();
  return (
    <motion.li layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="flex gap-3 sm:gap-4 border-b hairline py-4 sm:py-5" data-testid={`cart-item-${i.id}`}>
      <div className="grid h-16 w-14 sm:h-24 sm:w-20 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-paper p-1.5 sm:p-2"><img src={i.img} alt={i.name} className="max-h-full max-w-full object-contain" /></div>
      <div className="flex flex-1 min-w-0 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <p className="font-display text-base sm:text-lg font-bold leading-tight truncate">{i.name}</p>
          <button data-testid={`cart-item-remove-${i.id}`} onClick={() => remove(i.id)} className="text-ink-soft transition-colors hover:text-berry shrink-0" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
        </div>
        <p className="font-mono text-[11px] sm:text-xs text-ink-soft">{brl(i.price)} cada</p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center rounded-full border hairline">
            <button data-testid={`cart-item-decrease-${i.id}`} onClick={() => setQty(i.id, i.qty - 1)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center" aria-label="Diminuir"><Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></button>
            <span data-testid={`cart-item-qty-${i.id}`} className="w-5 sm:w-6 text-center font-mono text-xs sm:text-sm">{i.qty}</span>
            <button data-testid={`cart-item-increase-${i.id}`} onClick={() => setQty(i.id, i.qty + 1)} className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center" aria-label="Aumentar"><Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></button>
          </div>
          <span className="font-mono text-xs sm:text-sm">{brl(i.price * i.qty)}</span>
        </div>
      </div>
    </motion.li>
  );
};

const Coupon = () => {
  const { coupon, setCoupon } = useBag();
  const [val, setVal] = useState(coupon);
  const { rate } = calcTotals([], coupon);
  return (
    <div className="mt-5">
      <div className="flex gap-2">
        <input data-testid="cart-coupon-input" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Cupom de desconto" className="h-11 flex-1 rounded-full border hairline bg-white px-4 text-sm uppercase outline-none placeholder:normal-case placeholder:text-ink-soft focus:border-ink" />
        <button data-testid="cart-coupon-apply" onClick={() => setCoupon(val.trim().toUpperCase())} className="h-11 rounded-full border border-ink px-5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white">Aplicar</button>
      </div>
      {coupon && (
        <p data-testid="cart-coupon-status" className={`mt-2 text-xs ${rate ? "text-[#6F9A4F]" : "text-berry"}`}>
          {rate ? `Cupom ${coupon} aplicado: ${rate * 100}% de desconto` : "Cupom inválido. Experimente DOLLCII10"}
        </p>
      )}
    </div>
  );
};

const Summary = () => {
  const { items, coupon, setOpen, setCheckout } = useBag();
  const t = calcTotals(items, coupon);
  const left = Math.max(0, FREE_DELIVERY_FROM - (t.subtotal - t.discount));
  const pct = Math.min(100, ((t.subtotal - t.discount) / FREE_DELIVERY_FROM) * 100);
  return (
    <div className="border-t hairline bg-paper p-4 sm:p-6">
      <p className="text-xs text-ink-soft" data-testid="cart-free-delivery-msg">{left > 0 ? `Faltam ${brl(left)} para entrega grátis` : "Você ganhou entrega grátis"}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <motion.div className="h-full rounded-full bg-berry" animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
      </div>
      <Coupon />
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd data-testid="cart-subtotal" className="font-mono">{brl(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between text-[#6F9A4F]"><dt>Desconto</dt><dd data-testid="cart-discount" className="font-mono">{`${brl(-t.discount)}`}</dd></div>}
        <div className="flex justify-between"><dt className="text-ink-soft">Entrega</dt><dd data-testid="cart-delivery" className="font-mono">{t.delivery ? brl(t.delivery) : "Grátis"}</dd></div>
        <div className="flex justify-between pt-2 font-display text-2xl font-bold"><dt>Total</dt><dd data-testid="cart-total">{brl(t.total)}</dd></div>
      </dl>
      <button data-testid="checkout-button" onClick={() => { setOpen(false); setCheckout(true); }} className="mt-5 h-14 w-full rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
        Finalizar pedido
      </button>
    </div>
  );
};

const Empty = () => {
  const { setOpen } = useBag();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" data-testid="cart-empty-state">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-berry-soft text-berry"><ShoppingBag className="h-8 w-8" /></div>
      <p className="mt-6 font-display text-2xl font-bold">Sua sacola está vazia</p>
      <p className="mt-2 text-sm text-ink-soft">Que tal começar pelo nosso Morango & Leite?</p>
      <button data-testid="cart-empty-cta" onClick={() => { setOpen(false); scrollToId("cardapio"); }} className="mt-6 h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white">Ver cardápio</button>
    </div>
  );
};

export const BagDrawer = () => {
  const { items, open, setOpen, count } = useBag();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent data-testid="cart-drawer" className="flex w-full flex-col gap-0 border-l hairline bg-white p-0 sm:max-w-md">
        <div className="border-b hairline px-4 sm:px-6 pb-4 sm:pb-5 pt-5 sm:pt-7">
          <SheetTitle className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Sua sacola</SheetTitle>
          <SheetDescription className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{count} {count === 1 ? "item" : "itens"}</SheetDescription>
        </div>
        {items.length === 0 ? (
          <Empty />
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 sm:px-6" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {items.map((i) => <Item key={i.id} i={i} />)}
              </AnimatePresence>
            </ul>
            <Summary />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
