"use client";

import * as React from "react";
import { useSgDockLayout, type SgDockZoneId } from "./SgDockLayout";
import { t, useComponentsI18n } from "../i18n";

export type SgDockZoneProps = {
  zone: SgDockZoneId;
  className?: string;
  children?: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const POSITION_CLASS_PATTERN = /(?:^|\s)!?(?:(?:[a-z0-9-]+:)+)?(?:static|fixed|absolute|relative|sticky)(?=\s|$)/i;
const DEFAULT_ZONE_LAYOUT_CLASS: Record<SgDockZoneId, string> = {
  top: "col-span-3 row-start-1 items-start",
  bottom: "col-span-3 row-start-3 items-end",
  left: "col-start-1 row-start-2 items-start",
  right: "col-start-3 row-start-2 items-start",
  free: "col-start-2 row-start-2 items-center justify-center"
};

export function SgDockZone(props: Readonly<SgDockZoneProps>) {
  const { zone, className, children } = props;
  const dock = useSgDockLayout();
  const i18n = useComponentsI18n();
  const ref = React.useRef<HTMLDivElement>(null);
  const showDropPreview = Boolean(dock?.isDropPreviewActive);
  const isHorizontalZone = zone === "top" || zone === "bottom";
  const isVerticalZone = zone === "left" || zone === "right";
  const hasExplicitPositionClass = POSITION_CLASS_PATTERN.test(className ?? "");
  const hasCustomClass = Boolean(className?.trim());
  const zoneDefaultLayoutClass = hasCustomClass ? null : DEFAULT_ZONE_LAYOUT_CLASS[zone];

  React.useEffect(() => {
    if (!dock) return;
    dock.registerZone(zone, ref.current);
    return () => dock.registerZone(zone, null);
  }, [dock, zone]);

  return (
    <div
      ref={ref}
      data-sg-dock-zone={zone}
      className={cn(
        hasExplicitPositionClass ? "flex min-h-0 min-w-0 gap-3 p-2" : "relative flex min-h-0 min-w-0 gap-3 p-2",
        isHorizontalZone
          ? "flex-row flex-wrap items-start content-start"
          : isVerticalZone
            ? "flex-col flex-wrap items-start content-start"
            : "flex-col items-center",
        showDropPreview ? "rounded-xl border-2 border-dashed border-border/70 bg-background/40 p-3 transition-colors duration-150" : null,
        showDropPreview && isHorizontalZone ? "min-h-16" : null,
        showDropPreview && isVerticalZone ? "min-w-24" : null,
        zoneDefaultLayoutClass,
        className
      )}
    >
      {children}
      {showDropPreview ? (
        <span
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-foreground/70"
          aria-hidden="true"
        >
          {t(i18n, "components.dock.dropHere")}
        </span>
      ) : null}
    </div>
  );
}

SgDockZone.displayName = "SgDockZone";
