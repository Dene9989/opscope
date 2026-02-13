"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ADMIN_PERMISSION_KEY,
  PERMISSION_CATALOG,
  CatalogModule,
  PermissionDef,
  buildCatalogModules,
  getAllPermissionKeys,
  getPermissionSearchText,
  getReadPermissionKeys
} from "./permissionCatalog";

type RolePermissionsEditorProps = {
  roleId?: string;
  roleName: string;
  onRoleNameChange?: (value: string) => void;
  value: string[];
  onChange: (value: string[]) => void;
  onSave?: (value: string[]) => Promise<void> | void;
  onCancel?: () => void;
};

const normalizeSelection = (list: string[]) => Array.from(new Set(list.filter(Boolean)));

const levelBadgeStyles: Record<string, string> = {
  READ: "border border-border text-muted",
  WRITE: "border border-primary/40 text-primary",
  ADMIN: "border border-warning/60 text-warning"
};

function TogglePill({
  active,
  label,
  onClick,
  disabled
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-full border px-3 py-1 text-xs transition",
        active ? "border-primary text-primary" : "border-border text-muted",
        disabled && "opacity-50"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
        checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={clsx(
          "relative inline-flex h-4 w-8 items-center rounded-full transition",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={clsx(
            "inline-block h-3 w-3 translate-x-1 rounded-full bg-white transition",
            checked && "translate-x-4"
          )}
        />
      </span>
      {label}
    </button>
  );
}

export function RolePermissionsEditor({
  roleId,
  roleName,
  onRoleNameChange,
  value,
  onChange,
  onSave,
  onCancel
}: RolePermissionsEditorProps) {
  const visibleCatalog = useMemo(
    () => PERMISSION_CATALOG.filter((permission) => !permission.hidden),
    []
  );
  const modules = useMemo(() => buildCatalogModules(visibleCatalog), [visibleCatalog]);
  const [activeModule, setActiveModule] = useState(modules[0]?.name || "");
  const [query, setQuery] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [adminSnapshot, setAdminSnapshot] = useState<string[] | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItems, setConfirmItems] = useState<PermissionDef[]>([]);
  const pendingSaveRef = useRef<string[] | null>(null);
  const baselineRef = useRef<string[]>(normalizeSelection(value));
  const dirtyRef = useRef(false);
  const lastRoleIdRef = useRef<string | undefined>(roleId);

  useEffect(() => {
    if (roleId !== lastRoleIdRef.current) {
      lastRoleIdRef.current = roleId;
      dirtyRef.current = false;
    }
    if (!dirtyRef.current) {
      baselineRef.current = normalizeSelection(value);
    }
  }, [roleId, value]);

  const selectedSet = useMemo(() => new Set(normalizeSelection(value)), [value]);
  const adminEnabled = selectedSet.has(ADMIN_PERMISSION_KEY);
  const allKeys = useMemo(
    () => getAllPermissionKeys(PERMISSION_CATALOG, { includeAdmin: true, includeHidden: false }),
    []
  );
  const effectiveSelected = useMemo(() => {
    if (!adminEnabled) {
      return selectedSet;
    }
    return new Set(allKeys);
  }, [adminEnabled, allKeys, selectedSet]);
  const isLocked = adminEnabled;

  useEffect(() => {
    if (adminEnabled) {
      const missing = allKeys.some((key) => !selectedSet.has(key));
      if (missing) {
        onChange(allKeys);
      }
    }
  }, [adminEnabled, allKeys, onChange, selectedSet]);

  useEffect(() => {
    if (!modules.find((module) => module.name === activeModule)) {
      setActiveModule(modules[0]?.name || "");
    }
  }, [activeModule, modules]);

  const searchValue = query.trim().toLowerCase();

  const markDirty = () => {
    dirtyRef.current = true;
  };

  const applySelection = (keys: string[]) => {
    markDirty();
    onChange(normalizeSelection(keys));
  };

  const togglePermission = (key: string) => {
    if (isLocked) {
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    applySelection(Array.from(next));
  };

  const setSelection = (keys: string[]) => {
    if (isLocked) {
      return;
    }
    applySelection(keys);
  };

  const handleAdminToggle = (enabled: boolean) => {
    if (enabled) {
      setAdminSnapshot(normalizeSelection(value));
      applySelection(allKeys);
    } else {
      const restore = adminSnapshot || value.filter((key) => key !== ADMIN_PERMISSION_KEY);
      const cleaned = restore.filter((key) => key !== ADMIN_PERMISSION_KEY);
      setAdminSnapshot(null);
      applySelection(cleaned);
    }
  };

  const applySelectAll = () => {
    setSelection(allKeys.filter((key) => key !== ADMIN_PERMISSION_KEY));
  };

  const applyClearAll = () => {
    setSelection([]);
  };

  const applyReadOnly = () => {
    const readKeys = getReadPermissionKeys(PERMISSION_CATALOG);
    setSelection(readKeys);
  };

  const applyModuleAll = (moduleName: string) => {
    if (isLocked) {
      return;
    }
    const modulePermissions =
      modules.find((module) => module.name === moduleName)?.permissions || [];
    const keys = modulePermissions.map((permission) => permission.key);
    const next = new Set(selectedSet);
    const allSelected = keys.every((key) => effectiveSelected.has(key));
    if (allSelected) {
      keys.forEach((key) => next.delete(key));
    } else {
      keys.forEach((key) => next.add(key));
    }
    applySelection(Array.from(next));
  };

  const applyModuleReadOnly = (moduleName: string) => {
    if (isLocked) {
      return;
    }
    const readKeys = getReadPermissionKeys(PERMISSION_CATALOG, moduleName);
    const modulePermissions =
      modules.find((module) => module.name === moduleName)?.permissions || [];
    const moduleKeys = modulePermissions.map((permission) => permission.key);
    const next = new Set(selectedSet);
    moduleKeys.forEach((key) => next.delete(key));
    readKeys.forEach((key) => next.add(key));
    applySelection(Array.from(next));
  };

  const filteredPermissions = (permissions: PermissionDef[]) =>
    permissions.filter((permission) => {
      if (permission.hidden) {
        return false;
      }
      if (searchValue && !getPermissionSearchText(permission).includes(searchValue)) {
        return false;
      }
      if (onlySelected && !effectiveSelected.has(permission.key)) {
        return false;
      }
      if (onlyCritical && !permission.dangerous) {
        return false;
      }
      return true;
    });

  const handleSave = async () => {
    const current = normalizeSelection(value);
    const baseline = new Set(baselineRef.current);
    const changedCount = new Set(
      [...baseline, ...current].filter((key) => baseline.has(key) !== current.includes(key))
    ).size;
    const newlyDangerous = visibleCatalog.filter(
      (permission) => permission.dangerous && current.includes(permission.key) && !baseline.has(permission.key)
    );

    if (newlyDangerous.length) {
      pendingSaveRef.current = current;
      setConfirmItems(newlyDangerous);
      setConfirmOpen(true);
      return;
    }

    await commitSave(current, changedCount);
  };

  const commitSave = async (current: string[], changedCount: number) => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(current);
      }
      baselineRef.current = current;
      dirtyRef.current = false;
      setSaveMessage(`Voce alterou ${changedCount} permiss${changedCount === 1 ? "ao" : "oes"}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingSaveRef.current) {
      return;
    }
    const current = pendingSaveRef.current;
    pendingSaveRef.current = null;
    const baseline = new Set(baselineRef.current);
    const changedCount = new Set(
      [...baseline, ...current].filter((key) => baseline.has(key) !== current.includes(key))
    ).size;
    await commitSave(current, changedCount);
  };

  const selectedCount = Array.from(effectiveSelected).filter(
    (key) => key !== ADMIN_PERMISSION_KEY
  ).length;
  const totalCount = visibleCatalog.filter((permission) => !permission.hidden).length;

  const renderModuleContent = (module: CatalogModule, showTitle: boolean) => {
    const total = module.permissions.length;
    const selected = module.permissions.filter((permission) =>
      effectiveSelected.has(permission.key)
    ).length;
    const moduleRead = getReadPermissionKeys(PERMISSION_CATALOG, module.name);
    const moduleAllSelected = module.permissions.every((permission) =>
      effectiveSelected.has(permission.key)
    );

    return (
      <>
        <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              {showTitle ? module.name : "Permissoes do modulo"}
            </div>
            <div className="text-lg font-semibold">
              {selected}/{total} permissoes
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Switch
              checked={moduleAllSelected}
              onChange={() => applyModuleAll(module.name)}
              label="Habilitar tudo"
              disabled={isLocked}
            />
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
              onClick={() => applyModuleReadOnly(module.name)}
              disabled={isLocked || moduleRead.length === 0}
            >
              Somente leitura do modulo
            </button>
          </div>
        </div>

        <div className={clsx("mt-4 space-y-4", isLocked && "pointer-events-none opacity-60")}>
          {Object.entries(module.groups).map(([groupName, items]) => {
            const filtered = filteredPermissions(items);
            if (!filtered.length) {
              return null;
            }
            const groupSelected = filtered.filter((permission) =>
              effectiveSelected.has(permission.key)
            ).length;
            return (
              <details
                key={groupName}
                open
                className="rounded-xl border border-border bg-surface/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
                  <span>{groupName}</span>
                  <span className="text-xs text-muted">
                    {groupSelected}/{filtered.length}
                  </span>
                </summary>
                <div className="grid gap-2 px-4 pb-4">
                  {filtered.map((permission) => {
                    const checked = effectiveSelected.has(permission.key);
                    return (
                      <label
                        key={permission.key}
                        className={clsx(
                          "flex cursor-pointer gap-3 rounded-lg border border-border p-3 transition",
                          checked ? "bg-primary/10" : "bg-transparent"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-primary"
                          checked={checked}
                          onChange={() => togglePermission(permission.key)}
                          disabled={isLocked}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                            <span>{permission.label}</span>
                            <span
                              className={clsx(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                levelBadgeStyles[permission.level]
                              )}
                            >
                              {permission.level}
                            </span>
                            {permission.dangerous ? (
                              <span className="rounded-full border border-danger/60 px-2 py-0.5 text-[10px] font-semibold text-danger">
                                {"\u26A0\uFE0F"} Critica
                              </span>
                            ) : null}
                            {permission.legacy ? (
                              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                                Legado
                              </span>
                            ) : null}
                          </div>
                          {permission.description ? (
                            <p className="text-xs text-muted">{permission.description}</p>
                          ) : null}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </details>
            );
          })}
          {!filteredPermissions(module.permissions).length ? (
            <div className="rounded-lg border border-border bg-surface/60 px-4 py-6 text-center text-sm text-muted">
              Nenhuma permissao encontrada com os filtros atuais.
            </div>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">Permissoes do cargo</div>
          <h2 className="text-lg font-semibold">Editar cargo</h2>
          <p className="text-sm text-muted">
            Controle o que cada perfil pode ver e executar dentro da OPSCOPE.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {selectedCount} selecionadas
          </span>
          <Switch checked={adminEnabled} onChange={handleAdminToggle} label="Admin total" />
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        <div className="space-y-2">
          <label className="text-xs text-muted">Nome do cargo</label>
          <input
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
            value={roleName}
            onChange={(event) => onRoleNameChange?.(event.target.value)}
            placeholder="Nome do cargo"
          />
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <div className="text-sm font-semibold">Filtros rapidos</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <TogglePill
              active={onlySelected}
              label="Mostrar so selecionadas"
              onClick={() => setOnlySelected(!onlySelected)}
            />
            <TogglePill
              active={onlyCritical}
              label="Mostrar so criticas (\u26A0\uFE0F)"
              onClick={() => setOnlyCritical(!onlyCritical)}
            />
          </div>
          <div className="mt-3 space-y-2">
            <input
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
              placeholder="Buscar permissao..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                onClick={applySelectAll}
                disabled={isLocked}
              >
                Selecionar tudo
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                onClick={applyClearAll}
                disabled={isLocked}
              >
                Limpar
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                onClick={applyReadOnly}
                disabled={isLocked}
              >
                Somente leitura
              </button>
            </div>
          </div>
        </div>
        {adminEnabled ? (
          <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-warning">
            Admin total ativo. Permissoes granulares ficam em modo leitura.
          </div>
        ) : null}
        {modules.map((module) => {
          const total = module.permissions.length;
          const selected = module.permissions.filter((permission) =>
            effectiveSelected.has(permission.key)
          ).length;
          return (
            <details
              key={module.name}
              open={module.name === activeModule}
              className="rounded-2xl border border-border bg-card/70"
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold"
                onClick={() => setActiveModule(module.name)}
              >
                <span>{module.name}</span>
                <span className="text-xs text-muted">
                  {selected}/{total}
                </span>
              </summary>
              <div className="px-4 pb-4">{renderModuleContent(module, false)}</div>
            </details>
          );
        })}
      </div>

      <div className="hidden lg:grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted">Nome do cargo</label>
            <input
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
              value={roleName}
              onChange={(event) => onRoleNameChange?.(event.target.value)}
              placeholder="Nome do cargo"
            />
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-sm font-semibold">Modulos</div>
            <div className="mt-3 space-y-1">
              {modules.map((module) => {
                const total = module.permissions.length;
                const selected = module.permissions.filter((permission) =>
                  effectiveSelected.has(permission.key)
                ).length;
                return (
                  <button
                    key={module.name}
                    type="button"
                    onClick={() => setActiveModule(module.name)}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                      activeModule === module.name
                        ? "bg-primary/15 text-primary"
                        : "text-muted hover:bg-border/50"
                    )}
                  >
                    <span>{module.name}</span>
                    <span className="text-xs">
                      {selected}/{total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-sm font-semibold">Filtros rapidos</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <TogglePill
                active={onlySelected}
                label="Mostrar so selecionadas"
                onClick={() => setOnlySelected(!onlySelected)}
              />
            <TogglePill
              active={onlyCritical}
              label="Mostrar so criticas (\u26A0\uFE0F)"
              onClick={() => setOnlyCritical(!onlyCritical)}
            />
            </div>
            <div className="mt-3 space-y-2">
              <input
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
                placeholder="Buscar permissao..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                  onClick={applySelectAll}
                  disabled={isLocked}
                >
                  Selecionar tudo
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                  onClick={applyClearAll}
                  disabled={isLocked}
                >
                  Limpar
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1 text-xs text-muted"
                  onClick={applyReadOnly}
                  disabled={isLocked}
                >
                  Somente leitura
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {adminEnabled ? (
            <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-warning">
              Admin total ativo. Permissoes granulares ficam em modo leitura.
            </div>
          ) : null}
          {modules
            .filter((module) => module.name === activeModule)
            .map((module) => (
              <div key={module.name} className="rounded-2xl border border-border bg-card/70 p-5">
                {renderModuleContent(module, true)}
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="space-y-1 text-xs text-muted">
          <div>
            Total: {selectedCount}/{totalCount} permissoes selecionadas.
          </div>
          {saveMessage ? <div className="text-primary">{saveMessage}</div> : null}
        </div>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-xs text-muted"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="button"
            className={clsx(
              "rounded-lg px-4 py-2 text-xs font-semibold",
              saving ? "bg-border text-muted" : "bg-primary text-background"
            )}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Permissoes criticas habilitadas"
        description={`Voce habilitou ${confirmItems.length} permiss${confirmItems.length === 1 ? "ao critica" : "oes criticas"}: ${confirmItems
          .map((permission) => permission.label)
          .join(", ")}.`}
        confirmLabel="Confirmar e salvar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
