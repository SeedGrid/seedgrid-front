"use client";

import * as React from "react";
import { t, useComponentsI18n } from "../i18n";
import { SgPopup } from "../overlay/SgPopup";

/* ── helpers ── */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── types ── */

export type FABPosition =
  | "left-top" | "left-center" | "left-bottom"
  | "center-top" | "center-bottom"
  | "right-top" | "right-center" | "right-bottom";

export type FABSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";
// Backwards compatibility
export type FABVariant = FABSeverity;
export type FABSize = "sm" | "md" | "lg";
export type FABShape = "circle" | "rounded" | "square";
export type FABElevation = "none" | "sm" | "md" | "lg";
export type FABAnimation = "scale" | "slide" | "fade" | "rotate" | "pulse" | "none";
export type FABAnimationTrigger = "mount" | "hover" | "click";
export type FABLayoutType = "linear" | "circle" | "semi-circle" | "quarter-circle";

export type SgFABAction = {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  severity?: FABSeverity;
  // Backwards compatibility
  variant?: FABSeverity;
  disabled?: boolean;
};

export type SgFloatActionButtonProps = {
  hint?: string;
  hintPosition?: "top" | "right" | "bottom" | "left";
  hintDelay?: number;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  position?: FABPosition;
  offset?: { x?: number; y?: number };
  enableDragDrop?: boolean;
  dragId?: string;
  severity?: FABSeverity;
  // Backwards compatibility
  variant?: FABSeverity;
  color?: string;
  size?: FABSize;
  shape?: FABShape;
  elevation?: FABElevation;
  disabled?: boolean;
  loading?: boolean;
  autoHideOnScroll?: boolean;
  hideDirection?: "down" | "up";
  animation?: FABAnimation;
  animationOn?: FABAnimationTrigger;
  animationDuration?: number;
  direction?: "up" | "down" | "left" | "right";
  type?: FABLayoutType;
  radius?: number;
  transitionDelay?: number;
  actions?: SgFABAction[];
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  absolute?: boolean;
};

/* ── constants ── */

const EDGE = 24;

const POS_CSS: Record<FABPosition, React.CSSProperties> = {
  "left-top": { top: EDGE, left: EDGE },
  "left-center": { left: EDGE, top: "50%" },
  "left-bottom": { bottom: EDGE, left: EDGE },
  "center-top": { top: EDGE, left: "50%" },
  "center-bottom": { bottom: EDGE, left: "50%" },
  "right-top": { top: EDGE, right: EDGE },
  "right-center": { right: EDGE, top: "50%" },
  "right-bottom": { bottom: EDGE, right: EDGE },
};

const CENTER_TX: Partial<Record<FABPosition, string>> = {
  "left-center": "translateY(-50%)",
  "right-center": "translateY(-50%)",
  "center-top": "translateX(-50%)",
  "center-bottom": "translateX(-50%)",
};

const DEFAULT_HINT: Record<FABPosition, "top" | "right" | "bottom" | "left"> = {
  "left-top": "right", "left-center": "right", "left-bottom": "right",
  "center-top": "bottom", "center-bottom": "top",
  "right-top": "left", "right-center": "left", "right-bottom": "left",
};

const DEFAULT_DIR: Record<FABPosition, "up" | "down" | "left" | "right"> = {
  "left-top": "down", "left-center": "right", "left-bottom": "up",
  "center-top": "down", "center-bottom": "up",
  "right-top": "down", "right-center": "left", "right-bottom": "up",
};

