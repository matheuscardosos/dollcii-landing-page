import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Boxes, Check, ChevronRight, Clock, LogOut, Minus, Package,
  Plus, Receipt, Ticket, Trash2, TrendingUp, Truck, Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { brl, PRODUCTS } from "../data/menu";

const TABS = [
  { id: "hoje", label: "Hoje", icon: TrendingUp },
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "estoque", label: "Estoque", icon: Boxes },
  { id: "despesas", label: "Despesas", icon: Wallet },
  { id: "cupons", label: "Cupons", icon: Ticket },
];

const STEPS = [
  { label: "Recebido", icon: Package },
  { label: "Em preparo", icon: Clock },
  { label: "A caminho", icon: Truck },
  { label: "Entregue", icon: Check },
];

const ESTOQUE_BAIXO = 10;

const fmtHora = (iso) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const Empty = ({ icon: Icon, title, text }) => (
  <div className="rounded-[22px] border hairline bg-white px-6 py-14 text-center">
    <Icon className="mx-auto h-10 w-10 text-ink-soft" />
    <p className="mt-4 font-display text-lg font-bold">{title}</p>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

/* ── aba hoje ── */

const Metric = ({ label, value, hint, accent }) => (
  <div className="rounded-[22px] border hairline bg-white p-5">
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">{label}</p>
    <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl" style={accent ? { color: accent } : undefined}>
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
  </div>
);

const Hoje = ({ onNovaVenda }) => {
  const { hoje, stock } = useStore();
  const baixos = PRODUCTS.filter((p) => (stock[p.id] ?? 0) <= ESTOQUE_BAIXO);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Vendido hoje" value={brl(hoje.faturamento)} hint={hoje.pedidos + (hoje.pedidos === 1 ? " pedido" : " pedidos")} />
        <Metric label="Ticket médio" value={brl(hoje.ticket)} />
        <Metric label="Despesas" value={brl(hoje.gastos)} />
        <Metric label="Lucro" value={brl(hoje.lucro)} accent={hoje.lucro >= 0 ? "#6F9A4F" : "#FC030F"} />
      </div>

      <button
        onClick={onNovaVenda}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
      >
        <Plus className="h-4 w-4" /> Registrar nova venda
      </button>

      {baixos.length > 0 && (
        <div className="rounded-[22px] border border-berry/30 bg-berry-soft p-5">
          <p className="font-display text-base font-bold">Estoque baixo</p>
          <ul className="mt-2 space-y-1 text-sm">
            {baixos.map((p) => (
              <li key={p.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className="shrink-0 font-mono text-xs font-semibold">{stock[p.id] ?? 0} un</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[22px] border hairline bg-white p-5">
        <p className="font-display text-base font-bold">Vendas de hoje</p>
        {hoje.vendas.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Nenhuma venda registrada ainda hoje.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10">
            {hoje.vendas.map((v) => (
              <li key={v.code} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {v.items.reduce((s, i) => s + i.qty, 0)} un · {v.source === "balcao" ? "Balcão" : "Site"}
                  </span>
                  <span className="block text-xs text-ink-soft">{fmtHora(v.date)}</span>
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold">{brl(v.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ── aba pedidos ── */

const Pedidos = () => {
  const { sales, advanceSale } = useStore();
  if (!sales.length) {
    return <Empty icon={Receipt} title="Nenhum pedido ainda" text="Vendas do site e do balcão aparecem aqui." />;
  }
  return (
    <div className="space-y-3">
      {sales.map((s) => (
        <article key={s.code} className="rounded-[22px] border hairline bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                #{s.code} · {s.source === "balcao" ? "Balcão" : "Site"}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">{fmtHora(s.date)}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-lg font-bold">{brl(s.total)}</p>
              <p className="text-[11px] text-ink-soft">{s.payment === "pix" ? "Pix" : s.payment === "dinheiro" ? "Dinheiro" : "Maquininha"}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 border-t hairline pt-3">
            {s.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-ink-soft">{i.qty}x {i.name}</span>
                <span className="shrink-0 font-mono text-xs">{brl(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              {(() => {
                const Icon = STEPS[s.step].icon;
                return <Icon className="h-4 w-4 text-berry" />;
              })()}
              {STEPS[s.step].label}
            </span>
            {s.step < 3 && (
              <button
                onClick={() => advanceSale(s.code)}
                className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-white transition-colors hover:bg-berry"
              >
                {STEPS[s.step + 1].label} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

/* ── aba estoque ── */

const Estoque = () => {
  const { stock, adjustStock, setStock } = useStore();
  return (
    <div className="space-y-3">
      {PRODUCTS.map((p) => {
        const qty = stock[p.id] ?? 0;
        const baixo = qty <= ESTOQUE_BAIXO;
        return (
          <div key={p.id} className="flex items-center gap-3 rounded-[22px] border hairline bg-white p-3">
            <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
              <img src={p.img} alt="" loading="lazy" className="h-full w-auto object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className={`mt-0.5 text-xs ${baixo ? "font-semibold text-berry" : "text-ink-soft"}`}>
                {qty} unidades{baixo ? " · repor" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button onClick={() => adjustStock(p.id, -1)} aria-label="Tirar uma" className="grid h-9 w-9 place-items-center rounded-full border hairline transition-colors hover:bg-paper">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                value={qty}
                onChange={(e) => setStock(p.id, parseInt(e.target.value.replace(/\D/g, "") || "0", 10))}
                inputMode="numeric"
                aria-label={"Estoque de " + p.name}
                className="h-9 w-12 rounded-lg border hairline text-center font-mono text-sm outline-none focus:border-ink"
              />
              <button onClick={() => adjustStock(p.id, 1)} aria-label="Somar uma" className="grid h-9 w-9 place-items-center rounded-full border hairline transition-colors hover:bg-paper">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── aba despesas ── */

const CATEGORIAS = ["Ingredientes", "Embalagem", "Transporte", "Equipamento", "Outros"];

const Despesas = () => {
  const { expenses, addExpense, removeExpense } = useStore();
  const [form, setForm] = useState({ desc: "", value: "", category: CATEGORIAS[0] });

  const lancar = (e) => {
    e.preventDefault();
    const v = parseFloat(form.value.replace(",", "."));
    if (!form.desc.trim()) return toast.error("Descreva a despesa");
    if (!v || v <= 0) return toast.error("Informe um valor válido");
    addExpense({ desc: form.desc.trim(), value: v, category: form.category });
    setForm({ desc: "", value: "", category: CATEGORIAS[0] });
    toast.success("Despesa lançada");
  };

  const total = expenses.reduce((s, e) => s + e.value, 0);

  return (
    <div className="space-y-4">
      <form onSubmit={lancar} className="space-y-3 rounded-[22px] border hairline bg-white p-5">
        <p className="font-display text-base font-bold">Lançar despesa</p>
        <input
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          placeholder="Ex.: leite condensado, 12 caixas"
          className="h-12 w-full rounded-2xl border hairline px-4 text-sm outline-none focus:border-ink"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            placeholder="0,00"
            inputMode="decimal"
            className="h-12 w-full rounded-2xl border hairline px-4 text-sm outline-none focus:border-ink"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="h-12 w-full rounded-2xl border hairline bg-white px-3 text-sm outline-none focus:border-ink"
          >
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-berry">
          Lançar
        </button>
      </form>

      {expenses.length === 0 ? (
        <Empty icon={Wallet} title="Nenhuma despesa" text="O que você gastar com ingredientes, embalagem e transporte aparece aqui." />
      ) : (
        <div className="rounded-[22px] border hairline bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-bold">Lançamentos</p>
            <p className="font-mono text-sm font-semibold">{brl(total)}</p>
          </div>
          <ul className="mt-3 divide-y divide-ink/10">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{e.desc}</span>
                  <span className="block text-xs text-ink-soft">{e.category} · {fmtHora(e.date)}</span>
                </span>
                <span className="shrink-0 font-mono text-sm">{brl(e.value)}</span>
                <button onClick={() => removeExpense(e.id)} aria-label="Remover despesa" className="shrink-0 text-ink-soft transition-colors hover:text-berry">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ── aba cupons ── */

const Cupons = () => {
  const { coupons, addCoupon, toggleCoupon, removeCoupon } = useStore();
  const [form, setForm] = useState({ code: "", discount: "10" });

  const criar = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const pct = parseInt(form.discount, 10);
    if (code.length < 3) return toast.error("O código precisa de pelo menos 3 letras");
    if (!pct || pct < 1 || pct > 90) return toast.error("Desconto deve ficar entre 1% e 90%");
    if (!addCoupon(code, pct)) return toast.error("Já existe um cupom " + code);
    setForm({ code: "", discount: "10" });
    toast.success("Cupom " + code + " criado");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={criar} className="space-y-3 rounded-[22px] border hairline bg-white p-5">
        <p className="font-display text-base font-bold">Criar cupom</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="GELIZ10"
              maxLength={16}
              className="h-12 w-full rounded-2xl border hairline px-4 text-sm uppercase outline-none focus:border-ink"
            />
          </div>
          <div className="relative">
            <input
              value={form.discount}
              onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
              inputMode="numeric"
              aria-label="Desconto em porcentagem"
              className="h-12 w-full rounded-2xl border hairline px-4 pr-8 text-sm outline-none focus:border-ink"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">%</span>
          </div>
        </div>
        <button className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-berry">
          Criar cupom
        </button>
      </form>

      {coupons.length === 0 ? (
        <Empty icon={Ticket} title="Nenhum cupom" text="Crie um código de desconto pra divulgar nas redes." />
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.code} className="flex items-center gap-3 rounded-[22px] border hairline bg-white p-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.active ? "bg-berry-soft text-berry" : "bg-paper text-ink-soft"}`}>
                <Ticket className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm font-bold tracking-wider">{c.code}</p>
                <p className="text-xs text-ink-soft">
                  {c.discount}% de desconto · {c.uses} {c.uses === 1 ? "uso" : "usos"}
                </p>
              </div>
              <button
                onClick={() => toggleCoupon(c.code)}
                className={`h-8 shrink-0 rounded-full border px-3 text-xs font-semibold transition-colors ${c.active ? "border-[#6F9A4F] text-[#6F9A4F]" : "hairline text-ink-soft"}`}
              >
                {c.active ? "Ativo" : "Pausado"}
              </button>
              <button onClick={() => removeCoupon(c.code)} aria-label={"Apagar cupom " + c.code} className="shrink-0 text-ink-soft transition-colors hover:text-berry">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── nova venda ── */

const NovaVenda = ({ onClose }) => {
  const { addSale } = useStore();
  const [qtys, setQtys] = useState({});
  const [payment, setPayment] = useState("dinheiro");

  const set = (id, d) => setQtys((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + d) }));
  const itens = PRODUCTS.filter((p) => qtys[p.id] > 0).map((p) => ({ id: p.id, name: p.name, price: p.price, qty: qtys[p.id] }));
  const total = itens.reduce((s, i) => s + i.price * i.qty, 0);

  const registrar = () => {
    if (!itens.length) return toast.error("Escolha pelo menos um item");
    addSale({ items: itens, total, payment, source: "balcao", step: 3 });
    toast.success("Venda de " + brl(total) + " registrada");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      <div className="flex items-center justify-between border-b hairline px-5 py-4">
        <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <p className="font-display text-sm font-bold">Nova venda</p>
        <span className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mx-auto max-w-lg space-y-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-[22px] border hairline p-3">
              <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
                <img src={p.img} alt="" className="h-full w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-ink-soft">{brl(p.price)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => set(p.id, -1)} aria-label="Menos" className="grid h-9 w-9 place-items-center rounded-full border hairline">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center font-mono text-sm">{qtys[p.id] || 0}</span>
                <button onClick={() => set(p.id, 1)} aria-label="Mais" className="grid h-9 w-9 place-items-center rounded-full border hairline">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Pagamento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[["dinheiro", "Dinheiro"], ["pix", "Pix"], ["cartao", "Maquininha"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setPayment(id)}
                  className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${payment === id ? "border-ink bg-ink text-white" : "hairline"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t hairline px-5 py-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-soft">Total</p>
            <p className="font-display text-2xl font-bold">{brl(total)}</p>
          </div>
          <button
            onClick={registrar}
            className="h-14 shrink-0 rounded-full bg-berry px-8 text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
          >
            Registrar venda
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── casca ── */

export const AdminPanel = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("hoje");
  const [venda, setVenda] = useState(false);

  if (!user) return null;

  const sair = () => {
    logout();
    toast.success("Você saiu do painel");
    onBack();
  };

  const title = TABS.find((t) => t.id === tab)?.label;

  return (
    <div className="min-h-screen bg-paper lg:pl-[248px]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[248px] flex-col border-r hairline bg-white px-5 py-6 lg:flex">
        <button onClick={onBack} aria-label="Voltar para o site" className="self-start"><Logo /></button>
        <p className="mt-4 rounded-full bg-berry-soft px-3 py-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-berry">
          Painel da loja
        </p>
        <nav className="mt-6 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${on ? "bg-ink text-white" : "text-ink-soft hover:bg-paper hover:text-ink"}`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => setVenda(true)}
          className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
        >
          <Plus className="h-4 w-4" /> Nova venda
        </button>
        <div className="mt-auto rounded-2xl bg-paper p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-ink-soft">{user.email}</p>
          <button onClick={sair} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-berry hover:underline">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b hairline bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between gap-3 px-5 sm:px-6">
          <button onClick={onBack} className="lg:hidden" aria-label="Voltar para o site"><Logo /></button>
          <p className="hidden font-display text-lg font-bold lg:block">{title}</p>
          <button onClick={sair} className="flex h-10 items-center gap-2 rounded-full border hairline px-4 text-sm font-semibold transition-colors hover:bg-paper">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-5 pb-28 pt-6 sm:px-6 lg:pb-12">
        <div className="lg:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Painel da loja</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-[-0.03em]">Oi, {user.name.split(" ")[0]}</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="mt-5 lg:mt-0"
          >
            {tab === "hoje" && <Hoje onNovaVenda={() => setVenda(true)} />}
            {tab === "pedidos" && <Pedidos />}
            {tab === "estoque" && <Estoque />}
            {tab === "despesas" && <Despesas />}
            {tab === "cupons" && <Cupons />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Com cinco abas a venda sai do centro e vira botao flutuante. */}
      <button
        onClick={() => setVenda(true)}
        aria-label="Nova venda"
        className="fixed bottom-20 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-berry px-5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-90 lg:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus className="h-5 w-5" /> Venda
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-white/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
          {TABS.map((t) => <TabButton key={t.id} t={t} on={tab === t.id} onClick={() => setTab(t.id)} />)}
        </div>
      </nav>

      <AnimatePresence>{venda && <NovaVenda onClose={() => setVenda(false)} />}</AnimatePresence>
    </div>
  );
};

const TabButton = ({ t, on, onClick }) => {
  const Icon = t.icon;
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 py-1" aria-current={on ? "page" : undefined}>
      <Icon className={`h-5 w-5 ${on ? "text-berry" : "text-ink-soft"}`} />
      <span className={`text-[10px] leading-none ${on ? "font-semibold text-berry" : "text-ink-soft"}`}>{t.label}</span>
    </button>
  );
};
