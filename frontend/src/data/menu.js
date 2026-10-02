export const brl = (v) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const P = process.env.PUBLIC_URL;

const F = {
  strawberry: P + "/img/fruit_strawberry.webp",
  strawberryHalf: P + "/img/fruit_strawberry_half.webp",
  strawberrySlice: P + "/img/fruit_strawberry_slice.webp",
  pistachio: P + "/img/fruit_pistachio.webp",
  cacau: P + "/img/fruit_cacau.webp",
  maracuja: P + "/img/fruit_maracuja.webp",
  mint: P + "/img/leaf_mint.webp",
  milk: P + "/img/milk_splash.webp",
};

// Floating pieces around the hero popsicle. x/y in % of the stage, w in % of stage width.
export const FLAVORS = [
  {
    id: "morango",
    n: "01",
    name: "Morango",
    fruit: P + "/img/morango.svg",
    full: "Morango & Leite",
    word: "morango",
    accent: "#E2314B",
    tint: "#FDECEF",
    pop: P + "/img/pop_morango.webp",
    productId: "pic-morango",
    pieces: [
      { src: F.strawberry, x: 8, y: 14, w: 22, depth: 1.2, rot: -18, delay: 0 },
      { src: F.strawberryHalf, x: 68, y: 62, w: 26, depth: 1.6, rot: 14, delay: 0.6 },
      { src: F.strawberrySlice, x: 72, y: 10, w: 14, depth: 0.8, rot: 20, delay: 1.1 },
      { src: F.milk, x: 4, y: 66, w: 24, depth: 0.6, rot: 0, delay: 0.3 },
      { src: F.mint, x: 50, y: 4, w: 9, depth: 1, rot: -30, delay: 0.9 },
    ],
    line: "Calda de morango silvestre entrelaçada no leite fresco da fazenda.",
    story:
      "Morangos colhidos ainda de madrugada, cozidos lentamente até virarem calda. Depois, entrelaçados à mão em uma base de leite fresco. O resultado é doce na medida, ácido no ponto e impossível de esquecer.",
    notes: ["Morango silvestre", "Leite fresco", "Baunilha em fava"],
  },
  {
    id: "pistache",
    n: "02",
    name: "Pistache",
    fruit: P + "/img/pistache.svg",
    full: "Pistache Siciliano",
    word: "pistache",
    accent: "#6F9A4F",
    tint: "#EEF4E6",
    pop: P + "/img/pop_pistache.webp",
    productId: "pic-pistache",
    pieces: [
      { src: F.pistachio, x: 6, y: 16, w: 24, depth: 1.3, rot: -12, delay: 0 },
      { src: F.pistachio, x: 70, y: 58, w: 20, depth: 1.7, rot: 150, delay: 0.5 },
      { src: F.milk, x: 66, y: 8, w: 22, depth: 0.7, rot: 0, delay: 0.9 },
      { src: F.mint, x: 10, y: 66, w: 10, depth: 1, rot: 20, delay: 0.3 },
    ],
    line: "Pasta pura de pistache tostado, sem corante e sem atalho.",
    story:
      "Torramos o pistache na casa, moemos até virar uma pasta sedosa e equilibramos com uma pitada de flor de sal. A cor é a do próprio fruto: um verde suave, honesto, que nenhum corante imita.",
    notes: ["Pistache tostado", "Flor de sal", "Creme fresco"],
  },
  {
    id: "cacau",
    n: "03",
    name: "Cacau",
    fruit: P + "/img/cacau.svg",
    full: "Cacau 70%",
    word: "cacau",
    accent: "#4A2A1E",
    tint: "#F1ECE8",
    pop: P + "/img/pop_cacau.webp",
    productId: "pic-cacau",
    pieces: [
      { src: F.cacau, x: 4, y: 12, w: 28, depth: 1.3, rot: -8, delay: 0 },
      { src: F.cacau, x: 66, y: 64, w: 22, depth: 1.7, rot: 160, delay: 0.5 },
      { src: F.milk, x: 70, y: 10, w: 22, depth: 0.7, rot: 0, delay: 0.9 },
    ],
    line: "Chocolate 70% de origem única, intenso do começo ao fim.",
    story:
      "Um gelado para quem leva chocolate a sério. Cacau fino de origem única, casca crocante de chocolate amargo e um interior cremoso que derrete devagar, revelando notas de frutas secas e café.",
    notes: ["Cacau 70%", "Nibs crocantes", "Leite integral"],
  },
  {
    id: "maracuja",
    n: "04",
    name: "Maracujá",
    fruit: P + "/img/maracuja.svg",
    full: "Maracujá da Serra",
    word: "maracujá",
    accent: "#E9A30B",
    tint: "#FFF4D6",
    pop: P + "/img/pop_maracuja.webp",
    productId: "pic-maracuja",
    pieces: [
      { src: F.maracuja, x: 4, y: 14, w: 28, depth: 1.3, rot: -10, delay: 0 },
      { src: F.mint, x: 72, y: 8, w: 10, depth: 0.9, rot: 25, delay: 0.7 },
      { src: F.milk, x: 66, y: 62, w: 24, depth: 0.7, rot: 0, delay: 0.4 },
    ],
    line: "Polpa inteira com sementes, refrescante e cem por cento vegetal.",
    story:
      "Feito só com polpa de maracujá, água e açúcar orgânico. Mantemos as sementes porque é ali que mora o perfume da fruta. Leve, vibrante e naturalmente vegano.",
    notes: ["Polpa inteira", "Açúcar orgânico", "Vegano"],
  },
];

export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "picoles", label: "Picolés" },
  { id: "gelatos", label: "Gelatos" },
  { id: "potes", label: "Potes" },
  { id: "especiais", label: "Especiais" },
];

