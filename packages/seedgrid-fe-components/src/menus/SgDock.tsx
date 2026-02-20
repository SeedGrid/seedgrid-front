"use client";

import * as React from "react";
import { t, useComponentsI18n } from "../i18n";

/* ── types ── */

export type SgDockPosition =
  | "left-top" | "left-center" | "left-bottom"
  | "center-top" | "center-bottom"
  | "right-top" | "right-center" | "right-bottom";

export type SgDockOrientation = "horizontal" | "vertical";

export type SgDockItem = {
  /** Unique identifier */
  id: string;
  /** Icon to display */
  icon: React.ReactNode;
  /** Label/tooltip text */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Badge content */
  badge?: string | number;
  /** Custom class name */
  className?: string;
};

export interface SgDockProps {
  /** Unique identifier for the dock */
  id?: string;
  /** Items to display in the dock */
  items: SgDockItem[];
  /** Position of the dock */
  position?: SgDockPosition;
  /** Enable drag and drop repositioning */
  enableDragDrop?: boolean;
  /** ID for persisting drag position */
  dragId?: string;
  /** Offset from the edge */
  offset?: { x?: number; y?: number };
  /** Custom class name for container */
  className?: string;
  /** Custom class name for items */
  itemClassName?: string;
  /** Z-index */
  zIndex?: number;
  /** Item size in pixels */
  itemSize?: number;
  /** Gap between items in pixels */
  gap?: number;
  /** Background color */
  backgroundColor?: string;
  /** Show labels on hover */
  showLabels?: boolean;
  /** Magnification effect on hover */
  magnify?: boolean;
  /** Magnification scale */
  magnifyScale?: number;
  /** Border radius */
  borderRadius?: number;
  /** Shadow elevation */
  elevation?: "none" | "sm" | "md" | "lg";
  /** Custom style */
  style?: React.CSSProperties;
}

/* ── constants ── */

const EDGE = 24;

const POS_CSS: Record<SgDockPosition, React.CSSProperties> = {
  "left-top": { top: EDGE, left: EDGE },
  "left-center": { left: EDGE, top: "50%" },
  "left-bottom": { bottom: EDGE, left: EDGE },
  "center-top": { top: EDGE, left: "50%" },
  "center-bottom": { bottom: EDGE, left: "50%" },
  "right-top": { top: EDGE, right: EDGE },
  "right-center": { right: EDGE, top: "50%" },
  "right-bottom": { bottom: EDGE, right: EDGE },
};

const CENTER_TX: Partial<Record<SgDockPosition, string>> = {
  "left-center": "translateY(-50%)",
  "right-center": "translateY(-50%)",
  "center-top": "translateX(-50%)",
  "center-bottom": "translateX(-50%)",
};

const ELEV_CLS: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md shadow-black/15",
  lg: "shadow-lg shadow-black/20",
};

/* ── orientation helper ── */

function getOrientation(position: SgDockPosition): SgDockOrientation {
  if (position === "center-top" || position === "center-bottom") return "horizontal";
  if (position === "left-center" || position === "right-center") return "vertical";
  // For corners, default to horizontal
  return "horizontal";
}

/* ── component ── */

