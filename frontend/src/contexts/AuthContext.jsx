import { createContext, useContext, useEffect, useState } from "react";
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

  const login = async (password) => {
    const res = await api.post("/auth/login", { password });
    localStorage.setItem("milagros_token", res.data.token);
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem("milagros_token");
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ authed, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
