"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export type SgStackProps = Omit<React.HTMLAttributes<HTMLDivElement>, "align" | "children"> & {
  direction?: "row" | "column";
  gap?: number | string;
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
  grow?: boolean;
  children?: React.ReactNode;
};

export function SgStack(props: Readonly<SgStackProps>) {
  const {
    direction = "column",
    gap = 0,
    justify = "start",
    align = "stretch",
    wrap = false,
    grow = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const justifyClass: Record<NonNullable<SgStackProps["justify"]>, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };

  const alignClass: Record<NonNullable<SgStackProps["align"]>, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  };

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0",
        direction === "row" ? "flex-row" : "flex-col",
        justifyClass[justify],
        alignClass[align],
        wrap ? "flex-wrap" : "",
        grow ? "flex-1" : "",
        className
      )}
      style={{
        ...style,
        gap: toCssSpace(gap)
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

SgStack.displayName = "SgStack";

