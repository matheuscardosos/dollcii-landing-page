import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useAuth } from "../context/AuthContext";

const P = process.env.PUBLIC_URL;

// Contas de mentira pro seletor do Google. Clicar em qualquer uma loga de verdade.
const GOOGLE_ACCOUNTS = [
  { name: "Nicolas Geliz", email: "nicolas@gmail.com", color: "#FC030F", role: "admin" },
  { name: "Allana Geliz", email: "allana.chef@gmail.com", color: "#FCC303", role: "admin" },
];

const Field = ({ label, type = "text", ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <div className="relative mt-1.5">
        <input
          {...props}
          type={isPassword && show ? "text" : type}
          className="h-11 w-full rounded-2xl border hairline bg-white px-4 pr-11 text-sm outline-none focus:border-ink"
        />
        {isPassword && (
          <button type="button" tabIndex={-1} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
};

const GoogleButton = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl border hairline bg-white text-sm font-medium transition-colors hover:bg-paper"
  >
    <img src={P + "/img/google.svg"} alt="" className="h-5 w-5" />
    {label}
  </button>
);

const Divider = () => (
  <div className="flex items-center gap-3">
    <span className="h-px flex-1 bg-ink/10" />
    <span className="text-xs text-ink-soft">ou</span>
    <span className="h-px flex-1 bg-ink/10" />
  </div>
);

const Initial = ({ name, color }) => (
  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: color }}>
    {name.charAt(0)}
  </span>
);

const GoogleView = ({ goTo, onDone }) => {
  const { loginWithGoogle } = useAuth();
  const pick = (acc) => {
    const u = loginWithGoogle(acc);
    toast.success("Você entrou como " + acc.name.split(" ")[0]);
    onDone(u);
  };
  return (
    <div className="space-y-4">
      <button onClick={() => goTo("login")} className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="flex items-center gap-3">
        <img src={P + "/img/google.svg"} alt="" className="h-6 w-6" />
        <div>
          <DialogTitle className="font-display text-lg font-bold tracking-[-0.03em]">Escolha uma conta</DialogTitle>
          <DialogDescription className="text-xs text-ink-soft">para continuar na Geliz</DialogDescription>
        </div>
      </div>
      <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border hairline">
        {GOOGLE_ACCOUNTS.map((acc) => (
          <button key={acc.email} onClick={() => pick(acc)} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-paper">
            <Initial name={acc.name} color={acc.color} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{acc.name}</span>
              <span className="block truncate text-xs text-ink-soft">{acc.email}</span>
            </span>
            {acc.role === "admin" && (
              <span className="shrink-0 rounded-full bg-berry-soft px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-berry">Loja</span>
            )}
          </button>
        ))}
      </div>
      <p className="text-center text-[11px] leading-relaxed text-ink-soft">
        Ambiente de homologação. Nenhuma conta real do Google é acessada.
      </p>
    </div>
  );
};

const LoginView = ({ goTo, onDone }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return toast.error("Preencha e-mail e senha");
    const u = login(email, password);
    toast.success("Bem-vindo, " + u.name.split(" ")[0] + "!");
    onDone(u);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em]">Entrar</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-soft">Acesse sua conta Geliz</DialogDescription>
      </div>
      <GoogleButton label="Entrar com Google" onClick={() => goTo("google")} />
      <Divider />
      <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
      <Field label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />
      <button type="button" onClick={() => goTo("forgot")} className="text-xs font-medium text-berry hover:underline">
        Esqueci minha senha
      </button>
      <button type="submit" className="h-12 w-full rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
        Entrar
      </button>
      <p className="text-center text-sm text-ink-soft">
        Não tem conta?{" "}
        <button type="button" onClick={() => goTo("register")} className="font-semibold text-ink hover:underline">
          Criar conta
        </button>
      </p>
    </form>
  );
};

const RegisterView = ({ goTo, onDone }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirm)
      return toast.error("Preencha todos os campos");
    if (form.password !== form.confirm) return toast.error("As senhas não coincidem");
    const u = login(form.email, form.password, form.name.trim());
    toast.success("Conta criada. Bem-vindo, " + u.name.split(" ")[0] + "!");
    onDone(u);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em]">Criar conta</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-soft">Cadastre-se para fazer pedidos</DialogDescription>
      </div>
      <GoogleButton label="Cadastrar com Google" onClick={() => goTo("google")} />
      <Divider />
      <Field label="Nome completo" value={form.name} onChange={set("name")} placeholder="Como podemos te chamar?" />
      <Field label="E-mail" type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com" />
      <Field label="Senha" type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 8 caracteres" />
      <Field label="Confirmar senha" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repita a senha" />
      <button type="submit" className="mt-1 h-12 w-full rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
        Criar conta
      </button>
      <p className="text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <button type="button" onClick={() => goTo("login")} className="font-semibold text-ink hover:underline">
          Entrar
        </button>
      </p>
    </form>
  );
};

const ForgotView = ({ goTo }) => {
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Informe seu e-mail");
    toast.success("Se o e-mail existir, o link de recuperação chega em instantes.");
    goTo("login");
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em]">Redefinir senha</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-soft">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </DialogDescription>
      </div>
      <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
      <button type="submit" className="h-12 w-full rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
        Enviar link de recuperação
      </button>
      <p className="text-center text-sm text-ink-soft">
        Lembrou a senha?{" "}
        <button type="button" onClick={() => goTo("login")} className="font-semibold text-ink hover:underline">
          Voltar para o login
        </button>
      </p>
    </form>
  );
};

export const AuthModal = ({ open, onOpenChange, onSuccess }) => {
  const [view, setView] = useState("login");

  const close = (o) => {
    onOpenChange(o);
    if (!o) setTimeout(() => setView("login"), 300);
  };

  const done = (user) => {
    close(false);
    onSuccess?.(user);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex max-h-[90svh] w-[calc(100%-2rem)] max-w-md flex-col gap-0 overflow-hidden rounded-[20px] border-none bg-white p-0 sm:rounded-[28px]">
        <div className="overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
          {view === "login" && <LoginView goTo={setView} onDone={done} />}
          {view === "register" && <RegisterView goTo={setView} onDone={done} />}
          {view === "forgot" && <ForgotView goTo={setView} />}
          {view === "google" && <GoogleView goTo={setView} onDone={done} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
