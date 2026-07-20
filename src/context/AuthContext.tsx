"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest, getAuthToken, setAuthToken } from "@/lib/api";

export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function getDefaultAuthenticatedPath(role: UserRole) {
  return "/dashboard";
}

export function getSafeRedirectPath(path: string | null, role: UserRole) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return getDefaultAuthenticatedPath(role);
  }

  if (path.startsWith("/admin")) {
    return role === "admin" ? path : "/dashboard";
  }

  return path;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAuthToken(null);
    setHasSession(false);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      clearSession();
      return null;
    }

    try {
      const response = await apiRequest<AuthUser>("/auth/me");
      const currentUser = response.data ?? null;

      if (!currentUser || currentUser.status !== "active") {
        clearSession();
        return null;
      }

      setHasSession(true);
      setUser(currentUser);
      return currentUser;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const currentUser = await refreshUser();
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email: email.trim(), password },
    });

    if (!response.data?.token || !response.data.user) {
      throw new Error("Login response was incomplete");
    }

    setAuthToken(response.data.token);
    setHasSession(true);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await apiRequest<LoginResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: { name: name.trim(), email: email.trim(), password },
    });

    if (!response.data?.token || !response.data.user) {
      throw new Error("Registration response was incomplete");
    }

    setAuthToken(response.data.token);
    setHasSession(true);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user && hasSession && user.status === "active"),
      login,
      register,
      logout,
      refreshUser,
    }),
    [hasSession, isLoading, login, logout, refreshUser, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
