import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Check, ChevronRight, Clock, Heart, LogOut, MapPin, Package,
  Plus, Receipt, ShieldCheck, ShoppingBag, Truck, User, UtensilsCrossed, X,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useBag } from "../context/BagContext";
import { useStore } from "../context/StoreContext";
import { brl, CATEGORIES } from "../data/menu";

const TABS = [
  { id: "cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "conta", label: "Conta", icon: User },
];

const ORDER_STEPS = [
  { label: "Recebido", icon: Package },
  { label: "Em preparo", icon: Clock },
  { label: "A caminho", icon: Truck },
  { label: "Entregue", icon: Check },
];

/* ── card de produto, formato app ── */

const ProductTile = ({ p }) => {
  const { add } = useBag();
  const { isFavorite, toggleFavorite } = useAuth();
  const { isAvailable, isLow, bumpFavorite } = useStore();
  const fav = isFavorite(p.id);
  const favoritar = () => {
    toggleFavorite(p.id);
    bumpFavorite(p.id, fav ? -1 : 1);
  };
  const esgotado = !isAvailable(p.id);
  return (
    <motion.article layout className="overflow-hidden rounded-[22px] border border-app-border bg-app-surface">
      <div className="relative aspect-square" style={{ background: p.tint }}>
        <img src={p.img} alt={p.name} loading="lazy" className={`absolute inset-0 h-full w-full object-contain p-4 ${esgotado ? "opacity-40 saturate-0" : ""}`} />
        {esgotado ? (
          <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">Esgotado</span>
        ) : (
          isLow(p.id) && (
            <span className="absolute left-2 top-2 rounded-full bg-berry px-2.5 py-1 text-[10px] font-semibold text-white">Últimas</span>
          )
        )}
        <button
          onClick={favoritar}
          aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-app-surface shadow-md transition-transform active:scale-90"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-berry text-berry" : "text-app-muted"}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{p.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-app-muted">{p.desc}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold">{brl(p.price)}</span>
          <button
            onClick={() => add(p)}
            disabled={esgotado}
            aria-label={esgotado ? p.name + " esgotado" : "Adicionar " + p.name}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-app-invert text-app-invert-text transition-colors hover:bg-berry active:scale-90 disabled:pointer-events-none disabled:opacity-30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const Empty = ({ icon: Icon, title, text }) => (
  <div className="rounded-[22px] border border-app-border bg-app-surface px-6 py-14 text-center">
    <Icon className="mx-auto h-10 w-10 text-app-muted" />
    <p className="mt-4 font-display text-lg font-bold">{title}</p>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-app-muted">{text}</p>
  </div>
);

/* ── aba cardapio ── */

const Cardapio = () => {
  const { catalog } = useStore();
  const [cat, setCat] = useState("todos");
  const list = useMemo(() => (cat === "todos" ? catalog : catalog.filter((p) => p.cat === cat)), [cat, catalog]);
  return (
    <>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${cat === c.id ? "border-app-text bg-app-invert text-app-invert-text" : "border-app-border bg-app-surface"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => <ProductTile key={p.id} p={p} />)}
      </div>
    </>
  );
};

/* ── aba favoritos ── */

const Favoritos = () => {
  const { favorites } = useAuth();
  const { catalog } = useStore();
  const list = catalog.filter((p) => favorites.includes(p.id));
  if (!list.length) {
    return <Empty icon={Heart} title="Nenhum favorito ainda" text="Toque no coração de um sabor no cardápio para salvar aqui." />;
  }
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((p) => <ProductTile key={p.id} p={p} />)}
    </div>
  );
};

/* ── aba pedidos ── */

