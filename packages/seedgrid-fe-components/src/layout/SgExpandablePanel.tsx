"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type SgExpandablePanelDirection = "left" | "right" | "top" | "bottom";
export type SgExpandablePanelPlacement = "start" | "center" | "end";
export type SgExpandablePanelMode = "inline" | "overlay";
export type SgExpandablePanelElevation = "none" | "sm" | "md" | "lg";
export type SgExpandablePanelRounded = "none" | "md" | "lg" | "xl";
export type SgExpandablePanelRole = "dialog" | "region";

export type SgExpandablePanelSize = {
  min?: number | string;
  max?: number | string;
  default?: number | string;
};

export type SgExpandablePanelAnimation = {
  type?: "slide" | "fade" | "none";
  durationMs?: number;
};

export type SgExpandablePanelProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  handle?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  expandTo: SgExpandablePanelDirection;
  placement?: SgExpandablePanelPlacement;
  mode?: SgExpandablePanelMode;

  size?: SgExpandablePanelSize;
  resizable?: boolean;
  onSizeChange?: (size: number | string) => void;

  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  trapFocus?: boolean;
  showBackdrop?: boolean;

  animation?: SgExpandablePanelAnimation;

  elevation?: SgExpandablePanelElevation;
  border?: boolean;
  rounded?: SgExpandablePanelRounded;

  ariaLabel?: string;
  role?: SgExpandablePanelRole;

  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  style?: React.CSSProperties;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function toCssSize(value: number | string | undefined, fallback: number) {
  if (value === undefined || value === null) return `${fallback}px`;
  if (typeof value === "number") return `${value}px`;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : `${fallback}px`;
}

function parsePx(value: number | string | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;
  const match = /^(-?\d+(?:\.\d+)?)(px)?$/.exec(trimmed);
  if (!match) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function axisForDirection(direction: SgExpandablePanelDirection) {
  return direction === "left" || direction === "right" ? "x" : "y";
}

function closedTransform(direction: SgExpandablePanelDirection) {
  if (direction === "right") return "-translate-x-full";
  if (direction === "left") return "translate-x-full";
  if (direction === "bottom") return "-translate-y-full";
  return "translate-y-full";
}

function elevationClass(elevation: SgExpandablePanelElevation) {
  if (elevation === "sm") return "shadow-sm";
  if (elevation === "md") return "shadow-md";
  if (elevation === "lg") return "shadow-lg";
  return "";
}

function roundedClass(rounded: SgExpandablePanelRounded) {
  if (rounded === "none") return "rounded-none";
  if (rounded === "md") return "rounded-md";
  if (rounded === "lg") return "rounded-lg";
  return "rounded-xl";
}

function getFocusableElements(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
    )
  ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
}

