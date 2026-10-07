import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { brl } from "../data/menu";
import { useBag } from "../context/BagContext";
import { useStore } from "../context/StoreContext";
import { analisarQuiz, PERGUNTAS } from "../lib/quiz";

const P = process.env.PUBLIC_URL;

const ABERTURA = "E aí! Eu sou o Dollcii, seu guia de sabores. Bora descobrir o seu Geliz ideal?";

const Bolha = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex items-end gap-2.5"
  >
    <img src={P + "/img/mascote.webp"} alt="" className="h-8 w-8 shrink-0 object-contain" />
    <div className="rounded-2xl rounded-bl-md bg-paper px-4 py-3 text-sm leading-relaxed">{children}</div>
  </motion.div>
);

const Minha = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
    <span className="max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">{children}</span>
  </motion.div>
);

const Opcoes = ({ opcoes, onPick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    className="grid grid-cols-2 gap-2 pl-10"
  >
    {opcoes.map((o, i) => (
      <button
        key={o.label}
        onClick={() => onPick(i, o.label)}
        className="flex items-center gap-1.5 rounded-full border hairline px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-ink hover:text-white"
      >
        <span aria-hidden="true">{o.emoji}</span>
        <span className="min-w-0 truncate">{o.label}</span>
      </button>
    ))}
  </motion.div>
);

/* ── revelacao ── */

const Revelacao = ({ resultado, onScrollDown }) => {
  const [aberto, setAberto] = useState(false);
  const { add } = useBag();
  const { principal, segunda, frase } = resultado;
  const produto = principal.produto;

  const revelar = () => {
    setAberto(true);
    setTimeout(() => onScrollDown?.(), 400);
  };

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <Bolha>Seu Geliz ideal é...</Bolha>

      <motion.div
        className="relative mt-2 flex h-44 w-32 items-center justify-center overflow-hidden rounded-2xl"
        animate={{ background: aberto ? produto?.tint || "#FFECED" : "#111" }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {!aberto && (
            <motion.span key="?" exit={{ opacity: 0, scale: 1.5 }} className="select-none text-5xl font-bold text-white/30">
              ?
            </motion.span>
          )}
        </AnimatePresence>

        {aberto &&
          (produto?.img ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              src={produto.img}
              alt={principal.nome}
              className="h-36 w-auto object-contain drop-shadow-lg"
            />
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="select-none text-6xl"
              aria-hidden="true"
            >
              {principal.emoji}
            </motion.span>
          ))}
      </motion.div>

      {!aberto ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={revelar}
          className="mt-1 rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Revelar!
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full text-center">
          <p className="font-display text-lg font-bold">{principal.nome}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{principal.desc}</p>
          <p className="mt-2 text-sm font-semibold text-berry">{frase}</p>

          {produto ? (
            <>
              <p className="mt-1 font-semibold">{brl(produto.price)}</p>
              <button
                onClick={() => add(produto)}
                className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-berry"
              >
                Adicionar na sacola
              </button>
            </>
          ) : (
            <p className="mt-3 text-xs text-ink-soft">Esse sabor sai direto com a gente, chama no WhatsApp.</p>
          )}

          <div className="mt-4 rounded-2xl bg-paper p-3 text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Você também vai gostar</p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  <span aria-hidden="true">{segunda.emoji}</span> {segunda.nome}
                </span>
              </span>
              {segunda.produto && (
                <button
                  onClick={() => add(segunda.produto)}
                  className="shrink-0 rounded-full border hairline px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  Somar
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ── chat ── */

export const MascotQuiz = () => {
  const [open, setOpen] = useState(false);
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [rotulos, setRotulos] = useState([]);
  const [texto, setTexto] = useState("");
  const bodyRef = useRef(null);
  const { catalog } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("quiz")) setOpen(true);
  }, []);

  const rolar = () => {
    setTimeout(() => {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }, 350);
  };

  useEffect(() => {
    if (bodyRef.current) rolar();
  }, [passo]);

  const reset = () => {
    setPasso(0);
    setRespostas([]);
    setRotulos([]);
    setTexto("");
  };

  const responder = (valor, rotulo) => {
    setRespostas((r) => [...r, valor]);
    setRotulos((r) => [...r, rotulo]);
    setPasso((p) => p + 1);
  };

  const enviarTexto = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (t.length < 2) return;
    setTexto("");
    responder(t, t);
  };

  const resultado = respostas.length === 3 ? analisarQuiz(respostas, catalog) : null;
  const perguntaAtual = PERGUNTAS[passo];
  const esperandoTexto = perguntaAtual?.tipo === "texto";

  return (
    <>
      <motion.button
        onClick={() => {
          setOpen(true);
          if (passo === 0 && respostas.length === 0) reset();
        }}
        className="fixed bottom-5 right-5 z-50 h-16 w-16 overflow-hidden rounded-full border hairline bg-white shadow-xl transition-transform hover:scale-110 sm:bottom-6 sm:right-6 sm:h-20 sm:w-20"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
        aria-label="Abrir quiz de sabores"
      >
        <img src={P + "/img/mascote.webp"} alt="Mascote Geliz" className="h-full w-full object-contain p-1" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[5.5rem] right-5 z-50 flex max-h-[calc(100dvh-7rem)] w-[min(360px,calc(100vw-2.5rem))] flex-col rounded-[24px] border hairline bg-white shadow-2xl sm:bottom-[6.5rem] sm:right-6 sm:max-h-[calc(100dvh-8rem)]"
          >
            <div className="flex items-center justify-between border-b hairline px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={P + "/img/mascote.webp"} alt="" className="h-9 w-9 object-contain" />
                <div>
                  <p className="font-display text-sm font-bold">Geliz</p>
                  <p className="text-[11px] text-ink-soft">
                    {resultado ? "Achei o seu!" : `Pergunta ${Math.min(passo + 1, 3)} de 3`}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-paper" aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={bodyRef}
              className="flex flex-col gap-4 p-4"
              data-lenis-prevent
              style={{ overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "none" }}
            >
              <Bolha>{ABERTURA}</Bolha>

              {PERGUNTAS.map((q, i) => {
                if (passo < i) return null;
                return (
                  <div key={q.id} className="flex flex-col gap-4">
                    <Bolha delay={i === 0 ? 0.15 : 0}>{q.titulo}</Bolha>
                    {passo === i && q.tipo === "escolha" && <Opcoes opcoes={q.opcoes} onPick={responder} />}
                    {rotulos[i] && <Minha>{rotulos[i]}</Minha>}
                  </div>
                );
              })}

              {resultado && (
                <>
                  <Revelacao resultado={resultado} onScrollDown={rolar} />
                  <button
                    onClick={reset}
                    className="mx-auto mt-2 text-xs font-medium text-ink-soft underline transition-colors hover:text-ink"
                  >
                    Fazer de novo
                  </button>
                </>
              )}
            </div>

            {esperandoTexto && (
              <form onSubmit={enviarTexto} className="flex items-center gap-2 border-t hairline p-3">
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder={perguntaAtual.placeholder}
                  maxLength={100}
                  autoFocus
                  className="h-10 flex-1 rounded-full border hairline px-4 text-sm outline-none focus:border-ink"
                />
                <button
                  type="submit"
                  disabled={texto.trim().length < 2}
                  aria-label="Enviar resposta"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-berry text-white transition-colors hover:bg-berry-dark disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
