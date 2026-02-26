"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSgDockLayout } from "./SgDockLayout";
import { useHasSgEnvironmentProvider, useSgPersistence } from "../environment/SgEnvironmentProvider";

export type SgToolBarOrientation = "horizontal" | "vertical";
export type SgToolBarSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";

export type SgToolBarSize = {
  w?: number;
  h?: number;
};

export type SgToolBarProps = {
  id: string;
  title?: React.ReactNode;
  orientation?: SgToolBarOrientation;
  size?: SgToolBarSize;
  className?: string;
  style?: React.CSSProperties;
  dockZone?: "top" | "bottom" | "left" | "right" | "free";

  draggable?: boolean;
  freeDrag?: boolean;
  defaultPosition?: { x: number; y: number };

  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapseDirection?: "left" | "right" | "top" | "bottom";
  onCollapsedChange?: (collapsed: boolean) => void;

  children?: React.ReactNode;
};

export type SgToolbarIconButtonProps = {
  icon?: React.ReactNode | string;
  hint?: string;
  severity?: SgToolBarSeverity;
  disabled?: boolean;
  onClick?: () => void;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const BTN_COLORS: Record<SgToolBarSeverity, { bg: string; fg: string; ring: string }> = {
  primary: {
    bg: "hsl(var(--primary))",
    fg: "hsl(var(--primary-foreground))",
    ring: "hsl(var(--primary)/0.35)"
  },
  secondary: {
    bg: "hsl(var(--secondary))",
    fg: "hsl(var(--secondary-foreground))",
    ring: "hsl(var(--secondary)/0.35)"
  },
  success: {
    bg: "hsl(var(--tertiary,var(--accent,var(--primary))))",
    fg: "hsl(var(--tertiary-foreground,var(--accent-foreground,var(--primary-foreground))))",
    ring: "hsl(var(--tertiary,var(--accent,var(--primary)))/0.35)"
  },
  info: {
    bg: "hsl(var(--secondary,var(--primary)))",
    fg: "hsl(var(--secondary-foreground,var(--primary-foreground)))",
    ring: "hsl(var(--secondary,var(--primary))/0.35)"
  },
  warning: {
    bg: "hsl(var(--accent,var(--secondary,var(--primary))))",
    fg: "hsl(var(--accent-foreground,var(--secondary-foreground,var(--primary-foreground))))",
    ring: "hsl(var(--accent,var(--secondary,var(--primary)))/0.35)"
  },
  help: {
    bg: "hsl(var(--secondary,var(--primary)))",
    fg: "hsl(var(--secondary-foreground,var(--primary-foreground)))",
    ring: "hsl(var(--secondary,var(--primary))/0.35)"
  },
  danger: {
    bg: "hsl(var(--destructive))",
    fg: "hsl(var(--destructive-foreground))",
    ring: "hsl(var(--destructive)/0.35)"
  },
  plain: {
    bg: "hsl(var(--muted))",
    fg: "hsl(var(--muted-foreground))",
    ring: "hsl(var(--muted)/0.35)"
  }
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseStoredDragPosition(raw: unknown): { x: number; y: number } | null {
  const value = typeof raw === "string" ? (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })() : raw;

  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as { x?: unknown }).x !== "number" ||
    typeof (value as { y?: unknown }).y !== "number" ||
    !Number.isFinite((value as { x: number }).x) ||
    !Number.isFinite((value as { y: number }).y)
  ) {
    return null;
  }

  return {
    x: (value as { x: number }).x,
    y: (value as { y: number }).y
  };
}

type SgToolBarDragMode = "fixed" | "absolute";

type SgToolBarDragPos = {
  x: number;
  y: number;
  mode: SgToolBarDragMode;
};

function useControlledState<T>(args: { value?: T; defaultValue: T; onChange?: (next: T) => void }) {
  const { value, defaultValue, onChange } = args;
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [current, set] as const;
}

