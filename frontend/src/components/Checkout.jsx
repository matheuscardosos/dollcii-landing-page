import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useBag } from "../context/BagContext";
import { brl, calcTotals } from "../data/menu";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : null;

const Pills = ({ options, value, onChange, name }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(([id, label]) => (
      <button type="button" key={id} data-testid={`checkout-${name}-${id}`} onClick={() => onChange(id)} className={`h-11 rounded-full border px-5 text-sm font-medium transition-colors ${value === id ? "border-ink bg-ink text-white" : "hairline bg-white"}`}>
        {label}
      </button>
    ))}
  </div>
);

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">{label}</span>
    <input {...props} className="mt-2 h-12 w-full rounded-2xl border hairline bg-white px-4 text-sm outline-none focus:border-ink" />
  </label>
);

const STEPS = ["Pedido recebido", "No preparo", "Saiu para entrega"];

const Tracker = ({ order }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2600);
    return () => clearInterval(t);
  }, []);
  const steps = order.customer.mode === "retirada" ? [...STEPS.slice(0, 2), "Pronto para retirar"] : STEPS;
  return (
    <ol className="mt-8 space-y-4" data-testid="order-tracker">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-4">
          <motion.span animate={{ backgroundColor: i <= step ? "#E2314B" : "rgba(17,17,17,0.1)" }} className="grid h-8 w-8 place-items-center rounded-full text-white">
            {i <= step && <Check className="h-4 w-4" />}
          </motion.span>
          <span className={`text-sm ${i <= step ? "font-semibold" : "text-ink-soft"}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
};

const Done = ({ order, onClose }) => (
  <div className="p-5 sm:p-7 lg:p-10" data-testid="order-confirmation">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="grid h-16 w-16 place-items-center rounded-full bg-berry text-white">
      <Check className="h-7 w-7" />
    </motion.div>
    <DialogTitle className="mt-6 font-display text-4xl font-bold leading-tight tracking-[-0.03em]">Pedido confirmado, {order.customer.name.split(" ")[0]}!</DialogTitle>
    <DialogDescription className="mt-3 text-sm text-ink-soft">
      Número do pedido <span data-testid="order-code" className="font-mono font-semibold text-ink">#{order.code}</span>. Previsão de {order.eta_minutes} minutos.
    </DialogDescription>
    <Tracker order={order} />
    <div className="mt-8 flex items-center justify-between border-t hairline pt-5">
      <span className="text-sm text-ink-soft">Total pago</span>
      <span data-testid="order-total" className="font-display text-2xl font-bold">{brl(order.total)}</span>
    </div>
    <button data-testid="order-done-button" onClick={onClose} className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white">Voltar para a loja</button>
  </div>
);

export const Checkout = () => {
  const { items, coupon, checkout, setCheckout, clear, setCoupon } = useBag();
  const [form, setForm] = useState({ name: "", phone: "", mode: "entrega", address: "", payment: "pix" });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const t = calcTotals(items, coupon, form.mode);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  const close = (o) => {
    if (o) return;
    setCheckout(false);
    setTimeout(() => setOrder(null), 300);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Informe seu nome");
    if (form.phone.replace(/\D/g, "").length < 10) return toast.error("Informe um telefone válido");
    if (form.mode === "entrega" && !form.address.trim()) return toast.error("Informe o endereço de entrega");
    if (!API) return toast.error("Serviço de pedidos indisponível no momento");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/orders`, {
        items: items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        customer: { name: form.name.trim(), phone: form.phone, mode: form.mode, address: form.mode === "entrega" ? form.address.trim() : null },
        payment: form.payment,
        coupon: coupon || null,
      });
      setOrder(data);
      clear();
      setCoupon("");
    } catch {
      toast.error("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={checkout} onOpenChange={close}>
      <DialogContent data-testid="checkout-modal" data-lenis-prevent className="max-h-[94svh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[20px] sm:rounded-[28px] border-none bg-white p-0">
        {order ? (
          <Done order={order} onClose={() => close(false)} />
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <DialogTitle className="font-display text-3xl font-bold tracking-[-0.03em]">Sacola vazia</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-ink-soft">Adicione algum sabor para finalizar o pedido.</DialogDescription>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 sm:space-y-6 p-5 sm:p-7 lg:p-10">
            <div>
              <DialogTitle className="font-display text-4xl font-bold tracking-[-0.03em]">Finalizar pedido</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-ink-soft">Leva menos de um minuto. Prometemos.</DialogDescription>
            </div>
            <Field label="Nome" data-testid="checkout-name-input" value={form.name} onChange={set("name")} placeholder="Como podemos te chamar?" />
            <Field label="Telefone" data-testid="checkout-phone-input" value={form.phone} onChange={set("phone")} placeholder="(11) 90000-0000" inputMode="tel" />
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Como prefere receber</p>
              <Pills name="mode" value={form.mode} onChange={set("mode")} options={[["entrega", "Entrega"], ["retirada", "Retirar na loja"]]} />
            </div>
            {form.mode === "entrega" && <Field label="Endereço" data-testid="checkout-address-input" value={form.address} onChange={set("address")} placeholder="Rua, número e bairro" />}
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Pagamento</p>
              <Pills name="payment" value={form.payment} onChange={set("payment")} options={[["pix", "Pix"], ["cartao", "Cartão"], ["dinheiro", "Dinheiro"]]} />
            </div>
            <div className="space-y-1.5 rounded-2xl bg-paper p-5 text-sm">
              <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span className="font-mono">{brl(t.subtotal)}</span></div>
              {t.discount > 0 && <div className="flex justify-between text-[#6F9A4F]"><span>Desconto</span><span className="font-mono">{brl(-t.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-ink-soft">Entrega</span><span className="font-mono">{t.delivery ? brl(t.delivery) : "Grátis"}</span></div>
              <div className="flex justify-between pt-2 font-display text-xl font-bold"><span>Total</span><span data-testid="checkout-total">{brl(t.total)}</span></div>
            </div>
            <button data-testid="checkout-confirm-button" disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-berry text-sm font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-70">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar pedido · {brl(t.total)}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
