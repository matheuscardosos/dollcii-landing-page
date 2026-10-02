import { forwardRef } from "react";
import { motion } from "framer-motion";

export const ease = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 28, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 1, ease, delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

const line = { hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease } } };

export const Lines = ({ lines, className = "", delay = 0, onLoad = false, testId }) => {
  const trigger = onLoad ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.12 } };
  return (
    <motion.h2
      data-testid={testId}
      className={`font-display font-bold ${className}`}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span className="block" variants={line}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
};

export const Eyebrow = ({ children, className = "" }) => (
  <p className={`flex items-start gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft ${className}`}>
    <span className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />
    {children}
  </p>
);

export const Section = forwardRef(({ children, className = "", ...rest }, ref) => (
  <section ref={ref} className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 ${className}`} {...rest}>
    {children}
  </section>
));

export const H2 = ({ lines, className = "" }) => (
  <Lines className={`text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-7xl ${className}`} lines={lines} />
);
