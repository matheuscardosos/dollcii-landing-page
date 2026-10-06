export const brl = (v) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const P = process.env.PUBLIC_URL;

const ING = {
  cacau: P + "/img/fruit_cacau.webp",
  avela: P + "/img/avela.webp",
  milk: P + "/img/milk_splash.webp",
  condensado: P + "/img/splash_leite_condensado.webp",
  chocolateBranco: P + "/img/chocolate_branco.webp",
  biscoito: P + "/img/biscoito_maizena.webp",
  limaoRaspas: P + "/img/limao_raspas.webp",
  caramelo: P + "/img/caramelo_cubos.webp",
  gema: P + "/img/ovo_gema.webp",
  morango: P + "/img/morango_metade.webp",
};

// Floating pieces around the hero popsicle. x/y in % of the stage, w in % of stage width.
export const FLAVORS = [
  {
    id: "nutella",
    n: "01",
    name: "Nutella",
    fruit: P + "/img/avelas.svg",
    full: "Nutella Cremosa",
    word: "nutella",
    accent: "#5C3420",
    tint: "#F4EAE2",
    pop: P + "/img/geliz_nutella.webp",
    productId: "geliz-nutella",
    pieces: [
      { src: ING.cacau, x: 6, y: 12, w: 22, depth: 1.2, rot: -16, delay: 0 },
      { src: ING.avela, x: 70, y: 58, w: 20, depth: 1.5, rot: 12, delay: 0.6 },
      { src: ING.condensado, x: 3, y: 62, w: 24, depth: 0.7, rot: 0, delay: 0.3 },
      { src: ING.milk, x: 72, y: 8, w: 21, depth: 0.9, rot: 18, delay: 1 },
    ],
    line: "Creme de avelã com cacau, fechado numa camada de leite condensado.",
    story:
      "A base leva creme de avelã batido com cacau até ficar sedoso. No fundo, uma camada generosa de leite condensado que só aparece na última mordida. É o sabor que mais sai, e a gente entende o porquê.",
    notes: ["Creme de avelã", "Cacau", "Leite condensado"],
  },
  {
    id: "limao",
    n: "02",
    name: "Limão",
    fruit: P + "/img/limao.svg",
    full: "Torta de Limão",
    word: "limão",
    accent: "#C2A32B",
    tint: "#FBF4E0",
    pop: P + "/img/geliz_limao.webp",
    productId: "geliz-limao",
    pieces: [
      { src: ING.limaoRaspas, x: 5, y: 12, w: 24, depth: 1.2, rot: -14, delay: 0 },
      { src: ING.biscoito, x: 68, y: 60, w: 24, depth: 1.5, rot: 12, delay: 0.6 },
      { src: ING.chocolateBranco, x: 72, y: 9, w: 19, depth: 0.8, rot: 20, delay: 1 },
      { src: ING.milk, x: 3, y: 64, w: 23, depth: 0.6, rot: 0, delay: 0.3 },
    ],
    line: "A torta de limão da vovó, gelada e na palma da mão.",
    story:
      "A acidez do limão equilibrada no chocolate branco, com farelo de biscoito maizena espalhado na base. Refresca de verdade e ainda deixa aquele docinho no fim.",
    notes: ["Raspas de limão", "Chocolate branco", "Biscoito maizena"],
  },
  {
    id: "pudim",
    n: "03",
    name: "Pudim",
    fruit: P + "/img/pudim.svg",
    full: "Pudim de Leite",
    word: "pudim",
    accent: "#E09412",
    tint: "#FFF1D7",
    pop: P + "/img/geliz_pudim.webp",
    productId: "geliz-pudim",
    pieces: [
      { src: ING.caramelo, x: 68, y: 10, w: 23, depth: 1.1, rot: 14, delay: 0 },
      { src: ING.gema, x: 70, y: 58, w: 21, depth: 1.5, rot: -10, delay: 0.7 },
      { src: ING.condensado, x: 3, y: 32, w: 25, depth: 0.8, rot: 0, delay: 0.35 },
    ],
    line: "Gema, leite condensado e calda de caramelo queimado.",
    story:
      "Tem a textura do pudim e o frescor do geladinho. O caramelo queimado na medida certa corta o doce e dá aquele fundo amargo. Quem prova sempre pergunta se é pudim mesmo.",
    notes: ["Leite condensado", "Gema", "Caramelo queimado"],
  },
  {
    id: "amor-cravejado",
    n: "04",
    name: "Amor Cravejado",
    fruit: P + "/img/morango.svg",
    full: "Amor Cravejado",
    word: "amor",
    accent: "#E8294A",
    tint: "#FFE9EA",
    pop: P + "/img/geliz_amor_cravejado.webp",
    productId: "geliz-amor-cravejado",
    pieces: [
      { src: ING.morango, x: 6, y: 12, w: 23, depth: 1.3, rot: -16, delay: 0 },
      { src: ING.chocolateBranco, x: 70, y: 56, w: 20, depth: 1.5, rot: 12, delay: 0.6 },
      { src: ING.caramelo, x: 72, y: 8, w: 20, depth: 0.9, rot: 18, delay: 1 },
      { src: ING.milk, x: 3, y: 62, w: 24, depth: 0.6, rot: 0, delay: 0.3 },
    ],
    line: "Morango picado de verdade, cravejado no creme branco.",
    story:
      "Pedaços de morango fresco espalhados por todo o geladinho, num creme de chocolate branco com toque de caramelo. Cravejado porque a fruta aparece em cada mordida, não só na cor.",
    notes: ["Morango picado", "Chocolate branco", "Caramelo"],
  },
];