export function SgDock(props: Readonly<SgDockProps>) {
  const i18n = useComponentsI18n();
  const {
    id,
    items,
    position = "center-bottom",
    enableDragDrop = false,
    dragId,
    offset,
    className = "",
    itemClassName = "",
    zIndex = 50,
    itemSize = 48,
    gap = 8,
    backgroundColor = "rgba(255, 255, 255, 0.95)",
    showLabels = true,
    magnify = true,
    magnifyScale = 1.5,
    borderRadius = 16,
    elevation = "lg",
    style,
  } = props;

  const [dragPos, setDragPos] = React.useState<{ x: number; y: number } | null>(null);
  const dragPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasStoredPosRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const dragStart = React.useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const dragMoved = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const orientation = getOrientation(position);

  // Load stored position
  React.useEffect(() => {
    if (!enableDragDrop || !dragId) return;
    try {
      const stored = localStorage.getItem(`sg-dock-pos:${dragId}`);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { x?: number; y?: number } | null;
      if (
        !parsed ||
        typeof parsed.x !== "number" ||
        typeof parsed.y !== "number" ||
        !Number.isFinite(parsed.x) ||
        !Number.isFinite(parsed.y)
      ) {
        localStorage.removeItem(`sg-dock-pos:${dragId}`);
        return;
      }
      const px = parsed.x;
      const py = parsed.y;
      const maxX = Math.max(0, window.innerWidth - 300); // approximate dock width
      const maxY = Math.max(0, window.innerHeight - 100); // approximate dock height
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
  }, [enableDragDrop, dragId]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (!enableDragDrop) return;
    if (!containerRef.current) return;

    // Don't start drag if clicking on an item
    const target = event.target as HTMLElement;
    if (target.closest('[data-dock-item]')) return;

    event.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      left: rect.left,
      top: rect.top
    };
    dragMoved.current = false;
    setIsDragging(true);

    const handleMove = (moveEvent: PointerEvent) => {
      if (!dragStart.current) return;
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragMoved.current = true;
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
          localStorage.setItem(`sg-dock-pos:${dragId}`, JSON.stringify(dragPosRef.current));
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
  }, [enableDragDrop, dragId]);

  const handleContextMenu = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableDragDrop || !dragId) return;
    if (!hasStoredPosRef.current) return;
    event.preventDefault();
    setMenuOpen(true);
  }, [enableDragDrop, dragId]);

  const handleResetPosition = React.useCallback(() => {
    if (!dragId) return;
    try {
      localStorage.removeItem(`sg-dock-pos:${dragId}`);
    } catch {
      // ignore
    }
    dragPosRef.current = null;
    setDragPos(null);
    setMenuOpen(false);
    hasStoredPosRef.current = false;
    dragMoved.current = false;
  }, [dragId]);

  const handleItemClick = React.useCallback((item: SgDockItem) => {
    if (item.disabled) return;
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    item.onClick?.();
  }, []);

  // Container position
  const posStyle: React.CSSProperties = {
    position: "fixed",
    ...POS_CSS[position],
    zIndex
  };

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

  const txParts: string[] = [];
  const ctx = !(enableDragDrop && dragPos) ? CENTER_TX[position] : undefined;
  if (ctx) txParts.push(ctx);

  return (
    <>
      <div
        ref={containerRef}
        id={id}
        className={`sg-dock ${className} ${ELEV_CLS[elevation]}`}
        style={{
          ...posStyle,
          ...style,
          transform: txParts.join(" "),
          cursor: enableDragDrop ? (isDragging ? "grabbing" : "grab") : "default",
        }}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
      >
        <div
          className="sg-dock-container"
          style={{
            display: "flex",
            flexDirection: orientation === "horizontal" ? "row" : "column",
            alignItems: "center",
            gap: `${gap}px`,
            padding: `${gap}px`,
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
          }}
        >
          {items.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const scale = magnify && isHovered ? magnifyScale : 1;

            return (
              <div
                key={item.id}
                data-dock-item
                className={`sg-dock-item ${itemClassName} ${item.className ?? ""}`}
                style={{
                  position: "relative",
                  width: itemSize,
                  height: itemSize,
                  transform: `scale(${scale})`,
                  transition: "transform 0.2s ease",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleItemClick(item)}
              >
                <div
                  className="sg-dock-item-icon"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: `${borderRadius * 0.5}px`,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {item.icon}
                </div>

                {/* Badge */}
                {item.badge && (
                  <div
                    className="sg-dock-item-badge"
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "hsl(var(--destructive))",
                      color: "white",
                      borderRadius: "50%",
                      minWidth: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "0 4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {item.badge}
                  </div>
                )}

                {/* Label/Tooltip */}
                {showLabels && isHovered && (
                  <div
                    className="sg-dock-item-label"
                    style={{
                      position: "absolute",
                      ...(orientation === "horizontal"
                        ? { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 }
                        : position.startsWith("left")
                          ? { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 }
                          : { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 }
                      ),
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: zIndex + 1,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              maxWidth: 400,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 18, fontWeight: 600 }}>
              {t(i18n, "components.dock.resetPosition")}
            </h3>
            <p style={{ margin: 0, marginBottom: 16, fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
              {t(i18n, "components.dock.resetConfirm")}
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {t(i18n, "components.actions.cancel")}
              </button>
              <button
                onClick={handleResetPosition}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "hsl(var(--primary))",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {t(i18n, "components.actions.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
