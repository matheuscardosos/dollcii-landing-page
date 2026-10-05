import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eyebrow, H2, Reveal, Section } from "./Reveal";

const STEPS = [
  ["Colheita", "A fruta chega da roça ainda de manhã cedo. Escolhemos uma a uma, só as que estão no ponto."],
  ["Base", "Leite fresco pasteurizado na casa, creme e açúcar na medida. A base descansa por 72 horas."],
  ["Batimento", "Batemos devagar, em pequenos lotes, para incorporar pouco ar e muito sabor."],
  ["Palito", "Moldamos à mão e congelamos rápido, a 35 graus negativos, para preservar a textura."],
];

export const Process = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Section id="processo" ref={ref} data-testid="process-section" className="py-24 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-paper lg:sticky lg:top-28">
            <motion.img style={{ y, scale: 1.2 }} src={process.env.PUBLIC_URL + "/img/atelier.webp"} alt="Ateliê Geliz" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute bottom-5 left-5 h-28 w-28 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs><path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
                <circle cx="50" cy="50" r="49" fill="#ffffff" />
                <text fontSize="8.4" letterSpacing="2.2" fill="#111111" fontFamily="JetBrains Mono"><textPath href="#circ">FEITO À MÃO · TODO DIA · </textPath></text>
              </svg>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Eyebrow>O processo</Eyebrow>
          <H2 className="mt-5" lines={["Do pé", <span key="p">ao <span className="text-berry">palito.</span></span>]} />
          <ol className="mt-14">
            {STEPS.map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.05} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t hairline py-8 sm:grid-cols-[5rem_1fr_1.4fr] sm:gap-8" data-testid={`process-step-${i + 1}`}>
                <span className="font-mono text-sm text-berry">0{i + 1}</span>
                <h3 className="font-display text-3xl font-bold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2">{title}</h3>
                <p className="col-start-2 text-base leading-relaxed text-ink-soft sm:col-start-3">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
};
