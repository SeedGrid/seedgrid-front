"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { t, useComponentsI18n } from "../i18n";

export type SgDialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type SgDialogSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";
export type SgDialogAnimation = "fade" | "zoom" | "slideUp";

export type SgDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;

  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;

  size?: SgDialogSize;
  severity?: SgDialogSeverity;
  animation?: SgDialogAnimation;
  transitionMs?: number;
  autoCloseMs?: number;

  className?: string;
  style?: React.CSSProperties;
  customColor?: React.CSSProperties["backgroundColor"];
  elevation?: "none" | "sm" | "md" | "lg" | React.CSSProperties["boxShadow"];
  /** @deprecated use elevation */
  shadow?: React.CSSProperties["boxShadow"];
  showTopAccent?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  closeable?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  lockBodyScroll?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;

  ariaLabel?: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function sizeClass(size: SgDialogSize) {
  switch (size) {
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-lg";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-4xl";
    case "full":
      return "max-w-none w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-h-none";
  }
}

function severityClass(severity: SgDialogSeverity) {
  switch (severity) {
    case "primary":
      return "border-t-[hsl(var(--primary))]";
    case "secondary":
      return "border-t-[hsl(var(--secondary))]";
    case "success":
      return "border-t-[hsl(var(--tertiary,var(--accent,var(--primary))))]";
    case "info":
      return "border-t-[hsl(var(--secondary,var(--primary)))]";
    case "warning":
      return "border-t-[hsl(var(--accent,var(--secondary,var(--primary))))]";
    case "help":
      return "border-t-[hsl(var(--secondary,var(--primary)))]";
    case "danger":
      return "border-t-[hsl(var(--destructive))]";
    case "plain":
    default:
      return "border-t-[hsl(var(--border))]";
  }
}

function contentStateClass(animation: SgDialogAnimation, entered: boolean) {
  const common = entered ? "opacity-100" : "opacity-0";
  switch (animation) {
    case "fade":
      return common;
    case "zoom":
      return cn(common, entered ? "scale-100" : "scale-95");
    case "slideUp":
      return cn(common, entered ? "translate-y-0" : "translate-y-2");
  }
}

function resolveDialogShadow(
  elevation: SgDialogProps["elevation"],
  shadow: SgDialogProps["shadow"]
): React.CSSProperties["boxShadow"] | undefined {
  if (elevation === undefined) return shadow;
  if (typeof elevation !== "string") return elevation;
  switch (elevation) {
    case "none":
      return "none";
    case "sm":
      return "0 1px 2px rgba(2, 8, 23, 0.12)";
    case "md":
      return "0 10px 24px rgba(2, 8, 23, 0.2), 0 4px 10px rgba(2, 8, 23, 0.12)";
    case "lg":
      return "0 24px 60px rgba(2, 8, 23, 0.32), 0 12px 24px rgba(2, 8, 23, 0.18)";
    default:
      return elevation;
  }
}

type RgbColor = { r: number; g: number; b: number };

type CustomSurfacePalette = {
  foreground: string;
  mutedForeground: string;
  border: string;
  hoverBg: string;
  activeBg: string;
};

function clampByte(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function parseHexColor(input: string): RgbColor | null {
  const hex = input.replace("#", "").trim();
  if (!hex) return null;

  if (hex.length === 3 || hex.length === 4) {
    const r = Number.parseInt((hex.slice(0, 1) || "0").repeat(2), 16);
    const g = Number.parseInt((hex.slice(1, 2) || "0").repeat(2), 16);
    const b = Number.parseInt((hex.slice(2, 3) || "0").repeat(2), 16);
    if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;
    return { r, g, b };
  }

  if (hex.length === 6 || hex.length === 8) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null;
    return { r, g, b };
  }

  return null;
}

function parseRgbChannel(token: string): number | null {
  const value = token.trim();
  if (!value) return null;
  if (value.endsWith("%")) {
    const numeric = Number.parseFloat(value.slice(0, -1));
    if (!Number.isFinite(numeric)) return null;
    return clampByte((numeric / 100) * 255);
  }
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return null;
  return clampByte(numeric);
}

function parseRgbColor(input: string): RgbColor | null {
  const match = input.match(/^rgba?\((.+)\)$/i);
  if (!match) return null;

  const raw = match[1]?.trim() ?? "";
  const withoutAlpha = raw.replace(/\s*\/\s*[\d.]+%?\s*$/, "");
  const tokens = withoutAlpha.includes(",")
    ? withoutAlpha.split(",")
    : withoutAlpha.split(/\s+/);

  if (tokens.length < 3) return null;
  const r = parseRgbChannel(tokens[0] ?? "");
  const g = parseRgbChannel(tokens[1] ?? "");
  const b = parseRgbChannel(tokens[2] ?? "");
  if (r === null || g === null || b === null) return null;
  return { r, g, b };
}

