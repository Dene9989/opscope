"use client";

import * as React from "react";
import clsx from "clsx";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Switch({ checked, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition",
        checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted",
        disabled && "cursor-not-allowed opacity-50",
        className
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
            "inline-block h-3 w-3 translate-x-1 rounded-full bg-background transition",
            checked && "translate-x-4"
          )}
        />
      </span>
    </button>
  );
}
