import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COUPONS, PRODUCTS } from "../data/menu";

const KEY = "geliz-loja";
const STOCK_INICIAL = 40;

// Dados da operacao, compartilhados entre Nicolas e Allana.
// Ficam fora do perfil de usuario porque a loja e uma so.
const vazio = () => ({
  sales: [],
  expenses: [],
  stock: Object.fromEntries(PRODUCTS.map((p) => [p.id, STOCK_INICIAL])),
  // O cupom antigo vira o primeiro da lista, agora editavel pelo painel.
  coupons: Object.entries(COUPONS).map(([code, rate]) => ({
    code,
    discount: Math.round(rate * 100),
    active: true,
    uses: 0,
  })),
});

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (!v || typeof v !== "object") return vazio();
    const base = vazio();
    return {
      sales: Array.isArray(v.sales) ? v.sales : [],
      expenses: Array.isArray(v.expenses) ? v.expenses : [],
      coupons: Array.isArray(v.coupons) ? v.coupons : base.coupons,
      // Produto novo no cardapio entra com estoque cheio em vez de indefinido.
      stock: { ...base.stock, ...(v.stock || {}) },
    };
  } catch {
    return vazio();
  }
};

const code = () => "GLZ" + Math.random().toString(36).slice(2, 7).toUpperCase();
const hoje = () => new Date().toISOString().slice(0, 10);

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [data, setData] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const addSale = useCallback((sale) => {
    setData((d) => {
      const stock = { ...d.stock };
      sale.items.forEach((i) => {
        stock[i.id] = Math.max(0, (stock[i.id] ?? STOCK_INICIAL) - i.qty);
      });
      return {
        ...d,
        stock,
        sales: [{ code: code(), date: new Date().toISOString(), step: 0, source: "site", ...sale }, ...d.sales],
      };
    });
  }, []);

  const cancelSale = useCallback((saleCode, reason) => {
    setData((d) => {
      const venda = d.sales.find((s) => s.code === saleCode);
      if (!venda || venda.canceled) return d;
      // O que nao foi vendido volta pra prateleira.
      const stock = { ...d.stock };
      venda.items.forEach((i) => {
        stock[i.id] = (stock[i.id] ?? 0) + i.qty;
      });
      return {
        ...d,
        stock,
        sales: d.sales.map((s) =>
          s.code === saleCode ? { ...s, canceled: true, cancelReason: reason, canceledAt: new Date().toISOString() } : s
        ),
      };
    });
  }, []);

  const advanceSale = useCallback((saleCode) => {
    setData((d) => ({
      ...d,
      sales: d.sales.map((s) => (s.code === saleCode && !s.canceled ? { ...s, step: Math.min(3, s.step + 1) } : s)),
    }));
  }, []);

  const adjustStock = useCallback((id, delta) => {
    setData((d) => ({ ...d, stock: { ...d.stock, [id]: Math.max(0, (d.stock[id] ?? 0) + delta) } }));
  }, []);

  const setStock = useCallback((id, qty) => {
    setData((d) => ({ ...d, stock: { ...d.stock, [id]: Math.max(0, qty) } }));
  }, []);

  const addCoupon = useCallback((code, discount) => {
    const norm = code.trim().toUpperCase();
    let ok = true;
    setData((d) => {
      if (d.coupons.some((c) => c.code === norm)) {
        ok = false;
        return d;
      }
      return { ...d, coupons: [{ code: norm, discount, active: true, uses: 0 }, ...d.coupons] };
    });
    return ok;
  }, []);

  const toggleCoupon = useCallback((code) => {
    setData((d) => ({ ...d, coupons: d.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)) }));
  }, []);

  const removeCoupon = useCallback((code) => {
    setData((d) => ({ ...d, coupons: d.coupons.filter((c) => c.code !== code) }));
  }, []);

  const useCoupon = useCallback((code) => {
    const norm = (code || "").trim().toUpperCase();
    if (!norm) return;
    setData((d) => ({ ...d, coupons: d.coupons.map((c) => (c.code === norm ? { ...c, uses: c.uses + 1 } : c)) }));
  }, []);

  const addExpense = useCallback((exp) => {
    setData((d) => ({ ...d, expenses: [{ id: code(), date: new Date().toISOString(), ...exp }, ...d.expenses] }));
  }, []);

  const removeExpense = useCallback((id) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  const value = useMemo(() => {
    const doDia = (arr) => arr.filter((x) => x.date.slice(0, 10) === hoje());
    const vendasHoje = doDia(data.sales).filter((v) => !v.canceled);
    const despesasHoje = doDia(data.expenses);
    const faturamento = vendasHoje.reduce((s, v) => s + v.total, 0);
    const gastos = despesasHoje.reduce((s, e) => s + e.value, 0);
    return {
      ...data,
      addSale,
      advanceSale,
      cancelSale,
      salesOf: (email) => data.sales.filter((s) => s.customer && s.customer.email === email),
      adjustStock,
      setStock,
      addExpense,
      removeExpense,
      addCoupon,
      toggleCoupon,
      removeCoupon,
      useCoupon,
      // Cupom inativo ou inexistente nao da desconto.
      couponRate: (code) => {
        const c = data.coupons.find((x) => x.code === (code || "").trim().toUpperCase());
        return c && c.active ? c.discount / 100 : 0;
      },
      hoje: {
        vendas: vendasHoje,
        pedidos: vendasHoje.length,
        faturamento,
        gastos,
        lucro: faturamento - gastos,
        ticket: vendasHoje.length ? faturamento / vendasHoje.length : 0,
      },
    };
  }, [data, addSale, advanceSale, cancelSale, adjustStock, setStock, addExpense, removeExpense, addCoupon, toggleCoupon, removeCoupon, useCoupon]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
};
