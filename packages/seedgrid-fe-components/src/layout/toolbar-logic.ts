import type { SgDockZoneId } from "./SgDockLayout";
import type { SgToolBarOrientation, SgToolBarOrientationDirection } from "./SgToolBar";

export function resolveToolbarOrientationDirection(
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

export function resolveToolbarDockOrientationDirection(
  orientationDirection: SgToolBarOrientationDirection,
  inDock: boolean,
  zone: "top" | "bottom" | "left" | "right" | "free"
): SgToolBarOrientationDirection {
  if (!inDock || zone == "free") return orientationDirection;

  if (zone === "top" || zone === "bottom") {
    return orientationDirection.startsWith("horizontal") ? orientationDirection : "horizontal-left";
  }

  return orientationDirection.startsWith("vertical") ? orientationDirection : "vertical-down";
}

export function buildToolbarLayoutState(args: {
  orientationDirection: SgToolBarOrientationDirection;
  inDock: boolean;
  zone: "top" | "bottom" | "left" | "right" | "free";
  freeDrag: boolean;
  dragHoverZone: SgDockZoneId | null;
  effectiveZone: "top" | "bottom" | "left" | "right" | "free";
  showContent: boolean;
}): {
  zoneForOrientation: "top" | "bottom" | "left" | "right" | "free";
  resolvedOrientationDirection: SgToolBarOrientationDirection;
  orientation: SgToolBarOrientation;
  direction: "left" | "right" | "up" | "down";
  openUp: boolean;
  openLeft: boolean;
  showLeadingCollapseButton: boolean;
  collapseIconDirection: "left" | "right" | "up" | "down";
} {
  const zoneForOrientation = args.inDock && !args.freeDrag && args.dragHoverZone ? args.dragHoverZone : args.effectiveZone;
  const resolvedOrientationDirection = resolveToolbarDockOrientationDirection(
    args.orientationDirection,
    args.inDock,
    zoneForOrientation
  );
  const { orientation, direction } = resolveToolbarOrientationDirection(resolvedOrientationDirection);
  const openUp = orientation === "vertical" && direction === "up";
  const openLeft = orientation === "horizontal" && direction === "left";
  return {
    zoneForOrientation,
    resolvedOrientationDirection,
    orientation,
    direction,
    openUp,
    openLeft,
    showLeadingCollapseButton: orientation === "horizontal" && openLeft && args.showContent,
    collapseIconDirection: resolvedOrientationDirection === "horizontal-right" ? "right" : direction
  };
}
