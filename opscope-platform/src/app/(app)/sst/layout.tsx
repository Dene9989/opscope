"use client";

import { RoleGate } from "@/components/auth/RoleGate";

export default function SstLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate roles={["ADMIN", "GESTOR", "TECNICO_SST", "SUPERVISOR"]}>{children}</RoleGate>;
}
