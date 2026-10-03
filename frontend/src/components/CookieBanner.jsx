import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

const P = process.env.PUBLIC_URL;
const STORAGE_KEY = "dollcii-cookies";

const defaults = { essential: true, analytics: true, marketing: false };

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState(defaults);

  useEffect(() => {
    if (!loadPrefs()) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setVisible(false);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, essential: true }));
    setManage(false);
    setVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-40 border-t hairline bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] sm:p-5"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3 flex-1">
                <img src={P + "/img/cookie.svg"} alt="" className="h-8 w-8 shrink-0 mt-0.5" />
                <p className="text-sm text-ink-soft leading-relaxed">
                  Usamos cookies para melhorar sua experiência no site. Ao continuar navegando, você concorda com nossa Política de Privacidade.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setManage(true)} className="h-10 rounded-full border hairline px-4 text-sm font-medium transition-colors hover:bg-paper">
                  Gerenciar cookies
                </button>
                <button onClick={accept} className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-berry">
                  Aceitar todos
                </button>
                <button onClick={() => setVisible(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper sm:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={manage} onOpenChange={setManage}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-[20px] sm:rounded-[28px] border-none bg-white p-6 sm:p-8">
          <div>
            <DialogTitle className="font-display text-xl font-bold tracking-[-0.03em]">Gerenciar cookies</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-ink-soft">Escolha quais cookies deseja permitir.</DialogDescription>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border hairline p-4">
              <div>
                <p className="text-sm font-semibold">Cookies essenciais</p>
                <p className="text-xs text-ink-soft">Necessários para o funcionamento do site</p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between rounded-xl border hairline p-4">
              <div>
                <p className="text-sm font-semibold">Cookies de analytics</p>
                <p className="text-xs text-ink-soft">Nos ajudam a entender como você usa o site</p>
              </div>
              <Switch checked={prefs.analytics} onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))} />
            </div>
            <div className="flex items-center justify-between rounded-xl border hairline p-4">
              <div>
                <p className="text-sm font-semibold">Cookies de marketing</p>
                <p className="text-xs text-ink-soft">Permitem anúncios personalizados</p>
              </div>
              <Switch checked={prefs.marketing} onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))} />
            </div>
          </div>

          <button onClick={save} className="mt-4 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-berry">
            Salvar preferências
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};
