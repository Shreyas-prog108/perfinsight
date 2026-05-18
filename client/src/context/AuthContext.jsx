import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "perfinsight_auth";

function readUser() {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY}_user`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [user, setUserState] = useState(readUser);

  const setToken = useCallback((t) => {
    setTokenState(t);
    if (t) sessionStorage.setItem(STORAGE_KEY, t);
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const setUser = useCallback((u) => {
    setUserState(u);
    if (u) sessionStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(u));
    else sessionStorage.removeItem(`${STORAGE_KEY}_user`);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(`${STORAGE_KEY}_user`);
    setTokenState("");
    setUserState(null);
  }, []);

  const value = useMemo(() => ({ token, setToken, user, setUser, logout }), [token, user, setToken, setUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
