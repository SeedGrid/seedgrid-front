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
  padding?: number | string;
  children?: React.ReactNode;
};

export function SgScreen(props: Readonly<SgScreenProps>) {
  const {
    fullscreen = true,
    padding,
    className,
    style,
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "min-h-0 min-w-0",
        fullscreen ? "h-screen w-screen" : "h-full w-full",
        className
      )}
      style={{
        ...style,
        padding: toCssSpace(padding)
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

SgScreen.displayName = "SgScreen";

