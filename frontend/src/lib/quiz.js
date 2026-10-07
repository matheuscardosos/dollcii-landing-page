// Motor de pontuacao do quiz, portado da versao do Canva.
// Q1 vale 3 pontos por perfil; Q2 e Q3 sao texto livre e valem 2 pontos por
// palavra-chave encontrada. O ranking define a recomendacao e a segunda opcao.

export const PERGUNTAS = [
  {
    id: "q1",
    tipo: "escolha",
    titulo: "Qual seu doce favorito?",
    opcoes: [
      { emoji: "🍫", label: "Chocolate" },
      { emoji: "🍓", label: "Morango" },
      { emoji: "🍋", label: "Frutas cítricas" },
      { emoji: "🍪", label: "Biscoito e Oreo" },
      { emoji: "🍮", label: "Cremosos" },
      { emoji: "🍯", label: "Caramelo" },
      { emoji: "🥜", label: "Paçoca e amendoim" },
      { emoji: "🍬", label: "Bem doces" },
      { emoji: "🍃", label: "Refrescantes" },
      { emoji: "🤷", label: "Não sei" },
    ],
  },
  {
    id: "q2",
    tipo: "texto",
    titulo: "Se fosse um doce pro resto da vida, qual seria?",
    placeholder: "Conta pra mim...",
  },
  {
    id: "q3",
    tipo: "texto",
    titulo: "E qual doce te leva pra uma lembrança boa?",
    placeholder: "Aquele doce que é nostalgia...",
  },
];

// A ordem importa: ela desempata quando dois perfis fecham com a mesma pontuacao.
const PERFIS = ["chocolate", "biscoito", "morango", "refrescante", "citrico", "pudim", "pacoca"];

// Indice da opcao da Q1 -> perfis que ganham 3 pontos.
const MAPA_Q1 = [
  ["chocolate"],
  ["morango"],
  ["citrico", "refrescante"],
  ["biscoito"],
  ["pudim", "chocolate"],
  ["pudim"],
  ["pacoca"],
  ["chocolate", "morango"],
  ["refrescante", "citrico"],
  [],
];

const PALAVRAS = {
  chocolate: ["chocolate", "nutella", "brigadeiro", "cacau", "brownie", "bis", "trufa"],
  biscoito: ["oreo", "biscoito", "cookie", "cookies", "bolacha", "negresco"],
  morango: ["morango", "frutas vermelhas", "leite condensado", "ninho"],
  refrescante: ["maracujá", "maracuja", "frutas", "acerola", "manga", "abacaxi", "refrescante", "leve"],
  citrico: ["limão", "limao", "laranja", "citrico", "cítrico", "torta"],
  pudim: ["pudim", "caramelo", "doce de leite", "flan", "bolo", "tradicional"],
  pacoca: ["paçoca", "pacoca", "amendoim", "pé de moleque", "pe de moleque"],
};

// Os sete sabores da operacao, todos no cardapio. Tres ainda estao sem foto,
// entao o cartao mostra so o nome ate as imagens chegarem.
export const SABORES = {
  chocolate: { produto: "geliz-nutella", nome: "Geliz Nutella", emoji: "🍫", desc: "Cremoso e irresistível, com todo o sabor marcante da Nutella." },
  biscoito: { produto: "geliz-oreo", nome: "Geliz Oreo", emoji: "🍪", desc: "Pedacinhos de Oreo num geladinho cremoso e viciante." },
  morango: { produto: "geliz-amor-cravejado", nome: "Geliz do Amor", emoji: "🍓", desc: "Morango com leite condensado, puro amor em cada mordida." },
  refrescante: { produto: "geliz-calma", nome: "Geliz da Calma", emoji: "🍃", desc: "Maracujá refrescante e suave. Leveza em forma de gelado." },
  citrico: { produto: "geliz-limao", nome: "Premium Torta de Limão", emoji: "🍋", desc: "Sofisticado, inspirado na clássica torta de limão." },
  pudim: { produto: "geliz-pudim", nome: "Geliz de Pudim", emoji: "🍮", desc: "Caramelo e cremosidade, nostalgia de sobremesa de domingo." },
  pacoca: { produto: "geliz-pacoca", nome: "Geliz de Paçoca", emoji: "🥜", desc: "Amendoim e paçoca num geladinho cremoso e irresistível." },
};

const FRASES = {
  chocolate: "Chocolate é vida pra você!",
  biscoito: "Você é do time do biscoito!",
  morango: "Morango com cremosidade, perfeição!",
  refrescante: "Frescor é tudo!",
  citrico: "Sofisticação cítrica!",
  pudim: "Pudim no coração!",
  pacoca: "Paçoca e amendoim são o seu match!",
};

const FRASE_PADRAO = "Sabores cremosos e irresistíveis!";

const WHATSAPP = "553899859473";
export const linkWhatsApp = (nome) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Quero garantir o meu " + nome)}`;

// Junta o sabor do quiz com o produto do cardapio, quando ele existe.
const montar = (perfil, catalogo) => {
  const sabor = SABORES[perfil];
  const produto = sabor.produto ? catalogo.find((p) => p.id === sabor.produto) : null;
  return {
    perfil,
    emoji: sabor.emoji,
    nome: produto ? produto.name : sabor.nome,
    desc: produto ? produto.desc : sabor.desc,
    produto,
  };
};

export function analisarQuiz(respostas, catalogo = []) {
  const [q1, q2 = "", q3 = ""] = respostas;

  const pontos = {};
  PERFIS.forEach((p) => {
    pontos[p] = 0;
  });

  if (q1 !== null && q1 !== undefined) {
    (MAPA_Q1[q1] || []).forEach((p) => {
      if (p in pontos) pontos[p] += 3;
    });
  }

  [q2, q3].forEach((resposta) => {
    const texto = String(resposta).toLowerCase();
    Object.entries(PALAVRAS).forEach(([perfil, palavras]) => {
      palavras.forEach((palavra) => {
        if (texto.includes(palavra)) pontos[perfil] += 2;
      });
    });
  });

  const ranking = Object.entries(pontos).sort((a, b) => b[1] - a[1]);

  // Ninguem pontuou (so respondeu "Nao sei" e textos sem palavra conhecida).
  const vencedor = ranking[0][1] > 0 ? ranking[0][0] : "chocolate";

  let segundoPerfil = ranking.find(([p, n]) => n > 0 && p !== vencedor)?.[0];
  if (!segundoPerfil) segundoPerfil = vencedor === "chocolate" ? "morango" : "chocolate";

  return {
    principal: montar(vencedor, catalogo),
    segunda: montar(segundoPerfil, catalogo),
    frase: FRASES[vencedor] || FRASE_PADRAO,
    pontos,
  };
}
