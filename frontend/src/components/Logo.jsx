const P = process.env.PUBLIC_URL;

export const Logo = ({ className = "" }) => (
  <img
    src={P + "/img/logo.webp"}
    alt="Geliz"
    className={`h-9 w-auto sm:h-10 ${className}`}
  />
);
