import { ChefHat, Heart, Smile, Snowflake } from "lucide-react";
import { H2, Reveal, Section } from "./Reveal";
import { WhatsAppIcon, WHATSAPP_URL } from "./WhatsAppIcon";

const P = process.env.PUBLIC_URL;

const ROLES = [
  ["Allana", "Chef Gourmet", "Cria as receitas na cozinha, com amor e precisão."],
  ["Nicolas", "Embaixador da Gelicidade", "Leva cada geladinho até você, com carisma e dedicação."],
];

const REASONS = [
  [Heart, "Ajuda um casal a casar", "Cada venda é um passo em direção ao altar."],
  [ChefHat, "Feito com paixão e qualidade", "Receitas exclusivas que você não encontra em qualquer lugar."],
  [Smile, "Uma história de amor", "Você espalha Gelicidade junto com a gente."],
  [Snowflake, "Um momento só seu", "Porque a vida fica mais leve quando a gente se permite saborear."],
];

export const Historia = () => (
  <Section id="historia" data-testid="historia-section" className="py-24 lg:py-36">
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <H2 lines={["Nicolas", <span key="a">e <span className="text-berry">Allana.</span></span>]} />
        <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft" delay={0.1}>
          <p>Olá! Somos um casal de jovens empreendedores que decidiu transformar um sonho em sabor.</p>
          <p>
            Juntos, fundamos a Geliz com uma missão clara: espalhar momentos de felicidade congelada por onde passamos e,
            ao mesmo tempo, juntar cada centavo para realizar o maior sonho das nossas vidas, <strong className="font-semibold text-ink">nos casar.</strong>
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ROLES.map(([name, role, text], i) => (
            <Reveal key={name} delay={0.15 + i * 0.08} className="rounded-[24px] border hairline bg-paper p-6">
              <p className="font-display text-2xl font-bold tracking-[-0.03em]">{name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-berry">{role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="lg:col-span-6" delay={0.1}>
        <div className="relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-[32px] bg-berry-soft p-8 sm:p-10">
          <img
            src={P + "/img/mascote.webp"}
            alt=""
            loading="lazy"
            className="pointer-events-none absolute -right-6 top-0 h-[78%] w-auto object-contain sm:right-2"
          />
          <div className="relative max-w-sm">
            <p className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
              Cada geladinho, um sonho mais perto de se realizar.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              Com amor, Nicolas &amp; Allana
            </p>
          </div>
        </div>
      </Reveal>
    </div>

    <div className="mt-24 grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <Reveal delay={0.05}>
          <p className="font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
            Não vendemos apenas geladinhos. Vendemos experiência, afeto e <span className="text-berry">Gelicidade.</span>
          </p>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            Cada receita é testada e aprovada pela nossa chef, com ingredientes selecionados para criar explosões de
            sabor que refrescam o corpo e aquecem a alma. Do clássico leite condensado às edições especiais com frutas
            vermelhas, cada mordida é uma pausa feliz no seu dia.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-berry"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar com a gente
          </a>
        </Reveal>
      </div>

      <div className="lg:col-span-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map(([Icon, title, text], i) => (
            <Reveal key={title} delay={i * 0.06} className="rounded-[24px] border hairline p-6 transition-colors hover:bg-paper">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-berry-soft text-berry">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-xl font-bold leading-tight tracking-[-0.02em]">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </Section>
);
