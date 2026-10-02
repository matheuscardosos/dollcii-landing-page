import { Star } from "lucide-react";
import { Eyebrow, H2, Reveal } from "./Reveal";

const QUOTES = [
  { name: "Marina A.", place: "Jardins", text: "O Morango & Leite tem gosto de morango de verdade, daqueles de feira. Virou o nosso programa de domingo." },
  { name: "Rafael T.", place: "Pinheiros", text: "Sou chato com pistache e esse é, sem exagero, o melhor que já provei fora da Itália." },
  { name: "Júlia M.", place: "Vila Madalena", text: "A caixa degustação foi o presente mais elogiado do aniversário. A embalagem é linda e o sabor, melhor ainda." },
];

export const Testimonials = () => (
  <section data-testid="testimonials-section" className="bg-paper py-24 lg:py-36">
    <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Quem prova, volta</Eyebrow>
          <H2 className="mt-5 max-w-3xl" lines={["4,9 estrelas", <span key="e" className="text-berry">de pura doçura.</span>]} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 text-berry">
            {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="text-sm text-ink-soft">+2.400 avaliações</p>
        </div>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <Reveal key={q.name} delay={i * 0.08} className="flex flex-col justify-between rounded-[28px] bg-white p-8" data-testid={`testimonial-${i + 1}`}>
            <p className="font-display text-2xl font-semibold leading-snug tracking-[-0.02em]">“{q.text}”</p>
            <div className="mt-10 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-berry-soft font-display font-bold text-berry">{q.name[0]}</span>
              <p className="text-sm"><span className="font-semibold">{q.name}</span> <span className="text-ink-soft">· {q.place}</span></p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
