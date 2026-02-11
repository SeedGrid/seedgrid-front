"use client";

import * as React from "react";
import { createPortal } from "react-dom";

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

export function SgDialog(props: Readonly<SgDialogProps>) {
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
    ariaLabel ?? (typeof title === "string" ? title : undefined) ?? "Dialog";

  const overlayBase = "fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity";
  const overlayState = entered ? "opacity-100" : "opacity-0";

  const contentBase =
    "w-full rounded-2xl bg-background text-foreground shadow-2xl border border-border " +
    "max-h-[85vh] flex flex-col transition duration-150 ease-out border-t-4";

  const transitionStyle: React.CSSProperties = { transitionDuration: `${transitionMs}ms` };

  return createPortal(
    <div
      className={cn("fixed inset-0 z-[1000]", className)}
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
            severityClass(severity),
            contentClassName
          )}
          style={transitionStyle}
        >
          {(title || subtitle || closeable || leading || trailing) && (
            <div
              className={cn(
                "px-5 py-4 border-b border-border flex items-start gap-3",
                headerClassName
              )}
            >
              {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}

              <div className="min-w-0 flex-1">
                {title ? <div className="text-base font-semibold leading-6">{title}</div> : null}
                {subtitle ? <div className="text-sm text-muted-foreground mt-1">{subtitle}</div> : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {trailing ? <div className="shrink-0">{trailing}</div> : null}
                {closeable ? (
                  <button
                    type="button"
                    onClick={close}
                    className={cn(
                      "inline-flex items-center justify-center h-9 w-9 rounded-lg",
                      "hover:bg-muted/60 active:bg-muted",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring,var(--primary)))]"
                    )}
                    aria-label="Close"
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
                "px-5 py-4 border-t border-border flex items-center justify-end gap-2",
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
