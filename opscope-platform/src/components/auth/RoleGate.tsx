"use client";

import { useAuth } from "@/components/auth/AuthContext";
import type { Role } from "@/lib/types";

export function RoleGate({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="card p-6 text-sm text-muted">
        Acesso restrito. Perfil atual: {user.role}.
      </div>
    );
  }

  return <>{children}</>;
}
