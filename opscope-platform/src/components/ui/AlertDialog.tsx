"use client";

import * as React from "react";
import clsx from "clsx";

type AlertDialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

export function AlertDialog({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx?.open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className={clsx(
          "w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-card",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex flex-wrap justify-end gap-2">{children}</div>;
}

export function AlertDialogCancel({
  className,
  onClick,
  children
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={clsx("rounded-lg border border-border px-3 py-2 text-xs", className)}
      onClick={(event) => {
        onClick?.(event);
        ctx?.onOpenChange(false);
      }}
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({
  className,
  onClick,
  children
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={clsx("rounded-lg bg-primary px-3 py-2 text-xs text-background", className)}
      onClick={(event) => {
        onClick?.(event);
        ctx?.onOpenChange(false);
      }}
    >
      {children}
    </button>
  );
}
