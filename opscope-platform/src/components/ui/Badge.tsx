import * as React from "react";
import clsx from "clsx";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "danger" | "warning";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        variant === "default" && "bg-primary/15 text-primary",
        variant === "outline" && "border border-border text-muted",
        variant === "danger" && "border border-danger/60 text-danger",
        variant === "warning" && "border border-warning/60 text-warning",
        className
      )}
      {...props}
    />
  );
}
