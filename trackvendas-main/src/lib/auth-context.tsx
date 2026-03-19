import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "./types";
import { apiLogin } from "./api-service";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_USER = "authUser";
const STORAGE_KEY_TOKEN = "authToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res?.user && res?.token) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
      localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
