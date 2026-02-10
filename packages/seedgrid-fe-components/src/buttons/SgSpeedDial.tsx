"use client";

import * as React from "react";
import { SgButton, type SgButtonProps } from "./SgButton";

/* ── helpers ── */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── types ── */

type Severity = NonNullable<SgButtonProps["severity"]>;
type Appearance = NonNullable<SgButtonProps["appearance"]>;
type Size = NonNullable<SgButtonProps["size"]>;

export type SpeedDialDirection = "up" | "down" | "left" | "right";
export type SpeedDialType = "linear" | "circle" | "semi-circle" | "quarter-circle";

export type SgSpeedDialItem = {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  severity?: Severity;
  disabled?: boolean;
  className?: string;
};

export type SgSpeedDialProps = {
  items: SgSpeedDialItem[];
  direction?: SpeedDialDirection;
  type?: SpeedDialType;
  severity?: Severity;
  appearance?: Appearance;
  size?: Size;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  radius?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  transitionDelay?: number;
  mask?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  onOpen?: () => void;
  onClose?: () => void;
};

/* ── constants ── */

const ITEM_GAP: Record<Size, number> = { sm: 40, md: 48, lg: 56 };

const DEFAULT_RADIUS: Record<Size, number> = { sm: 100, md: 120, lg: 150 };

const DIRECTION_START_ANGLE: Record<SpeedDialDirection, number> = {
  up: 270,
  down: 90,
  left: 180,
  right: 0
};

const DEFAULT_TOOLTIP: Record<SpeedDialDirection, "top" | "bottom" | "left" | "right"> = {
  up: "left",
  down: "right",
  left: "top",
  right: "bottom"
};

/* ── positioning ── */

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function computeItemPositions(
  items: SgSpeedDialItem[],
  type: SpeedDialType,
  direction: SpeedDialDirection,
  size: Size,
  radius?: number
): Array<{ x: number; y: number }> {
  const count = items.length;
  if (count === 0) return [];

  if (type === "linear") {
    const gap = ITEM_GAP[size];
    return items.map((_, i) => {
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
  const centerAngle = DIRECTION_START_ANGLE[direction];

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

  return items.map((_, i) => {
    const angle = startAngle + step * i;
    const rad = degToRad(angle);
    return {
      x: Math.round(r * Math.cos(rad)),
      y: Math.round(r * Math.sin(rad))
    };
  });
}

/* ── default icons ── */

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

/* ── tooltip ── */

const TOOLTIP_POS: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2"
};

/* ── component ── */

export function SgSpeedDial(props: Readonly<SgSpeedDialProps>) {
  const {
    items,
    direction = "up",
    type = "linear",
    severity = "primary",
    appearance = "solid",
    size = "md",
    icon,
    activeIcon,
    radius,
    disabled = false,
    className,
    style,
    transitionDelay = 30,
    mask = false,
    tooltipPosition,
    onOpen,
    onClose
  } = props;

  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = React.useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      else onClose?.();
      return next;
    });
  }, [disabled, onOpen, onClose]);

  const close = React.useCallback(() => {
    if (open) {
      setOpen(false);
      onClose?.();
    }
  }, [open, onClose]);

  // click-outside
  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  const positions = computeItemPositions(items, type, direction, size, radius);
  const tipPos = tooltipPosition ?? DEFAULT_TOOLTIP[direction];

  const triggerIcon = icon ?? <PlusIcon />;
  const triggerActiveIcon = activeIcon ?? triggerIcon;

  return (
    <>
      {/* mask overlay */}
      {mask ? (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-300 z-40",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={close}
        />
      ) : null}

      <div
        ref={containerRef}
        className={cn("relative inline-flex items-center justify-center", mask && open ? "z-50" : "z-auto", className)}
        style={style}
      >
        {/* action items */}
        {items.map((item, i) => {
          const pos = positions[i] ?? { x: 0, y: 0 };
          const itemSeverity = item.severity ?? "plain";

          return (
            <div
              key={i}
              className="absolute"
              style={{
                transform: open
                  ? `translate(${pos.x}px, ${pos.y}px) scale(1)`
                  : "translate(0, 0) scale(0)",
                opacity: open ? 1 : 0,
                transition: `transform 200ms ease, opacity 200ms ease`,
                transitionDelay: open ? `${i * transitionDelay}ms` : `${(items.length - 1 - i) * transitionDelay}ms`
              }}
            >
              <div className="relative group">
                <SgButton
                  severity={itemSeverity}
                  appearance={itemSeverity === "plain" ? "solid" : appearance}
                  size={size}
                  shape="rounded"
                  disabled={item.disabled}
                  className={item.className}
                  onClick={() => {
                    item.onClick?.();
                    close();
                  }}
                  aria-label={item.label}
                  leftIcon={item.icon}
                />
                {item.label ? (
                  <span
                    className={cn(
                      "absolute whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-xs text-background",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none",
                      TOOLTIP_POS[tipPos]
                    )}
                  >
                    {item.label}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* trigger button */}
        <SgButton
          severity={severity}
          appearance={appearance}
          size={size}
          shape="rounded"
          disabled={disabled}
          onClick={toggle}
          aria-label={open ? "Close" : "Open"}
          aria-expanded={open}
          leftIcon={
            <span
              className="inline-flex transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              {open ? triggerActiveIcon : triggerIcon}
            </span>
          }
        />
      </div>
    </>
  );
}

SgSpeedDial.displayName = "SgSpeedDial";
