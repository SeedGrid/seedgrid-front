"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value?: number | string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function normalizeIndices(
  value: number | number[] | undefined,
  max: number,
  multiple: boolean
): number[] {
  if (value === undefined) return [];
  const source = Array.isArray(value) ? value : [value];
  const next = source
    .filter((idx) => Number.isInteger(idx))
    .map((idx) => Number(idx))
    .filter((idx) => idx >= 0 && idx < max);

  const unique = Array.from(new Set(next)).sort((a, b) => a - b);
  return multiple ? unique : unique.slice(0, 1);
}

function ChevronIcon(props: { open: boolean; horizontal: boolean }) {
  const base = props.horizontal
    ? props.open
      ? "rotate-180"
      : "rotate-90"
    : props.open
      ? "rotate-180"
      : "rotate-0";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-200", base)}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export type SgAccordionOrientation = "vertical" | "horizontal";

export type SgAccordionItem = {
  id?: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  headerBackgroundColor?: string;
  contentClassName?: string;
};

export type SgAccordionProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  id?: string;
  items: SgAccordionItem[];
  orientation?: SgAccordionOrientation;
  multiple?: boolean;
  collapsible?: boolean;
  activeIndex?: number | number[];
  defaultActiveIndex?: number | number[];
  defaultOpenFirst?: boolean;
  onActiveIndexChange?: (indexes: number[]) => void;
  onItemToggle?: (index: number, isOpen: boolean) => void;
  panelClassName?: string;
  headerClassName?: string;
  headerBackgroundColor?: string;
  contentClassName?: string;
  animationDuration?: number;
  horizontalHeaderWidth?: number | string;
  horizontalMinHeight?: number | string;
  keepMounted?: boolean;
};

const DEFAULT_HEADER_BACKGROUND =
  "var(--sg-accordion-header-bg, rgb(var(--sg-primary-50, 239 246 255)))";

