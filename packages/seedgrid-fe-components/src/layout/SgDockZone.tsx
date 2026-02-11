"use client";

import * as React from "react";
import { useSgDockLayout, type SgDockZoneId } from "./SgDockLayout";

export type SgDockZoneProps = {
  zone: SgDockZoneId;
  className?: string;
  children?: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function SgDockZone(props: Readonly<SgDockZoneProps>) {
  const { zone, className, children } = props;
  const dock = useSgDockLayout();
  const ref = React.useRef<HTMLDivElement>(null);

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
        "relative flex gap-3 p-3",
        zone === "top" || zone === "bottom" ? "flex-row items-center" : "flex-col items-center",
        className
      )}
    >
      {children}
    </div>
  );
}

SgDockZone.displayName = "SgDockZone";
