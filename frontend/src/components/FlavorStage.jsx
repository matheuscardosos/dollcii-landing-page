import { useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ease } from "./Reveal";

const Piece = ({ p, sx, sy, i }) => {
  const x = useTransform(sx, (v) => v * p.depth * 28);
  const y = useTransform(sy, (v) => v * p.depth * 28);
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, x, y, zIndex: p.depth > 1 ? 3 : 1 }}
      initial={{ opacity: 0, scale: 0.4, rotate: p.rot - 30 }}
      animate={{ opacity: 1, scale: 1, rotate: p.rot }}
      exit={{ opacity: 0, scale: 0.5, rotate: p.rot + 30 }}
      transition={{ duration: 0.9, ease, delay: 0.12 + i * 0.08 }}
    >
      <img src={p.src} alt="" decoding="async" className="fruit-shadow animate-float w-full" style={{ animationDelay: `${p.delay}s`, animationDuration: `${5 + p.depth * 1.5}s` }} draggable={false} />
    </motion.div>
  );
};

export const FlavorStage = ({ flavor, className = "", pieces = true }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.6 });
  const popX = useTransform(sx, (v) => v * 10);
  const popY = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <div className={`relative ${className}`} data-testid="flavor-stage">
      <motion.div
        className="absolute left-1/2 top-1/2 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ backgroundColor: flavor.tint }}
        transition={{ duration: 0.9 }}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={flavor.id}
          className="absolute inset-0 z-[2] flex items-center justify-center"
          initial={{ opacity: 0, y: 90, rotate: -16, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, rotate: -7, scale: 1 }}
          exit={{ opacity: 0, y: -90, rotate: 6, scale: 0.9 }}
          transition={{ duration: 1, ease }}
        >
          <motion.img
            src={flavor.pop}
            alt={flavor.full}
            className="pop-shadow h-[92%] w-auto select-none object-contain"
            style={{ x: popX, y: popY }}
            draggable={false}
            fetchPriority="high"
            decoding="async"
            data-testid="hero-popsicle-image"
          />
        </motion.div>
      </AnimatePresence>
      {pieces && (
        <AnimatePresence mode="popLayout" initial={false}>
          {flavor.pieces.map((p, i) => (
            <Piece key={`${flavor.id}-${i}`} p={p} sx={sx} sy={sy} i={i} />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