const COLORS: Record<FABSeverity, { bg: string; fg: string; ring: string }> = {
  primary: {
    bg: "var(--sg-btn-primary-bg, hsl(var(--primary)))",
    fg: "var(--sg-btn-primary-fg, hsl(var(--primary-foreground)))",
    ring: "var(--sg-btn-primary-ring, hsl(var(--primary)/0.35))",
  },
  secondary: {
    bg: "var(--sg-btn-secondary-bg, hsl(var(--secondary)))",
    fg: "var(--sg-btn-secondary-fg, hsl(var(--secondary-foreground)))",
    ring: "var(--sg-btn-secondary-ring, hsl(var(--secondary)/0.35))",
  },
  success: {
    bg: "var(--sg-btn-success-bg, hsl(var(--tertiary, var(--accent))))",
    fg: "var(--sg-btn-success-fg, hsl(var(--tertiary-foreground, var(--accent-foreground, 0 0% 100%))))",
    ring: "var(--sg-btn-success-ring, hsl(var(--tertiary, var(--accent))/0.35))",
  },
  info: {
    bg: "var(--sg-btn-info-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-info-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    ring: "var(--sg-btn-info-ring, hsl(var(--secondary, var(--primary))/0.35))",
  },
  warning: {
    bg: "var(--sg-btn-warning-bg, hsl(var(--secondary, var(--accent))))",
    fg: "var(--sg-btn-warning-fg, hsl(var(--secondary-foreground, var(--accent-foreground, 0 0% 100%))))",
    ring: "var(--sg-btn-warning-ring, hsl(var(--secondary, var(--accent))/0.35))",
  },
  help: {
    bg: "var(--sg-btn-help-bg, hsl(var(--secondary, var(--primary))))",
    fg: "var(--sg-btn-help-fg, hsl(var(--secondary-foreground, var(--primary-foreground))))",
    ring: "var(--sg-btn-help-ring, hsl(var(--secondary, var(--primary))/0.35))",
  },
  danger: {
    bg: "var(--sg-btn-danger-bg, hsl(var(--destructive)))",
    fg: "var(--sg-btn-danger-fg, hsl(var(--destructive-foreground)))",
    ring: "var(--sg-btn-danger-ring, hsl(var(--destructive)/0.35))",
  },
  plain: {
    bg: "hsl(var(--muted))",
    fg: "hsl(var(--muted-foreground))",
    ring: "hsl(var(--muted)/0.35)",
  },
};

const BTN_WH: Record<FABSize, number> = { sm: 40, md: 56, lg: 64 };
const ICON_SZ: Record<FABSize, number> = { sm: 18, md: 22, lg: 26 };
const ACT_WH: Record<FABSize, number> = { sm: 36, md: 44, lg: 52 };
const ACT_ICON: Record<FABSize, number> = { sm: 14, md: 18, lg: 20 };

const SHAPE_CLS: Record<FABShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-sm",
};

const ELEV_CLS: Record<FABElevation, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md shadow-black/15",
  lg: "shadow-lg shadow-black/20",
};

const TIP_CLS: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ACT_TIP_DIR: Record<string, "top" | "bottom" | "left" | "right"> = {
  up: "left", down: "right", left: "top", right: "bottom",
};

// linear spacing between main FAB and action buttons (and among actions)
const ITEM_GAP: Record<FABSize, number> = { sm: 48, md: 60, lg: 72 };

const DEFAULT_RADIUS: Record<FABSize, number> = { sm: 100, md: 120, lg: 150 };

const DIRECTION_START_ANGLE: Record<string, number> = {
  up: 270,
  down: 90,
  left: 180,
  right: 0
};