export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "cremosos", label: "Cremosos" },
  { id: "frutados", label: "Frutados" },
];

export const PRODUCTS = [
  {
    id: "geliz-nutella",
    cat: "cremosos",
    name: "Geliz Nutella",
    price: 10,
    img: P + "/img/geliz_nutella.webp",
    tint: "#F4EAE2",
    desc: "Creme de avelã com cacau e uma camada de leite condensado no fundo.",
    tags: ["Mais vendido"],
    ingredients: "Creme de avelã, cacau, leite, leite condensado, açúcar.",
  },
  {
    id: "geliz-limao",
    cat: "frutados",
    name: "Geliz Limão",
    price: 8,
    img: P + "/img/geliz_limao.webp",
    tint: "#FBF4E0",
    desc: "Torta de limão com chocolate branco e farelo de biscoito maizena.",
    tags: ["Refrescante"],
    ingredients: "Limão, chocolate branco, biscoito maizena, leite condensado, creme de leite.",
  },
  {
    id: "geliz-pudim",
    cat: "cremosos",
    name: "Geliz Pudim",
    price: 8,
    img: P + "/img/geliz_pudim.webp",
    tint: "#FFF1D7",
    desc: "Pudim de leite condensado com calda de caramelo queimado.",
    tags: ["Clássico"],
    ingredients: "Leite condensado, gema, leite, açúcar caramelizado.",
  },
  {
    id: "geliz-amor-cravejado",
    cat: "frutados",
    name: "Geliz Amor Cravejado",
    price: 10,
    img: P + "/img/geliz_amor_cravejado.webp",
    tint: "#FFE9EA",
    desc: "Morango picado cravejado num creme de chocolate branco com caramelo.",
    tags: ["Edição especial"],
    ingredients: "Morango, chocolate branco, caramelo, leite condensado, creme de leite.",
  },
];

export const COUPONS = { GELIZ10: 0.1 };
export const FREE_DELIVERY_FROM = 50;
export const DELIVERY_FEE = 7.9;

export const calcTotals = (items, coupon, mode = "entrega") => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const rate = COUPONS[(coupon || "").trim().toUpperCase()] || 0;
  const discount = subtotal * rate;
  const after = subtotal - discount;
  const delivery = mode === "entrega" && after > 0 && after < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return { subtotal, discount, delivery, total: after + delivery, rate };
};
