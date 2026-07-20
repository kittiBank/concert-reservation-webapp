"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import {
  clearAuth,
  getStoredUser,
  getToken,
  isAdmin,
  setAuth,
} from "@/lib/auth/storage";
import type { LoginInput, RegisterInput, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const data = await apiLogin(input);
    setAuth(data.accessToken, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const data = await apiRegister(input);
    setAuth(data.accessToken, data.user);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: isAdmin(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
