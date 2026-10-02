import { Eyebrow, H2, Reveal, Section } from "./Reveal";

const Stat = ({ value, label, text, delay, className = "" }) => (
  <Reveal delay={delay} className={`flex flex-col justify-between rounded-[28px] bg-paper p-7 ${className}`}>
    <Eyebrow>{label}</Eyebrow>
    <div>
      <p className="font-display text-6xl font-bold leading-none tracking-[-0.04em] lg:text-7xl">{value}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  </Reveal>
);

export const Bento = () => (
  <Section data-testid="bento-section" className="pb-24 lg:pb-36">
    <div className="mb-8 sm:mb-12 flex flex-col justify-between gap-4 sm:gap-6 lg:flex-row lg:items-end">
      <div>
        <Eyebrow>O que nos move</Eyebrow>
        <H2 className="mt-5" lines={["Menos ingredientes,", <span key="i" className="text-berry">mais verdade.</span>]} />
      </div>
      <p className="max-w-sm text-base leading-relaxed text-ink-soft">Cada gelado começa na feira e termina no palito em menos de dois dias. Sem pó, sem base pronta, sem pressa.</p>
    </div>
    <div className="grid auto-rows-[180px] sm:auto-rows-[240px] grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Reveal className="group relative overflow-hidden rounded-[28px] bg-paper sm:col-span-2 sm:row-span-2" data-testid="bento-hero-card">
        <img src={process.env.PUBLIC_URL + "/img/splash.webp"} alt="Morangos caindo no leite fresco" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
        <div className="absolute bottom-0 p-7 text-white lg:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">Ingredientes</p>
          <p className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-[-0.03em] lg:text-4xl">Leite fresco e fruta inteira. Nada além disso.</p>
        </div>
      </Reveal>
      <Stat value="72h" label="Maturação" text="de descanso da base antes de bater, para uma textura mais sedosa." delay={0.05} />
      <Stat value="0" label="Conservantes" text="corantes ou aromas artificiais. Nunca usamos e nunca vamos usar." delay={0.1} className="!bg-berry-soft" />
      <Reveal delay={0.15} className="group relative overflow-hidden rounded-[28px] bg-paper sm:col-span-2">
        <img src={process.env.PUBLIC_URL + "/img/atelier.webp"} alt="Ateliê Dollcii preparando a calda de morango" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
        <div className="relative flex h-full max-w-xs flex-col justify-end p-7 text-white">
          <p className="font-display text-5xl font-bold tracking-[-0.04em]">18</p>
          <p className="mt-2 text-sm leading-relaxed text-white/90">sabores girando ao longo do ano, sempre seguindo o que a estação tem de melhor.</p>
        </div>
      </Reveal>
    </div>
  </Section>
);