export function SgToolBar(props: Readonly<SgToolBarProps>) {
  const hasEnvironmentProvider = useHasSgEnvironmentProvider();
  const { load: loadPersistedState, save: savePersistedState, clear: clearPersistedState } = useSgPersistence();
  const {
    id,
    title,
    orientation = "vertical",
    size,
    className,
    style,
    dockZone,
    draggable = true,
    freeDrag = true,
    defaultPosition,
    collapsible = true,
    collapsed,
    defaultCollapsed = false,
    collapseDirection,
    onCollapsedChange,
    children
  } = props;

  const dock = useSgDockLayout();
  const inDock = !!dock;
  const assignedZone = inDock ? dock.getToolbarZone(id) : null;
  const effectiveZone = assignedZone ?? dockZone ?? "free";
  const portalTarget = inDock ? dock.getZoneElement(effectiveZone) : null;

  const [isCollapsed, setIsCollapsed] = useControlledState<boolean>({
    value: collapsed ?? (inDock ? dock.getToolbarCollapsed(id) : undefined),
    defaultValue: defaultCollapsed,
    onChange: (next) => {
      onCollapsedChange?.(next);
      if (inDock) dock.setToolbarCollapsed(id, next);
    }
  });

  const [dragPos, setDragPos] = React.useState<SgToolBarDragPos | null>(null);
  const dragPosRef = React.useRef<SgToolBarDragPos | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const dragStart = React.useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    mode: SgToolBarDragMode;
  } | null>(null);
  const dragMoved = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const storageKey = React.useMemo(() => `sg-toolbar-pos:${id}`, [id]);

  const loadStoredPosition = React.useCallback(async (): Promise<{ x: number; y: number } | null> => {
    if (!storageKey) return null;

    if (hasEnvironmentProvider) {
      try {
        const loaded = await loadPersistedState(storageKey);
        if (loaded === null || loaded === undefined) return null;
        const parsed = parseStoredDragPosition(loaded);
        if (!parsed) {
          await clearPersistedState(storageKey);
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = parseStoredDragPosition(raw);
      if (!parsed) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }, [clearPersistedState, hasEnvironmentProvider, loadPersistedState, storageKey]);

  const saveStoredPosition = React.useCallback(async (nextPos: { x: number; y: number }) => {
    if (!storageKey) return;

    if (hasEnvironmentProvider) {
      try {
        await savePersistedState(storageKey, nextPos);
      } catch {
        // ignore
      }
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextPos));
    } catch {
      // ignore
    }
  }, [hasEnvironmentProvider, savePersistedState, storageKey]);

  const resolveFreeDragMode = React.useCallback((): SgToolBarDragMode => {
    const container = containerRef.current;
    if (!container) return "fixed";
    const offsetParent = container.offsetParent;
    if (
      offsetParent instanceof HTMLElement &&
      offsetParent !== document.body &&
      offsetParent !== document.documentElement
    ) {
      return "absolute";
    }
    return "fixed";
  }, []);

  const getDragBounds = React.useCallback((mode: SgToolBarDragMode) => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();

    if (mode === "absolute") {
      const offsetParent = containerRef.current.offsetParent;
      if (offsetParent instanceof HTMLElement) {
        return {
          minX: 0,
          minY: 0,
          maxX: Math.max(0, offsetParent.clientWidth - rect.width),
          maxY: Math.max(0, offsetParent.clientHeight - rect.height)
        };
      }
    }

    return {
      minX: 0,
      minY: 0,
      maxX: Math.max(0, window.innerWidth - rect.width),
      maxY: Math.max(0, window.innerHeight - rect.height)
    };
  }, []);

  React.useEffect(() => {
    if (!inDock) return;
    dock.ensureToolbar(id, {
      zone: effectiveZone,
      collapsed: defaultCollapsed,
      orientation
    });
  }, [dock, id, effectiveZone, defaultCollapsed, inDock, orientation]);

  React.useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  React.useEffect(() => {
    if (!freeDrag) return;

    let alive = true;
    (async () => {
      const parsed = await loadStoredPosition();
      if (!alive || !parsed) return;

      const mode = resolveFreeDragMode();
      const bounds = getDragBounds(mode);
      if (!bounds) return;

      const next = {
        x: clamp(parsed.x, bounds.minX, bounds.maxX),
        y: clamp(parsed.y, bounds.minY, bounds.maxY),
        mode
      } as SgToolBarDragPos;
      dragPosRef.current = next;
      setDragPos(next);
    })();

    return () => {
      alive = false;
    };
  }, [freeDrag, getDragBounds, loadStoredPosition, resolveFreeDragMode]);

  React.useEffect(() => {
    const defaultX = defaultPosition?.x;
    const defaultY = defaultPosition?.y;
    if (defaultX === undefined || defaultY === undefined || !freeDrag) return;
    const nextMode = resolveFreeDragMode();
    setDragPos((prev) => {
      if (prev) return prev;
      return { x: defaultX, y: defaultY, mode: nextMode };
    });
  }, [defaultPosition?.x, defaultPosition?.y, freeDrag, resolveFreeDragMode]);

  React.useEffect(() => {
    if (!dragActive) return;
    const previousBodyCursor = document.body.style.cursor;
    const previousHtmlCursor = document.documentElement.style.cursor;
    document.body.style.cursor = "grabbing";
    document.documentElement.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = previousBodyCursor;
      document.documentElement.style.cursor = previousHtmlCursor;
    };
  }, [dragActive]);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if (!draggable) return;
      if (!containerRef.current) return;
      if (!freeDrag && !inDock) return;
      event.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const dragMode: SgToolBarDragMode = freeDrag
        ? (inDock ? "fixed" : resolveFreeDragMode())
        : "fixed";
      let initialLeft = rect.left;
      let initialTop = rect.top;

      if (dragMode === "absolute") {
        const offsetParent = containerRef.current.offsetParent;
        if (offsetParent instanceof HTMLElement) {
          const parentRect = offsetParent.getBoundingClientRect();
          initialLeft = rect.left - parentRect.left;
          initialTop = rect.top - parentRect.top;
        }
      }

      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        left: initialLeft,
        top: initialTop,
        mode: dragMode
      };
      setDragActive(true);
      dragMoved.current = false;

      const handleMove = (moveEvent: PointerEvent) => {
        if (!dragStart.current) return;
        const dx = moveEvent.clientX - dragStart.current.x;
        const dy = moveEvent.clientY - dragStart.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;
        const bounds = getDragBounds(dragStart.current.mode);
        const next = {
          x: bounds ? clamp(dragStart.current.left + dx, bounds.minX, bounds.maxX) : dragStart.current.left + dx,
          y: bounds ? clamp(dragStart.current.top + dy, bounds.minY, bounds.maxY) : dragStart.current.top + dy,
          mode: dragStart.current.mode
        };
        dragPosRef.current = next;
        setDragPos(next);
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        setDragActive(false);
        if (!dragStart.current) return;
        const start = dragStart.current;
        dragStart.current = null;
        if (!dragMoved.current) return;

        if (freeDrag) {
          const current = dragPosRef.current ?? {
            x: start.left,
            y: start.top,
            mode: start.mode
          };
          const bounds = getDragBounds(current.mode);
          const clamped = bounds
            ? {
              x: clamp(current.x, bounds.minX, bounds.maxX),
              y: clamp(current.y, bounds.minY, bounds.maxY),
              mode: current.mode
            }
            : current;
          dragPosRef.current = clamped;
          setDragPos(clamped);
          void saveStoredPosition({ x: clamped.x, y: clamped.y });
        } else if (inDock) {
          const zone = dock.getZoneAtPoint(upEvent.clientX, upEvent.clientY);
          if (zone) dock.moveToolbar(id, zone);
          dragPosRef.current = null;
          setDragPos(null);
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [draggable, freeDrag, inDock, dock, id, resolveFreeDragMode, getDragBounds, saveStoredPosition]
  );

  const direction =
    collapseDirection ??
    (orientation === "horizontal"
      ? "left"
      : "top");

  const showContent = !isCollapsed;

  const toolbar = (
    <div
      ref={containerRef}
      className={cn(
        "select-none rounded-xl border border-border bg-background shadow-sm",
        "flex",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col items-center",
        className
      )}
      style={{
        width: size?.w,
        height: size?.h,
        cursor: draggable ? (dragActive ? "grabbing" : "grab") : undefined,
        position: dragPos?.mode,
        left: dragPos?.x,
        top: dragPos?.y,
        zIndex: dragPos ? 1000 : undefined,
        ...style
      }}
      onPointerDown={handlePointerDown}
    >
      {(title || collapsible) && (
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 w-full",
            orientation === "horizontal"
              ? showContent
                ? "border-r border-border"
                : ""
              : showContent
                ? "border-b border-border"
                : ""
          )}
        >
          {title ? (
            <span className="text-xs font-semibold text-foreground truncate">
              {title}
            </span>
          ) : null}
          {collapsible ? (
            <button
              type="button"
              className="ml-auto inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
              onClick={() => setIsCollapsed(!isCollapsed)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Toggle toolbar"
            >
              <CollapseIcon direction={direction} collapsed={isCollapsed} />
            </button>
          ) : null}
        </div>
      )}

      {showContent ? (
        <div
          className={cn(
            "flex gap-2 p-2",
            orientation === "horizontal" ? "flex-row" : "flex-col"
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );

  if (portalTarget) {
    return createPortal(toolbar, portalTarget);
  }

  return toolbar;
}

export function SgToolbarIconButton(
  props: Readonly<SgToolbarIconButtonProps & { hideLabel?: boolean }>
) {
  const { icon, hint, severity = "plain", disabled, onClick, hideLabel } = props;
  const c = BTN_COLORS[severity];
  const text = typeof icon === "string" ? icon : null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={hint}
      className={cn(
        "group",
        "relative inline-flex items-center justify-center rounded-lg",
        "transition-[transform,filter] duration-150",
        "hover:brightness-95 active:brightness-90",
        "focus-visible:outline-none focus-visible:ring-4",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
      style={{
        width: 40,
        height: 40,
        backgroundColor: c.bg,
        color: c.fg,
        ["--tw-ring-color" as string]: c.ring
      }}
    >
      {icon && typeof icon !== "string" ? (
        <span className="inline-flex">{icon}</span>
      ) : (
        <span className="text-[10px] font-semibold">{text?.slice(0, 2)}</span>
      )}
      {!hideLabel && hint ? (
        <span className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-[11px] text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {hint}
        </span>
      ) : null}
    </button>
  );
}

function CollapseIcon(props: { direction: "left" | "right" | "top" | "bottom"; collapsed: boolean }) {
  const { direction, collapsed } = props;
  const path = (() => {
    if (direction === "top") {
      return collapsed ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6";
    }
    if (direction === "bottom") {
      return collapsed ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6";
    }
    if (direction === "left") {
      return collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6";
    }
    return collapsed ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
  })();

  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

SgToolBar.displayName = "SgToolBar";
SgToolbarIconButton.displayName = "SgToolbarIconButton";
