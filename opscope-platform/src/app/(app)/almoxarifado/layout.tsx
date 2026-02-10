"use client";

import { RoleGate } from "@/components/auth/RoleGate";

export default function AlmoxarifadoLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR", "COLABORADOR"]}>{children}</RoleGate>;
}
