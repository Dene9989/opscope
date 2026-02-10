"use client";

import { useAuth } from "@/components/auth/AuthContext";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-semibold">{user?.name || "Usuario"}</div>
          <div className="text-xs text-muted">{user?.role || "-"}</div>
        </div>
        <button className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-border" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}
