import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Lock, Minus, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useBag } from "../context/BagContext";
import { brl, calcTotals, FREE_DELIVERY_FROM } from "../data/menu";

const P = process.env.PUBLIC_URL;

/* ── helpers ── */

const randomPixCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 60; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

/* ── reusable pieces ── */

const Label = ({ children }) => (
  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">{children}</span>
);

const Input = ({ label, ...props }) => (
  <label className="block">
    <Label>{label}</Label>
    <input {...props} className="mt-1.5 h-12 w-full rounded-2xl border hairline bg-white px-4 text-sm outline-none focus:border-ink" />
  </label>
);

/* ── QR code fake via canvas ── */

const FakeQR = ({ size = 200 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const modules = 25;
    const cellSize = size / modules;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#111111";
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
    // corner squares
    const drawFinder = (x, y) => {
      const s = cellSize;
      ctx.fillStyle = "#111111";
      ctx.fillRect(x * s, y * s, 7 * s, 7 * s);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect((x + 1) * s, (y + 1) * s, 5 * s, 5 * s);
      ctx.fillStyle = "#111111";
      ctx.fillRect((x + 2) * s, (y + 2) * s, 3 * s, 3 * s);
    };
    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);
  }, [size]);
  return <canvas ref={ref} width={size} height={size} className="rounded-lg" />;
};

/* ── cart item ── */

