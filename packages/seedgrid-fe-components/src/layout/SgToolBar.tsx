"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSgDockLayout, type SgDockZoneId } from "./SgDockLayout";
import { useHasSgEnvironmentProvider, useSgPersistence } from "../environment/SgEnvironmentProvider";

export type SgToolBarOrientation = "horizontal" | "vertical";
export type SgToolBarOrientationDirection =
  | "vertical-up"
  | "vertical-down"
  | "horizontal-left"
  | "horizontal-right";
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
  orientationDirection?: SgToolBarOrientationDirection;
  buttonsPerDirection?: number;
  bgColorTitle?: string;
  bgColor?: string;
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
  onCollapsedChange?: (collapsed: boolean) => void;

  children?: React.ReactNode;
};

export type SgToolbarIconButtonProps = {
  icon?: React.ReactNode | string;
  label?: string;
  showLabel?: boolean;
  hint?: string;
  loading?: boolean;
  severity?: SgToolBarSeverity;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
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

function resolveOrientationDirection(
  orientationDirection: SgToolBarOrientationDirection
): { orientation: SgToolBarOrientation; direction: "left" | "right" | "up" | "down" } {
  switch (orientationDirection) {
    case "horizontal-right":
      return { orientation: "horizontal", direction: "left" };
    case "horizontal-left":
      return { orientation: "horizontal", direction: "right" };
    case "vertical-up":
      return { orientation: "vertical", direction: "up" };
    case "vertical-down":
    default:
      return { orientation: "vertical", direction: "down" };
  }
}

function resolveDockOrientationDirection(
  orientationDirection: SgToolBarOrientationDirection,
  inDock: boolean,
  zone: "top" | "bottom" | "left" | "right" | "free"
): SgToolBarOrientationDirection {
  if (!inDock || zone === "free") return orientationDirection;

  if (zone === "top" || zone === "bottom") {
    return orientationDirection.startsWith("horizontal") ? orientationDirection : "horizontal-left";
  }

  return orientationDirection.startsWith("vertical") ? orientationDirection : "vertical-down";
}

type SgToolBarDragMode = "fixed" | "absolute";

type SgToolBarDragPos = {
  x: number;
  y: number;
  mode: SgToolBarDragMode;
};

const SgToolbarOrientationContext = React.createContext<SgToolBarOrientation>("vertical");

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
    orientationDirection,
    buttonsPerDirection,
    bgColorTitle,
    bgColor,
    size,
    className,
    style,
    dockZone,
    draggable = false,
    freeDrag = false,
    defaultPosition,
    collapsible = true,
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    children
  } = props;

  const dock = useSgDockLayout();
  const inDock = !!dock;
  const assignedZone = inDock ? dock.getToolbarZone(id) : null;
  const effectiveZone = assignedZone ?? dockZone ?? "free";
  const [dragHoverZone, setDragHoverZone] = React.useState<SgDockZoneId | null>(null);
  const dragHoverZoneRef = React.useRef<SgDockZoneId | null>(null);
  const zoneForOrientation = inDock && !freeDrag && dragHoverZone ? dragHoverZone : effectiveZone;
  const resolvedOrientationDirection = resolveDockOrientationDirection(
    orientationDirection ?? "vertical-down",
    inDock,
    zoneForOrientation
  );
  const { orientation, direction } = resolveOrientationDirection(resolvedOrientationDirection);
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
  const setDragHoverZoneSafe = React.useCallback((next: SgDockZoneId | null) => {
    if (dragHoverZoneRef.current === next) return;
    dragHoverZoneRef.current = next;
    setDragHoverZone(next);
  }, []);

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
      if (inDock && !freeDrag) {
        dock.setDropPreviewActive(true);
        setDragHoverZoneSafe(dock.getZoneAtPoint(event.clientX, event.clientY) ?? effectiveZone);
      }

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
        if (inDock && !freeDrag) {
          setDragHoverZoneSafe(dock.getZoneAtPoint(moveEvent.clientX, moveEvent.clientY));
        }
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        setDragActive(false);
        setDragHoverZoneSafe(null);
        if (inDock && !freeDrag) {
          dock.setDropPreviewActive(false);
        }
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
          const zone = dragHoverZoneRef.current ?? dock.getZoneAtPoint(upEvent.clientX, upEvent.clientY);
          if (zone) dock.moveToolbar(id, zone);
          dragPosRef.current = null;
          setDragPos(null);
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [
      draggable,
      freeDrag,
      inDock,
      dock,
      id,
      effectiveZone,
      resolveFreeDragMode,
      getDragBounds,
      saveStoredPosition,
      setDragHoverZoneSafe
    ]
  );

  const showContent = !isCollapsed;
  const openUp = orientation === "vertical" && direction === "up";
  const openLeft = orientation === "horizontal" && direction === "left";
  const normalizedButtonsPerDirection =
    Number.isFinite(buttonsPerDirection) && typeof buttonsPerDirection === "number" && buttonsPerDirection > 0
      ? Math.floor(buttonsPerDirection)
      : undefined;
  const showLeadingCollapseButton = orientation === "horizontal" && openLeft && showContent;
  const collapseIconDirection: "left" | "right" | "up" | "down" =
    resolvedOrientationDirection === "horizontal-right" ? "right" : direction;

  const content = showContent ? (
    <div
      className={cn(
        "gap-2 p-2",
        normalizedButtonsPerDirection
          ? "grid"
          : orientation === "horizontal"
            ? "flex flex-row"
            : "flex flex-col"
      )}
      style={
        normalizedButtonsPerDirection
          ? orientation === "horizontal"
            ? { gridTemplateColumns: `repeat(${normalizedButtonsPerDirection}, max-content)` }
            : {
              gridTemplateRows: `repeat(${normalizedButtonsPerDirection}, max-content)`,
              gridAutoFlow: "column"
            }
          : undefined
      }
    >
      {children}
    </div>
  ) : null;

  const toolbar = (
    <SgToolbarOrientationContext.Provider value={orientation}>
      <div
        ref={containerRef}
        data-sg-toolbar-root="true"
        className={cn(
          "select-none rounded-xl border border-border bg-background shadow-sm",
          orientation === "horizontal" ? "inline-flex flex-row items-center" : "inline-flex flex-col items-center",
          className
        )}
        style={{
          width: size?.w,
          height: size?.h,
          backgroundColor: bgColor,
          cursor: draggable ? (dragActive ? "grabbing" : "grab") : undefined,
          position: dragPos?.mode,
          left: dragPos?.x,
          top: dragPos?.y,
          zIndex: dragPos ? 1000 : undefined,
          ...style
        }}
        onPointerDown={handlePointerDown}
      >
        {openUp || openLeft ? content : null}

        {(title || collapsible) && (
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1",
              orientation === "horizontal" ? "w-auto" : "w-full",
              orientation === "horizontal"
                ? showContent
                  ? (openLeft ? "border-l border-border" : "border-r border-border")
                  : ""
                : showContent
                  ? (openUp ? "border-t border-border" : "border-b border-border")
                  : ""
            )}
            style={{ backgroundColor: bgColorTitle }}
        >
            {collapsible && showLeadingCollapseButton ? (
              <button
                type="button"
                className="inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
                onClick={() => setIsCollapsed(!isCollapsed)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Toggle toolbar"
              >
                <CollapseIcon direction={collapseIconDirection} collapsed={isCollapsed} />
              </button>
            ) : null}
            {title ? (
              <span className="text-xs font-semibold text-foreground truncate">
                {title}
              </span>
            ) : null}
            {collapsible && !showLeadingCollapseButton ? (
              <button
                type="button"
                className="ml-auto inline-flex size-6 items-center justify-center rounded-md hover:bg-muted"
                onClick={() => setIsCollapsed(!isCollapsed)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Toggle toolbar"
              >
                <CollapseIcon direction={collapseIconDirection} collapsed={isCollapsed} />
              </button>
            ) : null}
          </div>
        )}

        {openUp || openLeft ? null : content}
      </div>
    </SgToolbarOrientationContext.Provider>
  );

  const needsCenterWrapper = inDock && (effectiveZone === "right" || effectiveZone === "left");
  const toolbarForRender = needsCenterWrapper ? (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {toolbar}
    </div>
  ) : toolbar;

  if (portalTarget) {
    return createPortal(toolbarForRender, portalTarget);
  }

  return toolbarForRender;
}

