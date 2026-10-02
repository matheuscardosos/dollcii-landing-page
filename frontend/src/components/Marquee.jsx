const WORDS = ["Fruta de verdade", "Leite fresco de fazenda", "Feito à mão todo dia", "Zero conservantes", "Zero corantes", "Pequenos lotes"];

const Dot = () => <span className="mx-6 h-2.5 w-2.5 shrink-0 rounded-full bg-berry lg:mx-10" aria-hidden="true" />;

const Row = () => (
  <div className="flex shrink-0 items-center">
    {WORDS.map((w, i) => (
      <span key={w} className="flex items-center">
        <span className={`whitespace-nowrap font-display text-3xl font-bold uppercase tracking-[-0.02em] sm:text-4xl lg:text-6xl ${i % 2 ? "text-outline" : "text-ink"}`}>{w}</span>
        <Dot />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="relative overflow-hidden border-y hairline bg-white py-7 lg:py-9" aria-label="Nossos princípios">
    <div className="flex w-max animate-marquee">
      <Row />
      <Row />
    </div>
  </section>
);