/* ── positioning helpers ── */

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function computeItemPositions(
  count: number,
  type: FABLayoutType,
  direction: "up" | "down" | "left" | "right",
  size: FABSize,
  radius?: number
): Array<{ x: number; y: number }> {
  if (count === 0) return [];

  if (type === "linear") {
    const gap = ITEM_GAP[size];
    return Array.from({ length: count }, (_, i) => {
      const dist = gap * (i + 1);
      switch (direction) {
        case "up":
          return { x: 0, y: -dist };
        case "down":
          return { x: 0, y: dist };
        case "left":
          return { x: -dist, y: 0 };
        case "right":
          return { x: dist, y: 0 };
      }
    });
  }

  const r = radius ?? DEFAULT_RADIUS[size];
  const centerAngle = DIRECTION_START_ANGLE[direction] ?? 0;

  let totalArc: number;
  switch (type) {
    case "circle":
      totalArc = 360;
      break;
    case "semi-circle":
      totalArc = 180;
      break;
    case "quarter-circle":
      totalArc = 90;
      break;
    default:
      totalArc = 360;
  }

  const step = type === "circle" ? totalArc / count : totalArc / Math.max(count - 1, 1);
  const startAngle = type === "circle" ? centerAngle : centerAngle - totalArc / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + step * i;
    const rad = degToRad(angle);
    return {
      x: Math.round(r * Math.cos(rad)),
      y: Math.round(r * Math.sin(rad))
    };
  });
}

/* ── icons ── */

function PlusIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}