export function SgToolbarIconButton(
  props: Readonly<SgToolbarIconButtonProps & { hideLabel?: boolean }>
) {
  const { icon, label, showLabel = true, hint, loading = false, severity = "plain", disabled, onClick, hideLabel } = props;
  const toolbarOrientation = React.useContext(SgToolbarOrientationContext);
  const isHorizontalToolbar = toolbarOrientation === "horizontal";
  const c = BTN_COLORS[severity];
  const text = typeof icon === "string" ? icon : null;
  const hasVisibleLabel = Boolean(label) && showLabel && !hideLabel;
  const [isPending, setIsPending] = React.useState(false);
  const isLoading = loading || isPending;
  const showHintTooltip = Boolean(hint) && !hideLabel;
  const [hintPosition, setHintPosition] = React.useState({ x: 0, y: 0 });
  const [isHintHovered, setIsHintHovered] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleClick = React.useCallback(() => {
    if (!onClick || disabled || isLoading) return;

    const result = onClick();
    if (!result || typeof (result as { then?: unknown }).then !== "function") return;

    setIsPending(true);
    void (result as Promise<void>).finally(() => {
      setIsPending(false);
    });
  }, [disabled, isLoading, onClick]);

  const updateHintPosition = React.useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const toolbarRoot = buttonRef.current.closest("[data-sg-toolbar-root='true']");
    const toolbarRect = toolbarRoot instanceof HTMLElement ? toolbarRoot.getBoundingClientRect() : null;
    if (isHorizontalToolbar) {
      const baseY = toolbarRect ? toolbarRect.top : buttonRect.top;
      setHintPosition({
        x: buttonRect.left + (buttonRect.width / 2),
        y: baseY - 8
      });
      return;
    }

    const baseX = toolbarRect ? toolbarRect.right : buttonRect.right;
    setHintPosition({
      x: baseX + 8,
      y: buttonRect.top + (buttonRect.height / 2)
    });
  }, [isHorizontalToolbar]);

  React.useEffect(() => {
    if (!showHintTooltip || !isHintHovered) return;

    updateHintPosition();

    const handleReposition = () => updateHintPosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isHintHovered, showHintTooltip, updateHintPosition]);

  const hintNode =
    showHintTooltip && isHintHovered && typeof document !== "undefined"
      ? createPortal(
        <span
          className="pointer-events-none fixed z-[1200] whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-[11px] text-background"
          style={{
            left: hintPosition.x,
            top: hintPosition.y,
            transform: isHorizontalToolbar ? "translate(-50%, -100%)" : "translateY(-50%)"
          }}
        >
          {hint}
        </span>,
        document.body
      )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled || isLoading}
        onClick={handleClick}
        aria-busy={isLoading || undefined}
        onMouseEnter={showHintTooltip ? () => {
          updateHintPosition();
          setIsHintHovered(true);
        } : undefined}
        onMouseLeave={showHintTooltip ? () => setIsHintHovered(false) : undefined}
        aria-label={hint ?? label ?? text ?? undefined}
        className={cn(
          "group",
          "relative inline-flex items-center justify-center rounded-lg",
          "transition-[transform,filter] duration-150",
          "hover:brightness-95 active:brightness-90",
          "focus-visible:outline-none focus-visible:ring-4",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          hasVisibleLabel ? "gap-2 px-2 pr-3" : ""
        )}
        style={{
          width: hasVisibleLabel ? undefined : 40,
          minWidth: 40,
          height: 40,
          backgroundColor: c.bg,
          color: c.fg,
          ["--tw-ring-color" as string]: c.ring
        }}
      >
        {isLoading ? (
          <span className="inline-flex size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : icon && typeof icon !== "string" ? (
          <span className="inline-flex shrink-0">{icon}</span>
        ) : (
          <span className="shrink-0 text-[10px] font-semibold">{text?.slice(0, 2)}</span>
        )}
        {hasVisibleLabel ? (
          <span className="text-xs font-medium leading-none">{label}</span>
        ) : null}
      </button>
      {hintNode}
    </>
  );
}

function CollapseIcon(props: { direction: "left" | "right" | "up" | "down"; collapsed: boolean }) {
  const { direction, collapsed } = props;
  const arrowUp = "M6 15l6-6 6 6";
  const arrowDown = "M6 9l6 6 6-6";
  const arrowLeft = "M15 6l-6 6 6 6";
  const arrowRight = "M9 6l6 6-6 6";

  const path =
    direction === "down" ? (collapsed ? arrowDown : arrowUp)
      : direction === "up" ? (collapsed ? arrowUp : arrowDown)
        : direction === "left" ? (collapsed ? arrowLeft : arrowRight)
          : (collapsed ? arrowRight : arrowLeft);

  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

SgToolBar.displayName = "SgToolBar";
SgToolbarIconButton.displayName = "SgToolbarIconButton";
