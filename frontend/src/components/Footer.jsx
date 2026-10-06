import { useState } from "react";
import axios from "axios";
import { ArrowRight, Instagram } from "lucide-react";
import { WhatsAppIcon, WHATSAPP_LABEL, WHATSAPP_URL } from "./WhatsAppIcon";
import { toast } from "sonner";
import { scrollToId } from "./SmoothScroll";
import { LegalModal } from "./LegalModal";

const P = process.env.PUBLIC_URL;
const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null;

const Club = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Digite um e-mail válido");
    if (!API) return toast.error("Cadastro indisponível no momento");
    setBusy(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Bem-vindo ao Clube Geliz! Seu cupom GELIZ10 já está valendo.");
      setEmail("");
    } catch {
      toast.error("Não conseguimos cadastrar agora. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 p-1.5 pl-5" data-testid="newsletter-form">
      <input data-testid="newsletter-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50" />
      <button data-testid="newsletter-submit-button" disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-berry hover:text-white" aria-label="Cadastrar">
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};

const COLS = [
  ["Navegar", [["Sabores", "sabores"], ["Cardápio", "cardapio"], ["Nossa história", "historia"], ["Processo", "processo"]]],
  ["Atendimento", [["Seg a sex, 12h às 18h"], ["Sábado, 8h às 16h"], ["Domingo, 9h às 12h"]]],
];

export const Footer = () => {
  const [legal, setLegal] = useState(null);
  return (
  <footer data-testid="site-footer" className="overflow-hidden bg-ink text-white">
    <div className="mx-auto max-w-[1440px] px-5 pt-20 sm:px-8 lg:px-14 lg:pt-28">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">Clube Geliz</p>
          <p className="mt-5 max-w-lg font-display text-2xl sm:text-4xl font-bold leading-[1.05] tracking-[-0.03em] lg:text-5xl">Sabores novos antes de todo mundo e 10% na primeira compra.</p>
          <div className="mt-8"><Club /></div>
        </div>
        {COLS.map(([title, links]) => (
          <div key={title} className="lg:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">{title}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/85">
              {links.map(([label, id]) => (
                <li key={label}>
                  {id ? <button data-testid={`footer-link-${id}`} onClick={() => scrollToId(id)} className="transition-colors hover:text-berry">{label}</button> : label}
                </li>
              ))}
              {title === "Atendimento" && (
                <>
                  <li className="pt-2"><a data-testid="footer-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-berry"><WhatsAppIcon className="h-4 w-4" /> {WHATSAPP_LABEL}</a></li>
                  <li><a data-testid="footer-instagram-link" href="https://www.instagram.com/gelizgeladinhos/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-berry"><Instagram className="h-4 w-4" /> @gelizgeladinhos</a></li>
                </>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 border-t border-white/10 pt-10 sm:mt-20 sm:pt-14">
        <img src={P + "/img/logo.webp"} alt="Geliz" className="mx-auto w-full max-w-[560px]" />
      </div>
      <div className="flex flex-col justify-between gap-4 py-8 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 sm:flex-row sm:items-center">
        <span>© 2026 Geliz</span>
        <div className="flex gap-4">
          <button onClick={() => setLegal("termos")} className="transition-colors hover:text-white">Termos de Uso</button>
          <button onClick={() => setLegal("privacidade")} className="transition-colors hover:text-white">Privacidade</button>
        </div>
        <span>Feito à mão em Montes Claros, MG</span>
      </div>
    </div>
    <LegalModal type={legal} open={!!legal} onOpenChange={(o) => { if (!o) setLegal(null); }} />
  </footer>
  );
};
