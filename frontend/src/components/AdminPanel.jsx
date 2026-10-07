import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Boxes, Check, ChevronRight, Clock, Heart, LogOut, Minus, Package,
  MoreHorizontal, Pause, Play, Plus, Receipt, Ticket, Trash2, TrendingUp, Truck, User, UtensilsCrossed, Wallet, X,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { brl } from "../data/menu";

const TABS = [
  { id: "resumo", label: "Resumo", icon: TrendingUp },
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "cardapio", label: "Cardápio", icon: UtensilsCrossed },
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

// A barra do celular comporta 4 abas mais o botao "Mais"; o resto vai pra folha.
const NA_BARRA = 4;

const fmtHora = (iso) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const Empty = ({ icon: Icon, title, text }) => (
  <div className="rounded-[22px] border border-app-border bg-app-surface px-6 py-14 text-center">
    <Icon className="mx-auto h-10 w-10 text-app-muted" />
    <p className="mt-4 font-display text-lg font-bold">{title}</p>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-app-muted">{text}</p>
  </div>
);

/* ── aba resumo ── */

const PERIODOS = [
  { id: "hoje", label: "Hoje" },
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "tudo", label: "Tudo" },
];

const Metric = ({ label, value, hint, accent }) => (
  <div className="rounded-[22px] border border-app-border bg-app-surface p-5">
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">{label}</p>
    <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl" style={accent ? { color: accent } : undefined}>
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-app-muted">{hint}</p>}
  </div>
);

