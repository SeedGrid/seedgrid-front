"use client";

import * as React from "react";

type Severity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";

type Appearance = "solid" | "flat" | "outline" | "ghost" | "text";

type Size = "sm" | "md" | "lg";

type Shape = "default" | "rounded";

export type SgButtonCustomColors = {
  bg?: string; // ex: "#2563eb"
  fg?: string; // ex: "white"
  border?: string; // ex: "#1d4ed8"
  hoverBg?: string;
  hoverFg?: string;
  hoverBorder?: string;
  activeBg?: string;
  ring?: string; // ex: "rgba(37,99,235,.35)"
};

export type SgButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  severity?: Severity;
  appearance?: Appearance;
  size?: Size;
  shape?: Shape;
  raised?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  customColors?: SgButtonCustomColors;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const PRESET: Record<
  Severity,
  Required<Pick<SgButtonCustomColors, "bg" | "fg" | "border" | "hoverBg" | "ring">>
> = {
  primary: {
    bg: "var(--sg-btn-primary-bg, hsl(var(--primary)))",
    fg: "var(--sg-btn-primary-fg, hsl(var(--primary-foreground)))",
    border: "var(--sg-btn-primary-border, hsl(var(--primary)))",
    hoverBg: "var(--sg-btn-primary-hover-bg, hsl(var(--primary)))",
    ring: "var(--sg-btn-primary-ring, hsl(var(--primary)/0.35))"
  },
  secondary: {
    bg: "var(--sg-btn-secondary-bg, hsl(var(--secondary)))",
    fg: "var(--sg-btn-secondary-fg, hsl(var(--secondary-foreground)))",
    border: "var(--sg-btn-secondary-border, hsl(var(--secondary)))",
    hoverBg: "var(--sg-btn-secondary-hover-bg, hsl(var(--secondary)))",
    ring: "var(--sg-btn-secondary-ring, hsl(var(--secondary)/0.35))"
  },
  success: {
    bg: "var(--sg-btn-success-bg, hsl(var(--tertiary, var(--accent))))",
    fg: "var(--sg-btn-success-fg, hsl(var(--tertiary-foreground, var(--accent-foreground, 0 0% 100%))))",
    border: "var(--sg-btn-success-border, hsl(var(--tertiary, var(--accent))))",
    hoverBg: "var(--sg-btn-success-hover-bg, hsl(var(--tertiary, var(--accent))))",
    ring: "var(--sg-btn-success-ring, hsl(var(--tertiary, var(--accent))/0.35))"
  },
  info: {
    bg: "var(--sg-btn-info-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-info-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    border: "var(--sg-btn-info-border, hsl(var(--secondary, var(--primary))))",
    hoverBg: "var(--sg-btn-info-hover-bg, hsl(var(--secondary, var(--primary))))",
    ring: "var(--sg-btn-info-ring, hsl(var(--secondary, var(--primary))/0.35))"
  },
  warning: {
    bg: "var(--sg-btn-warning-bg, hsl(var(--secondary, var(--accent))))",
    fg: "var(--sg-btn-warning-fg, hsl(var(--secondary-foreground, var(--accent-foreground, 0 0% 100%))))",
    border: "var(--sg-btn-warning-border, hsl(var(--secondary, var(--accent))))",
    hoverBg: "var(--sg-btn-warning-hover-bg, hsl(var(--secondary, var(--accent))))",
    ring: "var(--sg-btn-warning-ring, hsl(var(--secondary, var(--accent))/0.35))"
  },
  help: {
    bg: "var(--sg-btn-help-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-help-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    border: "var(--sg-btn-help-border, hsl(var(--secondary, var(--primary))))",
    hoverBg: "var(--sg-btn-help-hover-bg, hsl(var(--secondary, var(--primary))))",
    ring: "var(--sg-btn-help-ring, hsl(var(--secondary, var(--primary))/0.35))"
  },
  danger: {
    bg: "var(--sg-btn-danger-bg, hsl(var(--destructive)))",
    fg: "var(--sg-btn-danger-fg, hsl(var(--destructive-foreground)))",
    border: "var(--sg-btn-danger-border, hsl(var(--destructive)))",
    hoverBg: "var(--sg-btn-danger-hover-bg, hsl(var(--destructive)))",
    ring: "var(--sg-btn-danger-ring, hsl(var(--destructive)/0.35))"
  },
  plain: {
    bg: "var(--sg-btn-plain-bg, hsl(var(--muted)))",
    fg: "var(--sg-btn-plain-fg, hsl(var(--muted-foreground)))",
    border: "var(--sg-btn-plain-border, hsl(var(--muted)))",
    hoverBg: "var(--sg-btn-plain-hover-bg, hsl(var(--muted)))",
    ring: "var(--sg-btn-plain-ring, hsl(var(--muted)/0.35))"
  }
};

const SIZE: Record<
  Size,
  { h: string; px: string; text: string; gap: string; icon: string; radius: string }
