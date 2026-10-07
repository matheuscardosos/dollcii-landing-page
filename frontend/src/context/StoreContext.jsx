import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COUPONS, PRODUCTS } from "../data/menu";

const KEY = "geliz-loja";
const STOCK_INICIAL = 40;
const CUSTO_INICIAL = 2.5;
const ULTIMAS_UNIDADES = 6;

// Dados da operacao, compartilhados entre Nicolas e Allana.
// Ficam fora do perfil de usuario porque a loja e uma so.
const vazio = () => ({
  sales: [],
  expenses: [],
  stock: Object.fromEntries(PRODUCTS.map((p) => [p.id, STOCK_INICIAL])),
  costs: Object.fromEntries(PRODUCTS.map((p) => [p.id, CUSTO_INICIAL])),
  // So o que a loja mudou em cima do cardapio base.
  overrides: {},
  favorites: {},
  // O cupom antigo vira o primeiro da lista, agora editavel pelo painel.
  coupons: Object.entries(COUPONS).map(([code, rate]) => ({
    code,
    discount: Math.round(rate * 100),
    active: true,
    uses: 0,
    expiresAt: "",
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
      costs: { ...base.costs, ...(v.costs || {}) },
      overrides: v.overrides || {},
      favorites: v.favorites || {},
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

  const setPrice = useCallback((id, price) => {
    setData((d) => ({ ...d, overrides: { ...d.overrides, [id]: { ...d.overrides[id], price: Math.max(0, price) } } }));
  }, []);

  const togglePaused = useCallback((id) => {
    setData((d) => ({ ...d, overrides: { ...d.overrides, [id]: { ...d.overrides[id], paused: !d.overrides[id]?.paused } } }));
  }, []);

  // Contagem global de favoritos: o perfil guarda os do usuario, isso guarda o total.
  const bumpFavorite = useCallback((id, delta) => {
    setData((d) => ({ ...d, favorites: { ...d.favorites, [id]: Math.max(0, (d.favorites[id] || 0) + delta) } }));
  }, []);

  const setCost = useCallback((id, value) => {
    setData((d) => ({ ...d, costs: { ...d.costs, [id]: Math.max(0, value) } }));
  }, []);

  const setStock = useCallback((id, qty) => {
    setData((d) => ({ ...d, stock: { ...d.stock, [id]: Math.max(0, qty) } }));
  }, []);

  const addCoupon = useCallback((code, discount, expiresAt = "") => {
    const norm = code.trim().toUpperCase();
    let ok = true;
    setData((d) => {
      if (d.coupons.some((c) => c.code === norm)) {
        ok = false;
        return d;
      }
      return { ...d, coupons: [{ code: norm, discount, active: true, uses: 0, expiresAt }, ...d.coupons] };
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
    const diasAtras = (n) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return d.toISOString().slice(0, 10);
    };

    // "tudo" nao filtra; os outros cortam pela data de corte.
    const corte = { hoje: hoje(), "7d": diasAtras(6), "30d": diasAtras(29), tudo: null };

    const resumo = (periodo = "hoje") => {
      const desde = corte[periodo];
      const dentro = (x) => !desde || x.date.slice(0, 10) >= desde;

      const vendas = data.sales.filter((v) => dentro(v) && !v.canceled);
      const despesas = data.expenses.filter(dentro);

      const faturamento = vendas.reduce((acc, v) => acc + v.total, 0);
      // Custo do que saiu, nao do que esta parado em estoque.
      const custo = vendas.reduce(
        (acc, v) => acc + v.items.reduce((a, i) => a + (data.costs[i.id] ?? 0) * i.qty, 0),
        0
      );
      const gastos = despesas.reduce((acc, e) => acc + e.value, 0);

      const porProduto = {};
      vendas.forEach((v) =>
        v.items.forEach((i) => {
          const r = (porProduto[i.id] = porProduto[i.id] || { id: i.id, name: i.name, qty: 0, receita: 0, custo: 0 });
          r.qty += i.qty;
          r.receita += i.price * i.qty;
          r.custo += (data.costs[i.id] ?? 0) * i.qty;
        })
      );

      return {
        vendas,
        pedidos: vendas.length,
        faturamento,
        custo,
        gastos,
        lucro: faturamento - custo - gastos,
        ticket: vendas.length ? faturamento / vendas.length : 0,
        unidades: vendas.reduce((acc, v) => acc + v.items.reduce((a, i) => a + i.qty, 0), 0),
        ranking: Object.values(porProduto).sort((a, b) => b.qty - a.qty),
      };
    };

    // O cardapio que o resto do app enxerga ja vem com o que a loja editou.
    const catalog = PRODUCTS.map((p) => ({ ...p, ...(data.overrides[p.id] || {}) }));

    const metricas = (id) => {
      let qty = 0;
      let receita = 0;
      data.sales.forEach((v) => {
        if (v.canceled) return;
        v.items.forEach((i) => {
          if (i.id !== id) return;
          qty += i.qty;
          receita += i.price * i.qty;
        });
      });
      return { qty, receita, favoritos: data.favorites[id] || 0 };
    };

    return {
      ...data,
      catalog,
      metricas,
      setPrice,
      togglePaused,
      bumpFavorite,
      addSale,
      advanceSale,
      cancelSale,
      salesOf: (email) => data.sales.filter((s) => s.customer && s.customer.email === email),
      adjustStock,
      setStock,
      setCost,
      addExpense,
      removeExpense,
      addCoupon,
      toggleCoupon,
      removeCoupon,
      useCoupon,
      // Cupom inexistente, pausado ou vencido nao da desconto.
      couponRate: (code) => {
        const c = data.coupons.find((x) => x.code === (code || "").trim().toUpperCase());
        if (!c || !c.active) return 0;
        if (c.expiresAt && c.expiresAt < hoje()) return 0;
        return c.discount / 100;
      },
      isExpired: (c) => !!c.expiresAt && c.expiresAt < hoje(),

      // Quem vende so pergunta se tem ou nao tem. A quantidade fica no painel.
      isAvailable: (id) => !data.overrides[id]?.paused && (data.stock[id] ?? 0) > 0,
      isPaused: (id) => !!data.overrides[id]?.paused,
      isLow: (id) => {
        const q = data.stock[id] ?? 0;
        return q > 0 && q <= ULTIMAS_UNIDADES;
      },
      stockLeft: (id) => data.stock[id] ?? 0,

      resumo,
      pendentes: data.sales.filter((s) => !s.canceled && s.step < 3),
    };
  }, [data, addSale, advanceSale, cancelSale, adjustStock, setStock, setCost, setPrice, togglePaused, bumpFavorite, addExpense, removeExpense, addCoupon, toggleCoupon, removeCoupon, useCoupon]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
};