export const PRODUCTS = [
  { id: "pic-morango", cat: "picoles", name: "Morango & Leite", price: 14.9, img: P + "/img/pop_morango.webp", tint: "#FDECEF", desc: "Calda de morango silvestre entrelaçada em leite fresco.", tags: ["Mais pedido"], ingredients: "Leite fresco, morango, açúcar, creme de leite, baunilha em fava." },
  { id: "pic-pistache", cat: "picoles", name: "Pistache Siciliano", price: 16.9, img: P + "/img/pop_pistache.webp", tint: "#EEF4E6", desc: "Pasta pura de pistache com topo de pistache picado.", tags: ["Sem glúten"], ingredients: "Leite, pasta de pistache, açúcar, creme de leite, flor de sal." },
  { id: "pic-cacau", cat: "picoles", name: "Cacau 70%", price: 15.9, img: P + "/img/pop_cacau.webp", tint: "#F1ECE8", desc: "Casca de chocolate amargo e interior cremoso de cacau.", tags: ["Intenso"], ingredients: "Leite, chocolate 70%, cacau em pó, açúcar, nibs de cacau." },
  { id: "pic-maracuja", cat: "picoles", name: "Maracujá da Serra", price: 12.9, img: P + "/img/pop_maracuja.webp", tint: "#FFF4D6", desc: "Polpa inteira com sementes, leve e refrescante.", tags: ["Vegano", "Zero lactose"], ingredients: "Polpa de maracujá, água, açúcar orgânico." },
  { id: "pic-coco", cat: "picoles", name: "Coco Queimado", price: 13.9, img: P + "/img/pop_coco.webp", tint: "#F6F1E8", desc: "Leite de coco com lascas tostadas e um toque de rapadura.", tags: ["Vegano", "Zero lactose"], ingredients: "Leite de coco, coco ralado tostado, rapadura, água." },
  { id: "pic-limao", cat: "picoles", name: "Limão Siciliano & Hortelã", price: 11.9, img: P + "/img/pop_limao.webp", tint: "#F3F7E4", desc: "Sorbet cítrico com folhas de hortelã fresca.", tags: ["Vegano"], ingredients: "Suco de limão siciliano, água, açúcar, hortelã." },
  { id: "gel-doce-leite", cat: "gelatos", name: "Doce de Leite Mineiro", price: 18.9, img: P + "/img/cup_doce_leite.webp", tint: "#F7EEE2", desc: "Gelato de doce de leite artesanal com fio de caramelo.", tags: ["Copo 180 ml"], ingredients: "Leite, doce de leite, açúcar, creme de leite, sal." },
  { id: "gel-frutas", cat: "gelatos", name: "Frutas Vermelhas", price: 19.9, img: P + "/img/cup_frutas_vermelhas.webp", tint: "#F8E8EC", desc: "Sorbet de framboesa e amora com frutas frescas.", tags: ["Vegano", "Copo 180 ml"], ingredients: "Framboesa, amora, mirtilo, água, açúcar." },
  { id: "pote-baunilha", cat: "potes", name: "Pote Baunilha de Madagascar", price: 49.9, img: P + "/img/pote_baunilha.webp", tint: "#F4F1EA", desc: "Base clássica com fava de baunilha inteira. 500 ml.", tags: ["500 ml"], ingredients: "Leite, creme de leite, açúcar, gemas, baunilha de Madagascar." },
  { id: "pote-morango", cat: "potes", name: "Pote Morango & Leite", price: 52.9, img: P + "/img/pote_morango.webp", tint: "#FDECEF", desc: "O nosso sabor assinatura para levar para casa. 500 ml.", tags: ["500 ml", "Assinatura"], ingredients: "Leite fresco, morango, açúcar, creme de leite, baunilha." },
  { id: "esp-cone", cat: "especiais", name: "Cone Morango Silvestre", price: 21.9, img: P + "/img/especial_cone.webp", tint: "#FBEAE4", desc: "Casquinha crocante feita na casa, gelato e calda quente de morango.", tags: ["Edição limitada"], ingredients: "Casquinha artesanal, gelato de morango, calda de morango." },
  { id: "esp-caixa", cat: "especiais", name: "Caixa Degustação", price: 79.9, img: P + "/img/caixa.webp", tint: "#F2F2EE", desc: "Seis picolés da casa em uma caixa para presentear.", tags: ["6 unidades", "Presente"], ingredients: "Seleção de seis sabores da estação." },
];

export const COUPONS = { DOLLCII10: 0.1 };
export const FREE_DELIVERY_FROM = 80;
export const DELIVERY_FEE = 7.9;

export const calcTotals = (items, coupon, mode = "entrega") => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const rate = COUPONS[(coupon || "").trim().toUpperCase()] || 0;
  const discount = subtotal * rate;
  const after = subtotal - discount;
  const delivery = mode === "entrega" && after > 0 && after < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return { subtotal, discount, delivery, total: after + delivery, rate };
};

export const STORES = [
  { id: "jardins", name: "Jardins", address: "Rua Oscar Freire, 1120, Jardins, São Paulo", hours: "Todos os dias, 11h às 23h", phone: "(11) 4000-1020" },
  { id: "pinheiros", name: "Pinheiros", address: "Rua dos Pinheiros, 870, Pinheiros, São Paulo", hours: "Ter a dom, 12h às 22h", phone: "(11) 4000-1030" },
  { id: "vila-madalena", name: "Vila Madalena", address: "Rua Aspicuelta, 410, Vila Madalena, São Paulo", hours: "Todos os dias, 12h às 00h", phone: "(11) 4000-1040" },
];
