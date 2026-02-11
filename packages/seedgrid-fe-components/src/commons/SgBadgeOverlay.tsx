"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgBadgeOverlayPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "right"
  | "left"
  | "top"
  | "bottom";

export type SgBadgeOverlayProps = {
  children: React.ReactNode;
  badge: React.ReactNode;
  placement?: SgBadgeOverlayPlacement;
  className?: string;
};

export function SgBadgeOverlay(props: Readonly<SgBadgeOverlayProps>) {
  const { children, badge, placement = "top-right", className } = props;
  const pos: Record<SgBadgeOverlayPlacement, string> = {
    "top-left": "left-0 top-0 -translate-x-1/3 -translate-y-1/3",
    "top-right": "right-0 top-0 translate-x-1/3 -translate-y-1/3",
    "bottom-left": "left-0 bottom-0 -translate-x-1/3 translate-y-1/3",
    "bottom-right": "right-0 bottom-0 translate-x-1/3 translate-y-1/3",
    right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      <span className={cn("absolute", pos[placement])}>{badge}</span>
    </span>
  );
}

SgBadgeOverlay.displayName = "SgBadgeOverlay";
