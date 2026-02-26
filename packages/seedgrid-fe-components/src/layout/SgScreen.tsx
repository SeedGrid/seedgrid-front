"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export type SgScreenProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  fullscreen?: boolean;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  children?: React.ReactNode;
};

export function SgScreen(props: Readonly<SgScreenProps>) {
  const {
    fullscreen = true,
    width,
    height,
    padding,
    className,
    style,
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "relative min-h-0 min-w-0",
        fullscreen ? "h-screen w-screen" : "h-full w-full",
        className
      )}
      style={{
        ...style,
        ...(width !== undefined ? { width: toCssSpace(width) } : null),
        ...(height !== undefined ? { height: toCssSpace(height) } : null),
        padding: toCssSpace(padding)
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

SgScreen.displayName = "SgScreen";
