"use client";

import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md card p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-lg border border-border px-3 py-2 text-xs" onClick={onCancel}>
            Cancelar
          </button>
          <button className="rounded-lg bg-danger px-3 py-2 text-xs" onClick={onConfirm}>
            {confirmLabel || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
