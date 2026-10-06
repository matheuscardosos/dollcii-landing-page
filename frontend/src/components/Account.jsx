import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Heart, LogOut, Package, Plus, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useBag } from "../context/BagContext";
import { brl, CATEGORIES, PRODUCTS } from "../data/menu";

const TABS = [
  { id: "cardapio", label: "Cardápio", icon: Package },
  { id: "pedidos", label: "Pedidos", icon: Clock },
  { id: "dados", label: "Dados", icon: User },
  { id: "favoritos", label: "Favoritos", icon: Heart },
];

export const ORDER_STEPS = ["Recebido", "Em preparo", "Saiu para entrega", "Entregue"];

/* ── cartao de produto, versao compacta pra lista ── */

const Row = ({ p }) => {
  const { add } = useBag();
  const { isFavorite, toggleFavorite } = useAuth();
  const fav = isFavorite(p.id);
  return (
    <div className="flex items-center gap-4 rounded-[20px] border hairline bg-white p-3">
      <div className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: p.tint }}>
        <img src={p.img} alt={p.name} loading="lazy" className="h-full w-auto object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{p.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">{p.desc}</p>
        <p className="mt-1.5 text-sm font-semibold">{brl(p.price)}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <button
          onClick={() => toggleFavorite(p.id)}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${fav ? "border-berry bg-berry-soft text-berry" : "hairline text-ink-soft hover:text-berry"}`}
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={() => add(p)}
          aria-label={"Adicionar " + p.name + " à sacola"}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-berry"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ── aba: cardapio completo ── */

const Catalogo = () => {
  const [cat, setCat] = useState("todos");
  const list = useMemo(() => (cat === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat)), [cat]);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${cat === c.id ? "border-ink bg-ink text-white" : "hairline bg-white hover:bg-paper"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((p) => <Row key={p.id} p={p} />)}
      </div>
    </div>
  );
};

/* ── aba: pedidos ── */

const StatusTrack = ({ step }) => (
  <ol className="mt-4 grid grid-cols-4 gap-1">
    {ORDER_STEPS.map((s, i) => {
      const done = i <= step;
      const Icon = i === 3 ? Check : i === 2 ? Truck : i === 1 ? Clock : Package;
      return (
        <li key={s} className="flex flex-col items-center gap-1.5 text-center">
          <span className={`grid h-8 w-8 place-items-center rounded-full ${done ? "bg-berry text-white" : "bg-ink/10 text-ink-soft"}`}>
            <Icon className="h-4 w-4" />
          </span>
          <span className={`text-[10px] leading-tight ${done ? "font-semibold text-ink" : "text-ink-soft"}`}>{s}</span>
        </li>
      );
    })}
  </ol>
);

const Pedidos = () => {
  const { orders } = useAuth();
  if (!orders.length) {
    return (
      <div className="rounded-[24px] border hairline bg-white p-10 text-center">
        <Package className="mx-auto h-10 w-10 text-ink-soft" />
        <p className="mt-4 font-display text-xl font-bold">Nenhum pedido ainda</p>
        <p className="mt-1 text-sm text-ink-soft">Quando você fizer o primeiro, ele aparece aqui com o status.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.code} className="rounded-[24px] border hairline bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Pedido #{o.code}</p>
              <p className="mt-1 text-sm text-ink-soft">{o.date}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold">{brl(o.total)}</p>
              <p className="text-xs text-ink-soft">{o.payment === "pix" ? "Pix" : "Maquininha na entrega"}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 border-t hairline pt-4 text-sm">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-ink-soft">{i.qty}x {i.name}</span>
                <span className="shrink-0 font-mono text-xs">{brl(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <StatusTrack step={o.step} />
        </div>
      ))}
    </div>
  );
};

/* ── aba: dados da conta ── */

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">{label}</span>
    <input {...props} className="mt-1.5 h-12 w-full rounded-2xl border hairline bg-white px-4 text-sm outline-none focus:border-ink" />
  </label>
);

const maskCpf = (v) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const Dados = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, cpf: user.cpf, phone: user.phone });
  const [addr, setAddr] = useState(user.address);
  const [pass, setPass] = useState({ atual: "", nova: "", confirma: "" });
  const [busyCep, setBusyCep] = useState(false);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: k === "cpf" ? maskCpf(e.target.value) : e.target.value }));

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

  const salvar = (e) => {
    e.preventDefault();
    updateProfile({ ...form, address: addr });
    toast.success("Dados salvos");
  };

  const trocarSenha = (e) => {
    e.preventDefault();
    if (!pass.atual || !pass.nova || !pass.confirma) return toast.error("Preencha todos os campos");
    if (pass.nova !== pass.confirma) return toast.error("As senhas novas não coincidem");
    setPass({ atual: "", nova: "", confirma: "" });
    toast.success("Senha alterada");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={salvar} className="space-y-4 rounded-[24px] border hairline bg-white p-6">
        <p className="font-display text-lg font-bold">Seus dados</p>
        <Field label="Nome" value={form.name} onChange={setF("name")} />
        <Field label="E-mail" value={user.email} disabled className="mt-1.5 h-12 w-full rounded-2xl border hairline bg-paper px-4 text-sm text-ink-soft outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="CPF" value={form.cpf} onChange={setF("cpf")} placeholder="000.000.000-00" inputMode="numeric" />
          <Field label="Telefone" value={form.phone} onChange={setF("phone")} placeholder="(38) 90000-0000" inputMode="tel" />
        </div>

        <p className="pt-2 font-display text-lg font-bold">Endereço padrão</p>
        <div className="relative">
          <Field label="CEP" value={addr.cep} onChange={setA("cep")} placeholder="00000-000" inputMode="numeric" maxLength={9} />
          {busyCep && <span className="absolute right-4 top-9 text-xs text-ink-soft">Buscando...</span>}
        </div>
        <Field label="Rua" value={addr.street} onChange={setA("street")} placeholder="Nome da rua" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Número" value={addr.number} onChange={setA("number")} placeholder="Nº" />
          <Field label="Complemento" value={addr.complement} onChange={setA("complement")} placeholder="Apto, bloco..." />
        </div>
        <Field label="Bairro" value={addr.neighborhood} onChange={setA("neighborhood")} placeholder="Bairro" />
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Field label="Cidade" value={addr.city} onChange={setA("city")} placeholder="Cidade" /></div>
          <Field label="Estado" value={addr.state} onChange={setA("state")} placeholder="UF" maxLength={2} />
        </div>
        <button className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-berry">
          Salvar alterações
        </button>
      </form>

      <form onSubmit={trocarSenha} className="h-fit space-y-4 rounded-[24px] border hairline bg-white p-6">
        <p className="font-display text-lg font-bold">Trocar senha</p>
        <Field label="Senha atual" type="password" value={pass.atual} onChange={(e) => setPass((p) => ({ ...p, atual: e.target.value }))} />
        <Field label="Nova senha" type="password" value={pass.nova} onChange={(e) => setPass((p) => ({ ...p, nova: e.target.value }))} />
        <Field label="Confirmar nova senha" type="password" value={pass.confirma} onChange={(e) => setPass((p) => ({ ...p, confirma: e.target.value }))} />
        <button className="h-12 w-full rounded-full border border-ink text-sm font-semibold transition-colors hover:bg-ink hover:text-white">
          Alterar senha
        </button>
      </form>
    </div>
  );
};

/* ── aba: favoritos ── */

const Favoritos = () => {
  const { favorites } = useAuth();
  const list = PRODUCTS.filter((p) => favorites.includes(p.id));
  if (!list.length) {
    return (
      <div className="rounded-[24px] border hairline bg-white p-10 text-center">
        <Heart className="mx-auto h-10 w-10 text-ink-soft" />
        <p className="mt-4 font-display text-xl font-bold">Nenhum favorito ainda</p>
        <p className="mt-1 text-sm text-ink-soft">Toque no coração de um sabor no cardápio para salvar aqui.</p>
      </div>
    );
  }
  return <div className="grid gap-3 sm:grid-cols-2">{list.map((p) => <Row key={p.id} p={p} />)}</div>;
};

/* ── casca ── */

export const Account = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("cardapio");

  if (!user) return null;

  const sair = () => {
    logout();
    toast.success("Você saiu da conta");
    onBack();
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b hairline bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1100px] items-center justify-between px-5 sm:px-8">
          <button onClick={onBack} aria-label="Voltar para o site"><Logo /></button>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hidden h-10 items-center gap-2 rounded-full border hairline px-4 text-sm font-medium transition-colors hover:bg-paper sm:flex">
              <ArrowLeft className="h-4 w-4" /> Voltar ao site
            </button>
            <button onClick={sair} className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-berry">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">Minha conta</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Oi, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{user.email}</p>

        <nav className="mt-8 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${on ? "border-ink bg-ink text-white" : "hairline bg-white hover:bg-white/60"}`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            {tab === "cardapio" && <Catalogo />}
            {tab === "pedidos" && <Pedidos />}
            {tab === "dados" && <Dados />}
            {tab === "favoritos" && <Favoritos />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