export const SgExpandablePanel = React.forwardRef<HTMLDivElement, SgExpandablePanelProps>(
  function SgExpandablePanel(props, ref) {
    const {
      header,
      children,
      footer,
      handle,
      open,
      defaultOpen = false,
      onOpenChange,
      expandTo,
      placement = "start",
      mode = "inline",
      size,
      resizable = false,
      onSizeChange,
      closeOnOutsideClick,
      closeOnEsc = true,
      trapFocus,
      showBackdrop = true,
      animation,
      elevation = "md",
      border = true,
      rounded = "lg",
      ariaLabel,
      role,
      className,
      contentClassName,
      headerClassName,
      bodyClassName,
      footerClassName,
      overlayClassName,
      style
    } = props;

    const isControlled = open !== undefined;
    const [openUncontrolled, setOpenUncontrolled] = React.useState<boolean>(defaultOpen);
    const isOpen = isControlled ? !!open : openUncontrolled;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setOpenUncontrolled(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const axis = axisForDirection(expandTo);
    const fallbackMainSize = axis === "x" ? 320 : 280;
    const [mainSize, setMainSize] = React.useState<number | string>(
      size?.default ?? fallbackMainSize
    );

    React.useEffect(() => {
      if (size?.default !== undefined) {
        setMainSize(size.default);
      }
    }, [size?.default]);

    const minPx = parsePx(size?.min) ?? (axis === "x" ? 180 : 140);
    const maxPx = parsePx(size?.max) ?? Number.POSITIVE_INFINITY;

    const mainSizeCss = toCssSize(mainSize, fallbackMainSize);
    const minSizeCss = size?.min !== undefined ? toCssSize(size.min, minPx) : undefined;
    const maxSizeCss =
      size?.max !== undefined && Number.isFinite(maxPx)
        ? toCssSize(size.max, maxPx)
        : size?.max !== undefined
        ? toCssSize(size.max, fallbackMainSize)
        : undefined;

    const resolvedTrapFocus = trapFocus ?? mode === "overlay";
    const resolvedCloseOnOutsideClick = closeOnOutsideClick ?? mode === "overlay";
    const shouldRenderBackdrop = showBackdrop || resolvedCloseOnOutsideClick;
    const animationType = animation?.type ?? "slide";
    const durationMs = animation?.durationMs ?? 180;

    const [mounted, setMounted] = React.useState(false);
    const [present, setPresent] = React.useState(isOpen);
    const [entered, setEntered] = React.useState(isOpen);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (mode !== "overlay") {
        setEntered(isOpen);
        return;
      }

      if (isOpen) {
        setPresent(true);
        const id = window.requestAnimationFrame(() => setEntered(true));
        return () => window.cancelAnimationFrame(id);
      }

      setEntered(false);
      const delay = animationType === "none" ? 0 : durationMs;
      const id = window.setTimeout(() => setPresent(false), delay);
      return () => window.clearTimeout(id);
    }, [mode, isOpen, animationType, durationMs]);

    React.useEffect(() => {
      if (mode !== "overlay" || !present || !isOpen) return;
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }, [mode, present, isOpen]);

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const overlayRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = React.useMemo(
      () => (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const lastActiveRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      if (mode !== "overlay" || !isOpen) return;
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      const id = window.setTimeout(() => {
        const root = panelRef.current;
        if (!root) return;
        const focusables = getFocusableElements(root);
        (focusables[0] ?? root).focus?.();
      }, 0);
      return () => window.clearTimeout(id);
    }, [mode, isOpen]);

    React.useEffect(() => {
      if (mode !== "overlay") return;
      if (isOpen || present) return;
      lastActiveRef.current?.focus?.();
    }, [mode, isOpen, present]);

    React.useEffect(() => {
      if (mode !== "overlay" || !isOpen) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (closeOnEsc && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          return;
        }
        if (!resolvedTrapFocus || event.key !== "Tab") return;
        const root = panelRef.current;
        if (!root) return;
        const focusables = getFocusableElements(root);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        const active = document.activeElement as HTMLElement | null;
        if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [mode, isOpen, closeOnEsc, resolvedTrapFocus, setOpen]);

    const resizeState = React.useRef<{
      startX: number;
      startY: number;
      startSize: number;
    } | null>(null);

    const onResizeStart = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!resizable) return;
        const panel = panelRef.current;
        if (!panel) return;
        event.preventDefault();
        event.stopPropagation();

        const rect = panel.getBoundingClientRect();
        resizeState.current = {
          startX: event.clientX,
          startY: event.clientY,
          startSize: axis === "x" ? rect.width : rect.height
        };

        const onMove = (moveEvent: PointerEvent) => {
          if (!resizeState.current) return;
          const dx = moveEvent.clientX - resizeState.current.startX;
          const dy = moveEvent.clientY - resizeState.current.startY;
          const delta =
            axis === "x"
              ? expandTo === "right"
                ? dx
                : -dx
              : expandTo === "bottom"
              ? dy
              : -dy;
          const next = clamp(resizeState.current.startSize + delta, minPx, maxPx);
          setMainSize(next);
          onSizeChange?.(next);
        };

        const onUp = () => {
          resizeState.current = null;
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onUp);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
      },
      [axis, expandTo, maxPx, minPx, onSizeChange, resizable]
    );

    const panelBaseClass = cn(
      "relative min-h-0 min-w-0 overflow-hidden bg-background text-foreground",
      "flex flex-col",
      border ? "border border-border" : "",
      roundedClass(rounded),
      elevationClass(elevation),
      animationType === "none"
        ? ""
        : "transition-[transform,opacity,width,height] ease-out",
      contentClassName
    );

    const panelRole = role ?? (mode === "overlay" ? "dialog" : "region");
    const panelAriaLabel = ariaLabel ?? "Expandable panel";
    const transitionStyle: React.CSSProperties =
      animationType === "none" ? { transitionDuration: "0ms" } : { transitionDuration: `${durationMs}ms` };

    const resizeHandleClass =
      expandTo === "right"
        ? "absolute inset-y-0 right-0 w-1 cursor-ew-resize"
        : expandTo === "left"
        ? "absolute inset-y-0 left-0 w-1 cursor-ew-resize"
        : expandTo === "bottom"
        ? "absolute inset-x-0 bottom-0 h-1 cursor-ns-resize"
        : "absolute inset-x-0 top-0 h-1 cursor-ns-resize";

    const renderPanelContent = (extraStyle?: React.CSSProperties, stateClass?: string) => (
      <div
        ref={mergedRef}
        role={panelRole}
        aria-modal={mode === "overlay" ? true : undefined}
        aria-label={panelAriaLabel}
        tabIndex={-1}
        className={cn(panelBaseClass, stateClass, className)}
        style={{ ...extraStyle, ...style, ...transitionStyle }}
      >
        {handle ? <div className="px-3 pt-2">{handle}</div> : null}
        {header ? (
          <div className={cn("shrink-0 border-b border-border px-4 py-3", headerClassName)}>{header}</div>
        ) : null}
        <div className={cn("min-h-0 flex-1 overflow-auto px-4 py-3", bodyClassName)}>{children}</div>
        {footer ? (
          <div className={cn("shrink-0 border-t border-border px-4 py-3", footerClassName)}>{footer}</div>
        ) : null}
        {resizable ? (
          <div
            className={cn(
              resizeHandleClass,
              "z-20 bg-transparent transition-colors hover:bg-primary/20 active:bg-primary/30"
            )}
            onPointerDown={onResizeStart}
            aria-hidden="true"
          />
        ) : null}
      </div>
    );

    if (mode === "inline") {
      const wrapperStyle: React.CSSProperties =
        axis === "x"
          ? {
              width: isOpen ? mainSizeCss : "0px",
              minWidth: isOpen ? minSizeCss : undefined,
              maxWidth: maxSizeCss
            }
          : {
              height: isOpen ? mainSizeCss : "0px",
              minHeight: isOpen ? minSizeCss : undefined,
              maxHeight: maxSizeCss
            };

      const inlineStateClass =
        animationType === "fade"
          ? isOpen
            ? "opacity-100"
            : "opacity-0"
          : animationType === "slide"
          ? cn(
              isOpen ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0",
              !isOpen ? closedTransform(expandTo) : ""
            )
          : "";

      return (
        <div
          className={cn(
            "relative min-h-0 min-w-0 overflow-hidden",
            animationType === "none" ? "" : "transition-[width,height,opacity] ease-out"
          )}
          style={{ ...wrapperStyle, ...transitionStyle }}
        >
          {renderPanelContent(
            axis === "x"
              ? { width: "100%", minWidth: 0, height: "100%" }
              : { height: "100%", minHeight: 0, width: "100%" },
            inlineStateClass
          )}
        </div>
      );
    }

    if (!mounted || !present) return null;

    const overlayContainerClass =
      axis === "x"
        ? cn(
            "fixed inset-0 z-[1000] flex pointer-events-none",
            expandTo === "right" ? "justify-start" : "justify-end",
            placement === "start" ? "items-start" : placement === "center" ? "items-center" : "items-end"
          )
        : cn(
            "fixed inset-0 z-[1000] flex flex-col pointer-events-none",
            expandTo === "bottom" ? "justify-start" : "justify-end",
            placement === "start" ? "items-start" : placement === "center" ? "items-center" : "items-end"
          );

    const overlayPanelStyle: React.CSSProperties =
      axis === "x"
        ? {
            width: mainSizeCss,
            minWidth: minSizeCss,
            maxWidth: maxSizeCss,
            height: placement === "center" ? "calc(100% - 2rem)" : "100%"
          }
        : {
            height: mainSizeCss,
            minHeight: minSizeCss,
            maxHeight: maxSizeCss,
            width: placement === "center" ? "calc(100% - 2rem)" : "100%"
          };

    const overlayStateClass =
      animationType === "fade"
        ? entered
          ? "opacity-100"
          : "opacity-0"
        : animationType === "slide"
        ? cn(
            entered ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0",
            !entered ? closedTransform(expandTo) : ""
          )
        : "";

    return createPortal(
      <div className="fixed inset-0 z-[1000] pointer-events-none">
        {shouldRenderBackdrop ? (
          <div
            ref={overlayRef}
            className={cn(
              "absolute inset-0 pointer-events-auto",
              showBackdrop ? "bg-black/40 backdrop-blur-[1px]" : "bg-transparent",
              animationType === "none" ? "" : "transition-opacity ease-out",
              entered ? "opacity-100" : "opacity-0",
              overlayClassName
            )}
            style={transitionStyle}
            onMouseDown={(event) => {
              if (!resolvedCloseOnOutsideClick) return;
              if (event.target === overlayRef.current) setOpen(false);
            }}
          />
        ) : null}

        <div className={overlayContainerClass}>
          <div className="pointer-events-auto">
            {renderPanelContent(overlayPanelStyle, overlayStateClass)}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

SgExpandablePanel.displayName = "SgExpandablePanel";
