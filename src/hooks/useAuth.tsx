"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "@/lib/types";
import { hasToken, clearToken } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jiji_user");
    if (stored && hasToken()) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("jiji_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("jiji_user");
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    handleSetUser(null);
    window.location.href = "/login";
  }, [handleSetUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
