"use client";

import * as React from "react";

export type SgBadgeSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "custom";

export type SgBadgeVariant = "solid" | "soft" | "outline" | "ghost";
export type SgBadgeSize = "xs" | "sm" | "md" | "lg";

export type SgBadgeCustomColors = {
  bg?: string;
  fg?: string;
  border?: string;
  softBg?: string;
  softFg?: string;
  hoverBg?: string;
  hoverFg?: string;
  hoverBorder?: string;
  ring?: string;
};

export type SgBadgePartsClassName = {
  container?: string;
  label?: string;
  removeButton?: string;
  dot?: string;
};

export type SgBadgeProps = {
  value?: React.ReactNode;
  severity?: SgBadgeSeverity;
  variant?: SgBadgeVariant;
  size?: SgBadgeSize;
  rounded?: boolean;
  dot?: boolean;
  pulse?: boolean;
  max?: number;
  showZero?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  removeAriaLabel?: string;
  autoRemove?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  title?: string;
  hint?: string;
  customColors?: SgBadgeCustomColors;
  className?: string;
  partsClassName?: SgBadgePartsClassName;
  "aria-label"?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const SIZE: Record<SgBadgeSize, string> = {
  xs: "h-4 px-1.5 text-[11px]",
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-sm",
  lg: "h-7 px-3 text-base"
};

const ICON_SIZE: Record<SgBadgeSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-4",
  lg: "size-5"
};

const PRESET: Record<
  Exclude<SgBadgeSeverity, "custom">,
  Required<Pick<SgBadgeCustomColors, "bg" | "fg" | "border" | "ring">>
> = {
  primary: {
    bg: "hsl(var(--primary))",
    fg: "hsl(var(--primary-foreground))",
    border: "hsl(var(--primary))",
    ring: "hsl(var(--ring, var(--primary)))"
  },
  secondary: {
    bg: "hsl(var(--secondary))",
    fg: "hsl(var(--secondary-foreground))",
    border: "hsl(var(--secondary))",
    ring: "hsl(var(--ring, var(--secondary)))"
  },
  success: {
    bg: "hsl(var(--tertiary, var(--accent, var(--primary))))",
    fg: "hsl(var(--tertiary-foreground, var(--accent-foreground, var(--primary-foreground))))",
    border: "hsl(var(--tertiary, var(--accent, var(--primary))))",
    ring: "hsl(var(--ring, var(--tertiary, var(--accent, var(--primary)))))"
  },
  warning: {
    bg: "hsl(var(--accent, var(--secondary, var(--primary))))",
    fg: "hsl(var(--accent-foreground, var(--secondary-foreground, var(--primary-foreground))))",
    border: "hsl(var(--accent, var(--secondary, var(--primary))))",
    ring: "hsl(var(--ring, var(--accent, var(--secondary, var(--primary)))))"
  },
  danger: {
    bg: "hsl(var(--destructive))",
    fg: "hsl(var(--destructive-foreground))",
    border: "hsl(var(--destructive))",
    ring: "hsl(var(--ring, var(--destructive)))"
  },
  info: {
    bg: "hsl(var(--secondary, var(--primary)))",
    fg: "hsl(var(--secondary-foreground, var(--primary-foreground)))",
    border: "hsl(var(--secondary, var(--primary)))",
    ring: "hsl(var(--ring, var(--secondary, var(--primary))))"
  },
  neutral: {
    bg: "hsl(var(--muted))",
    fg: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    ring: "hsl(var(--ring, var(--muted)))"
  }
};

function resolveBadgeColors(
  severity: SgBadgeSeverity,
  custom?: SgBadgeCustomColors
): Required<SgBadgeCustomColors> {
  const base = severity === "custom" ? PRESET.primary : PRESET[severity];
  const bg = custom?.bg ?? base.bg;
  const fg = custom?.fg ?? base.fg;
  const border = custom?.border ?? base.border;
  const softBg =
    custom?.softBg ?? `color-mix(in_srgb, ${bg} 14%, transparent)`;
  const softFg = custom?.softFg ?? bg;
  const hoverBg =
    custom?.hoverBg ?? `color-mix(in_srgb, ${bg} 12%, transparent)`;
  const hoverFg = custom?.hoverFg ?? bg;
  const hoverBorder = custom?.hoverBorder ?? border;
  const ring = custom?.ring ?? base.ring;

  return {
    bg,
    fg,
    border,
    softBg,
    softFg,
    hoverBg,
    hoverFg,
    hoverBorder,
    ring
  };
}

