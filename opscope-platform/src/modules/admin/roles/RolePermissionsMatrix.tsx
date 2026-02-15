"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/AlertDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import {
  PERMISSION_ITEMS,
  PermissionItemDef,
  buildPermissionModules,
  getPermissionSearchText
} from "./permissionCatalog";
import {
  AccessLevel,
  ADMIN_KEYS,
  applyModuleLevel,
  diffRoleKeys,
  getAdminKey,
  getAllCatalogKeys,
  getItemLevel,
  getUnknownPermissionKeys,
  hasAdminKey,
  isEditSupported,
  normalizeRoleKeys,
  setItemLevel
} from "./rolePermissionMapping";

const LEVEL_LABELS: Record<AccessLevel, string> = {
  NONE: "Sem acesso",
  VIEW: "Visualizar",
  EDIT: "Editar"
};

type RolePermissionsMatrixProps = {
  roleId?: string;
  roleName: string;
  onRoleNameChange?: (value: string) => void;
  value: string[];
  onChange: (value: string[]) => void;
  onSave?: (value: string[]) => Promise<void> | void;
  onCancel?: () => void;
};

type PendingAction = {
  items: PermissionItemDef[];
  apply: () => void;
};

export function RolePermissionsMatrix({
  roleId,
  roleName,
  onRoleNameChange,
  value,
  onChange,
  onSave,
  onCancel
}: RolePermissionsMatrixProps) {
  const modules = useMemo(() => buildPermissionModules(PERMISSION_ITEMS), []);
  const [activeModule, setActiveModule] = useState(modules[0]?.name || "");
  const [query, setQuery] = useState("");
  const [onlyConfigured, setOnlyConfigured] = useState(false);
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItems, setConfirmItems] = useState<PermissionItemDef[]>([]);
  const pendingActionRef = useRef<PendingAction | null>(null);
  const adminSnapshotRef = useRef<string[] | null>(null);
  const baselineRef = useRef<string[]>(normalizeRoleKeys(value));
  const lastRoleIdRef = useRef<string | undefined>(roleId);

  const normalized = useMemo(() => normalizeRoleKeys(value), [value]);
  const adminEnabled = hasAdminKey(normalized);
  const adminKey = getAdminKey(normalized);
  const unknownKeys = useMemo(() => getUnknownPermissionKeys(normalized), [normalized]);
  const allCatalogKeys = useMemo(() => getAllCatalogKeys(PERMISSION_ITEMS), []);

  useEffect(() => {
    if (roleId !== lastRoleIdRef.current) {
      lastRoleIdRef.current = roleId;
      baselineRef.current = normalizeRoleKeys(value);
    }
  }, [roleId, value]);

  useEffect(() => {
    if (!adminEnabled) {
      return;
    }
    const expected = normalizeRoleKeys([...unknownKeys, adminKey, ...allCatalogKeys]);
    const missing = expected.some((key) => !normalized.includes(key));
    if (missing) {
      onChange(expected);
    }
  }, [adminEnabled, adminKey, allCatalogKeys, normalized, onChange, unknownKeys]);

  useEffect(() => {
    if (!modules.find((module) => module.name === activeModule)) {
      setActiveModule(modules[0]?.name || "");
    }
  }, [activeModule, modules]);

  const effectiveRoleKeys = useMemo(() => {
    if (!adminEnabled) {
      return normalized;
    }
    return normalizeRoleKeys([...normalized, ...allCatalogKeys]);
  }, [adminEnabled, allCatalogKeys, normalized]);

  const isLocked = adminEnabled;

  const applyRoleKeys = (keys: string[]) => {
    onChange(normalizeRoleKeys(keys));
  };

  const requestCriticalConfirm = (items: PermissionItemDef[], apply: () => void) => {
    if (!items.length) {
      apply();
      return;
    }
    pendingActionRef.current = { items, apply };
    setConfirmItems(items);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    const pending = pendingActionRef.current;
    pendingActionRef.current = null;
    if (pending) {
      pending.apply();
    }
  };

  const getCriticalItemsForLevel = (items: PermissionItemDef[], level: AccessLevel) =>
    items.filter((item) => {
      if (!item.dangerous) {
        return false;
      }
      const requiresLevel = isEditSupported(item) ? "EDIT" : "VIEW";
      if (level !== requiresLevel) {
        return false;
      }
      const currentLevel = getItemLevel(effectiveRoleKeys, item);
      return currentLevel !== requiresLevel;
    });

  const updateItemLevel = (itemKey: string, level: AccessLevel) => {
    if (isLocked) {
      return;
    }
    const item = PERMISSION_ITEMS.find((entry) => entry.key === itemKey);
    if (!item) {
      return;
    }
    const apply = () => {
      const next = setItemLevel(normalized, item, level);
      applyRoleKeys(next);
    };
    const criticalItems = getCriticalItemsForLevel([item], level);
    requestCriticalConfirm(criticalItems, apply);
  };

  const applyModuleLevelSelection = (moduleName: string, level: AccessLevel) => {
    if (isLocked) {
      return;
    }
    const moduleItems = PERMISSION_ITEMS.filter((item) => item.module === moduleName);
    const apply = () => {
      const next = applyModuleLevel(normalized, moduleName, level, PERMISSION_ITEMS);
      applyRoleKeys(next);
    };
    const criticalItems = getCriticalItemsForLevel(moduleItems, level);
    requestCriticalConfirm(criticalItems, apply);
  };

  const applyGlobalLevel = (level: AccessLevel) => {
    if (isLocked) {
      return;
    }
    const apply = () => {
      let next = normalized;
      PERMISSION_ITEMS.forEach((item) => {
        next = setItemLevel(next, item, level);
      });
      applyRoleKeys(next);
    };
    const criticalItems = getCriticalItemsForLevel(PERMISSION_ITEMS, level);
    requestCriticalConfirm(criticalItems, apply);
  };

  const handleAdminToggle = (enabled: boolean) => {
    if (enabled) {
      adminSnapshotRef.current = normalized.filter((key) => !ADMIN_KEYS.includes(key));
      const next = normalizeRoleKeys([
        ...unknownKeys,
        adminKey,
        ...allCatalogKeys
      ]);
      applyRoleKeys(next);
      return;
    }
    const restore = adminSnapshotRef.current || normalized.filter((key) => !ADMIN_KEYS.includes(key));
    adminSnapshotRef.current = null;
    applyRoleKeys(normalizeRoleKeys(restore));
  };

  const searchValue = query.trim().toLowerCase();

  const filteredModuleItems = useMemo(() => {
    const module = modules.find((entry) => entry.name === activeModule);
    if (!module) {
      return [];
    }
    return module.items.filter((item) => {
      if (searchValue && !getPermissionSearchText(item).includes(searchValue)) {
        return false;
      }
      const level = getItemLevel(effectiveRoleKeys, item);
      if (onlyConfigured && level === "NONE") {
        return false;
      }
      if (onlyCritical && !item.dangerous) {
        return false;
      }
      return true;
    });
  }, [activeModule, effectiveRoleKeys, modules, onlyConfigured, onlyCritical, searchValue]);

  const activeModuleLevel = useMemo(() => {
    const module = modules.find((entry) => entry.name === activeModule);
    if (!module || !module.items.length) {
      return undefined;
    }
    const levels = new Set(module.items.map((item) => getItemLevel(effectiveRoleKeys, item)));
    if (levels.size === 1) {
      return Array.from(levels)[0];
    }
    return undefined;
  }, [activeModule, effectiveRoleKeys, modules]);

  const modulesWithStats = useMemo(
    () =>
      modules.map((module) => {
        const viewCount = module.items.filter((item) => getItemLevel(effectiveRoleKeys, item) !== "NONE").length;
        const editCount = module.items.filter((item) => getItemLevel(effectiveRoleKeys, item) === "EDIT").length;
        return { ...module, viewCount, editCount, total: module.items.length };
      }),
    [effectiveRoleKeys, modules]
  );

  const configuredCount = useMemo(
    () => PERMISSION_ITEMS.filter((item) => getItemLevel(effectiveRoleKeys, item) !== "NONE").length,
    [effectiveRoleKeys]
  );

  const diffSummary = useMemo(
    () => diffRoleKeys(baselineRef.current, normalized, PERMISSION_ITEMS),
    [normalized]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(normalized);
      }
      baselineRef.current = normalized;
      setSaveMessage(`Voce alterou ${diffSummary.changedItems.length} itens.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">Permissoes do cargo</div>
          <h2 className="text-lg font-semibold">Matriz por item</h2>
          <p className="text-sm text-muted">Controle de acesso com niveis NONE, VIEW ou EDIT por item.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {configuredCount} itens configurados
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Admin total</span>
            <Switch checked={adminEnabled} onCheckedChange={handleAdminToggle} />
          </div>
        </div>
      </div>

      {adminEnabled ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-warning">
          Admin total ativo. Permissoes granulares ficam bloqueadas.
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card/70 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="min-w-[220px] flex-1">
              <Input
                placeholder="Buscar por nome, descricao ou chave..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <Switch checked={onlyConfigured} onCheckedChange={setOnlyConfigured} />
                <span>Mostrar apenas configuradas</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={onlyCritical} onCheckedChange={setOnlyCritical} />
                <span>Mostrar apenas criticas</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted"
              onClick={() => applyGlobalLevel("NONE")}
              disabled={isLocked}
            >
              Tudo NONE
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted"
              onClick={() => applyGlobalLevel("VIEW")}
              disabled={isLocked}
            >
              Tudo VIEW
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted"
              onClick={() => applyGlobalLevel("EDIT")}
              disabled={isLocked}
            >
              Tudo EDIT
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>Legenda:</span>
          <Badge variant="outline">NONE</Badge>
          <Badge variant="outline">VIEW</Badge>
          <Badge variant="outline">EDIT</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr]">
        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <div className="space-y-2">
            <label className="text-xs text-muted">Nome do cargo</label>
            <Input
              placeholder="Nome do cargo"
              value={roleName}
              onChange={(event) => onRoleNameChange?.(event.target.value)}
            />
          </div>
          <div className="text-sm font-semibold mt-4">Modulos</div>
          <ScrollArea className="mt-3 max-h-[60vh] pr-2">
            <div className="space-y-1">
              {modulesWithStats.map((module) => (
                <button
                  key={module.name}
                  type="button"
                  onClick={() => setActiveModule(module.name)}
                  className={clsx(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                    activeModule === module.name
                      ? "bg-primary/15 text-primary"
                      : "text-muted hover:bg-border/50"
                  )}
                >
                  <span>{module.name}</span>
                  <span className="text-[11px] text-muted">
                    {module.viewCount}/{module.total} VIEW · {module.editCount}/{module.total} EDIT
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Modulo</div>
                <div className="text-lg font-semibold">{activeModule}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">Modulo todo:</span>
                <RadioGroup
                  value={activeModuleLevel}
                  onValueChange={(value) => applyModuleLevelSelection(activeModule, value as AccessLevel)}
                  className="inline-flex rounded-lg border border-border p-1"
                  disabled={isLocked}
                >
                  <RadioGroupItem
                    value="NONE"
                    className="rounded-md px-3 py-1"
                    disabled={isLocked}
                  >
                    NONE
                  </RadioGroupItem>
                  <RadioGroupItem
                    value="VIEW"
                    className="rounded-md px-3 py-1"
                    disabled={isLocked}
                  >
                    VIEW
                  </RadioGroupItem>
                  <RadioGroupItem
                    value="EDIT"
                    className="rounded-md px-3 py-1"
                    disabled={isLocked}
                  >
                    EDIT
                  </RadioGroupItem>
                </RadioGroup>
              </div>
            </div>

            <ScrollArea className="mt-4 max-h-[55vh] pr-2">
              <div className="space-y-3">
                {filteredModuleItems.length ? (
                  filteredModuleItems.map((item) => {
                    const level = getItemLevel(effectiveRoleKeys, item);
                    const editSupported = isEditSupported(item);
                    return (
                      <div
                        key={item.key}
                        className="rounded-xl border border-border bg-background/40 p-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                              <span>{item.label}</span>
                              {item.dangerous ? (
                                <Tooltip content="Permissao critica. Exige confirmacao ao habilitar editar.">
                                  <Badge variant="danger">CRITICO</Badge>
                                </Tooltip>
                              ) : null}
                            </div>
                            {item.description ? (
                              <p className="mt-1 text-xs text-muted">{item.description}</p>
                            ) : null}
                          </div>
                          <RadioGroup
                            value={level}
                            onValueChange={(value) => updateItemLevel(item.key, value as AccessLevel)}
                            className="inline-flex rounded-lg border border-border p-1"
                          >
                            {(["NONE", "VIEW", "EDIT"] as AccessLevel[]).map((option) => (
                              <RadioGroupItem
                                key={option}
                                value={option}
                                className="rounded-md px-3 py-1"
                                disabled={isLocked || (option === "EDIT" && !editSupported)}
                              >
                                {LEVEL_LABELS[option]}
                              </RadioGroupItem>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-border bg-background/40 px-4 py-6 text-center text-sm text-muted">
                    Nenhum item encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {unknownKeys.length ? (
            <div className="rounded-2xl border border-warning/40 bg-warning/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning">
                <Badge variant="warning">Aviso</Badge>
                Outras permissoes (mantidas automaticamente)
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {unknownKeys.map((key) => (
                  <Badge key={key} variant="outline">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 text-xs text-muted">
          <div>Voce alterou {diffSummary.changedItems.length} itens.</div>
          {diffSummary.changedItems.length ? (
            <details className="text-xs">
              <summary className="cursor-pointer text-primary">Ver alteracoes</summary>
              <div className="mt-2 space-y-1">
                {diffSummary.changedItems.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <Badge variant="outline">{getItemLevel(normalized, item)}</Badge>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
          {saveMessage ? <div className="text-primary">{saveMessage}</div> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permissoes criticas</AlertDialogTitle>
            <AlertDialogDescription>
              Voce esta prestes a liberar EDIT para {confirmItems.length} item
              {confirmItems.length === 1 ? "" : "s"} critico{confirmItems.length === 1 ? "" : "s"}:
              {" "}
              {confirmItems.map((item) => item.label).join(", ")}. Confirma essa alteracao?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
