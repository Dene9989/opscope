"use client";

import { RolePermissionsMatrix } from "./RolePermissionsMatrix";

type RolePermissionsEditorProps = {
  roleId?: string;
  roleName: string;
  onRoleNameChange?: (value: string) => void;
  value: string[];
  onChange: (value: string[]) => void;
  onSave?: (value: string[]) => Promise<void> | void;
  onCancel?: () => void;
};

export function RolePermissionsEditor(props: RolePermissionsEditorProps) {
  return <RolePermissionsMatrix {...props} />;
}
