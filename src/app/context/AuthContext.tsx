import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiLogin, apiRegister } from "../api";

export type UserRole = "admin" | "doctor" | "patient";

export interface AuthUser {
  id: string;       // user_id from MySQL (as string)
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY  = "meditrack_user";
const TOKEN_KEY = "meditrack_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from localStorage on first mount
  useEffect(() => {
    const savedUser  = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  /** Calls POST /api/auth/login and stores the returned user + token */
  const login = async (email: string, password: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await apiLogin(email, password);

    const authUser: AuthUser = {
      id:    String(data.user.id ?? data.user.user_id),
      name:  data.user.name,
      email: data.user.email,
      role:  (data.user.role as UserRole) ?? "patient",
    };

    setUser(authUser);
    setToken(data.token);
    localStorage.setItem(USER_KEY,  JSON.stringify(authUser));
    localStorage.setItem(TOKEN_KEY, data.token);
  };

  /** Clears both in-memory and persisted session */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
