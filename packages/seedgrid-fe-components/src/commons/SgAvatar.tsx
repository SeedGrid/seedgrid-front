"use client";

import * as React from "react";

export type SgAvatarSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "custom";

export type SgAvatarShape = "circle" | "square";
export type SgAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SgAvatarCustomColors = {
  bg?: string;
  fg?: string;
  border?: string;
  ring?: string;
};

export type SgAvatarProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "color"> & {
  src?: string;
  alt?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  fallback?: React.ReactNode;
  size?: SgAvatarSize;
  shape?: SgAvatarShape;
  severity?: SgAvatarSeverity;
  bordered?: boolean;
  disabled?: boolean;
  customColors?: SgAvatarCustomColors;
  imageClassName?: string;
  children?: React.ReactNode;
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
};

export type SgAvatarGroupOverlap = "none" | "sm" | "md" | "lg";

export type SgAvatarGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  children: React.ReactNode;
  max?: number;
  total?: number;
  overlap?: SgAvatarGroupOverlap;
  moreSeverity?: SgAvatarSeverity;
  moreLabel?: (remaining: number) => React.ReactNode;
  size?: SgAvatarSize;
  shape?: SgAvatarShape;
  bordered?: boolean;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const SIZE: Record<SgAvatarSize, { box: string; text: string; icon: string }> = {
  xs: { box: "size-6", text: "text-[11px]", icon: "size-3.5" },
  sm: { box: "size-8", text: "text-xs", icon: "size-4" },
  md: { box: "size-10", text: "text-sm", icon: "size-5" },
  lg: { box: "size-14", text: "text-lg", icon: "size-7" },
  xl: { box: "size-20", text: "text-2xl", icon: "size-9" }
};

const GROUP_OVERLAP: Record<SgAvatarGroupOverlap, string> = {
  none: "",
  sm: "-ml-1",
  md: "-ml-2",
  lg: "-ml-3"
};

const PRESET: Record<
  Exclude<SgAvatarSeverity, "custom">,
  Required<Pick<SgAvatarCustomColors, "bg" | "fg" | "border" | "ring">>
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

function resolveAvatarColors(
  severity: SgAvatarSeverity,
  custom?: SgAvatarCustomColors
): Required<SgAvatarCustomColors> {
  const base = severity === "custom" ? PRESET.primary : PRESET[severity];
  return {
    bg: custom?.bg ?? base.bg,
    fg: custom?.fg ?? base.fg,
    border: custom?.border ?? base.border,
    ring: custom?.ring ?? base.ring
  };
}

function buildVars(severity: SgAvatarSeverity, custom?: SgAvatarCustomColors): React.CSSProperties {
  const merged = resolveAvatarColors(severity, custom);
  return {
    ["--sg-avatar-bg" as any]: merged.bg,
    ["--sg-avatar-fg" as any]: merged.fg,
    ["--sg-avatar-border" as any]: merged.border,
    ["--sg-avatar-ring" as any]: merged.ring
  };
}

function hasRenderable(value: React.ReactNode): boolean {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function normalizeLabel(label: React.ReactNode): React.ReactNode {
  if (typeof label !== "string") return label;
  const trimmed = label.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 2) return trimmed.toUpperCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export const SgAvatar = React.forwardRef<HTMLSpanElement, SgAvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      label,
      icon,
      fallback,
      size = "md",
      shape = "circle",
      severity = "primary",
      bordered = true,
      disabled = false,
      customColors,
      className,
      imageClassName,
      children,
      onImageError,
      onClick,
      role,
      tabIndex,
      style,
      title,
      ["aria-label"]: ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [imageFailed, setImageFailed] = React.useState(false);
    const s = SIZE[size];

    React.useEffect(() => {
      setImageFailed(false);
    }, [src]);

    const hasChildren = hasRenderable(children);
    const showImage = !hasChildren && !!src && !imageFailed;
    const showIcon = !hasChildren && !showImage && hasRenderable(icon);
    const showLabel = !hasChildren && !showImage && !showIcon && hasRenderable(label);

    const interactive = typeof onClick === "function" || role === "button" || typeof tabIndex === "number";
    const resolvedAriaLabel = ariaLabel ?? (typeof label === "string" ? label : alt);
    const squareRadius = size === "xs" || size === "sm" ? "rounded-md" : "rounded-xl";

    return (
      <span
        ref={ref}
        title={title}
        role={role}
        tabIndex={tabIndex}
        onClick={disabled ? undefined : onClick}
        aria-label={resolvedAriaLabel}
        style={{ ...buildVars(severity, customColors), ...style }}
        className={cn(
          "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
          "font-medium leading-none",
          s.box,
          s.text,
          shape === "circle" ? "rounded-full" : squareRadius,
          bordered ? "border border-[var(--sg-avatar-border)]" : "border border-transparent",
          showImage ? "bg-muted text-transparent" : "bg-[var(--sg-avatar-bg)] text-[var(--sg-avatar-fg)]",
          interactive
            ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-avatar-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            : "",
          disabled ? "pointer-events-none opacity-55" : "",
          className
        )}
        {...rest}
      >
        {hasChildren ? (
          children
        ) : showImage ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            className={cn("size-full object-cover", imageClassName)}
            onError={(event) => {
              setImageFailed(true);
              onImageError?.(event);
            }}
          />
        ) : showIcon ? (
          <span className={cn("inline-flex items-center justify-center", s.icon)}>{icon}</span>
        ) : showLabel ? (
          <span className="uppercase">{normalizeLabel(label)}</span>
        ) : (
          <span className={cn("inline-flex items-center justify-center", s.icon)}>
            {hasRenderable(fallback) ? fallback : "?"}
          </span>
        )}
      </span>
    );
  }
);

SgAvatar.displayName = "SgAvatar";

export const SgAvatarGroup = React.forwardRef<HTMLDivElement, SgAvatarGroupProps>(
  (
    {
      children,
      max,
      total,
      overlap = "md",
      moreSeverity = "neutral",
      moreLabel,
      size = "md",
      shape = "circle",
      bordered = true,
      className,
      ...rest
    },
    ref
  ) => {
    const avatars = React.Children.toArray(children).filter((item) => item !== null && item !== undefined);
    const normalizedMax =
      typeof max === "number" && Number.isFinite(max) && max > 0 ? Math.floor(max) : undefined;
    const visibleCount = normalizedMax ? Math.min(normalizedMax, avatars.length) : avatars.length;
    const visible = avatars.slice(0, visibleCount);
    const calculatedTotal = Math.max(total ?? avatars.length, avatars.length);
    const hiddenCount = Math.max(calculatedTotal - visibleCount, 0);

    return (
      <div ref={ref} className={cn("inline-flex items-center", className)} {...rest}>
        {visible.map((child, index) => {
          const key =
            React.isValidElement(child) && child.key != null ? String(child.key) : `sg-avatar-${index}`;
          return (
            <span key={key} className={cn("inline-flex", index === 0 ? "" : GROUP_OVERLAP[overlap])}>
              {child}
            </span>
          );
        })}
        {hiddenCount > 0 ? (
          <span className={cn("inline-flex", visibleCount === 0 ? "" : GROUP_OVERLAP[overlap])}>
            <SgAvatar
              label={moreLabel ? moreLabel(hiddenCount) : `+${hiddenCount}`}
              size={size}
              shape={shape}
              severity={moreSeverity}
              bordered={bordered}
            />
          </span>
        ) : null}
      </div>
    );
  }
);

SgAvatarGroup.displayName = "SgAvatarGroup";
