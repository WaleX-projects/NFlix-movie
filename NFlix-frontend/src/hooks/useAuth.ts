import {
  createContext,
  createElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as authApi from "@/api/authApi";
import { TOKEN_KEY } from "@/api/axios";
import type { User } from "@/types/user";

const USER_KEY = "nflix_user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper to safely get item from localStorage
const getStorageItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch {
    return item; // Return as string if it's not JSON (like the token)
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStorageItem(USER_KEY));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  // Sync state if logged out from another tab/event
  useEffect(() => {
    const handler = () => {
      logout();
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const persist = useCallback((u: User, t: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, t);
    setUser(u);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      // NOTE: Ensure your API returns { user, access } or adjust these keys
      if (res.user && res.access) {
        persist(res.user, res.access);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so the UI can show an error message
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const res = await authApi.register(email, password, name);
      if (res.user && res.access) {
        persist(res.user, res.access);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, token, loading, login, register, logout } },
    children
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