function buildVars(severity: SgBadgeSeverity, custom?: SgBadgeCustomColors): React.CSSProperties {
  const merged = resolveBadgeColors(severity, custom);
  return {
    ["--sg-badge-bg" as any]: merged.bg,
    ["--sg-badge-fg" as any]: merged.fg,
    ["--sg-badge-border" as any]: merged.border,
    ["--sg-badge-soft-bg" as any]: merged.softBg,
    ["--sg-badge-soft-fg" as any]: merged.softFg,
    ["--sg-badge-hover-bg" as any]: merged.hoverBg,
    ["--sg-badge-hover-fg" as any]: merged.hoverFg,
    ["--sg-badge-hover-border" as any]: merged.hoverBorder,
    ["--sg-badge-ring" as any]: merged.ring
  };
}

function getDisplayValue(value: React.ReactNode, max?: number, showZero?: boolean) {
  if (typeof value === "number") {
    if (!showZero && value === 0) return null;
    if (typeof max === "number" && value > max) return `${max}+`;
    return String(value);
  }
  return value ?? null;
}

export function SgBadge(props: Readonly<SgBadgeProps>) {
  const {
    value,
    severity = "primary",
    variant = "solid",
    size = "md",
    rounded = true,
    dot = false,
    pulse = false,
    max,
    showZero = true,
    leftIcon,
    rightIcon,
    removable = false,
    onRemove,
    removeAriaLabel = "Remover",
    autoRemove = false,
    onClick,
    disabled,
    title,
    hint,
    customColors,
    className,
    partsClassName,
    ...aria
  } = props;

  const displayValue = getDisplayValue(value, max, showZero);
  const [autoRemoved, setAutoRemoved] = React.useState(false);

  if (dot) {
    return (
      <span
        title={hint ?? title}
        className={cn("relative inline-flex items-center justify-center", partsClassName?.dot, className)}
        style={buildVars(severity, customColors)}
        {...aria}
      >
        {pulse ? (
          <span className="absolute inline-flex size-3 rounded-full bg-[var(--sg-badge-bg)] opacity-75 animate-ping" />
        ) : null}
        <span className="inline-flex size-2.5 rounded-full bg-[var(--sg-badge-bg)]" />
      </span>
    );
  }

  if (autoRemoved) return null;
  if (displayValue === null && !leftIcon && !rightIcon && !removable) return null;

  const isButton = typeof onClick === "function";
  const Tag: any = isButton ? "button" : "span";

  const base = cn(
    "inline-flex items-center gap-1.5 whitespace-nowrap font-medium",
    "transition-[color,background-color,border-color] duration-150",
    SIZE[size],
    rounded ? "rounded-full" : "rounded-md",
    variant === "solid"
      ? "bg-[var(--sg-badge-bg)] text-[var(--sg-badge-fg)] border border-[var(--sg-badge-border)]"
      : variant === "soft"
      ? "bg-[var(--sg-badge-soft-bg)] text-[var(--sg-badge-soft-fg)] border border-transparent"
      : variant === "outline"
      ? "bg-transparent text-[var(--sg-badge-bg)] border border-[var(--sg-badge-border)]"
      : "bg-transparent text-[var(--sg-badge-bg)] border border-transparent",
    variant === "ghost" || variant === "outline"
      ? "hover:bg-[var(--sg-badge-hover-bg)] hover:text-[var(--sg-badge-hover-fg)] hover:border-[var(--sg-badge-hover-border)]"
      : "",
    isButton
      ? cn(
          "cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-badge-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled ? "pointer-events-none opacity-50" : ""
        )
      : "",
    className,
    partsClassName?.container
  );

  return (
    <Tag
      type={isButton ? "button" : undefined}
      title={hint ?? title}
      onClick={disabled ? undefined : onClick}
      disabled={isButton ? disabled : undefined}
      style={buildVars(severity, customColors)}
      className={base}
      role={isButton ? undefined : "status"}
      {...aria}
    >
      {leftIcon ? <span className={cn("inline-flex", ICON_SIZE[size])}>{leftIcon}</span> : null}
      {displayValue !== null ? <span className={cn("inline-flex items-center", partsClassName?.label)}>{displayValue}</span> : null}
      {rightIcon ? <span className={cn("inline-flex", ICON_SIZE[size])}>{rightIcon}</span> : null}
      {removable ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (autoRemove) setAutoRemoved(true);
            onRemove?.();
          }}
          aria-label={removeAriaLabel}
          className={cn(
            "ml-0.5 inline-flex items-center justify-center rounded-full",
            "opacity-70 hover:opacity-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-badge-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            partsClassName?.removeButton
          )}
        >
          <span className={cn("inline-flex", ICON_SIZE[size])}>x</span>
        </button>
      ) : null}
    </Tag>
  );
}

SgBadge.displayName = "SgBadge";
