import { brl } from "../data/menu";

// O recibo e desenhado em canvas em vez de rasterizar a tela. Assim o
// resultado nao depende de CSS, sai igual em qualquer navegador e serve
// de origem unica pro PNG e pro PDF.

const LARGURA = 760;
const MARGEM = 56;
const ESCALA = 2; // densidade, pra nao sair serrilhado

const COR = {
  papel: "#ffffff",
  tinta: "#1a1110",
  suave: "#7b6a63",
  linha: "#e8e2de",
  marca: "#fc030f",
  verde: "#6f9a4f",
};

const PAGAMENTO = {
  pix: "Pix",
  dinheiro: "Dinheiro na entrega",
  cartao: "Maquininha na entrega",
};

const carregarLogo = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = process.env.PUBLIC_URL + "/img/logo.webp";
  });

const fmtData = (iso) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Retirada nao tem endereco de entrega: o bloco muda de conteudo, nao so de titulo.
const linhasDoLocal = (venda) => {
  if (venda.mode === "retirada" || !venda.address) {
    return ["Retirada no local", "Combine o horário pelo WhatsApp"];
  }
  const a = venda.address;
  const linha1 = [a.street, a.number].filter(Boolean).join(", ");
  const linha2 = [a.complement, a.neighborhood].filter(Boolean).join(" · ");
  const linha3 = [a.city, a.state].filter(Boolean).join(" / ");
  const cep = a.cep ? "CEP " + a.cep : "";
  return [linha1, linha2, [linha3, cep].filter(Boolean).join(" · ")].filter(Boolean);
};