const Track = ({ step }) => (
  <ol className="mt-4 flex items-start">
    {ORDER_STEPS.map((s, i) => {
      const done = i <= step;
      const Icon = s.icon;
      return (
        <li key={s.label} className="relative flex flex-1 flex-col items-center gap-1.5">
          {i > 0 && (
            <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= step ? "bg-berry" : "bg-app-border"}`} />
          )}
          <span className={`relative grid h-8 w-8 place-items-center rounded-full ${done ? "bg-berry text-white" : "bg-app-border text-app-muted"}`}>
            <Icon className="h-4 w-4" />
          </span>
          <span className={`text-center text-[10px] leading-tight ${done ? "font-semibold text-app-text" : "text-app-muted"}`}>
            {s.label}
          </span>
        </li>
      );
    })}
  </ol>
);

const Pedidos = () => {
  const { user } = useAuth();
  const { salesOf } = useStore();
  // Le direto das vendas da loja: assim um cancelamento no painel chega aqui.
  const orders = salesOf(user.email);

  if (!orders.length) {
    return <Empty icon={Receipt} title="Nenhum pedido ainda" text="Quando você fizer o primeiro, ele aparece aqui com o status da entrega." />;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <article key={o.code} className={`rounded-[22px] border bg-app-surface p-4 sm:p-5 ${o.canceled ? "border-berry/30" : "border-app-border"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">#{o.code}</p>
              <p className="mt-0.5 text-xs text-app-muted">
                {new Date(o.date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`font-display text-lg font-bold ${o.canceled ? "text-app-muted line-through" : ""}`}>{brl(o.total)}</p>
              <p className="text-[11px] text-app-muted">{o.payment === "pix" ? "Pix" : o.payment === "dinheiro" ? "Dinheiro" : "Maquininha"}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 border-t border-app-border pt-3">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-app-muted">{i.qty}x {i.name}</span>
                <span className="shrink-0 font-mono text-xs">{brl(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          {o.canceled ? (
            <div className="mt-4 rounded-xl bg-app-accent-soft p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-berry">
                <X className="h-4 w-4" /> Pedido cancelado
              </p>
              <p className="mt-1 text-xs leading-relaxed text-app-muted">{o.cancelReason}</p>
            </div>
          ) : (
            <Track step={o.step} />
          )}
        </article>
      ))}
    </div>
  );
};

/* ── aba conta ── */

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">{label}</span>
    <input {...props} className="mt-1.5 h-12 w-full rounded-2xl border border-app-border bg-app-surface px-4 text-sm outline-none focus:border-app-text disabled:bg-app-hover disabled:text-app-muted" />
  </label>
);

const Card = ({ children, onSubmit, cta }) => (
  <form onSubmit={onSubmit} className="space-y-3 rounded-[22px] border border-app-border bg-app-surface p-5">
    {children}
    <button className="h-12 w-full rounded-full bg-app-invert text-sm font-semibold text-app-invert-text transition-colors hover:bg-berry">
      {cta}
    </button>
  </form>
);

const maskCpf = (v) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const SECOES = [
  { id: "pessoais", label: "Dados pessoais", hint: "Nome, CPF e telefone", icon: User },
  { id: "endereco", label: "Endereço padrão", hint: "Usado pra preencher o checkout", icon: MapPin },
  { id: "seguranca", label: "Segurança", hint: "Trocar a senha", icon: ShieldCheck },
  { id: "sessao", label: "Sessão", hint: "Voltar ao site ou sair", icon: LogOut },
];

// custom no AnimatePresence faz a direcao chegar tambem em quem esta saindo.
const DESLIZA = {
  entra: (d) => ({ opacity: 0, x: d * 26 }),
  centro: { opacity: 1, x: 0 },
  sai: (d) => ({ opacity: 0, x: d * -26 }),
};

const SectionHeader = ({ title, onBack }) => (
  <div className="mb-4 flex items-center gap-3">
    <button onClick={onBack} aria-label="Voltar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-app-border bg-app-surface transition-colors hover:bg-app-hover">
      <ArrowLeft className="h-4 w-4" />
    </button>
    <p className="font-display text-lg font-bold">{title}</p>
  </div>
);

const Conta = () => {
  const { user, updateProfile, logout } = useAuth();
  const [secao, setSecao] = useState(null);
  const [form, setForm] = useState({ name: user.name, cpf: user.cpf, phone: user.phone });
  const [addr, setAddr] = useState(user.address);
  const [pass, setPass] = useState({ atual: "", nova: "", confirma: "" });
  const [busyCep, setBusyCep] = useState(false);

  const setF = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: k === "cpf" ? maskCpf(e.target.value) : e.target.value }));

  const setA = (k) => async (e) => {
    const v = e.target.value;
    setAddr((a) => ({ ...a, [k]: v }));
    if (k === "cep" && v.replace(/\D/g, "").length === 8) {
      setBusyCep(true);
      try {
        const res = await fetch("https://brasilapi.com.br/api/cep/v1/" + v.replace(/\D/g, ""));
        if (!res.ok) throw new Error();
        const d = await res.json();
        setAddr((a) => ({ ...a, street: d.street || "", neighborhood: d.neighborhood || "", city: d.city || "", state: d.state || "" }));
      } catch {
        toast.error("CEP não encontrado");
      } finally {
        setBusyCep(false);
      }
    }
  };

  const salvarDados = (e) => {
    e.preventDefault();
    updateProfile(form);
    toast.success("Dados salvos");
  };

  const salvarEndereco = (e) => {
    e.preventDefault();
    updateProfile({ address: addr });
    toast.success("Endereço salvo");
  };

  const trocarSenha = (e) => {
    e.preventDefault();
    if (!pass.atual || !pass.nova || !pass.confirma) return toast.error("Preencha todos os campos");
    if (pass.nova !== pass.confirma) return toast.error("As senhas novas não coincidem");
    setPass({ atual: "", nova: "", confirma: "" });
    toast.success("Senha alterada");
  };

  // A rota e protegida, entao sair ja devolve a landing sozinho.
  const sair = () => {
    logout();
    toast.success("Você saiu da conta");
  };

  // O lado pra onde desliza depende de estar entrando ou voltando.
  const [dir, setDir] = useState(1);

  const abrir = (id) => {
    setDir(1);
    setSecao(id);
  };

  const voltar = () => {
    setDir(-1);
    setSecao(null);
  };

  const conteudo = () => {

    if (secao === "pessoais") {
      return (
        <>
          <SectionHeader title="Dados pessoais" onBack={voltar} />
          <Card onSubmit={salvarDados} cta="Salvar dados">
            <Field label="Nome" value={form.name} onChange={setF("name")} />
            <Field label="E-mail" value={user.email} disabled />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CPF" value={form.cpf} onChange={setF("cpf")} placeholder="000.000.000-00" inputMode="numeric" />
              <Field label="Telefone" value={form.phone} onChange={setF("phone")} placeholder="(38) 90000-0000" inputMode="tel" />
            </div>
          </Card>
        </>
      );
    }

    if (secao === "endereco") {
      return (
        <>
          <SectionHeader title="Endereço padrão" onBack={voltar} />
          <Card onSubmit={salvarEndereco} cta="Salvar endereço">
            <div className="relative">
              <Field label="CEP" value={addr.cep} onChange={setA("cep")} placeholder="00000-000" inputMode="numeric" maxLength={9} />
              {busyCep && <span className="absolute right-4 top-9 text-xs text-app-muted">Buscando...</span>}
            </div>
            <Field label="Rua" value={addr.street} onChange={setA("street")} placeholder="Nome da rua" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Número" value={addr.number} onChange={setA("number")} placeholder="Nº" />
              <Field label="Complemento" value={addr.complement} onChange={setA("complement")} placeholder="Apto, bloco" />
            </div>
            <Field label="Bairro" value={addr.neighborhood} onChange={setA("neighborhood")} placeholder="Bairro" />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Cidade" value={addr.city} onChange={setA("city")} placeholder="Cidade" />
              </div>
              <Field label="UF" value={addr.state} onChange={setA("state")} placeholder="MG" maxLength={2} />
            </div>
          </Card>
        </>
      );
    }

    if (secao === "seguranca") {
      return (
        <>
          <SectionHeader title="Segurança" onBack={voltar} />
          <Card onSubmit={trocarSenha} cta="Alterar senha">
            <Field label="Senha atual" type="password" value={pass.atual} onChange={(e) => setPass((p) => ({ ...p, atual: e.target.value }))} />
            <Field label="Nova senha" type="password" value={pass.nova} onChange={(e) => setPass((p) => ({ ...p, nova: e.target.value }))} />
            <Field label="Confirmar nova senha" type="password" value={pass.confirma} onChange={(e) => setPass((p) => ({ ...p, confirma: e.target.value }))} />
          </Card>
        </>
      );
    }

    if (secao === "sessao") {
      return (
        <>
          <SectionHeader title="Sessão" onBack={voltar} />
          <div className="space-y-1 rounded-[22px] border border-app-border bg-app-surface p-3">
            <button onClick={sair} className="flex w-full items-center justify-between rounded-xl px-2 py-3.5 text-sm text-berry transition-colors hover:bg-app-accent-soft">
              <span className="flex items-center gap-3"><LogOut className="h-4 w-4" /> Sair da conta</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center gap-4 rounded-[22px] border border-app-border bg-app-surface p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-berry text-xl font-bold text-white">
            {user.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold">{user.name}</p>
            <p className="truncate text-sm text-app-muted">{user.email}</p>
          </div>
        </div>

        <div className="mt-3 divide-y divide-app-border overflow-hidden rounded-[22px] border border-app-border bg-app-surface">
          {SECOES.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => abrir(sec.id)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-app-hover"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-app-hover text-app-muted">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{sec.label}</span>
                  <span className="block truncate text-xs text-app-muted">{sec.hint}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-app-muted" />
              </button>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-lg overflow-x-clip">
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={secao || "menu"}
          custom={dir}
          variants={DESLIZA}
          initial="entra"
          animate="centro"
          exit="sai"
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {conteudo()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── casca do app ── */

const BagFab = ({ className = "" }) => {
  const { count, setOpen } = useBag();
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Abrir sacola"
      className={`relative grid place-items-center rounded-full bg-berry text-white shadow-lg transition-transform active:scale-90 ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-app-invert px-1 font-mono text-[10px] text-app-invert-text">
          {count}
        </span>
      )}
    </button>
  );
};

export const Account = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("cardapio");

  if (!user) return null;

  const title = TABS.find((t) => t.id === tab)?.label;

  return (
    <div className="min-h-screen bg-app-bg lg:pl-[248px]">
      {/* Navegacao lateral no desktop */}
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
        <div className="mt-auto rounded-2xl bg-app-hover p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-app-muted">{user.email}</p>
          <button onClick={() => logout()} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-berry hover:underline">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </aside>

      {/* Barra do topo */}
      <header className="sticky top-0 z-20 border-b border-app-border bg-app-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between gap-3 px-5 sm:px-6">
          <span className="lg:hidden"><Logo /></span>
          <p className="hidden font-display text-lg font-bold lg:block">{title}</p>
          {/* No celular a sacola fica so no centro da barra de baixo. */}
          <BagFab className="hidden h-11 w-11 lg:grid" />
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-5 pb-28 pt-6 sm:px-6 lg:pb-12">
        <div className="lg:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-app-muted">Minha conta</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-[-0.03em]">
            Oi, {user.name.split(" ")[0]}
          </h1>
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
            {tab === "cardapio" && <Cardapio />}
            {tab === "favoritos" && <Favoritos />}
            {tab === "pedidos" && <Pedidos />}
            {tab === "conta" && <Conta />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegacao inferior no celular, com a sacola no centro */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-app-border bg-app-surface/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
          {TABS.slice(0, 2).map((t) => <TabButton key={t.id} t={t} on={tab === t.id} onClick={() => setTab(t.id)} />)}
          <div className="relative flex justify-center">
            <BagFab className="absolute -top-7 h-14 w-14 ring-4 ring-app-bg" />
          </div>
          {TABS.slice(2).map((t) => <TabButton key={t.id} t={t} on={tab === t.id} onClick={() => setTab(t.id)} />)}
        </div>
      </nav>
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
