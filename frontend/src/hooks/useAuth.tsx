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
  switchActiveSession,
  type PortalRole,
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
  switchPortal: (portal: PortalRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserFromStorage = useCallback(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    setUser(token && storedUser ? storedUser : null);
  }, []);

  useEffect(() => {
    syncUserFromStorage();
    setIsLoading(false);
  }, [syncUserFromStorage]);

  useEffect(() => {
    const handleSessionExpired = () => {
      syncUserFromStorage();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [syncUserFromStorage]);

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

  const switchPortal = useCallback((portal: PortalRole) => {
    const nextUser = switchActiveSession(portal);
    if (!nextUser) return false;

    setUser(nextUser);
    return true;
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
      switchPortal,
    }),
    [user, isLoading, login, register, logout, switchPortal],
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
