import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PRODUCTS, brl } from "../data/menu";
import { useBag } from "../context/BagContext";

const P = process.env.PUBLIC_URL;

const QUESTIONS = [
  {
    msg: "E aí! Eu sou o Dollcii, seu guia de sabores. Bora descobrir o gelado perfeito pra você?",
    question: "Qual tipo de doce você mais curte?",
    options: [
      { label: "Frutas frescas", value: "fruta" },
      { label: "Chocolate intenso", value: "chocolate" },
      { label: "Doces cremosos", value: "cremoso" },
    ],
  },
  {
    question: "Como você prefere a intensidade do sabor?",
    options: [
      { label: "Leve e refrescante", value: "leve" },
      { label: "Equilibrado", value: "equilibrado" },
      { label: "Forte e marcante", value: "forte" },
    ],
  },
  {
    question: "Pra qual ocasião?",
    options: [
      { label: "Pra mim, agora", value: "individual" },
      { label: "Dividir com alguém", value: "dividir" },
      { label: "Presentear", value: "presente" },
    ],
  },
];

function pickProduct(answers) {
  const [taste, intensity, occasion] = answers;

  if (occasion === "presente") return PRODUCTS.find((p) => p.id === "esp-caixa");

  if (taste === "chocolate") {
    if (intensity === "forte") return PRODUCTS.find((p) => p.id === "pic-cacau");
    return PRODUCTS.find((p) => p.id === "gel-doce-leite");
  }

  if (taste === "fruta") {
    if (intensity === "leve") return PRODUCTS.find((p) => p.id === "pic-maracuja");
    if (occasion === "dividir") return PRODUCTS.find((p) => p.id === "pote-morango");
    return PRODUCTS.find((p) => p.id === "pic-morango");
  }

  // cremoso
  if (intensity === "forte") return PRODUCTS.find((p) => p.id === "pic-pistache");
  if (occasion === "dividir") return PRODUCTS.find((p) => p.id === "pote-baunilha");
  return PRODUCTS.find((p) => p.id === "gel-doce-leite");
}

const Bubble = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex gap-2.5 items-end"
  >
    <img src={P + "/img/mascote.webp"} alt="" className="h-8 w-8 shrink-0 object-contain" />
    <div className="rounded-2xl rounded-bl-md bg-paper px-4 py-3 text-sm leading-relaxed">
      {children}
    </div>
  </motion.div>
);

const Options = ({ options, onPick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    className="flex flex-col gap-2 pl-10"
  >
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onPick(o.value)}
        className="rounded-full border hairline px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-ink hover:text-white"
      >
        {o.label}
      </button>
    ))}
  </motion.div>
);

const Reveal = ({ product }) => {
  const [revealed, setRevealed] = useState(false);
  const { add } = useBag();

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <Bubble>Seu sabor ideal é...</Bubble>
      <motion.div
        className="relative mt-2 flex h-44 w-32 items-center justify-center rounded-2xl"
        style={{ background: revealed ? product.tint : "#111" }}
        animate={{ background: revealed ? product.tint : "#111" }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {!revealed && (
            <motion.span
              key="question"
              exit={{ opacity: 0, scale: 1.5 }}
              className="text-5xl font-bold text-white/30 select-none"
            >
              ?
            </motion.span>
          )}
        </AnimatePresence>
        {revealed && (
          <motion.img
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            src={product.img}
            alt={product.name}
            className="h-36 w-auto object-contain drop-shadow-lg"
          />
        )}
      </motion.div>
      {!revealed ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setRevealed(true)}
          className="mt-1 rounded-full bg-berry px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Revelar!
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="font-display text-lg font-bold">{product.name}</p>
          <p className="text-xs text-ink-soft">{product.desc}</p>
          <p className="mt-1 font-semibold">{brl(product.price)}</p>
          <button
            onClick={() => add(product)}
            className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-berry"
          >
            Adicionar na sacola
          </button>
        </motion.div>
      )}
    </div>
  );
};

export const MascotQuiz = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const bodyRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("quiz")) setOpen(true);
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    setTimeout(() => {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }, 350);
  }, [step]);

  const openQuiz = () => {
    setOpen(true);
    if (step === 0 && answers.length === 0) reset();
  };

  const closeQuiz = () => setOpen(false);

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const answer = (val) => {
    const next = [...answers, val];
    setAnswers(next);
    setStep(step + 1);
  };

  const product = answers.length === 3 ? pickProduct(answers) : null;

  return (
    <>
      {/* Botao flutuante */}
      <motion.button
        onClick={openQuiz}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white shadow-xl border hairline overflow-hidden transition-transform hover:scale-110"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
        aria-label="Abrir quiz de sabores"
      >
        <img src={P + "/img/mascote.webp"} alt="Mascote Dollcii" className="h-full w-full object-contain p-1" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[5.5rem] right-5 sm:bottom-[6.5rem] sm:right-6 z-50 flex w-[min(340px,calc(100vw-2.5rem))] max-h-[calc(100dvh-7rem)] sm:max-h-[calc(100dvh-8rem)] flex-col rounded-[24px] border hairline bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b hairline px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={P + "/img/mascote.webp"} alt="" className="h-9 w-9 object-contain" />
                <div>
                  <p className="font-display text-sm font-bold">Dollcii</p>
                  <p className="text-[11px] text-ink-soft">Descubra seu sabor</p>
                </div>
              </div>
              <button onClick={closeQuiz} className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-paper" aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="flex flex-col gap-4 p-4" data-lenis-prevent style={{ maxHeight: "60vh", overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "none" }}>
              {/* Pergunta 1 sempre visivel */}
              {step >= 0 && (
                <>
                  <Bubble>{QUESTIONS[0].msg}</Bubble>
                  <Bubble delay={0.15}>{QUESTIONS[0].question}</Bubble>
                  {step === 0 && <Options options={QUESTIONS[0].options} onPick={answer} />}
                </>
              )}

              {/* Resposta 1 + Pergunta 2 */}
              {step >= 1 && (
                <>
                  <div className="flex justify-end">
                    <span className="rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">
                      {QUESTIONS[0].options.find((o) => o.value === answers[0])?.label}
                    </span>
                  </div>
                  <Bubble>{QUESTIONS[1].question}</Bubble>
                  {step === 1 && <Options options={QUESTIONS[1].options} onPick={answer} />}
                </>
              )}

              {/* Resposta 2 + Pergunta 3 */}
              {step >= 2 && (
                <>
                  <div className="flex justify-end">
                    <span className="rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">
                      {QUESTIONS[1].options.find((o) => o.value === answers[1])?.label}
                    </span>
                  </div>
                  <Bubble>{QUESTIONS[2].question}</Bubble>
                  {step === 2 && <Options options={QUESTIONS[2].options} onPick={answer} />}
                </>
              )}

              {/* Resposta 3 + Revelacao */}
              {step >= 3 && product && (
                <>
                  <div className="flex justify-end">
                    <span className="rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">
                      {QUESTIONS[2].options.find((o) => o.value === answers[2])?.label}
                    </span>
                  </div>
                  <Reveal product={product} />
                  <button
                    onClick={reset}
                    className="mx-auto mt-2 text-xs font-medium text-ink-soft underline transition-colors hover:text-ink"
                  >
                    Tentar de novo
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
