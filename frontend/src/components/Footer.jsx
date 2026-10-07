import { useState } from "react";
import { Instagram } from "lucide-react";
import { WhatsAppIcon, WHATSAPP_LABEL, WHATSAPP_URL } from "./WhatsAppIcon";
import { scrollToId } from "./SmoothScroll";
import { LegalModal } from "./LegalModal";

const P = process.env.PUBLIC_URL;

const COLS = [
  ["Navegar", [["Sabores", "sabores"], ["Cardápio", "cardapio"], ["Nossa história", "historia"]]],
  ["Atendimento", [["Seg a sex, 12h às 18h"], ["Sábado, 8h às 16h"], ["Domingo, 9h às 12h"]]],
];

export const Footer = () => {
  const [legal, setLegal] = useState(null);
  return (
  <footer data-testid="site-footer" className="overflow-hidden bg-ink text-white">
    <div className="mx-auto max-w-[1440px] px-5 pt-20 sm:px-8 lg:px-14 lg:pt-28">
      <div className="grid gap-12 sm:grid-cols-2">
        {COLS.map(([title, links]) => (
          <div key={title}>
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
        <span>
          © 2026 Geliz · site por{" "}
          <a href="https://www.instagram.com/math.scs" target="_blank" rel="noreferrer" className="text-white/80 transition-colors hover:text-berry">
            math.scs
          </a>
        </span>
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
