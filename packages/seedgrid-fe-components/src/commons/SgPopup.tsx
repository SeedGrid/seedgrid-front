"use client";

import * as React from "react";
import { createPortal } from "react-dom";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function useEvent<T extends (...args: any[]) => any>(fn: T | undefined) {
  const ref = React.useRef(fn);
  React.useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return React.useCallback((...args: Parameters<T>) => ref.current?.(...args), []) as T;
}

export type SgPopupPlacement = "auto" | "top" | "right" | "bottom" | "left";
export type SgPopupPreferPlacement = "top" | "right" | "bottom" | "left";
export type SgPopupAlign = "start" | "center" | "end";

export type SgPopupSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";

export type SgPopupAction = {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  severity?: SgPopupSeverity;
  disabled?: boolean;
  closeOnClick?: boolean;
  onClick?: () => void;
};

export type SgPopupProps = {
  title?: string;
  subtitle?: string;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;

  anchorRef: React.RefObject<HTMLElement>;

  placement?: SgPopupPlacement;
  preferPlacement?: SgPopupPreferPlacement;
  align?: SgPopupAlign;
  offset?: number;
  padding?: number;

  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;

  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  minWidth?: number | string;

  actions?: SgPopupAction[];
  children?: React.ReactNode;
};

const ACTION_CLS: Record<SgPopupSeverity, string> = {
  primary: "text-primary-foreground bg-primary hover:brightness-95",
  secondary: "text-secondary-foreground bg-secondary hover:brightness-95",
  success: "text-white bg-emerald-600 hover:brightness-95",
  info: "text-white bg-sky-600 hover:brightness-95",
  warning: "text-white bg-amber-600 hover:brightness-95",
  help: "text-white bg-violet-600 hover:brightness-95",
  danger: "text-destructive-foreground bg-destructive hover:brightness-95",
  plain: "text-foreground bg-muted hover:bg-muted/80"
};

const ACTION_DEFAULT_CLS =
  "text-foreground bg-transparent hover:bg-muted/80";

type PlacementNoAuto = Exclude<SgPopupPlacement, "auto">;

function computeAlignedLeft(anchor: DOMRect, popup: DOMRect, align: SgPopupAlign) {
  if (align === "start") return anchor.left;
  if (align === "center") return anchor.left + anchor.width / 2 - popup.width / 2;
  return anchor.right - popup.width;
}

function computeAlignedTop(anchor: DOMRect, popup: DOMRect, align: SgPopupAlign) {
  if (align === "start") return anchor.top;
  if (align === "center") return anchor.top + anchor.height / 2 - popup.height / 2;
  return anchor.bottom - popup.height;
}

function chooseAutoPlacement(opts: {
  anchor: DOMRect;
  popup: DOMRect;
  offset: number;
  prefer: SgPopupPreferPlacement;
  viewportW: number;
  viewportH: number;
}) {
  const { anchor, popup, offset, prefer, viewportW, viewportH } = opts;
  const space = {
    right: viewportW - anchor.right,
    left: anchor.left,
    bottom: viewportH - anchor.bottom,
    top: anchor.top
  };

  const fits = (placement: PlacementNoAuto) => {
    if (placement === "left" || placement === "right") {
      return space[placement] >= popup.width + offset;
    }
    return space[placement] >= popup.height + offset;
  };

  const opposite: Record<PlacementNoAuto, PlacementNoAuto> = {
    right: "left",
    left: "right",
    top: "bottom",
    bottom: "top"
  };

  const candidates: PlacementNoAuto[] = [
    prefer,
    opposite[prefer],
    "bottom",
    "top",
    "right",
    "left"
  ];

  return candidates.find(fits) ?? prefer;
}

