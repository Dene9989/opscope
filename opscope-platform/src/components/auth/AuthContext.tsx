"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("opscope_token");
    if (!storedToken) {
      setLoading(false);
      router.push("/login");
      return;
    }

    setToken(storedToken);

    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Sessao invalida");
        return response.json();
      })
      .then((payload) => {
        setUser(payload.user);
      })
      .catch(() => {
        localStorage.removeItem("opscope_token");
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const logout = () => {
    localStorage.removeItem("opscope_token");
    router.push("/login");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      token
    }),
    [user, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