const CartItem = ({ item }) => {
  const { setQty, remove } = useBag();
  return (
    <div className="flex gap-3 border-b hairline py-4">
      <div className="grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper p-1.5">
        <img src={item.img} alt={item.name} className="h-full w-auto object-contain" />
      </div>
      <div className="flex flex-1 min-w-0 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <p className="text-sm font-semibold truncate">{item.name}</p>
          <button onClick={() => remove(item.id)} className="shrink-0 text-ink-soft hover:text-berry"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
        <p className="font-mono text-[11px] text-ink-soft">{brl(item.price)} cada</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-full border hairline">
            <button onClick={() => setQty(item.id, item.qty - 1)} className="grid h-7 w-7 place-items-center"><Minus className="h-3 w-3" /></button>
            <span className="w-5 text-center font-mono text-xs">{item.qty}</span>
            <button onClick={() => setQty(item.id, item.qty + 1)} className="grid h-7 w-7 place-items-center"><Plus className="h-3 w-3" /></button>
          </div>
          <span className="font-mono text-xs font-medium">{brl(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  );
};

/* ── coupon ── */

const Coupon = () => {
  const { coupon, setCoupon } = useBag();
  const [val, setVal] = useState(coupon);
  const { rate } = calcTotals([], coupon);
  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Cupom de desconto" className="h-10 flex-1 rounded-full border hairline bg-white px-4 text-sm uppercase outline-none placeholder:normal-case placeholder:text-ink-soft focus:border-ink" />
        <button onClick={() => setCoupon(val.trim().toUpperCase())} className="h-10 rounded-full border border-ink px-4 text-sm font-semibold transition-colors hover:bg-ink hover:text-white">Aplicar</button>
      </div>
      {coupon && (
        <p className={`mt-2 text-xs ${rate ? "text-[#6F9A4F]" : "text-berry"}`}>
          {rate ? `Cupom ${coupon} aplicado: ${rate * 100}% de desconto` : "Cupom inválido. Experimente DOLLCII10"}
        </p>
      )}
    </div>
  );
};

/* ── address section ── */

const AddressSection = ({ address, setAddress, mode, setMode }) => {
  const [loadingCep, setLoadingCep] = useState(false);

  const fetchCep = useCallback(async (cep) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${clean}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAddress((a) => ({
        ...a,
        street: data.street || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
      }));
    } catch {
      toast.error("CEP não encontrado");
    } finally {
      setLoadingCep(false);
    }
  }, [setAddress]);

  const set = (key) => (e) => {
    const v = e.target.value;
    setAddress((a) => ({ ...a, [key]: v }));
    if (key === "cep" && v.replace(/\D/g, "").length === 8) fetchCep(v);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Como prefere receber</Label>
        <div className="mt-2 flex gap-2">
          {[["entrega", "Entrega"], ["retirada", "Retirar na loja"]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setMode(id)} className={`h-10 rounded-full border px-5 text-sm font-medium transition-colors ${mode === id ? "border-ink bg-ink text-white" : "hairline bg-white"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === "entrega" && (
        <div className="space-y-3">
          <div className="relative">
            <Input label="CEP" value={address.cep} onChange={set("cep")} placeholder="00000-000" inputMode="numeric" maxLength={9} />
            {loadingCep && <span className="absolute right-4 top-9 text-xs text-ink-soft">Buscando...</span>}
          </div>
          <Input label="Rua" value={address.street} onChange={set("street")} placeholder="Nome da rua" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Número" value={address.number} onChange={set("number")} placeholder="Nº" />
            <Input label="Complemento" value={address.complement} onChange={set("complement")} placeholder="Apto, bloco..." />
          </div>
          <Input label="Bairro" value={address.neighborhood} onChange={set("neighborhood")} placeholder="Bairro" />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input label="Cidade" value={address.city} onChange={set("city")} placeholder="Cidade" />
            </div>
            <Input label="Estado" value={address.state} onChange={set("state")} placeholder="UF" maxLength={2} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ── payment section ── */

const ALL_BRANDS = [
  { id: "visa", name: "Visa" },
  { id: "mastercard", name: "Mastercard" },
  { id: "elo", name: "Elo" },
  { id: "amex", name: "American Express" },
  { id: "hipercard", name: "Hipercard" },
  { id: "diners", name: "Diners Club" },
  { id: "discover", name: "Discover" },
  { id: "jcb", name: "JCB" },
  { id: "maestro", name: "Maestro" },
];

function detectBrand(number) {
  const n = number.replace(/\D/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(636368|438935|504175|451416|509\d{3}|650\d{3}|651\d{3}|652[1-9]|6550)/.test(n)) return "elo";
  if (/^(606282|3841)/.test(n)) return "hipercard";
  if (/^3(?:0[0-5]|[68])/.test(n)) return "diners";
  if (/^6(?:011|5)/.test(n)) return "discover";
  if (/^35(?:2[89]|[3-8])/.test(n)) return "jcb";
  if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(n)) return "maestro";
  return null;
}

const BrandsPopup = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50"
        />
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          className="absolute right-0 top-full z-50 mt-2 rounded-2xl border hairline bg-white p-4 shadow-xl"
        >
          <p className="mb-3 text-xs font-semibold text-ink">Bandeiras aceitas</p>
          <div className="grid grid-cols-3 gap-3">
            {ALL_BRANDS.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-1.5 rounded-xl bg-paper p-2.5">
                <img src={P + `/img/${b.id}.svg`} alt={b.name} className="h-6" />
                <span className="text-[10px] text-ink-soft">{b.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const PaymentSection = ({ method, setMethod, card, setCard }) => {
  const [brandsOpen, setBrandsOpen] = useState(false);
  const setField = (key) => (e) => setCard((c) => ({ ...c, [key]: e.target.value }));
  const detected = detectBrand(card.number);

  return (
    <div className="space-y-4">
      <Label>Forma de pagamento</Label>
      <p className="text-sm text-ink-soft -mt-2">Escolha o método que prefere para finalizar sua compra.</p>

      {/* Cartão option */}
      <button
        type="button"
        onClick={() => setMethod("cartao")}
        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${method === "cartao" ? "border-berry bg-berry-soft" : "hairline"}`}
      >
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${method === "cartao" ? "border-berry" : "border-ink/20"}`}>
          {method === "cartao" && <span className="h-2.5 w-2.5 rounded-full bg-berry" />}
        </span>
        <img src={P + "/img/visa.svg"} alt="" className="h-5" />
        <span className="text-sm font-semibold">Cartão de crédito e débito</span>
      </button>

      <AnimatePresence>
        {method === "cartao" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-2xl border hairline p-4">
              <p className="text-sm font-semibold">Dados do cartão</p>
              <div className="relative">
                <Input label="Número do cartão" value={card.number} onChange={setField("number")} placeholder="0000 0000 0000 0000" inputMode="numeric" maxLength={19} />
                <div className="absolute right-3 top-8 flex items-center gap-1.5">
                  {detected ? (
                    <motion.img
                      key={detected}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={P + `/img/${detected}.svg`}
                      alt={detected}
                      className="h-6"
                    />
                  ) : (
                    <span className="text-[10px] text-ink-soft/50">Nenhuma</span>
                  )}
                </div>
              </div>
              <div className="relative inline-block">
                <button type="button" onClick={() => setBrandsOpen(!brandsOpen)} className="text-xs font-medium text-berry hover:underline">
                  Bandeiras aceitas
                </button>
                <BrandsPopup open={brandsOpen} onClose={() => setBrandsOpen(false)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Validade" value={card.expiry} onChange={setField("expiry")} placeholder="MM/AA" maxLength={5} />
                <Input label="CVV" value={card.cvv} onChange={setField("cvv")} placeholder="000" inputMode="numeric" maxLength={4} />
              </div>
              <Input label="Nome do titular" value={card.name} onChange={setField("name")} placeholder="Como está no cartão" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pix option */}
      <button
        type="button"
        onClick={() => setMethod("pix")}
        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${method === "pix" ? "border-berry bg-berry-soft" : "hairline"}`}
      >
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${method === "pix" ? "border-berry" : "border-ink/20"}`}>
          {method === "pix" && <span className="h-2.5 w-2.5 rounded-full bg-berry" />}
        </span>
        <img src={P + "/img/pix.svg"} alt="" className="h-5" />
        <span className="text-sm font-semibold">Pagar com Pix</span>
      </button>

      {method === "pix" && (
        <div className="flex items-center gap-3 rounded-2xl border hairline p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-paper">
            <img src={P + "/img/pix.svg"} alt="" className="h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">Pagamento rápido e seguro</p>
            <p className="text-xs text-ink-soft">Após a confirmação, você será redirecionado para pagar via Pix.</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── pix waiting screen ── */

const PixWaiting = ({ total, onConfirm }) => {
  const [seconds, setSeconds] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const pixCode = useRef(randomPixCode()).current;
  const timerMinutes = 15;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds >= 15 && !confirmed) {
      setConfirmed(true);
      setTimeout(() => onConfirm(), 2000);
    }
  }, [seconds, confirmed, onConfirm]);

  const remaining = timerMinutes * 60 - seconds;
  const min = Math.max(0, Math.floor(remaining / 60));
  const sec = Math.max(0, remaining % 60);

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-[#6F9A4F] text-white"
        >
          <Check className="h-9 w-9" />
        </motion.div>
        <p className="font-display text-2xl font-bold">Pagamento confirmado!</p>
        <p className="text-sm text-ink-soft">Preparando seu pedido...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <p className="font-display text-xl font-bold">Pague com Pix</p>
      <p className="text-sm text-ink-soft">Escaneie o QR Code ou copie o código abaixo</p>
      <FakeQR size={200} />
      <div className="w-full max-w-sm">
        <p className="mb-1.5 text-xs font-medium text-ink-soft">Pix copia e cola</p>
        <div className="flex items-center gap-2 rounded-xl border hairline bg-paper p-3">
          <p className="flex-1 truncate font-mono text-xs">{pixCode}</p>
          <button
            onClick={() => { navigator.clipboard.writeText(pixCode); toast("Código copiado!"); }}
            className="shrink-0 rounded-lg bg-ink p-2 text-white transition-colors hover:bg-berry"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <p className="font-mono text-2xl font-bold">{String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}</p>
        <p className="text-xs text-ink-soft">Tempo restante para pagamento</p>
      </div>
      <p className="font-display text-lg font-bold">{brl(total)}</p>
    </div>
  );
};

/* ── success screen ── */

const Success = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="grid h-20 w-20 place-items-center rounded-full bg-berry text-white"
    >
      <Check className="h-9 w-9" />
    </motion.div>
    <p className="font-display text-3xl font-bold">Pedido confirmado!</p>
    <p className="max-w-xs text-sm text-ink-soft">Seu pedido foi recebido e está sendo preparado. Acompanhe pelo app ou aguarde a entrega.</p>
    <button onClick={onClose} className="mt-4 h-12 rounded-full bg-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-berry">
      Voltar para a loja
    </button>
  </div>
);

/* ── main page ── */

export const CheckoutPage = () => {
  const { items, coupon, checkout, setCheckout, clear, setCoupon, count } = useBag();
  const [mode, setMode] = useState("entrega");
  const [method, setMethod] = useState("cartao");
  const [address, setAddress] = useState({ cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [stage, setStage] = useState("form"); // form | pix | success

  const t = calcTotals(items, coupon, mode);

  const left = Math.max(0, FREE_DELIVERY_FROM - (t.subtotal - t.discount));
  const pct = Math.min(100, ((t.subtotal - t.discount) / FREE_DELIVERY_FROM) * 100);

  const close = () => {
    setCheckout(false);
    setTimeout(() => setStage("form"), 300);
  };

  const validate = () => {
    if (mode === "entrega") {
      if (!address.cep.replace(/\D/g, "")) return toast.error("Informe o CEP");
      if (!address.street.trim()) return toast.error("Informe a rua");
      if (!address.number.trim()) return toast.error("Informe o número");
      if (!address.neighborhood.trim()) return toast.error("Informe o bairro");
      if (!address.city.trim()) return toast.error("Informe a cidade");
    }
    if (method === "cartao") {
      if (card.number.replace(/\D/g, "").length < 13) return toast.error("Número do cartão inválido");
      if (!card.expiry.trim()) return toast.error("Informe a validade");
      if (!card.cvv.trim()) return toast.error("Informe o CVV");
      if (!card.name.trim()) return toast.error("Informe o nome do titular");
    }
    return true;
  };

  const handleFinalize = () => {
    if (validate() !== true) return;
    if (method === "pix") {
      setStage("pix");
    } else {
      clear();
      setCoupon("");
      setStage("success");
    }
  };

  const handlePixConfirm = useCallback(() => {
    clear();
    setCoupon("");
    setStage("success");
  }, [clear, setCoupon]);

  if (!checkout) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-white"
      data-lenis-prevent
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b hairline bg-white/90 px-5 py-4 backdrop-blur-lg sm:px-8">
        <button onClick={close} className="flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <p className="font-display text-sm font-bold">Checkout</p>
        <button onClick={close} className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-paper">
          <X className="h-4 w-4" />
        </button>
      </div>

      {stage === "success" ? (
        <Success onClose={close} />
      ) : stage === "pix" ? (
        <div className="mx-auto max-w-lg px-5 sm:px-8">
          <PixWaiting total={t.total} onConfirm={handlePixConfirm} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="font-display text-2xl font-bold">Sacola vazia</p>
          <p className="text-sm text-ink-soft">Adicione algum sabor para finalizar o pedido.</p>
          <button onClick={close} className="h-12 rounded-full bg-ink px-6 text-sm font-semibold text-white">Voltar para a loja</button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:gap-12">
          {/* Left column: cart */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold">Sua sacola</h2>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{count} {count === 1 ? "item" : "itens"}</p>

            <div className="mt-4">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            {/* Free delivery progress */}
            <div className="mt-4">
              <p className="text-xs text-ink-soft">{left > 0 ? `Faltam ${brl(left)} para entrega grátis` : "Você ganhou entrega grátis"}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <motion.div className="h-full rounded-full bg-berry" animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
              </div>
            </div>

            <Coupon />

            {/* Summary */}
            <div className="mt-6 space-y-2 rounded-2xl bg-paper p-5 text-sm">
              <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span className="font-mono">{brl(t.subtotal)}</span></div>
              {t.discount > 0 && <div className="flex justify-between text-[#6F9A4F]"><span>Desconto</span><span className="font-mono">{brl(-t.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-ink-soft">Entrega</span><span className="font-mono">{t.delivery ? brl(t.delivery) : "Grátis"}</span></div>
              <div className="flex justify-between pt-2 font-display text-2xl font-bold"><span>Total</span><span>{brl(t.total)}</span></div>
            </div>
          </div>

          {/* Right column: address + payment */}
          <div className="space-y-8 lg:col-span-7">
            <AddressSection address={address} setAddress={setAddress} mode={mode} setMode={setMode} />
            <PaymentSection method={method} setMethod={setMethod} card={card} setCard={setCard} />

            <button
              onClick={handleFinalize}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
            >
              Finalizar pedido
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
              <Lock className="h-3 w-3" /> Pagamento 100% seguro e criptografado
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
