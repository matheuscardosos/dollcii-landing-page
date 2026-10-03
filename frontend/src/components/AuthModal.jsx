import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

const P = process.env.PUBLIC_URL;

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
          className="h-12 w-full rounded-2xl border hairline bg-white px-4 text-sm outline-none focus:border-ink pr-11"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink" tabIndex={-1}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
};

const GoogleButton = ({ label }) => (
  <button
    type="button"
    onClick={() => toast("Funcionalidade disponível em breve!")}
    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border hairline bg-white text-sm font-medium transition-colors hover:bg-paper"
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

const LoginView = ({ goTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return toast.error("Preencha todos os campos");
    toast("Funcionalidade disponível em breve!");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em]">Entrar</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-soft">Acesse sua conta Dollcii</DialogDescription>
      </div>
      <GoogleButton label="Entrar com Google" />
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

const RegisterView = ({ goTo }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirm) return toast.error("Preencha todos os campos");
    if (password !== confirm) return toast.error("As senhas não coincidem");
    toast("Funcionalidade disponível em breve!");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em]">Criar conta</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-ink-soft">Cadastre-se para fazer pedidos</DialogDescription>
      </div>
      <GoogleButton label="Cadastrar com Google" />
      <Divider />
      <Field label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" />
      <Field label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
      <Field label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
      <Field label="Confirmar senha" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha" />
      <button type="submit" className="h-12 w-full rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark">
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
    toast("Funcionalidade disponível em breve!");
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

export const AuthModal = ({ open, onOpenChange }) => {
  const [view, setView] = useState("login");

  const handleChange = (o) => {
    onOpenChange(o);
    if (!o) setTimeout(() => setView("login"), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent className="max-h-[94svh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[20px] sm:rounded-[28px] border-none bg-white p-6 sm:p-8">
        {view === "login" && <LoginView goTo={setView} />}
        {view === "register" && <RegisterView goTo={setView} />}
        {view === "forgot" && <ForgotView goTo={setView} />}
      </DialogContent>
    </Dialog>
  );
};