function Spinner({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── slide offset by position ── */

function slideInit(pos: FABPosition): string {
  if (pos.endsWith("bottom")) return "translateY(24px)";
  if (pos.endsWith("top")) return "translateY(-24px)";
  if (pos.startsWith("left")) return "translateX(-24px)";
  return "translateX(24px)";
}

function slideNudge(pos: FABPosition, dist = 10): string {
  if (pos.endsWith("bottom")) return `translateY(${dist}px)`;
  if (pos.endsWith("top")) return `translateY(-${dist}px)`;
  if (pos.startsWith("left")) return `translateX(-${dist}px)`;
  return `translateX(${dist}px)`;
}

/* ── component ── */

export function SgFloatActionButton(props: Readonly<SgFloatActionButtonProps>) {
  const i18n = useComponentsI18n();
  const {
    hint, hintDelay = 300, icon, activeIcon,
    position = "right-bottom", offset,
    enableDragDrop = false, dragId,
    severity = "primary", variant, color,
    size = "md", shape = "circle", elevation = "md",
    disabled = false, loading = false,
    autoHideOnScroll = false, hideDirection = "down",
    animation = "scale", animationOn = "mount", animationDuration = 200,
    type = "linear", radius, transitionDelay = 30,
    actions, onClick,
    className, style, zIndex = 50, absolute = false,
  } = props;

  const hintPos = props.hintPosition ?? DEFAULT_HINT[position];
  const dir = props.direction ?? DEFAULT_DIR[position];

  const [mounted, setMounted] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [hintShow, setHintShow] = React.useState(false);
  const [dragPos, setDragPos] = React.useState<{ x: number; y: number } | null>(null);
  const dragPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasStoredPosRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dragStart = React.useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const dragMoved = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fabBtnRef = React.useRef<HTMLButtonElement>(null);
  const hintTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAbsolute = absolute === true;

  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 20); return () => clearTimeout(t); }, []);

  React.useEffect(() => {
    if (!clicked) return;
    const t = setTimeout(() => setClicked(false), animationDuration);
    return () => clearTimeout(t);
  }, [clicked, animationDuration]);

  React.useEffect(() => {
    if (!autoHideOnScroll) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      const d = cur - lastY;
      if (hideDirection === "down" && d > 5) setHidden(true);
      else if (hideDirection === "up" && d < -5) setHidden(true);
      else if (Math.abs(d) > 5) setHidden(false);
      lastY = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [autoHideOnScroll, hideDirection]);

  React.useEffect(() => {
    if (!enableDragDrop || !dragId) return;
    try {
      const stored = localStorage.getItem(`sg-fab-pos:${dragId}`);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { x?: number; y?: number } | null;
      if (
        !parsed ||
        typeof parsed.x !== "number" ||
        typeof parsed.y !== "number" ||
        !Number.isFinite(parsed.x) ||
        !Number.isFinite(parsed.y)
      ) {
        localStorage.removeItem(`sg-fab-pos:${dragId}`);
        return;
      }
      const px = parsed.x;
      const py = parsed.y;
      const wh = BTN_WH[size];
      let maxX = Math.max(0, window.innerWidth - wh);
      let maxY = Math.max(0, window.innerHeight - wh);
      if (isAbsolute && containerRef.current) {
        const parent = containerRef.current.offsetParent as HTMLElement | null;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          maxX = Math.max(0, rect.width - wh);
          maxY = Math.max(0, rect.height - wh);
        }
      }
      const clamped = {
        x: Math.min(Math.max(px, 0), maxX),
        y: Math.min(Math.max(py, 0), maxY)
      };
      dragPosRef.current = clamped;
      setDragPos(clamped);
      hasStoredPosRef.current = true;
    } catch {
      // ignore
    }
  }, [enableDragDrop, dragId, size, isAbsolute]);

  React.useEffect(() => {
    if (!open) return;
    const onMd = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMd);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onMd); document.removeEventListener("keydown", onKey); };
  }, [open]);


  const onEnter = React.useCallback(() => {
    setHovered(true);
    if (hint) hintTimer.current = setTimeout(() => setHintShow(true), hintDelay);
  }, [hint, hintDelay]);

  const onLeave = React.useCallback(() => {
    setHovered(false);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setHintShow(false);
  }, []);

  const handleClick = React.useCallback(() => {
    if (disabled || loading) return;
    if (enableDragDrop && dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    setClicked(true);
    if (actions && actions.length > 0) setOpen((p) => !p);
    else onClick?.();
  }, [disabled, loading, actions, onClick, enableDragDrop, menuOpen]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    if (!enableDragDrop || disabled || loading) return;
    if (!containerRef.current) return;
    event.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const parent = isAbsolute
      ? ((containerRef.current.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? {
        left: 0,
        top: 0
      })
      : { left: 0, top: 0 };
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      left: rect.left - parent.left,
      top: rect.top - parent.top
    };
    dragMoved.current = false;
    setIsDragging(true);
    const handleMove = (moveEvent: PointerEvent) => {
      if (!dragStart.current) return;
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragMoved.current = true;
        if (actions && actions.length > 0) setOpen(true);
      }
      const nextPos = {
        x: dragStart.current.left + dx,
        y: dragStart.current.top + dy
      };
      dragPosRef.current = nextPos;
      setDragPos(nextPos);
      hasStoredPosRef.current = true;
    };

    const handleUp = () => {
      setIsDragging(false);
      dragStart.current = null;
      if (enableDragDrop && dragId && dragPosRef.current) {
        try {
          localStorage.setItem(`sg-fab-pos:${dragId}`, JSON.stringify(dragPosRef.current));
        } catch {
          // ignore
        }
      }
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  }, [enableDragDrop, disabled, loading, actions, dragId, isAbsolute]);

  const handleContextMenu = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableDragDrop || !dragId) return;
    if (!hasStoredPosRef.current) return;
    event.preventDefault();
    setMenuOpen(true);
  }, [enableDragDrop, dragId]);

  const handleResetConfirm = React.useCallback((confirmed: boolean) => {
    if (!confirmed || !dragId) {
      setMenuOpen(false);
      return;
    }

    try {
      localStorage.removeItem(`sg-fab-pos:${dragId}`);
    } catch (error) {
      // ignore
    }
    dragPosRef.current = null;
    setDragPos(null);
    setOpen(false);
    setMenuOpen(false);
    hasStoredPosRef.current = false;
    dragMoved.current = false;
  }, [dragId]);

  /* colors */
  const resolvedSeverity = severity ?? variant ?? "primary";
  const c = COLORS[resolvedSeverity];
  const bg = color ?? c.bg;
  const fg = color ? "white" : c.fg;
  const ring = color ? `color-mix(in srgb, ${color} 35%, transparent)` : c.ring;

  /* sizing */
  const wh = BTN_WH[size];
  const iconSz = ICON_SZ[size];
  const actWh = ACT_WH[size];
  const actIcon = ACT_ICON[size];

  /* container position */
  const posStyle: React.CSSProperties = { position: absolute ? "absolute" : "fixed", ...POS_CSS[position], zIndex };
  if (enableDragDrop && dragPos) {
    posStyle.left = dragPos.x;
    posStyle.top = dragPos.y;
    delete posStyle.right;
    delete posStyle.bottom;
  }
  if (offset?.x) {
    if (posStyle.right !== undefined) posStyle.right = (typeof posStyle.right === "number" ? posStyle.right : 0) - offset.x;
    else if (posStyle.left !== undefined) posStyle.left = (typeof posStyle.left === "number" ? posStyle.left : 0) + offset.x;
  }
  if (offset?.y) {
    if (posStyle.bottom !== undefined) posStyle.bottom = (typeof posStyle.bottom === "number" ? posStyle.bottom : 0) - offset.y;
    else if (posStyle.top !== undefined) posStyle.top = (typeof posStyle.top === "number" ? posStyle.top : 0) + offset.y;
  }

  const inlinePosition =
    !absolute && (style?.position === "relative" || style?.position === "static");
  const useFloating = !inlinePosition;

  const txParts: string[] = [];
  const ctx = useFloating && !(enableDragDrop && dragPos) ? CENTER_TX[position] : undefined;
  if (ctx) txParts.push(ctx);
  if (useFloating && hidden) {
    txParts.push(hideDirection === "down" ? "translateY(100px)" : "translateY(-100px)");
  }

  /* button animation */
  const anim: React.CSSProperties = { transition: `transform ${animationDuration}ms ease, opacity ${animationDuration}ms ease` };
  if (animationOn === "mount") {
    switch (animation) {
      case "scale": anim.transform = mounted ? "scale(1)" : "scale(0)"; anim.opacity = mounted ? 1 : 0; break;
      case "fade": anim.opacity = mounted ? 1 : 0; break;
      case "rotate": anim.transform = mounted ? "rotate(0deg)" : "rotate(-180deg)"; anim.opacity = mounted ? 1 : 0; break;
      case "slide": anim.transform = mounted ? "translate(0,0)" : slideInit(position); anim.opacity = mounted ? 1 : 0; break;
      case "pulse": if (mounted) anim.animation = "sg-fab-pulse 1.5s ease-in-out infinite"; else anim.opacity = 0; break;
    }
  } else if (animationOn === "hover") {
    switch (animation) {
      case "scale": anim.transform = hovered ? "scale(1.1)" : "scale(1)"; break;
      case "fade": anim.opacity = hovered ? 0.62 : 1; break;
      case "slide": anim.transform = hovered ? slideNudge(position, 10) : "translate(0,0)"; break;
      case "rotate": anim.transform = hovered ? "rotate(15deg)" : "rotate(0deg)"; break;
      case "pulse": if (hovered) anim.animation = "sg-fab-pulse 0.8s ease-in-out infinite"; break;
    }
  } else if (animationOn === "click") {
    switch (animation) {
      case "scale": anim.transform = clicked ? "scale(0.9)" : "scale(1)"; break;
      case "fade": anim.opacity = clicked ? 0.52 : 1; break;
      case "slide": anim.transform = clicked ? slideNudge(position, 14) : "translate(0,0)"; break;
      case "rotate": anim.transform = clicked ? "rotate(90deg)" : "rotate(0deg)"; break;
    }
  }

  /* action positions */
  const actPos = computeItemPositions((actions ?? []).length, type, dir, size, radius);

  const isOff = disabled || loading;
  return (
    <div
      ref={containerRef}
      style={{
        ...(inlinePosition ? { position: style?.position as React.CSSProperties["position"] } : posStyle),
        transform: txParts.length > 0 ? txParts.join(" ") : undefined,
        transition: "transform 300ms ease, opacity 300ms ease",
        opacity: useFloating && hidden ? 0 : 1,
        ...style,
      }}
      className={cn("inline-flex items-center justify-center", className)}
      onContextMenu={(event) => {
        if (!enableDragDrop || !dragId) return;
        handleContextMenu(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {animation === "pulse" && (
        <style>{`@keyframes sg-fab-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
      )}

      {/* action items */}
      {actions?.map((a, i) => {
        const p = actPos[i] ?? { x: 0, y: 0 };
        const actionSeverity = a.severity ?? a.variant ?? "plain";
        const ac = COLORS[actionSeverity];
        return (
          <div
            key={i}
            className="absolute"
            style={{
              transform: open ? `translate(${p.x}px, ${p.y}px) scale(1)` : "translate(0,0) scale(0)",
              opacity: open ? 1 : 0,
              transition: "transform 200ms ease, opacity 200ms ease",
              transitionDelay: open ? `${i * transitionDelay}ms` : `${((actions.length - 1 - i) * transitionDelay)}ms`,
            }}
          >
            <div className="relative group">
              <button
                disabled={a.disabled}
                className={cn(
                  "inline-flex items-center justify-center rounded-full",
                  "hover:brightness-90 active:brightness-[0.85]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-md transition-[filter] duration-150",
                )}
                style={{
                  width: actWh, height: actWh,
                  backgroundColor: ac.bg, color: ac.fg,
                  ["--tw-ring-color" as string]: ac.ring,
                }}
                onClick={() => { a.onClick?.(); setOpen(false); }}
                aria-label={a.label}
              >
                {a.icon}
              </button>
              {a.label ? (
                <span
                  className={cn(
                    "absolute whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-xs text-background",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none",
                    TIP_CLS[ACT_TIP_DIR[dir] ?? "top"]
                  )}
                >
                  {a.label}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}

      {/* main FAB button */}
      <button
        ref={fabBtnRef}
        disabled={isOff}
        className={cn(
          "relative inline-flex items-center justify-center",
          "hover:brightness-90 active:brightness-[0.85]",
          "focus-visible:outline-none focus-visible:ring-4",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "transition-[filter] duration-150",
          enableDragDrop ? (isDragging ? "cursor-grabbing" : "cursor-pointer") : "",
          SHAPE_CLS[shape],
          ELEV_CLS[elevation],
        )}
        style={{
          width: wh, height: wh,
          backgroundColor: bg, color: fg,
          ["--tw-ring-color" as string]: ring,
          ...anim,
        }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-label={hint ?? (open ? "Close" : "Open")}
        aria-expanded={actions ? open : undefined}
      >
        {loading ? (
          <Spinner size={iconSz} />
        ) : (
          <span
            className="inline-flex items-center justify-center transition-transform duration-300"
            style={{ transform: open && actions ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            {open && activeIcon ? activeIcon : (icon ?? <PlusIcon size={iconSz} />)}
          </span>
        )}

        {/* hint tooltip */}
        {hint && !open ? (
          <span
            className={cn(
              "absolute whitespace-nowrap rounded bg-foreground/90 px-2.5 py-1.5 text-xs font-medium text-background",
              "transition-opacity duration-200 pointer-events-none",
              hintShow ? "opacity-100" : "opacity-0",
              TIP_CLS[hintPos]
            )}
          >
            {hint}
          </span>
        ) : null}
      </button>

      <SgPopup
        title={t(i18n, "components.fab.resetPosition")}
        open={menuOpen}
        onOpenChange={setMenuOpen}
        anchorRef={fabBtnRef as React.RefObject<HTMLElement>}
        placement="auto"
        preferPlacement="left"
        align="start"
        offset={8}
        actions={[
          {
            label: t(i18n, "components.fab.yes"),
            closeOnClick: false,
            onClick: () => handleResetConfirm(true)
          },
          {
            label: t(i18n, "components.fab.no"),
            closeOnClick: false,
            onClick: () => handleResetConfirm(false)
          }
        ]}
      />
    </div>
  );
}

SgFloatActionButton.displayName = "SgFloatActionButton";