> = {
  sm: { h: "h-8", px: "px-3", text: "text-sm", gap: "gap-2", icon: "size-4", radius: "rounded-md" },
  md: { h: "h-10", px: "px-4", text: "text-sm", gap: "gap-2", icon: "size-4", radius: "rounded-lg" },
  lg: { h: "h-12", px: "px-5", text: "text-base", gap: "gap-2.5", icon: "size-5", radius: "rounded-xl" }
};

export function resolveButtonColors(
  severity: Severity,
  custom?: SgButtonCustomColors
): Required<SgButtonCustomColors> {
  const base = PRESET[severity];
  return {
    bg: custom?.bg ?? base.bg,
    fg: custom?.fg ?? base.fg,
    border: custom?.border ?? base.border,
    hoverBg: custom?.hoverBg ?? base.hoverBg,
    hoverFg: custom?.hoverFg ?? (custom?.fg ?? base.fg),
    hoverBorder: custom?.hoverBorder ?? (custom?.border ?? base.border),
    activeBg: custom?.activeBg ?? (custom?.hoverBg ?? base.hoverBg),
    ring: custom?.ring ?? base.ring
  };
}

function buildVars(severity: Severity, custom?: SgButtonCustomColors): React.CSSProperties {
  const merged = resolveButtonColors(severity, custom);
  return {
    ["--sg-btn-bg" as any]: merged.bg,
    ["--sg-btn-fg" as any]: merged.fg,
    ["--sg-btn-border" as any]: merged.border,
    ["--sg-btn-hover-bg" as any]: merged.hoverBg,
    ["--sg-btn-hover-fg" as any]: merged.hoverFg,
    ["--sg-btn-hover-border" as any]: merged.hoverBorder,
    ["--sg-btn-active-bg" as any]: merged.activeBg,
    ["--sg-btn-ring" as any]: merged.ring
  };
}

function appearanceClass(appearance: Appearance) {
  switch (appearance) {
    case "solid":
      return cn(
        "bg-[var(--sg-btn-bg)] text-[var(--sg-btn-fg)] border border-[var(--sg-btn-border)]",
        "hover:bg-[var(--sg-btn-hover-bg)] hover:text-[var(--sg-btn-hover-fg)] hover:border-[var(--sg-btn-hover-border)]",
        "active:bg-[var(--sg-btn-active-bg)]"
      );
    case "flat":
      return cn(
        "bg-[var(--sg-btn-bg)] text-[var(--sg-btn-fg)] border border-transparent",
        "hover:bg-[var(--sg-btn-hover-bg)] hover:text-[var(--sg-btn-hover-fg)]",
        "active:bg-[var(--sg-btn-active-bg)]"
      );
    case "outline":
      return cn(
        "bg-transparent text-[var(--sg-btn-bg)] border border-[var(--sg-btn-border)]",
        "hover:bg-[color-mix(in_srgb,var(--sg-btn-bg)_12%,transparent)]",
        "active:bg-[color-mix(in_srgb,var(--sg-btn-bg)_18%,transparent)]"
      );
    case "ghost":
      return cn(
        "bg-transparent text-[var(--sg-btn-bg)] border border-transparent",
        "hover:bg-[color-mix(in_srgb,var(--sg-btn-bg)_10%,transparent)]",
        "active:bg-[color-mix(in_srgb,var(--sg-btn-bg)_16%,transparent)]"
      );
    case "text":
      return cn("bg-transparent text-[var(--sg-btn-bg)] border border-transparent", "hover:underline underline-offset-4");
  }
}

export const SgButton = React.forwardRef<HTMLButtonElement, SgButtonProps>(
  (
    {
      severity = "primary",
      appearance = "solid",
      size = "md",
      shape = "default",
      raised = false,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      className,
      children,
      style,
      customColors,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);
    const isIconOnly = !children && (leftIcon || rightIcon);
    const s = SIZE[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        style={{ ...buildVars(severity, customColors), ...style }}
        className={cn(
          "inline-flex items-center justify-center select-none whitespace-nowrap",
          "font-medium",
          "transition-[background-color,color,border-color,box-shadow,transform] duration-150",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--sg-btn-ring)]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          s.h,
          isIconOnly ? "aspect-square" : s.px,
          s.text,
          s.gap,
          shape === "rounded" ? "rounded-full" : s.radius,
          appearanceClass(appearance),
          raised && appearance !== "text" ? "shadow-sm hover:shadow-md active:shadow-sm" : false,
          !isDisabled && appearance !== "text" ? "active:translate-y-[0.5px]" : false,
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className={cn("inline-flex items-center", s.gap)}>
            <Spinner className={s.icon} />
            {children ? <span>{children}</span> : null}
          </span>
        ) : (
          <span className={cn("inline-flex items-center", s.gap)}>
            {leftIcon ? <span className={cn("shrink-0", s.icon)}>{leftIcon}</span> : null}
            {children ? <span>{children}</span> : null}
            {rightIcon ? <span className={cn("shrink-0", s.icon)}>{rightIcon}</span> : null}
          </span>
        )}
      </button>
    );
  }
);

SgButton.displayName = "SgButton";

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
