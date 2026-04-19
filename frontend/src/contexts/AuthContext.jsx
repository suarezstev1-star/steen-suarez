import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(!!localStorage.getItem("milagros_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("milagros_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/verify")
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem("milagros_token");
        setAuthed(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (password) => {
    const res = await api.post("/auth/login", { password });
    localStorage.setItem("milagros_token", res.data.token);
    setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("milagros_token");
    setAuthed(false);
  }, []);

  const value = useMemo(
    () => ({ authed, loading, login, logout }),
    [authed, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