function computePosition(opts: {
  anchor: DOMRect;
  popup: DOMRect;
  placement: SgPopupPlacement;
  preferPlacement: SgPopupPreferPlacement;
  align: SgPopupAlign;
  offset: number;
  padding: number;
}) {
  const { anchor, popup, placement, preferPlacement, align, offset, padding } = opts;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const finalPlacement: PlacementNoAuto =
    placement === "auto"
      ? chooseAutoPlacement({
        anchor,
        popup,
        offset,
        prefer: preferPlacement,
        viewportW: vw,
        viewportH: vh
      })
      : placement;

  let top = 0;
  let left = 0;

  if (finalPlacement === "right") {
    left = anchor.right + offset;
    top = computeAlignedTop(anchor, popup, align);
  } else if (finalPlacement === "left") {
    left = anchor.left - popup.width - offset;
    top = computeAlignedTop(anchor, popup, align);
  } else if (finalPlacement === "bottom") {
    top = anchor.bottom + offset;
    left = computeAlignedLeft(anchor, popup, align);
  } else {
    top = anchor.top - popup.height - offset;
    left = computeAlignedLeft(anchor, popup, align);
  }

  left = clamp(left, padding, vw - popup.width - padding);
  top = clamp(top, padding, vh - popup.height - padding);

  return { top, left };
}

export function SgPopup(props: Readonly<SgPopupProps>) {
  const {
    title,
    subtitle,
    open,
    onOpenChange,
    defaultOpen = false,
    onOpen,
    onClose,
    anchorRef,
    placement = "auto",
    preferPlacement = "right",
    align = "start",
    offset = 8,
    padding = 8,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    className,
    style,
    zIndex = 60,
    minWidth = 180,
    actions,
    children
  } = props;

  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen);
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const onOpenEvt = useEvent(onOpen);
  const onCloseEvt = useEvent(onClose);
  const prevOpen = React.useRef<boolean>(isOpen);

  React.useEffect(() => {
    if (prevOpen.current !== isOpen) {
      if (isOpen) onOpenEvt?.();
      else onCloseEvt?.();
      prevOpen.current = isOpen;
    }
  }, [isOpen, onOpenEvt, onCloseEvt]);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);

  const recompute = React.useCallback(() => {
    const anchorEl = anchorRef.current;
    const panelEl = panelRef.current;
    if (!anchorEl || !panelEl) return;
    const anchorRect = anchorEl.getBoundingClientRect();
    const popupRect = panelEl.getBoundingClientRect();
    const next = computePosition({
      anchor: anchorRect,
      popup: popupRect,
      placement,
      preferPlacement,
      align,
      offset,
      padding
    });
    setPos({ top: next.top, left: next.left });
  }, [anchorRef, placement, preferPlacement, align, offset, padding]);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    recompute();
    const raf = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, recompute]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onResize = () => recompute();
    const onScroll = () => recompute();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true as any);
    };
  }, [isOpen, recompute]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!closeOnOutsideClick) return;
      const panel = panelRef.current;
      const anchor = anchorRef.current;
      const target = e.target as Node;
      if (panel && panel.contains(target)) return;
      if (anchor && anchor.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!closeOnEscape) return;
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeOnOutsideClick, closeOnEscape, setOpen, anchorRef]);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  if (!isOpen) return null;

  const body = (
    <div
      ref={panelRef}
      className={cn(
        "fixed overflow-hidden rounded-md border border-border bg-background shadow-lg",
        "min-w-[180px]",
        className
      )}
      style={{
        zIndex,
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        minWidth,
        ...style
      }}
      role="dialog"
      aria-modal="false"
    >
      {title ? (
        <div className="bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          {title}
        </div>
      ) : null}

      {subtitle ? (
        <div className="border-b border-border bg-background px-3 py-2 text-xs text-muted-foreground">
          {subtitle}
        </div>
      ) : null}

      {children ? <div className="p-2">{children}</div> : null}

      {actions && actions.length > 0 ? (
        <div className={cn(children ? "border-t border-border" : "", "p-1")}>
          {actions.map((a, idx) => {
            const hasSeverity = a.severity !== undefined;
            const sev = a.severity ?? "plain";
            return (
              <button
                key={idx}
                type="button"
                disabled={a.disabled}
                title={a.hint}
                className={cn(
                  "w-full select-none rounded px-3 py-2 text-left text-sm",
                  "transition-[filter,background-color] duration-150",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  idx > 0 ? "border-t border-border" : "",
                  hasSeverity ? ACTION_CLS[sev] : ACTION_DEFAULT_CLS
                )}
                onClick={() => {
                  a.onClick?.();
                  if (a.closeOnClick ?? true) close();
                }}
              >
                <span className="inline-flex items-center gap-2">
                  {a.icon ? <span className="inline-flex">{a.icon}</span> : null}
                  <span>{a.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  return createPortal(body, document.body);
}

SgPopup.displayName = "SgPopup";
