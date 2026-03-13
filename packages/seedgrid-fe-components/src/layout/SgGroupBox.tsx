"use client";

import React from "react";

export type SgGroupBoxProps = {
  title: string;
  height?: number | string;
  width?: number | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function toCssSize(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function SgGroupBox(props: SgGroupBoxProps) {
  const { title, height, width, children, className, style } = props;

  return (
    <div
      className={className}
      style={{
        width: toCssSize(width) ?? "100%",
        height: toCssSize(height),
        ...style
      }}
    >
      <fieldset className="relative rounded-lg border border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] px-4 pb-4 pt-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-foreground/70">
          {title}
        </legend>
        <div>{children}</div>
      </fieldset>
    </div>
  );
}



