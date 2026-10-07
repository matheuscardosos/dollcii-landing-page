import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { baixarPDF, baixarPNG, compartilhar, desenharRecibo, nomeArquivo } from "../lib/recibo";

export const Recibo = ({ venda, onClose }) => {
  const holder = useRef(null);
  const canvasRef = useRef(null);
  const [pronto, setPronto] = useState(false);
  const [ocupado, setOcupado] = useState("");

  useEffect(() => {
    let vivo = true;
    desenharRecibo(venda).then((canvas) => {
      if (!vivo || !holder.current) return;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.display = "block";
      holder.current.innerHTML = "";
      holder.current.appendChild(canvas);
      canvasRef.current = canvas;
      setPronto(true);
    });
    return () => {
      vivo = false;
    };
  }, [venda]);

  const acao = (nome, fn) => async () => {
    if (!canvasRef.current) return;
    setOcupado(nome);
    try {
      await fn(canvasRef.current);
    } catch {
      toast.error("Não consegui gerar o arquivo. Tente de novo.");
    } finally {
      setOcupado("");
    }
  };

  const Botao = ({ nome, icon: Icon, label, onClick, primario }) => (
    <button
      onClick={onClick}
      disabled={!pronto || !!ocupado}
      className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
        primario
          ? "bg-berry text-white hover:bg-berry-dark"
          : "border border-app-border hover:bg-app-hover"
      }`}
    >
      {ocupado === nome ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full w-full max-w-xl flex-col bg-app-bg sm:my-auto sm:h-auto sm:max-h-[92svh] sm:rounded-[28px]"
      >
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <p className="font-display text-base font-bold">Recibo do pedido</p>
          <button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-app-hover">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5" data-lenis-prevent>
          <div
            ref={holder}
            className="overflow-hidden rounded-2xl border border-app-border shadow-sm"
            style={{ minHeight: pronto ? undefined : 320 }}
          >
            {!pronto && (
              <div className="grid h-80 place-items-center text-sm text-app-muted">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Gerando recibo...
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="flex flex-col gap-2 border-t border-app-border p-4 sm:flex-row sm:p-5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <Botao
            nome="pdf"
            icon={FileText}
            label="Baixar PDF"
            primario
            onClick={acao("pdf", (c) => baixarPDF(c, nomeArquivo(venda, "pdf")))}
          />
          <Botao
            nome="png"
            icon={Download}
            label="Baixar PNG"
            onClick={acao("png", (c) => baixarPNG(c, nomeArquivo(venda, "png")))}
          />
          <Botao
            nome="share"
            icon={Share2}
            label="Compartilhar"
            onClick={acao("share", async (c) => {
              const r = await compartilhar(c, venda);
              if (r === "baixado") toast("Seu navegador não compartilha arquivos, então baixei o PNG.");
            })}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
