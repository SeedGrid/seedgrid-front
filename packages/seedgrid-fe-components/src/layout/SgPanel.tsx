"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function toCssPercent(value?: SgPanelPercent) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}%` : value;
}

export type SgPanelAlign = "top" | "left" | "bottom" | "right" | "client";
export type SgPanelBorderStyle = "none" | "solid" | "dashed";
export type SgPanelScrollable = boolean | "auto" | "y" | "x";
export type SgPanelPercent = number | `${number}%`;

export type SgPanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, "align" | "children"> & {
  align?: SgPanelAlign;
  width?: SgPanelPercent;
  height?: SgPanelPercent;
  span?: number;
  rowSpan?: number;
  borderStyle?: SgPanelBorderStyle;
  padding?: number | string;
  scrollable?: SgPanelScrollable;
  scrollbarGutter?: boolean;
  children?: React.ReactNode;
};

function getScrollClass(scrollable: SgPanelScrollable | undefined) {
  if (!scrollable) return "";
  if (scrollable === true || scrollable === "auto") return "overflow-auto";
  if (scrollable === "y") return "overflow-y-auto overflow-x-hidden";
  return "overflow-x-auto overflow-y-hidden";
}

export function SgPanel(props: Readonly<SgPanelProps>) {
  const {
    width,
    height,
    borderStyle = "solid",
    padding,
    scrollable = false,
    scrollbarGutter = false,
    className,
    style,
    children,
    ...rest
  } = props;

  const borderClass =
    borderStyle === "none"
      ? "border border-transparent"
      : borderStyle === "dashed"
      ? "border border-dashed border-border"
      : "border border-solid border-border";

  const widthCss = toCssPercent(width);
  const heightCss = toCssPercent(height);

  return (
    <div
      className={cn("min-h-0 min-w-0 bg-background", borderClass, getScrollClass(scrollable), className)}
      style={{
        ...style,
        ...(widthCss !== undefined ? { width: widthCss } : null),
        ...(heightCss !== undefined ? { height: heightCss } : null),
        padding: toCssSpace(padding),
        ...(scrollbarGutter ? ({ scrollbarGutter: "stable" } as React.CSSProperties) : null)
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

SgPanel.displayName = "SgPanel";