function parseHue(token: string): number | null {
  const value = token.trim().toLowerCase();
  if (!value) return null;

  if (value.endsWith("turn")) {
    const numeric = Number.parseFloat(value.slice(0, -4));
    if (!Number.isFinite(numeric)) return null;
    return numeric * 360;
  }
  if (value.endsWith("rad")) {
    const numeric = Number.parseFloat(value.slice(0, -3));
    if (!Number.isFinite(numeric)) return null;
    return (numeric * 180) / Math.PI;
  }
  if (value.endsWith("deg")) {
    const numeric = Number.parseFloat(value.slice(0, -3));
    if (!Number.isFinite(numeric)) return null;
    return numeric;
  }

  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function parsePercent(token: string): number | null {
  const value = token.trim();
  if (!value.endsWith("%")) return null;
  const numeric = Number.parseFloat(value.slice(0, -1));
  if (!Number.isFinite(numeric)) return null;
  return Math.min(100, Math.max(0, numeric));
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const sat = Math.min(1, Math.max(0, s / 100));
  const lig = Math.min(1, Math.max(0, l / 100));
  const hue = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: clampByte((r + m) * 255),
    g: clampByte((g + m) * 255),
    b: clampByte((b + m) * 255)
  };
}

function parseHslColor(input: string): RgbColor | null {
  const match = input.match(/^hsla?\((.+)\)$/i);
  if (!match) return null;

  const raw = match[1]?.trim() ?? "";
  const withoutAlpha = raw.replace(/\s*\/\s*[\d.]+%?\s*$/, "");
  const tokens = withoutAlpha.includes(",")
    ? withoutAlpha.split(",")
    : withoutAlpha.split(/\s+/);

  if (tokens.length < 3) return null;
  const h = parseHue(tokens[0] ?? "");
  const s = parsePercent(tokens[1] ?? "");
  const l = parsePercent(tokens[2] ?? "");
  if (h === null || s === null || l === null) return null;
  return hslToRgb(h, s, l);
}