const Resumo = ({ onNovaVenda, onVerPendentes }) => {
  const { resumo, pendentes, stock, isLow, isAvailable, catalog } = useStore();
  const [periodo, setPeriodo] = useState("hoje");
  const r = resumo(periodo);

  const repor = catalog.filter((p) => !isAvailable(p.id) || isLow(p.id));
  const margem = r.faturamento > 0 ? Math.round((r.lucro / r.faturamento) * 100) : 0;

  return (
    <div className="space-y-4">
      {pendentes.length > 0 && (
        <button
          onClick={onVerPendentes}
          className="flex w-full items-center gap-3 rounded-[22px] bg-berry p-5 text-left text-white transition-transform active:scale-[0.99]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20">
            <Clock className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-bold">
              {pendentes.length} {pendentes.length === 1 ? "pedido aguardando" : "pedidos aguardando"}
            </span>
            <span className="block text-xs text-white/80">Toque para ver a lista</span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </button>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {PERIODOS.map((x) => (
          <button
            key={x.id}
            onClick={() => setPeriodo(x.id)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${periodo === x.id ? "border-app-text bg-app-invert text-app-invert-text" : "border-app-border bg-app-surface"}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label="Faturamento"
          value={brl(r.faturamento)}
          hint={r.pedidos + (r.pedidos === 1 ? " pedido" : " pedidos") + " · " + r.unidades + " un"}
        />
        <Metric label="Ticket médio" value={brl(r.ticket)} />
        <Metric label="Custo + despesas" value={brl(r.custo + r.gastos)} hint={"Produção " + brl(r.custo)} />
        <Metric
          label="Lucro"
          value={brl(r.lucro)}
          hint={r.faturamento > 0 ? "Margem de " + margem + "%" : undefined}
          accent={r.lucro >= 0 ? "#6F9A4F" : "#FC030F"}
        />
      </div>

      <button
        onClick={onNovaVenda}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
      >
        <Plus className="h-4 w-4" /> Registrar nova venda
      </button>

      {r.ranking.length > 0 && (
        <div className="rounded-[22px] border border-app-border bg-app-surface p-5">
          <p className="font-display text-base font-bold">Mais vendidos</p>
          <ul className="mt-3 space-y-3">
            {r.ranking.map((item, i) => {
              const pct = Math.round((item.qty / r.ranking[0].qty) * 100);
              const lucroItem = item.receita - item.custo;
              return (
                <li key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {i + 1}. {item.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-app-muted">
                      {item.qty} un · {brl(lucroItem)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-app-border">
                    <div className="h-full rounded-full bg-berry" style={{ width: pct + "%" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {repor.length > 0 && (
        <div className="rounded-[22px] border border-berry/30 bg-app-accent-soft p-5">
          <p className="font-display text-base font-bold">Precisa repor</p>
          <ul className="mt-2 space-y-1 text-sm">
            {repor.map((p) => (
              <li key={p.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className={`shrink-0 font-mono text-xs font-semibold ${isAvailable(p.id) ? "" : "text-berry"}`}>
                  {isAvailable(p.id) ? (stock[p.id] ?? 0) + " un" : "Esgotado"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-[22px] border border-app-border bg-app-surface p-5">
        <p className="font-display text-base font-bold">Vendas do período</p>
        {r.vendas.length === 0 ? (
          <p className="mt-2 text-sm text-app-muted">Nenhuma venda registrada.</p>
        ) : (
          <ul className="mt-3 divide-y divide-app-border">
            {r.vendas.slice(0, 12).map((v) => (
              <li key={v.code} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {v.items.reduce((a, i) => a + i.qty, 0)} un · {v.customer ? v.customer.name : "Balcão"}
                  </span>
                  <span className="block text-xs text-app-muted">{fmtHora(v.date)}</span>
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold">{brl(v.total)}</span>
              </li>
            ))}
          </ul>
        )}
        {r.vendas.length > 12 && (
          <p className="mt-3 text-xs text-app-muted">Mostrando as 12 mais recentes de {r.vendas.length}.</p>
        )}
      </div>
    </div>
  );
};

/* ── aba pedidos ── */

const MOTIVOS = ["Sem estoque", "Fora da área de entrega", "Cliente desistiu", "Pagamento não confirmado"];

const CancelDialog = ({ sale, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState("");

  const confirmar = () => {
    const texto = motivo.trim();
    if (texto.length < 4) return toast.error("Escreva o motivo do cancelamento");
    onConfirm(texto);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5"
    >
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        className="w-full max-w-md rounded-t-[28px] bg-app-surface p-6 sm:rounded-[28px]"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold">Cancelar pedido</p>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-app-muted">#{sale.code}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-app-hover">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm text-app-muted">
          O cliente vai ver esse motivo no histórico dele. O estoque volta pra prateleira.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {MOTIVOS.map((m) => (
            <button
              key={m}
              onClick={() => setMotivo(m)}
              className={`h-8 rounded-full border px-3 text-xs font-medium transition-colors ${motivo === m ? "border-app-text bg-app-invert text-app-invert-text" : "border-app-border hover:bg-app-hover"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Escreva o motivo"
          className="mt-3 w-full resize-none rounded-2xl border border-app-border p-4 text-sm outline-none focus:border-app-text"
        />

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="h-12 flex-1 rounded-full border border-app-border text-sm font-semibold transition-colors hover:bg-app-hover">
            Voltar
          </button>
          <button onClick={confirmar} className="h-12 flex-1 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
            Cancelar pedido
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SITUACOES = [
  { id: "pendentes", label: "Pendentes", test: (s) => !s.canceled && s.step < 3 },
  { id: "entregues", label: "Entregues", test: (s) => !s.canceled && s.step === 3 },
  { id: "cancelados", label: "Cancelados", test: (s) => s.canceled },
  { id: "todos", label: "Todos", test: () => true },
];

const Pedidos = () => {
  const { sales, advanceSale, cancelSale } = useStore();
  const [cancelando, setCancelando] = useState(null);
  const [situacao, setSituacao] = useState("pendentes");
  const [busca, setBusca] = useState("");

  const confirmar = (motivo) => {
    cancelSale(cancelando.code, motivo);
    toast.success("Pedido #" + cancelando.code + " cancelado");
    setCancelando(null);
  };

  if (!sales.length) {
    return <Empty icon={Receipt} title="Nenhum pedido ainda" text="Vendas do site e do balcão aparecem aqui." />;
  }

  const termo = busca.trim().toUpperCase();
  const filtro = SITUACOES.find((x) => x.id === situacao).test;
  const lista = sales.filter(
    (s) => filtro(s) && (!termo || s.code.includes(termo) || (s.customer && s.customer.name.toUpperCase().includes(termo)))
  );

  return (
    <>
      <div className="mb-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {SITUACOES.map((x) => {
            const n = sales.filter(x.test).length;
            return (
              <button
                key={x.id}
                onClick={() => setSituacao(x.id)}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${situacao === x.id ? "border-app-text bg-app-invert text-app-invert-text" : "border-app-border bg-app-surface"}`}
              >
                {x.label}
                <span className={`font-mono text-[11px] ${situacao === x.id ? "opacity-70" : "text-app-muted"}`}>{n}</span>
              </button>
            );
          })}
        </div>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por código ou cliente"
          className="h-11 w-full rounded-full border border-app-border bg-app-surface px-4 text-sm outline-none focus:border-app-text"
        />
      </div>

      {lista.length === 0 ? (
        <Empty icon={Receipt} title="Nada por aqui" text="Nenhum pedido bate com o filtro escolhido." />
      ) : (
      <div className="space-y-3">
        {lista.map((s) => (
          <article key={s.code} className={`rounded-[22px] border bg-app-surface p-4 sm:p-5 ${s.canceled ? "border-berry/30 opacity-80" : "border-app-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">#{s.code}</p>
                <p className="mt-0.5 text-xs text-app-muted">{fmtHora(s.date)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`font-display text-lg font-bold ${s.canceled ? "text-app-muted line-through" : ""}`}>{brl(s.total)}</p>
                <p className="text-[11px] text-app-muted">{s.payment === "pix" ? "Pix" : s.payment === "dinheiro" ? "Dinheiro" : "Maquininha"}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-app-hover px-3 py-2">
              <User className="h-3.5 w-3.5 shrink-0 text-app-muted" />
              {s.customer ? (
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{s.customer.name}</span>
                  <span className="block truncate text-[11px] text-app-muted">{s.customer.email}</span>
                </span>
              ) : (
                <span className="text-xs font-medium text-app-muted">Venda no balcão</span>
              )}
            </div>

            <ul className="mt-3 space-y-1 border-t border-app-border pt-3">
              {s.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-app-muted">{i.qty}x {i.name}</span>
                  <span className="shrink-0 font-mono text-xs">{brl(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            {s.canceled ? (
              <div className="mt-4 rounded-xl bg-app-accent-soft p-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-berry">
                  <X className="h-4 w-4" /> Cancelado
                </p>
                <p className="mt-1 text-xs leading-relaxed text-app-muted">{s.cancelReason}</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {(() => {
                    const Icon = STEPS[s.step].icon;
                    return <Icon className="h-4 w-4 text-berry" />;
                  })()}
                  {STEPS[s.step].label}
                </span>
                <div className="flex items-center gap-2">
                  {s.step < 3 && (
                    <button
                      onClick={() => setCancelando(s)}
                      className="h-9 rounded-full border border-app-border px-4 text-xs font-semibold text-app-muted transition-colors hover:border-berry hover:text-berry"
                    >
                      Cancelar
                    </button>
                  )}
                  {s.step < 3 && (
                    <button
                      onClick={() => advanceSale(s.code)}
                      className="flex h-9 items-center gap-1.5 rounded-full bg-app-invert px-4 text-xs font-semibold text-app-invert-text transition-colors hover:bg-berry"
                    >
                      {STEPS[s.step + 1].label} <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
      )}

      <AnimatePresence>
        {cancelando && (
          <CancelDialog sale={cancelando} onClose={() => setCancelando(null)} onConfirm={confirmar} />
        )}
      </AnimatePresence>
    </>
  );
};

/* ── aba cardapio ── */

const CardapioAdmin = () => {
  const { catalog, costs, stock, metricas, setPrice, togglePaused, isPaused } = useStore();

  return (
    <div className="space-y-3">
      <p className="text-sm text-app-muted">Alterações no cardápio e status do produto.</p>
      {catalog.map((p) => {
        const m = metricas(p.id);
        const pausado = isPaused(p.id);
        const custo = costs[p.id] ?? 0;
        const margem = p.price > 0 ? Math.round(((p.price - custo) / p.price) * 100) : 0;
        return (
          <div key={p.id} className={`rounded-[22px] border bg-app-surface p-4 ${pausado ? "border-app-border opacity-70" : "border-app-border"}`}>
            <div className="flex items-start gap-3">
              <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
                <img src={p.img} alt="" loading="lazy" className="h-full w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-app-muted">{p.desc}</p>
              </div>
              <button
                onClick={() => togglePaused(p.id)}
                aria-label={pausado ? "Voltar a vender" : "Pausar venda"}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors ${pausado ? "border-berry text-berry" : "border-app-border text-app-muted hover:text-app-text"}`}
              >
                {pausado ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {pausado ? "Pausado" : "À venda"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-app-border pt-3 sm:grid-cols-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Preço</span>
                <span className="relative mt-1 block">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-app-muted">R$</span>
                  <input
                    value={String(p.price).replace(".", ",")}
                    onChange={(e) => setPrice(p.id, parseFloat(e.target.value.replace(",", ".").replace(/[^\d.]/g, "")) || 0)}
                    inputMode="decimal"
                    aria-label={"Preço de " + p.name}
                    className="h-9 w-full rounded-lg border border-app-border bg-app-surface pl-9 pr-2 font-mono text-sm outline-none focus:border-app-text"
                  />
                </span>
              </label>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Margem</span>
                <p className="mt-1 flex h-9 items-center font-mono text-sm">
                  {margem}% <span className="ml-1.5 text-xs text-app-muted">({brl(custo)} de custo)</span>
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Estoque</span>
                <p className="mt-1 flex h-9 items-center font-mono text-sm">{stock[p.id] ?? 0} un</p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Favoritado</span>
                <p className="mt-1 flex h-9 items-center gap-1.5 font-mono text-sm">
                  <Heart className="h-3.5 w-3.5 fill-berry text-berry" /> {m.favoritos}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-app-hover px-3 py-2">
              <span className="text-xs text-app-muted">Vendeu {m.qty} un no total</span>
              <span className="font-mono text-xs font-semibold">{brl(m.receita)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── aba estoque ── */

const Estoque = () => {
  const { stock, costs, adjustStock, setStock, setCost, isAvailable, isLow, catalog } = useStore();
  return (
    <div className="space-y-3">
      <p className="text-sm text-app-muted">Defina o custo e o estoque de cada produto.</p>
      {catalog.map((p) => {
        const qty = stock[p.id] ?? 0;
        const esgotado = !isAvailable(p.id);
        const baixo = isLow(p.id);
        const margem = p.price > 0 ? Math.round(((p.price - (costs[p.id] ?? 0)) / p.price) * 100) : 0;
        return (
          <div key={p.id} className={`rounded-[22px] border bg-app-surface p-3 ${esgotado ? "border-berry/40" : "border-app-border"}`}>
            <div className="flex items-center gap-3">
              <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
                <img src={p.img} alt="" loading="lazy" className="h-full w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className={`mt-0.5 text-xs ${esgotado || baixo ? "font-semibold text-berry" : "text-app-muted"}`}>
                  {esgotado ? "Esgotado no site" : qty + " unidades" + (baixo ? " · repor" : "")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => adjustStock(p.id, -1)} aria-label="Tirar uma" className="grid h-9 w-9 place-items-center rounded-full border border-app-border transition-colors hover:bg-app-hover">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  value={qty}
                  onChange={(e) => setStock(p.id, parseInt(e.target.value.replace(/\D/g, "") || "0", 10))}
                  inputMode="numeric"
                  aria-label={"Estoque de " + p.name}
                  className="h-9 w-12 rounded-lg border border-app-border bg-app-surface text-center font-mono text-sm outline-none focus:border-app-text"
                />
                <button onClick={() => adjustStock(p.id, 1)} aria-label="Somar uma" className="grid h-9 w-9 place-items-center rounded-full border border-app-border transition-colors hover:bg-app-hover">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 border-t border-app-border pt-3">
              <label className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Custo</span>
                <span className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-app-muted">R$</span>
                  <input
                    value={String(costs[p.id] ?? 0).replace(".", ",")}
                    onChange={(e) => setCost(p.id, parseFloat(e.target.value.replace(",", ".").replace(/[^\d.]/g, "")) || 0)}
                    inputMode="decimal"
                    aria-label={"Custo de " + p.name}
                    className="h-9 w-24 rounded-lg border border-app-border bg-app-surface pl-9 pr-2 font-mono text-sm outline-none focus:border-app-text"
                  />
                </span>
              </label>
              <p className="ml-auto text-xs text-app-muted">
                Vende a {brl(p.price)} · margem de <span className="font-semibold text-app-text">{margem}%</span>
              </p>
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
      <form onSubmit={lancar} className="space-y-3 rounded-[22px] border border-app-border bg-app-surface p-5">
        <p className="font-display text-base font-bold">Lançar despesa</p>
        <input
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
          placeholder="Ex.: leite condensado, 12 caixas"
          className="h-12 w-full rounded-2xl border border-app-border px-4 text-sm outline-none focus:border-app-text"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            placeholder="0,00"
            inputMode="decimal"
            className="h-12 w-full rounded-2xl border border-app-border px-4 text-sm outline-none focus:border-app-text"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="h-12 w-full rounded-2xl border border-app-border bg-app-surface px-3 text-sm outline-none focus:border-app-text"
          >
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="h-12 w-full rounded-full bg-app-invert text-sm font-semibold text-app-invert-text transition-colors hover:bg-berry">
          Lançar
        </button>
      </form>

      {expenses.length === 0 ? (
        <Empty icon={Wallet} title="Nenhuma despesa" text="O que você gastar com ingredientes, embalagem e transporte aparece aqui." />
      ) : (
        <div className="rounded-[22px] border border-app-border bg-app-surface p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-bold">Lançamentos</p>
            <p className="font-mono text-sm font-semibold">{brl(total)}</p>
          </div>
          <ul className="mt-3 divide-y divide-app-border">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{e.desc}</span>
                  <span className="block text-xs text-app-muted">{e.category} · {fmtHora(e.date)}</span>
                </span>
                <span className="shrink-0 font-mono text-sm">{brl(e.value)}</span>
                <button onClick={() => removeExpense(e.id)} aria-label="Remover despesa" className="shrink-0 text-app-muted transition-colors hover:text-berry">
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

const fmtData = (iso) => iso.split("-").reverse().join("/");

const Cupons = () => {
  const { coupons, addCoupon, toggleCoupon, removeCoupon, isExpired } = useStore();
  const [form, setForm] = useState({ code: "", discount: "10", expiresAt: "" });

  const criar = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const pct = parseInt(form.discount, 10);
    if (code.length < 3) return toast.error("O código precisa de pelo menos 3 letras");
    if (!pct || pct < 1 || pct > 90) return toast.error("Desconto deve ficar entre 1% e 90%");
    if (form.expiresAt && form.expiresAt < new Date().toISOString().slice(0, 10))
      return toast.error("A validade não pode ser no passado");
    if (!addCoupon(code, pct, form.expiresAt)) return toast.error("Já existe um cupom " + code);
    setForm({ code: "", discount: "10", expiresAt: "" });
    toast.success("Cupom " + code + " criado");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={criar} className="space-y-3 rounded-[22px] border border-app-border bg-app-surface p-5">
        <p className="font-display text-base font-bold">Criar cupom</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Código</span>
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="GELIZ10"
                maxLength={16}
                className="mt-1.5 h-12 w-full rounded-2xl border border-app-border px-4 text-sm uppercase outline-none focus:border-app-text"
              />
            </label>
          </div>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Desconto</span>
            <span className="relative mt-1.5 block">
              <input
                value={form.discount}
                onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                inputMode="numeric"
                className="h-12 w-full rounded-2xl border border-app-border px-4 pr-8 text-sm outline-none focus:border-app-text"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-app-muted">%</span>
            </span>
          </label>
        </div>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Validade (opcional)</span>
          <input
            type="date"
            value={form.expiresAt}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
            className="mt-1.5 h-12 w-full rounded-2xl border border-app-border px-4 text-sm outline-none focus:border-app-text"
          />
          <span className="mt-1.5 block text-xs text-app-muted">Deixe vazio para o cupom não expirar.</span>
        </label>
        <button className="h-12 w-full rounded-full bg-app-invert text-sm font-semibold text-app-invert-text transition-colors hover:bg-berry">
          Criar cupom
        </button>
      </form>

      {coupons.length === 0 ? (
        <Empty icon={Ticket} title="Nenhum cupom" text="Crie um código de desconto pra divulgar nas redes." />
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => {
            const vencido = isExpired(c);
            const valendo = c.active && !vencido;
            return (
              <div key={c.code} className={`flex items-center gap-3 rounded-[22px] border bg-app-surface p-4 ${vencido ? "border-berry/30" : "border-app-border"}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${valendo ? "bg-app-accent-soft text-berry" : "bg-app-hover text-app-muted"}`}>
                  <Ticket className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-mono text-sm font-bold tracking-wider ${vencido ? "text-app-muted line-through" : ""}`}>
                    {c.code}
                  </p>
                  <p className="text-xs text-app-muted">
                    {c.discount}% · {c.uses} {c.uses === 1 ? "uso" : "usos"}
                    {c.expiresAt ? (vencido ? " · venceu em " : " · vale até ") + fmtData(c.expiresAt) : " · sem prazo"}
                  </p>
                </div>
                {vencido ? (
                  <span className="shrink-0 rounded-full bg-app-accent-soft px-3 py-1 text-xs font-semibold text-berry">Vencido</span>
                ) : (
                  <button
                    onClick={() => toggleCoupon(c.code)}
                    className={`h-8 shrink-0 rounded-full border px-3 text-xs font-semibold transition-colors ${c.active ? "border-[#6F9A4F] text-[#6F9A4F]" : "border-app-border text-app-muted"}`}
                  >
                    {c.active ? "Ativo" : "Pausado"}
                  </button>
                )}
                <button onClick={() => removeCoupon(c.code)} aria-label={"Apagar cupom " + c.code} className="shrink-0 text-app-muted transition-colors hover:text-berry">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── nova venda ── */

const NovaVenda = ({ onClose }) => {
  const { addSale, catalog } = useStore();
  const [qtys, setQtys] = useState({});
  const [payment, setPayment] = useState("dinheiro");

  const set = (id, d) => setQtys((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + d) }));
  const itens = catalog.filter((p) => qtys[p.id] > 0).map((p) => ({ id: p.id, name: p.name, price: p.price, qty: qtys[p.id] }));
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
      className="fixed inset-0 z-50 flex flex-col bg-app-surface"
    >
      <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
        <button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-app-muted hover:text-app-text">
          <ArrowLeft className="h-4 w-4" /> Cancelar
        </button>
        <p className="font-display text-sm font-bold">Nova venda</p>
        <span className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="mx-auto max-w-lg space-y-3">
          {catalog.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-[22px] border border-app-border p-3">
              <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
                <img src={p.img} alt="" className="h-full w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-app-muted">{brl(p.price)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => set(p.id, -1)} aria-label="Menos" className="grid h-9 w-9 place-items-center rounded-full border border-app-border">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center font-mono text-sm">{qtys[p.id] || 0}</span>
                <button onClick={() => set(p.id, 1)} aria-label="Mais" className="grid h-9 w-9 place-items-center rounded-full border border-app-border">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Pagamento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[["dinheiro", "Dinheiro"], ["pix", "Pix"], ["cartao", "Maquininha"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setPayment(id)}
                  className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${payment === id ? "border-app-text bg-app-invert text-app-invert-text" : "border-app-border"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-app-border px-5 py-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-app-muted">Total</p>
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

/* ── folha com as abas que nao couberam ── */

const MaisOpcoes = ({ atual, onPick, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden"
  >
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      exit={{ y: 60 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-t-[28px] bg-app-bg p-5"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-app-border" />
      <div className="divide-y divide-app-border overflow-hidden rounded-[22px] border border-app-border bg-app-surface">
        {TABS.slice(NA_BARRA).map((t) => {
          const Icon = t.icon;
          const on = atual === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-app-hover"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-app-accent-soft text-berry" : "bg-app-hover text-app-muted"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className={`flex-1 text-sm ${on ? "font-semibold text-berry" : "font-medium"}`}>{t.label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-app-muted" />
            </button>
          );
        })}
      </div>
      <button
        onClick={onClose}
        className="mt-3 h-12 w-full rounded-full border border-app-border text-sm font-semibold transition-colors hover:bg-app-hover"
      >
        Fechar
      </button>
    </motion.div>
  </motion.div>
);

/* ── casca ── */

export const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("resumo");
  const [venda, setVenda] = useState(false);
  const [mais, setMais] = useState(false);

  if (!user) return null;

  // A rota e protegida, entao sair ja devolve a landing sozinho.
  const sair = () => {
    logout();
    toast.success("Você saiu do painel");
  };

  const title = TABS.find((t) => t.id === tab)?.label;

  return (
    <div className="min-h-screen bg-app-bg lg:pl-[248px]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[248px] flex-col border-r border-app-border bg-app-surface px-5 py-6 lg:flex">
        <span className="self-start"><Logo /></span>
        <nav className="mt-8 space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${on ? "bg-app-invert text-app-invert-text" : "text-app-muted hover:bg-app-hover hover:text-app-text"}`}
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
        <div className="mt-auto rounded-2xl bg-app-hover p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-app-muted">{user.email}</p>
          <button onClick={sair} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-berry hover:underline">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-app-border bg-app-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between gap-3 px-5 sm:px-6">
          <span className="lg:hidden"><Logo /></span>
          <p className="hidden font-display text-lg font-bold lg:block">{title}</p>
          <button onClick={sair} className="flex h-10 items-center gap-2 rounded-full border border-app-border px-4 text-sm font-semibold transition-colors hover:bg-app-hover">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-5 pb-28 pt-6 sm:px-6 lg:pb-12">
        <div className="lg:hidden">
          <h1 className="font-display text-2xl font-bold tracking-[-0.03em]">Oi, {user.name.split(" ")[0]}</h1>
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
            {tab === "resumo" && <Resumo onNovaVenda={() => setVenda(true)} onVerPendentes={() => setTab("pedidos")} />}
            {tab === "pedidos" && <Pedidos />}
            {tab === "cardapio" && <CardapioAdmin />}
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-app-border bg-app-surface/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
          {TABS.slice(0, NA_BARRA).map((t) => (
            <TabButton key={t.id} t={t} on={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
          <TabButton
            t={{ label: "Mais", icon: MoreHorizontal }}
            on={TABS.slice(NA_BARRA).some((t) => t.id === tab)}
            onClick={() => setMais(true)}
          />
        </div>
      </nav>

      <AnimatePresence>{venda && <NovaVenda onClose={() => setVenda(false)} />}</AnimatePresence>

      <AnimatePresence>
        {mais && (
          <MaisOpcoes
            atual={tab}
            onPick={(id) => {
              setTab(id);
              setMais(false);
            }}
            onClose={() => setMais(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ t, on, onClick }) => {
  const Icon = t.icon;
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 py-1" aria-current={on ? "page" : undefined}>
      <Icon className={`h-5 w-5 ${on ? "text-berry" : "text-app-muted"}`} />
      <span className={`text-[10px] leading-none ${on ? "font-semibold text-berry" : "text-app-muted"}`}>{t.label}</span>
    </button>
  );
};
