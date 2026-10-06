import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "../data/menu";

const KEY = "geliz-loja";
const STOCK_INICIAL = 40;

// Dados da operacao, compartilhados entre Nicolas e Allana.
// Ficam fora do perfil de usuario porque a loja e uma so.
const vazio = () => ({
  sales: [],
  expenses: [],
  stock: Object.fromEntries(PRODUCTS.map((p) => [p.id, STOCK_INICIAL])),
});

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (!v || typeof v !== "object") return vazio();
    const base = vazio();
    return {
      sales: Array.isArray(v.sales) ? v.sales : [],
      expenses: Array.isArray(v.expenses) ? v.expenses : [],
      // Produto novo no cardapio entra com estoque cheio em vez de indefinido.
      stock: { ...base.stock, ...(v.stock || {}) },
    };
  } catch {
    return vazio();
  }
};

const code = () => Math.random().toString(36).slice(2, 8).toUpperCase();
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

  const advanceSale = useCallback((saleCode) => {
    setData((d) => ({
      ...d,
      sales: d.sales.map((s) => (s.code === saleCode ? { ...s, step: Math.min(3, s.step + 1) } : s)),
    }));
  }, []);

  const adjustStock = useCallback((id, delta) => {
    setData((d) => ({ ...d, stock: { ...d.stock, [id]: Math.max(0, (d.stock[id] ?? 0) + delta) } }));
  }, []);

  const setStock = useCallback((id, qty) => {
    setData((d) => ({ ...d, stock: { ...d.stock, [id]: Math.max(0, qty) } }));
  }, []);

  const addExpense = useCallback((exp) => {
    setData((d) => ({ ...d, expenses: [{ id: code(), date: new Date().toISOString(), ...exp }, ...d.expenses] }));
  }, []);

  const removeExpense = useCallback((id) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  const value = useMemo(() => {
    const doDia = (arr) => arr.filter((x) => x.date.slice(0, 10) === hoje());
    const vendasHoje = doDia(data.sales);
    const despesasHoje = doDia(data.expenses);
    const faturamento = vendasHoje.reduce((s, v) => s + v.total, 0);
    const gastos = despesasHoje.reduce((s, e) => s + e.value, 0);
    return {
      ...data,
      addSale,
      advanceSale,
      adjustStock,
      setStock,
      addExpense,
      removeExpense,
      hoje: {
        vendas: vendasHoje,
        pedidos: vendasHoje.length,
        faturamento,
        gastos,
        lucro: faturamento - gastos,
        ticket: vendasHoje.length ? faturamento / vendasHoje.length : 0,
      },
    };
  }, [data, addSale, advanceSale, adjustStock, setStock, addExpense, removeExpense]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
};
