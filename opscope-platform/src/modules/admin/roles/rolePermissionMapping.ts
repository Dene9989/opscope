import {
  ADMIN_PERMISSION_ALIASES,
  ADMIN_PERMISSION_KEY,
  PermissionItemDef,
  PERMISSION_ITEMS,
  getKnownPermissionKeys
} from "./permissionCatalog";

export type AccessLevel = "NONE" | "VIEW" | "EDIT";

export const ADMIN_KEYS = [ADMIN_PERMISSION_KEY, ...ADMIN_PERMISSION_ALIASES];

export function normalizeRoleKeys(keys: string[]) {
  const output = new Set<string>();
  (keys || []).forEach((key) => {
    const trimmed = String(key || "").trim();
    if (trimmed) {
      output.add(trimmed);
    }
  });
  return Array.from(output);
}

export function getAdminKey(keys: string[]) {
  const normalized = normalizeRoleKeys(keys);
  const alias = ADMIN_PERMISSION_ALIASES.find((key) => normalized.includes(key));
  return alias || ADMIN_PERMISSION_KEY;
}

export function hasAdminKey(keys: string[]) {
  const normalized = normalizeRoleKeys(keys);
  return ADMIN_KEYS.some((key) => normalized.includes(key));
}

export function getItemLevel(roleKeys: string[], item: PermissionItemDef): AccessLevel {
  const roleSet = new Set(normalizeRoleKeys(roleKeys));
  const hasEdit = item.editKeys.some((key) => roleSet.has(key));
  if (hasEdit) {
    return "EDIT";
  }
  const hasView = item.viewKeys.some((key) => roleSet.has(key));
  if (hasView) {
    return "VIEW";
  }
  return "NONE";
}

export function setItemLevel(
  roleKeys: string[],
  item: PermissionItemDef,
  level: AccessLevel
) {
  const next = new Set(normalizeRoleKeys(roleKeys));
  [...item.viewKeys, ...item.editKeys].forEach((key) => next.delete(key));
  if (level === "VIEW" || level === "EDIT") {
    item.viewKeys.forEach((key) => next.add(key));
  }
  if (level === "EDIT") {
    item.editKeys.forEach((key) => next.add(key));
  }
  return Array.from(next);
}

export function applyModuleLevel(
  roleKeys: string[],
  moduleName: string,
  level: AccessLevel,
  items: PermissionItemDef[] = PERMISSION_ITEMS
) {
  const next = new Set(normalizeRoleKeys(roleKeys));
  items
    .filter((item) => item.module === moduleName)
    .forEach((item) => {
      [...item.viewKeys, ...item.editKeys].forEach((key) => next.delete(key));
      if (level === "VIEW" || level === "EDIT") {
        item.viewKeys.forEach((key) => next.add(key));
      }
      if (level === "EDIT") {
        item.editKeys.forEach((key) => next.add(key));
      }
    });
  return Array.from(next);
}

export function diffRoleKeys(
  before: string[],
  after: string[],
  items: PermissionItemDef[] = PERMISSION_ITEMS
) {
  const beforeSet = new Set(normalizeRoleKeys(before));
  const afterSet = new Set(normalizeRoleKeys(after));
  const changedItems = items.filter((item) => {
    const beforeLevel = getItemLevel(before, item);
    const afterLevel = getItemLevel(after, item);
    return beforeLevel !== afterLevel;
  });
  const addedKeys = Array.from(afterSet).filter((key) => !beforeSet.has(key));
  const removedKeys = Array.from(beforeSet).filter((key) => !afterSet.has(key));
  return { changedItems, addedKeys, removedKeys };
}

export function getUnknownPermissionKeys(
  roleKeys: string[],
  items: PermissionItemDef[] = PERMISSION_ITEMS
) {
  const knownKeys = getKnownPermissionKeys(items);
  return normalizeRoleKeys(roleKeys).filter((key) => !knownKeys.has(key) && !ADMIN_KEYS.includes(key));
}

export function getAllCatalogKeys(items: PermissionItemDef[] = PERMISSION_ITEMS) {
  const keys = getKnownPermissionKeys(items);
  return Array.from(keys);
}

export function isEditSupported(item: PermissionItemDef) {
  return item.editKeys.length > 0;
}
