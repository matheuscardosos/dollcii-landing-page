export const LogoMark = ({ className = "h-7 w-auto", color = "#E2314B" }) => (
  <svg viewBox="0 0 28 40" className={className} aria-hidden="true">
    <rect x="12" y="26" width="4" height="13" rx="2" fill="#111111" />
    <path d="M4 12C4 6.5 8.5 2 14 2s10 4.5 10 10v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill={color} />
    <circle cx="19.5" cy="8.5" r="2.2" fill="#fff" opacity=".7" />
  </svg>
);

export const Logo = ({ className = "", dark = false }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <LogoMark />
    <span className={`font-display text-2xl font-bold leading-none tracking-[-0.04em] ${dark ? "text-white" : "text-ink"}`}>dollcii</span>
  </span>
);
