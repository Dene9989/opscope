"use client";

import * as React from "react";
import clsx from "clsx";

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

export function RadioGroup({ value, onValueChange, disabled, className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div role="radiogroup" className={className} {...props} />
    </RadioGroupContext.Provider>
  );
}

type RadioGroupItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function RadioGroupItem({ value, className, disabled, children, ...props }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const checked = ctx?.value === value;
  const isDisabled = Boolean(disabled || ctx?.disabled);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => {
        if (!isDisabled) {
          ctx?.onValueChange?.(value);
        }
      }}
      className={clsx(
        "inline-flex items-center justify-center text-xs font-semibold transition",
        checked ? "bg-primary text-background" : "text-muted",
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}
