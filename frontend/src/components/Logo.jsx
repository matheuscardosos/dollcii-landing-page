const P = process.env.PUBLIC_URL;

export const LogoMark = ({ className = "h-7 w-auto", color = "#FC030F" }) => (
  <svg viewBox="0 0 28 40" className={className} aria-hidden="true">
    <rect x="12" y="26" width="4" height="13" rx="2" fill="#FCC303" />
    <path d="M4 12C4 6.5 8.5 2 14 2s10 4.5 10 10v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill={color} />
    <circle cx="19.5" cy="8.5" r="2.2" fill="#fff" opacity=".7" />
  </svg>
);

export const Logo = ({ className = "" }) => (
  <img
    src={P + "/img/logo.webp"}
    alt="Geliz"
    className={`h-9 w-auto sm:h-10 ${className}`}
  />
);