function parseCssColorToRgb(color: string): RgbColor | null {
  const input = color.trim();
  if (!input) return null;

  if (input.startsWith("#")) return parseHexColor(input);
  if (/^rgba?\(/i.test(input)) return parseRgbColor(input);
  if (/^hsla?\(/i.test(input)) return parseHslColor(input);
  return null;
}

function relativeLuminance({ r, g, b }: RgbColor): number {
  const normalize = (channel: number) => {
    const n = channel / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

function resolveCustomSurfacePalette(
  backgroundColor: SgDialogProps["customColor"]
): CustomSurfacePalette | null {
  if (typeof backgroundColor !== "string") return null;
  const parsed = parseCssColorToRgb(backgroundColor);
  if (!parsed) return null;

  const lightSurface = relativeLuminance(parsed) >= 0.56;
  if (lightSurface) {
    return {
      foreground: "rgb(17 24 39)",
      mutedForeground: "rgb(71 85 105)",
      border: "rgba(15, 23, 42, 0.16)",
      hoverBg: "rgba(15, 23, 42, 0.08)",
      activeBg: "rgba(15, 23, 42, 0.14)"
    };
  }

  return {
    foreground: "rgb(243 244 246)",
    mutedForeground: "rgb(203 213 225)",
    border: "rgba(248, 250, 252, 0.18)",
    hoverBg: "rgba(248, 250, 252, 0.08)",
    activeBg: "rgba(248, 250, 252, 0.14)"
  };
}

export function SgDialog(props: Readonly<SgDialogProps>) {
  const i18n = useComponentsI18n();
  const {
    open: openProp,
    onOpenChange,
    defaultOpen = false,

    title,
    subtitle,
    leading,
    trailing,
    children,
    footer,

    size = "md",
    severity = "plain",
    animation = "zoom",
    transitionMs = 160,
    autoCloseMs,

    className,
    style,
    customColor,
    elevation,
    shadow,
    showTopAccent = true,
    overlayClassName,
    contentClassName,
    headerClassName,
    bodyClassName,
    footerClassName,

    closeable = true,
    onClose,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    lockBodyScroll = true,
    initialFocusRef,
    restoreFocus = true,

    ariaLabel
  } = props;

  const isControlled = openProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = React.useState(defaultOpen);
  const open = isControlled ? !!openProp : openUncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const close = React.useCallback(() => {
    if (!open) return;
    setOpen(false);
    onClose?.();
  }, [open, setOpen, onClose]);

  const [mounted, setMounted] = React.useState(false);
  const [present, setPresent] = React.useState(open);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      const id = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(id);
    }
    setEntered(false);
    const id = window.setTimeout(() => setPresent(false), transitionMs);
    return () => window.clearTimeout(id);
  }, [open, transitionMs]);

  React.useEffect(() => {
    if (!open) return;
    if (!autoCloseMs || autoCloseMs <= 0) return;
    const id = window.setTimeout(() => {
      close();
    }, autoCloseMs);
    return () => window.clearTimeout(id);
  }, [open, autoCloseMs, close]);

  React.useEffect(() => {
    if (!present || !open || !lockBodyScroll) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [present, open, lockBodyScroll]);

  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const lastActiveRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement as HTMLElement | null;
    const focusTarget =
      initialFocusRef?.current ??
      contentRef.current?.querySelector<HTMLElement>(
        `[data-sg-dialog-initial-focus="true"], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
      );
    const id = window.setTimeout(() => focusTarget?.focus?.(), 0);
    return () => window.clearTimeout(id);
  }, [open, initialFocusRef]);

  React.useEffect(() => {
    if (open) return;
    if (!restoreFocus) return;
    lastActiveRef.current?.focus?.();
  }, [open, restoreFocus]);

  React.useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const root = contentRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        const active = document.activeElement as HTMLElement | null;
        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, close]);

  const onOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === overlayRef.current) close();
  };

  if (!mounted) return null;
  if (!present) return null;

  const a11yLabel =
    ariaLabel ?? (typeof title === "string" ? title : undefined) ?? t(i18n, "components.dialog.ariaLabel");

  const overlayBase = "fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity";
  const overlayState = entered ? "opacity-100" : "opacity-0";

  const contentBase =
    "w-full rounded-2xl bg-background text-foreground shadow-2xl border border-border " +
    "max-h-[85vh] flex flex-col transition duration-150 ease-out" +
    (showTopAccent ? " border-t-4" : "");

  const resolvedShadow = resolveDialogShadow(elevation, shadow);
  const customPalette = resolveCustomSurfacePalette(customColor);
  const dialogVars: Record<string, string> = {
    "--sg-dialog-muted-foreground": customPalette?.mutedForeground ?? "hsl(var(--muted-foreground))",
    "--sg-dialog-divider": customPalette?.border ?? "hsl(var(--border))",
    "--sg-dialog-hover-bg": customPalette?.hoverBg ?? "hsl(var(--muted) / 0.6)",
    "--sg-dialog-active-bg": customPalette?.activeBg ?? "hsl(var(--muted))"
  };

  const transitionStyle: React.CSSProperties = { transitionDuration: `${transitionMs}ms` };
  const contentStyle: React.CSSProperties = {
    ...(dialogVars as unknown as React.CSSProperties),
    ...transitionStyle,
    ...(customColor !== undefined ? { backgroundColor: customColor } : {}),
    ...(customPalette ? { color: customPalette.foreground, borderColor: customPalette.border } : {}),
    ...(resolvedShadow !== undefined ? { boxShadow: resolvedShadow } : {})
  };

  return createPortal(
    <div
      className={cn("fixed inset-0 z-[1000]", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={a11yLabel}
    >
      <div
        ref={overlayRef}
        onMouseDown={onOverlayMouseDown}
        className={cn(overlayBase, overlayState, overlayClassName)}
        style={transitionStyle}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          ref={contentRef}
          className={cn(
            contentBase,
            sizeClass(size),
            contentStateClass(animation, entered),
            showTopAccent ? severityClass(severity) : false,
            contentClassName
          )}
          style={contentStyle}
        >
          {(title || subtitle || closeable || leading || trailing) && (
            <div
              className={cn(
                "px-5 py-4 border-b border-[var(--sg-dialog-divider)] flex items-start gap-3",
                headerClassName
              )}
            >
              {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}

              <div className="min-w-0 flex-1">
                {title ? <div className="text-base font-semibold leading-6">{title}</div> : null}
                {subtitle ? <div className="mt-1 text-sm text-[var(--sg-dialog-muted-foreground)]">{subtitle}</div> : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {trailing ? <div className="shrink-0">{trailing}</div> : null}
                {closeable ? (
                  <button
                    type="button"
                    onClick={close}
                    className={cn(
                      "inline-flex items-center justify-center h-9 w-9 rounded-lg",
                      "hover:bg-[var(--sg-dialog-hover-bg)] active:bg-[var(--sg-dialog-active-bg)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring,var(--primary)))]"
                    )}
                    aria-label={t(i18n, "components.dialog.close")}
                  >
                    <CloseIcon />
                  </button>
                ) : null}
              </div>
            </div>
          )}

          <div className={cn("px-5 py-4 overflow-auto", bodyClassName)}>
            {children}
          </div>

          {footer ? (
            <div
              className={cn(
                "px-5 py-4 border-t border-[var(--sg-dialog-divider)] flex items-center justify-end gap-2",
                footerClassName
              )}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

SgDialog.displayName = "SgDialog";



