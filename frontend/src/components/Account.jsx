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
import { brl, CATEGORIES, PRODUCTS } from "../data/menu";

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
  const fav = isFavorite(p.id);
  return (
    <motion.article layout className="overflow-hidden rounded-[22px] border hairline bg-white">
      <div className="relative aspect-square" style={{ background: p.tint }}>
        <img src={p.img} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-4" />
        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md transition-transform active:scale-90"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-berry text-berry" : "text-ink-soft"}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold">{p.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-soft">{p.desc}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold">{brl(p.price)}</span>
          <button
            onClick={() => add(p)}
            aria-label={"Adicionar " + p.name}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-berry active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const Empty = ({ icon: Icon, title, text }) => (
  <div className="rounded-[22px] border hairline bg-white px-6 py-14 text-center">
    <Icon className="mx-auto h-10 w-10 text-ink-soft" />
    <p className="mt-4 font-display text-lg font-bold">{title}</p>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

/* ── aba cardapio ── */

const Cardapio = () => {
  const [cat, setCat] = useState("todos");
  const list = useMemo(() => (cat === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)), [cat]);
  return (
    <>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${cat === c.id ? "border-ink bg-ink text-white" : "hairline bg-white"}`}
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
  const list = PRODUCTS.filter((p) => favorites.includes(p.id));
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
            <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= step ? "bg-berry" : "bg-ink/10"}`} />
          )}
          <span className={`relative grid h-8 w-8 place-items-center rounded-full ${done ? "bg-berry text-white" : "bg-ink/10 text-ink-soft"}`}>
            <Icon className="h-4 w-4" />
          </span>
          <span className={`text-center text-[10px] leading-tight ${done ? "font-semibold text-ink" : "text-ink-soft"}`}>
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
        <article key={o.code} className={`rounded-[22px] border bg-white p-4 sm:p-5 ${o.canceled ? "border-berry/30" : "hairline"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">#{o.code}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {new Date(o.date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={`font-display text-lg font-bold ${o.canceled ? "text-ink-soft line-through" : ""}`}>{brl(o.total)}</p>
              <p className="text-[11px] text-ink-soft">{o.payment === "pix" ? "Pix" : "Maquininha"}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 border-t hairline pt-3">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-ink-soft">{i.qty}x {i.name}</span>
                <span className="shrink-0 font-mono text-xs">{brl(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          {o.canceled ? (
            <div className="mt-4 rounded-xl bg-berry-soft p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-berry">
                <X className="h-4 w-4" /> Pedido cancelado
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{o.cancelReason}</p>
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
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">{label}</span>
    <input {...props} className="mt-1.5 h-12 w-full rounded-2xl border hairline bg-white px-4 text-sm outline-none focus:border-ink disabled:bg-paper disabled:text-ink-soft" />
  </label>
);

const Card = ({ children, onSubmit, cta }) => (
  <form onSubmit={onSubmit} className="space-y-3 rounded-[22px] border hairline bg-white p-5">
    {children}
    <button className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-berry">
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

const SectionHeader = ({ title, onBack }) => (
  <div className="mb-4 flex items-center gap-3">
    <button onClick={onBack} aria-label="Voltar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border hairline bg-white transition-colors hover:bg-paper">
      <ArrowLeft className="h-4 w-4" />
    </button>
    <p className="font-display text-lg font-bold">{title}</p>
  </div>
);

const Conta = ({ onBack }) => {
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

  const sair = () => {
    logout();
    toast.success("Você saiu da conta");
    onBack();
  };

  const voltar = () => setSecao(null);

  if (secao === "pessoais") {
    return (
      <div className="mx-auto max-w-lg">
        <SectionHeader title="Dados pessoais" onBack={voltar} />
        <Card onSubmit={salvarDados} cta="Salvar dados">
          <Field label="Nome" value={form.name} onChange={setF("name")} />
          <Field label="E-mail" value={user.email} disabled />
          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF" value={form.cpf} onChange={setF("cpf")} placeholder="000.000.000-00" inputMode="numeric" />
            <Field label="Telefone" value={form.phone} onChange={setF("phone")} placeholder="(38) 90000-0000" inputMode="tel" />
          </div>
        </Card>
      </div>
    );
  }

  if (secao === "endereco") {
    return (
      <div className="mx-auto max-w-lg">
        <SectionHeader title="Endereço padrão" onBack={voltar} />
        <Card onSubmit={salvarEndereco} cta="Salvar endereço">
          <div className="relative">
            <Field label="CEP" value={addr.cep} onChange={setA("cep")} placeholder="00000-000" inputMode="numeric" maxLength={9} />
            {busyCep && <span className="absolute right-4 top-9 text-xs text-ink-soft">Buscando...</span>}
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
      </div>
    );
  }

  if (secao === "seguranca") {
    return (
      <div className="mx-auto max-w-lg">
        <SectionHeader title="Segurança" onBack={voltar} />
        <Card onSubmit={trocarSenha} cta="Alterar senha">
          <Field label="Senha atual" type="password" value={pass.atual} onChange={(e) => setPass((p) => ({ ...p, atual: e.target.value }))} />
          <Field label="Nova senha" type="password" value={pass.nova} onChange={(e) => setPass((p) => ({ ...p, nova: e.target.value }))} />
          <Field label="Confirmar nova senha" type="password" value={pass.confirma} onChange={(e) => setPass((p) => ({ ...p, confirma: e.target.value }))} />
        </Card>
      </div>
    );
  }

  if (secao === "sessao") {
    return (
      <div className="mx-auto max-w-lg">
        <SectionHeader title="Sessão" onBack={voltar} />
        <div className="space-y-1 rounded-[22px] border hairline bg-white p-3">
          <button onClick={onBack} className="flex w-full items-center justify-between rounded-xl px-2 py-3.5 text-sm transition-colors hover:bg-paper">
            <span className="flex items-center gap-3"><ArrowLeft className="h-4 w-4 text-ink-soft" /> Voltar para o site</span>
            <ChevronRight className="h-4 w-4 text-ink-soft" />
          </button>
          <button onClick={sair} className="flex w-full items-center justify-between rounded-xl px-2 py-3.5 text-sm text-berry transition-colors hover:bg-berry-soft">
            <span className="flex items-center gap-3"><LogOut className="h-4 w-4" /> Sair da conta</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center gap-4 rounded-[22px] border hairline bg-white p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-berry text-xl font-bold text-white">
          {user.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{user.name}</p>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
        </div>
      </div>

      <div className="mt-3 divide-y divide-ink/10 overflow-hidden rounded-[22px] border hairline bg-white">
        {SECOES.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setSecao(sec.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-paper"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper text-ink-soft">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{sec.label}</span>
                <span className="block truncate text-xs text-ink-soft">{sec.hint}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-soft" />
            </button>
          );
        })}
      </div>
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
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] text-white">
          {count}
        </span>
      )}
    </button>
  );
};

export const Account = ({ onBack }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState("cardapio");

  if (!user) return null;

  const title = TABS.find((t) => t.id === tab)?.label;

  return (
    <div className="min-h-screen bg-paper lg:pl-[248px]">
      {/* Navegacao lateral no desktop */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[248px] flex-col border-r hairline bg-white px-5 py-6 lg:flex">
        <button onClick={onBack} aria-label="Voltar para o site" className="self-start"><Logo /></button>
        <nav className="mt-8 space-y-1">
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
        <div className="mt-auto rounded-2xl bg-paper p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-ink-soft">{user.email}</p>
          <button onClick={onBack} className="mt-3 text-xs font-medium text-berry hover:underline">
            Voltar para o site
          </button>
        </div>
      </aside>

      {/* Barra do topo */}
      <header className="sticky top-0 z-20 border-b hairline bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between gap-3 px-5 sm:px-6">
          <button onClick={onBack} className="lg:hidden" aria-label="Voltar para o site">
            <Logo />
          </button>
          <p className="hidden font-display text-lg font-bold lg:block">{title}</p>
          {/* No celular a sacola fica so no centro da barra de baixo. */}
          <BagFab className="hidden h-11 w-11 lg:grid" />
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-5 pb-28 pt-6 sm:px-6 lg:pb-12">
        <div className="lg:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Minha conta</p>
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
            {tab === "conta" && <Conta onBack={onBack} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegacao inferior no celular, com a sacola no centro */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-white/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
          {TABS.slice(0, 2).map((t) => <TabButton key={t.id} t={t} on={tab === t.id} onClick={() => setTab(t.id)} />)}
          <div className="relative flex justify-center">
            <BagFab className="absolute -top-7 h-14 w-14 ring-4 ring-paper" />
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
      <Icon className={`h-5 w-5 ${on ? "text-berry" : "text-ink-soft"}`} />
      <span className={`text-[10px] leading-none ${on ? "font-semibold text-berry" : "text-ink-soft"}`}>{t.label}</span>
    </button>
  );
};