export function SgAccordion(props: Readonly<SgAccordionProps>) {
  const {
    id,
    items,
    orientation = "vertical",
    multiple = false,
    collapsible = true,
    activeIndex,
    defaultActiveIndex,
    defaultOpenFirst = true,
    onActiveIndexChange,
    onItemToggle,
    panelClassName,
    headerClassName,
    headerBackgroundColor,
    contentClassName,
    animationDuration = 220,
    horizontalHeaderWidth = 52,
    horizontalMinHeight = 220,
    keepMounted = true,
    className,
    ...rest
  } = props;

  const generatedId = React.useId().replace(/[:]/g, "");
  const baseId = (id ?? `sg-accordion-${generatedId}`).replace(/\s+/g, "-");

  const isHorizontal = orientation === "horizontal";
  const headerWidth = toCssSize(horizontalHeaderWidth) ?? "52px";
  const minHeight = toCssSize(horizontalMinHeight) ?? "220px";

  const controlled = activeIndex !== undefined;
  const controlledIndices = React.useMemo(
    () => normalizeIndices(activeIndex, items.length, multiple),
    [activeIndex, items.length, multiple]
  );

  const [internalIndices, setInternalIndices] = React.useState<number[]>(() => {
    const seed =
      defaultActiveIndex !== undefined
        ? defaultActiveIndex
        : defaultOpenFirst && items.length > 0
          ? 0
          : [];
    return normalizeIndices(seed, items.length, multiple);
  });

  React.useEffect(() => {
    if (controlled) return;
    setInternalIndices((prev) => normalizeIndices(prev, items.length, multiple));
  }, [controlled, items.length, multiple]);

  const openIndices = controlled ? controlledIndices : internalIndices;
  const openSet = React.useMemo(() => new Set(openIndices), [openIndices]);

  const commitIndices = React.useCallback(
    (next: number[]) => {
      const normalized = normalizeIndices(next, items.length, multiple);
      if (!controlled) setInternalIndices(normalized);
      onActiveIndexChange?.(normalized);
    },
    [controlled, items.length, multiple, onActiveIndexChange]
  );

  const handleToggle = React.useCallback(
    (index: number) => {
      const item = items[index];
      if (!item || item.disabled) return;
      const isOpen = openSet.has(index);
      if (isOpen && !collapsible) return;

      let next: number[];
      if (isOpen) {
        next = openIndices.filter((it) => it !== index);
      } else {
        next = multiple ? [...openIndices, index] : [index];
      }

      commitIndices(next);
      onItemToggle?.(index, !isOpen);
    },
    [items, openSet, collapsible, openIndices, multiple, commitIndices, onItemToggle]
  );

  return (
    <div
      className={cn(
        isHorizontal ? "flex w-full gap-2 overflow-x-auto" : "space-y-2",
        className
      )}
      data-orientation={orientation}
      {...rest}
    >
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const panelId = `${baseId}-panel-${item.id ?? index}`;
        const headerId = `${baseId}-header-${item.id ?? index}`;
        const contentId = `${baseId}-content-${item.id ?? index}`;
        const resolvedHeaderBackground =
          item.headerBackgroundColor ?? headerBackgroundColor ?? DEFAULT_HEADER_BACKGROUND;

        const sharedButtonClasses = cn(
          "inline-flex items-center gap-2 text-left font-medium transition-[filter,colors] duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          item.disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:brightness-95"
        );

        return (
          <div
            key={panelId}
            id={panelId}
            className={cn(
              "border border-border bg-background",
              isHorizontal ? "flex min-w-0 overflow-hidden rounded-lg" : "overflow-hidden rounded-lg",
              panelClassName,
              item.className
            )}
            style={
              isHorizontal
                ? {
                    minHeight,
                    flex: isOpen ? "1 1 0%" : "0 0 auto",
                    transition: `flex-basis ${animationDuration}ms ease`
                  }
                : undefined
            }
          >
            <button
              id={headerId}
              type="button"
              disabled={item.disabled}
              aria-controls={contentId}
              aria-expanded={isOpen}
              className={cn(
                sharedButtonClasses,
                isHorizontal
                  ? "h-full flex-col justify-between border-r border-border px-2 py-3 text-[11px] uppercase tracking-wide"
                  : "w-full justify-between px-4 py-3 text-sm",
                headerClassName,
                item.headerClassName
              )}
              style={
                isHorizontal
                  ? {
                      width: headerWidth,
                      backgroundColor: resolvedHeaderBackground
                    }
                  : {
                      backgroundColor: resolvedHeaderBackground
                    }
              }
              onClick={() => handleToggle(index)}
            >
              {isHorizontal ? (
                <>
                  <ChevronIcon open={isOpen} horizontal />
                  <span
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    className="line-clamp-1 select-none text-center text-[10px] font-semibold tracking-wide"
                  >
                    {item.title}
                  </span>
                  {item.icon ? <span className="opacity-80">{item.icon}</span> : <span aria-hidden="true" />}
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-2">
                    {item.icon ? <span className="opacity-80">{item.icon}</span> : null}
                    <span>{item.title}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    {item.end ? <span>{item.end}</span> : null}
                    <ChevronIcon open={isOpen} horizontal={false} />
                  </span>
                </>
              )}
            </button>

            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className={cn("overflow-hidden", contentClassName, item.contentClassName)}
              style={
                isHorizontal
                  ? {
                      width: isOpen ? "100%" : "0px",
                      opacity: isOpen ? 1 : 0,
                      transition: `width ${animationDuration}ms ease, opacity ${animationDuration}ms ease`
                    }
                  : {
                      maxHeight: isOpen ? "960px" : "0px",
                      opacity: isOpen ? 1 : 0,
                      transition: `max-height ${animationDuration}ms ease, opacity ${animationDuration}ms ease`
                    }
              }
            >
              {keepMounted || isOpen ? (
                <div className={cn(isHorizontal ? "h-full min-w-[220px] p-4" : "p-4")}>
                  {item.content}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

SgAccordion.displayName = "SgAccordion";
