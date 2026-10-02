import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const KEY = "dollcii-bag";
const BagContext = createContext(null);

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export const BagProvider = ({ children }) => {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const l = window.__lenis;
    if (!l) return;
    if (open || checkout) l.stop();
    else l.start();
  }, [open, checkout]);

  const value = useMemo(() => {
    const add = (p, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((i) => i.id === p.id);
        if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { id: p.id, name: p.name, price: p.price, img: p.img, qty }];
      });
      toast.success(`${p.name} foi para a sacola`, { action: { label: "Ver sacola", onClick: () => setOpen(true) } });
    };
    const setQty = (id, qty) =>
      setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { items, add, setQty, remove: (id) => setQty(id, 0), clear: () => setItems([]), count, open, setOpen, checkout, setCheckout, coupon, setCoupon };
  }, [items, open, checkout, coupon]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};

export const useBag = () => useContext(BagContext);