export async function desenharRecibo(venda) {
  const logo = await carregarLogo();

  // Primeiro medimos a altura, que depende da quantidade de itens.
  const linhasEndereco = linhasDoLocal(venda);
  const altura =
    290 + venda.items.length * 34 + linhasEndereco.length * 22 + (venda.canceled ? 70 : 0) + 270;

  const canvas = document.createElement("canvas");
  canvas.width = LARGURA * ESCALA;
  canvas.height = altura * ESCALA;
  const ctx = canvas.getContext("2d");
  ctx.scale(ESCALA, ESCALA);
  ctx.textBaseline = "alphabetic";

  const fonte = (tam, peso = "400") =>
    `${peso} ${tam}px Manrope, "Helvetica Neue", Arial, sans-serif`;

  const texto = (t, x, y, { tam = 14, peso = "400", cor = COR.tinta, align = "left" } = {}) => {
    ctx.font = fonte(tam, peso);
    ctx.fillStyle = cor;
    ctx.textAlign = align;
    ctx.fillText(t, x, y);
  };

  const linha = (y) => {
    ctx.strokeStyle = COR.linha;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGEM, y + 0.5);
    ctx.lineTo(LARGURA - MARGEM, y + 0.5);
    ctx.stroke();
  };

  ctx.fillStyle = COR.papel;
  ctx.fillRect(0, 0, LARGURA, altura);

  // Faixa da marca no topo
  ctx.fillStyle = COR.marca;
  ctx.fillRect(0, 0, LARGURA, 8);

  let y = 64;

  if (logo) {
    const h = 54;
    ctx.drawImage(logo, MARGEM, y - 38, (logo.width / logo.height) * h, h);
  } else {
    texto("GELIZ", MARGEM, y, { tam: 30, peso: "800" });
  }

  texto("RECIBO", LARGURA - MARGEM, y - 18, { tam: 12, peso: "700", cor: COR.suave, align: "right" });
  texto("#" + venda.code, LARGURA - MARGEM, y + 4, { tam: 20, peso: "700", align: "right" });

  y += 44;
  linha(y);
  y += 34;

  // Dados do pedido, em duas colunas
  const meio = LARGURA / 2 + 10;
  texto("CLIENTE", MARGEM, y, { tam: 10, peso: "700", cor: COR.suave });
  texto("DATA", meio, y, { tam: 10, peso: "700", cor: COR.suave });
  y += 20;
  texto(venda.customer ? venda.customer.name : "Venda no balcão", MARGEM, y, { tam: 15, peso: "600" });
  texto(fmtData(venda.date), meio, y, { tam: 15, peso: "600" });

  if (venda.customer) {
    y += 19;
    texto(venda.customer.email, MARGEM, y, { tam: 12, cor: COR.suave });
  }

  y += 34;
  const ehRetirada = venda.mode === "retirada" || !venda.address;
  texto(ehRetirada ? "RETIRADA" : "ENTREGA EM", MARGEM, y, { tam: 10, peso: "700", cor: COR.suave });
  texto("PAGAMENTO", meio, y, { tam: 10, peso: "700", cor: COR.suave });
  y += 20;
  texto(PAGAMENTO[venda.payment] || "A combinar", meio, y, { tam: 15, peso: "600" });

  linhasEndereco.forEach((l, i) => {
    texto(l, MARGEM, y + i * 20, { tam: 13, cor: i === 0 ? COR.tinta : COR.suave });
  });

  y += Math.max(linhasEndereco.length * 20, 20) + 24;
  linha(y);
  y += 32;

  // Itens
  texto("ITEM", MARGEM, y, { tam: 10, peso: "700", cor: COR.suave });
  texto("QTD", LARGURA - MARGEM - 180, y, { tam: 10, peso: "700", cor: COR.suave, align: "right" });
  texto("UNIT.", LARGURA - MARGEM - 90, y, { tam: 10, peso: "700", cor: COR.suave, align: "right" });
  texto("TOTAL", LARGURA - MARGEM, y, { tam: 10, peso: "700", cor: COR.suave, align: "right" });
  y += 16;

  venda.items.forEach((item) => {
    y += 26;
    texto(item.name, MARGEM, y, { tam: 14, peso: "500" });
    texto(String(item.qty), LARGURA - MARGEM - 180, y, { tam: 14, align: "right", cor: COR.suave });
    texto(brl(item.price), LARGURA - MARGEM - 90, y, { tam: 14, align: "right", cor: COR.suave });
    texto(brl(item.price * item.qty), LARGURA - MARGEM, y, { tam: 14, peso: "600", align: "right" });
    y += 8;
  });

  y += 16;
  linha(y);
  y += 38;

  // Total
  texto("TOTAL PAGO", MARGEM, y, { tam: 12, peso: "700", cor: COR.suave });
  texto(brl(venda.total), LARGURA - MARGEM, y + 6, { tam: 32, peso: "800", align: "right" });

  y += 44;

  if (venda.canceled) {
    ctx.fillStyle = "#ffeced";
    ctx.fillRect(MARGEM, y, LARGURA - MARGEM * 2, 54);
    texto("PEDIDO CANCELADO", MARGEM + 18, y + 24, { tam: 12, peso: "700", cor: COR.marca });
    texto(venda.cancelReason || "", MARGEM + 18, y + 42, { tam: 12, cor: COR.suave });
    y += 70;
  }

  // Rodape
  y = altura - 112;
  linha(y);
  y += 28;
  texto("Obrigado por fazer parte da nossa história.", MARGEM, y, { tam: 14, peso: "600" });
  y += 20;
  texto("Geliz · Felicidade em forma de geladinho · Montes Claros, MG", MARGEM, y, {
    tam: 12,
    cor: COR.suave,
  });
  y += 18;
  texto("@gelizgeladinhos · (38) 9985-9473", MARGEM, y, { tam: 12, cor: COR.suave });
  y += 22;
  texto("Este recibo não possui validade fiscal.", MARGEM, y, { tam: 11, cor: COR.suave });

  return canvas;
}

export const nomeArquivo = (venda, ext) => `recibo-geliz-${venda.code}.${ext}`;

export function baixarPNG(canvas, nome) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nome;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

export async function baixarPDF(canvas, nome) {
  // Import dinamico: quem nunca baixa recibo nao carrega o gerador.
  const { jsPDF } = await import("jspdf");
  const w = canvas.width / ESCALA;
  const h = canvas.height / ESCALA;
  const pdf = new jsPDF({ unit: "px", format: [w, h], orientation: w > h ? "landscape" : "portrait" });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h);
  pdf.save(nome);
}

export async function compartilhar(canvas, venda) {
  const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
  const file = new File([blob], nomeArquivo(venda, "png"), { type: "image/png" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "Recibo Geliz #" + venda.code,
      text: "Meu pedido na Geliz, " + brl(venda.total) + ".",
    });
    return "compartilhado";
  }

  await baixarPNG(canvas, nomeArquivo(venda, "png"));
  return "baixado";
}
