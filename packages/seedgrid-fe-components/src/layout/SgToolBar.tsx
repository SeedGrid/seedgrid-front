"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSgDockLayout } from "./SgDockLayout";

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

  const [dragPos, setDragPos] = React.useState<{ x: number; y: number } | null>(
    defaultPosition ?? null
  );
  const dragStart = React.useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const dragMoved = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!inDock) return;
    dock.ensureToolbar(id, {
      zone: effectiveZone,
      collapsed: defaultCollapsed,
      orientation
    });
  }, [dock, id, effectiveZone, defaultCollapsed, inDock, orientation]);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if (!draggable) return;
      if (!containerRef.current) return;
      if (!freeDrag && !inDock) return;
      event.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        left: rect.left,
        top: rect.top
      };
      dragMoved.current = false;

      const handleMove = (moveEvent: PointerEvent) => {
        if (!dragStart.current) return;
        const dx = moveEvent.clientX - dragStart.current.x;
        const dy = moveEvent.clientY - dragStart.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;
        const next = { x: dragStart.current.left + dx, y: dragStart.current.top + dy };
        setDragPos(next);
      };

      const handleUp = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        if (!dragStart.current) return;
        dragStart.current = null;
        if (!dragMoved.current) return;

        if (inDock) {
          const zone = dock.getZoneAtPoint(upEvent.clientX, upEvent.clientY);
          if (zone) dock.moveToolbar(id, zone);
          setDragPos(null);
        } else if (freeDrag) {
          const wh = containerRef.current?.getBoundingClientRect();
          if (wh) {
            const maxX = Math.max(0, window.innerWidth - wh.width);
            const maxY = Math.max(0, window.innerHeight - wh.height);
            setDragPos({
              x: clamp(dragPos?.x ?? wh.left, 0, maxX),
              y: clamp(dragPos?.y ?? wh.top, 0, maxY)
            });
          }
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [draggable, freeDrag, inDock, dock, id, dragPos]
  );

  const direction =
    collapseDirection ??
    (orientation === "horizontal"
      ? "left"
      : "top");

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
        position: dragPos ? "fixed" : undefined,
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
            "flex items-center gap-2 px-2 py-1 border-b border-border w-full",
            orientation === "horizontal" ? "border-b-0 border-r" : ""
          )}
        >
          {title ? (
            <span className={cn("text-xs font-semibold text-foreground truncate", isCollapsed ? "hidden" : "")}>
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

      <div
        className={cn(
          "flex gap-2 p-2",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          isCollapsed ? "opacity-90" : ""
        )}
      >
        {React.Children.map(children, (child) => {
          if (!isCollapsed) return child;
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, { hideLabel: true });
        })}
      </div>
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
  const rot = direction === "left" ? (collapsed ? 180 : 0)
    : direction === "right" ? (collapsed ? 0 : 180)
    : direction === "top" ? (collapsed ? 180 : 0)
    : (collapsed ? 0 : 180);
  return (
    <svg viewBox="0 0 24 24" className="size-4" style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
      <path d="M8 5l8 7-8 7" fill="currentColor" />
    </svg>
  );
}

SgToolBar.displayName = "SgToolBar";
SgToolbarIconButton.displayName = "SgToolbarIconButton";
