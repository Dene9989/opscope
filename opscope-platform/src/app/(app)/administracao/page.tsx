"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { RolePermissionsEditor } from "@/modules/admin/roles/RolePermissionsEditor";

export default function AdministracaoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("Tecnico Junior de Manutencao");
  const [rolePermissions, setRolePermissions] = useState<string[]>([
    "verProjetos",
    "verSST",
    "verAlmoxarifado",
    "MAINT_CREATE",
    "MAINT_EDIT",
    "MAINT_COMPLETE"
  ]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const handleSave = async (next: string[]) => {
    setRolePermissions(next);
    setLastSavedAt(new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      <Header title="Administracao" subtitle="Configuracoes e permissao" />
      <div className="card p-6 text-sm text-muted">
        Gerencie cargos e permissoes operacionais. Use o editor abaixo para ajustar o perfil.
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div>
          <div className="text-sm font-semibold">Editar cargo</div>
          <div className="text-xs text-muted">
            {lastSavedAt ? `Ultima atualizacao: ${new Date(lastSavedAt).toLocaleString("pt-BR")}` : "Sem alteracoes recentes."}
          </div>
        </div>
        <button
          className="rounded-lg border border-border px-3 py-2 text-xs text-muted hover:bg-border"
          onClick={() => setModalOpen(true)}
        >
          Abrir editor
        </button>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-6xl rounded-2xl border border-border bg-background shadow-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <div className="text-lg font-semibold">Editar cargo</div>
                <div className="text-xs text-muted">Organize permissoes por modulo e nivel.</div>
              </div>
              <button className="text-xs text-muted hover:text-primary" onClick={() => setModalOpen(false)}>
                Fechar
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              <RolePermissionsEditor
                roleId="demo-role"
                roleName={roleName}
                onRoleNameChange={setRoleName}
                value={rolePermissions}
                onChange={setRolePermissions}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
