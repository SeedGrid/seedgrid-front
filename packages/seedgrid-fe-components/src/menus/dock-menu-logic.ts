import type * as React from "react";
import type { SgDockMenuOrientation, SgDockMenuPosition } from "./SgDockMenu";

export function resolveDockMenuOrientation(position: SgDockMenuPosition): SgDockMenuOrientation {
  if (position === "center-top" || position === "center-bottom") return "horizontal";
  if (position === "left-center" || position === "right-center") return "vertical";
  return "horizontal";
}

export function resolveDockMenuLiftDirection(
  position: SgDockMenuPosition,
  orientation: SgDockMenuOrientation
): number {
  if (orientation === "horizontal") {
    return position.includes("bottom") ? -1 : 1;
  }
  return position.startsWith("left") ? 1 : -1;
}

export function buildDockMenuLayout(position: SgDockMenuPosition): {
  orientation: SgDockMenuOrientation;
  liftDirection: number;
} {
  const orientation = resolveDockMenuOrientation(position);
  return {
    orientation,
    liftDirection: resolveDockMenuLiftDirection(position, orientation)
  };
}

export function buildDockMenuItemMotion(args: {
  index: number;
  hoveredIndex: number | null;
  magnify: boolean;
  magnifyScale: number;
  itemSize: number;
  gap: number;
  orientation: SgDockMenuOrientation;
  liftDirection: number;
}): {
  scale: number;
  translateX: number;
  translateY: number;
  transformOrigin: string;
  zIndex: number;
} {
  const { index, hoveredIndex, magnify, magnifyScale, itemSize, gap, orientation, liftDirection } = args;
  const isHovered = hoveredIndex === index;
  const hasMagnifyCurve = magnify && hoveredIndex !== null;
  const distance = hasMagnifyCurve ? Math.abs(index - hoveredIndex) : Number.POSITIVE_INFINITY;
  const influence = hasMagnifyCurve ? Math.max(0, 1 - distance / 3) : 0;
  const curve = influence * influence;

  const scale = 1 + (magnifyScale - 1) * curve;
  const liftPx = curve * Math.min(itemSize * 0.4, 18);
  const spreadBase = Math.max(0, itemSize * (magnifyScale - 1) * 0.68 + gap * 0.12);
  const spreadCurve = hasMagnifyCurve && distance > 0 ? Math.max(0, 1 - (distance - 1) * 0.1) : 0;
  const spreadSign = hasMagnifyCurve && hoveredIndex !== null ? Math.sign(index - hoveredIndex) : 0;
  const spreadPx = spreadSign === 0 ? 0 : spreadSign * spreadBase * spreadCurve;

  const translateX =
    (orientation === "vertical" ? liftDirection * liftPx : 0) +
    (orientation === "horizontal" ? spreadPx : 0);
  const translateY =
    (orientation === "horizontal" ? liftDirection * liftPx : 0) +
    (orientation === "vertical" ? spreadPx : 0);

  const transformOrigin =
    orientation === "horizontal"
      ? liftDirection < 0
        ? "50% 100%"
        : "50% 0%"
      : liftDirection > 0
        ? "0% 50%"
        : "100% 50%";

  return {
    scale,
    translateX,
    translateY,
    transformOrigin,
    zIndex: isHovered ? 3 : curve > 0 ? 2 : 1
  };
}

export function buildDockMenuLabelStyle(
  orientation: SgDockMenuOrientation,
  position: SgDockMenuPosition
): React.CSSProperties {
  if (orientation === "horizontal") {
    return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 };
  }

  if (position.startsWith("left")) {
    return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 };
  }

  return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 };
}

const DOCK_EDGE = 24;

const DOCK_POS_CSS: Record<SgDockMenuPosition, React.CSSProperties> = {
  "left-top": { top: DOCK_EDGE, left: DOCK_EDGE },
  "left-center": { left: DOCK_EDGE, top: "50%" },
  "left-bottom": { bottom: DOCK_EDGE, left: DOCK_EDGE },
  "center-top": { top: DOCK_EDGE, left: "50%" },
  "center-bottom": { bottom: DOCK_EDGE, left: "50%" },
  "right-top": { top: DOCK_EDGE, right: DOCK_EDGE },
  "right-center": { right: DOCK_EDGE, top: "50%" },
  "right-bottom": { bottom: DOCK_EDGE, right: DOCK_EDGE }
};

const DOCK_CENTER_TX: Partial<Record<SgDockMenuPosition, string>> = {
  "left-center": "translateY(-50%)",
  "right-center": "translateY(-50%)",
  "center-top": "translateX(-50%)",
  "center-bottom": "translateX(-50%)"
};

export function buildDockMenuContainerStyle(args: {
  position: SgDockMenuPosition;
  zIndex: number;
  enableDragDrop: boolean;
  dragPos: { x: number; y: number } | null;
  offset?: { x?: number; y?: number };
}): { style: React.CSSProperties; transform: string } {
  const { position, zIndex, enableDragDrop, dragPos, offset } = args;
  const style: React.CSSProperties = {
    position: "fixed",
    ...DOCK_POS_CSS[position],
    zIndex
  };

  if (enableDragDrop && dragPos) {
    style.left = dragPos.x;
    style.top = dragPos.y;
    delete style.right;
    delete style.bottom;
  }

  if (offset?.x) {
    if (style.right !== undefined) style.right = (typeof style.right === "number" ? style.right : 0) - offset.x;
    else if (style.left !== undefined) style.left = (typeof style.left === "number" ? style.left : 0) + offset.x;
  }
  if (offset?.y) {
    if (style.bottom !== undefined) style.bottom = (typeof style.bottom === "number" ? style.bottom : 0) - offset.y;
    else if (style.top !== undefined) style.top = (typeof style.top === "number" ? style.top : 0) + offset.y;
  }

  const transform = !(enableDragDrop && dragPos) ? (DOCK_CENTER_TX[position] ?? "") : "";
  return { style, transform };
}


export function buildDockMenuContextMenuState(args: {
  enableDragDrop: boolean;
  dragId?: string;
  hasStoredPosition: boolean;
}): {
  canOpenContextMenu: boolean;
  canResetPosition: boolean;
} {
  const canOpenContextMenu = Boolean(args.enableDragDrop && args.dragId && args.hasStoredPosition);
  return {
    canOpenContextMenu,
    canResetPosition: canOpenContextMenu
  };
}
