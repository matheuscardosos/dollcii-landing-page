import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "geliz-auth";

// Tudo aqui e simulado: nao existe servidor, a sessao vive no navegador.
const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
};

const nameFromEmail = (email) =>
  email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Cliente";

const blankProfile = (email, name, provider, role = "cliente") => ({
  name: name || nameFromEmail(email),
  email,
  provider,
  role,
  cpf: "",
  phone: "",
  address: { cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" },
  favorites: [],
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(load);

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  const login = useCallback((email, _password, name) => {
    const u = blankProfile(email.trim(), name, "email");
    setUser(u);
    return u;
  }, []);

  const loginWithGoogle = useCallback((account) => {
    const u = blankProfile(account.email, account.name, "google", account.role || "cliente");
    u.avatar = account.avatar || null;
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((patch) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setUser((u) => {
      if (!u) return u;
      const has = u.favorites.includes(id);
      return { ...u, favorites: has ? u.favorites.filter((f) => f !== id) : [...u.favorites, id] };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      signed: !!user,
      isAdmin: user?.role === "admin",
      login,
      loginWithGoogle,
      logout,
      updateProfile,
      favorites: user?.favorites || [],
      isFavorite: (id) => !!user?.favorites.includes(id),
      toggleFavorite,
    }),
    [user, login, loginWithGoogle, logout, updateProfile, toggleFavorite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
};
