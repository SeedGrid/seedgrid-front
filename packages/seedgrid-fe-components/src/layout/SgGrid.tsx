"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export type SgGridColumns =
  | number
  | Partial<Record<"base" | "sm" | "md" | "lg" | "xl" | "2xl", number>>;

export type SgGridProps = Omit<React.HTMLAttributes<HTMLDivElement>, "align" | "children"> & {
  columns?: SgGridColumns;
  minItemWidth?: number | string;
  gap?: number | string;
  padding?: number | string;
  dense?: boolean;
  rowHeight?: number | string;
  justify?: "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch";
  children?: React.ReactNode;
};

const BREAKPOINTS: Record<"sm" | "md" | "lg" | "xl" | "2xl", number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};

function normalizeColumns(columns: SgGridColumns | undefined) {
  if (!columns) return { base: 1 };
  if (typeof columns === "number") return { base: columns };
  return { base: columns.base ?? 1, ...columns };
}

function justifyToCss(value: SgGridProps["justify"]) {
  if (!value) return undefined;
  const map: Record<NonNullable<SgGridProps["justify"]>, React.CSSProperties["justifyContent"]> = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  };
  return map[value];
}

function alignToCss(value: SgGridProps["align"]) {
  if (!value) return undefined;
  const map: Record<NonNullable<SgGridProps["align"]>, React.CSSProperties["alignItems"]> = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch"
  };
  return map[value];
}

export function SgGrid(props: Readonly<SgGridProps>) {
  const {
    columns,
    minItemWidth,
    gap = 0,
    padding,
    dense = false,
    rowHeight,
    justify,
    align,
    className,
    style,
    children,
    ...rest
  } = props;

  const instanceId = React.useId().replace(/:/g, "");
  const normalized = normalizeColumns(columns);

  const dynamicCss = React.useMemo(() => {
    if (minItemWidth) return "";

    const rules: string[] = [];
    rules.push(`[data-sg-grid="${instanceId}"]{--sg-grid-cols:${normalized.base};}`);

    (Object.keys(BREAKPOINTS) as Array<keyof typeof BREAKPOINTS>).forEach((bp) => {
      const next = normalized[bp];
      if (!next || next < 1) return;
      rules.push(
        `@media (min-width:${BREAKPOINTS[bp]}px){[data-sg-grid="${instanceId}"]{--sg-grid-cols:${next};}}`
      );
    });

    return rules.join("\n");
  }, [instanceId, minItemWidth, normalized]);

  const templateColumns = minItemWidth
    ? `repeat(auto-fit, minmax(${toCssSpace(minItemWidth)}, 1fr))`
    : "repeat(var(--sg-grid-cols), minmax(0, 1fr))";

  const items = React.Children.toArray(children);

  return (
    <>
      {dynamicCss ? <style>{dynamicCss}</style> : null}
      <div
        data-sg-grid={instanceId}
        className={cn("grid min-h-0 min-w-0", className)}
        style={{
          ...style,
          gridTemplateColumns: templateColumns,
          gap: toCssSpace(gap),
          padding: toCssSpace(padding),
          gridAutoRows: toCssSpace(rowHeight),
          gridAutoFlow: dense ? "dense" : undefined,
          justifyContent: justifyToCss(justify),
          alignItems: alignToCss(align)
        }}
        {...rest}
      >
        {items.map((item, index) => {
          if (!React.isValidElement(item)) {
            return item;
          }

          const element = item as React.ReactElement<{ span?: number; rowSpan?: number }>;
          const span = element.props?.span;
          const rowSpan = element.props?.rowSpan;
          const hasSpan = typeof span === "number" && span > 1;
          const hasRowSpan = typeof rowSpan === "number" && rowSpan > 1;

          if (!hasSpan && !hasRowSpan) {
            return React.cloneElement(element, { key: element.key ?? `grid-item-${index}` });
          }

          const wrapperStyle: React.CSSProperties = {};
          if (hasSpan) wrapperStyle.gridColumn = `span ${span} / span ${span}`;
          if (hasRowSpan) wrapperStyle.gridRow = `span ${rowSpan} / span ${rowSpan}`;

          return (
            <div
              key={item.key ?? `grid-wrap-${index}`}
              className="min-h-0 min-w-0"
              style={wrapperStyle}
            >
              {element}
            </div>
          );
        })}
      </div>
    </>
  );
}

SgGrid.displayName = "SgGrid";
