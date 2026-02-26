"use client";

import * as React from "react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgBreadcrumbItem = {
  id: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: () => void;
};

export type SgBreadcrumbSeparator = "slash" | "chevron" | "dot" | "arrow";

export type SgBreadcrumbProps = {
  items: SgBreadcrumbItem[];
  separator?: SgBreadcrumbSeparator | React.ReactNode;
  maxItems?: number;
  overflowBehavior?: "collapse" | "scroll";
  showHomeIcon?: boolean;
  homeHref?: string;
  homeLabel?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "subtle" | "primary";
  ariaLabel?: string;
  overflowLabel?: string;
  onNavigate?: (item: SgBreadcrumbItem, index: number) => void;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
};

type IndexedItem = {
  item: SgBreadcrumbItem;
  index: number;
};

type DisplayToken =
  | { type: "item"; value: IndexedItem }
  | { type: "overflow"; value: IndexedItem[] };

function separatorNode(separator: SgBreadcrumbSeparator | React.ReactNode, iconClassName: string) {
  if (React.isValidElement(separator)) return separator;
  if (separator === "slash") return <span className={iconClassName}>/</span>;
  if (separator === "dot") return <span className={iconClassName}>{"\u2022"}</span>;
  if (separator === "arrow") return <span className={iconClassName}>{"\u2192"}</span>;
  return <ChevronRight className={iconClassName} />;
}

function toDisplayTokens(
  items: IndexedItem[],
  overflowBehavior: "collapse" | "scroll",
  maxItems?: number
): DisplayToken[] {
  if (
    overflowBehavior !== "collapse" ||
    maxItems === undefined ||
    maxItems < 2 ||
    items.length <= maxItems
  ) {
    return items.map((item) => ({ type: "item", value: item }));
  }

  if (maxItems === 2) {
    return [
      { type: "item", value: items[0] as IndexedItem },
      { type: "item", value: items[items.length - 1] as IndexedItem }
    ];
  }

  const tailCount = maxItems - 2;
  const head = items[0] as IndexedItem;
  const tail = items.slice(-tailCount);
  const hidden = items.slice(1, items.length - tailCount);

  const out: DisplayToken[] = [{ type: "item", value: head }];
  if (hidden.length > 0) out.push({ type: "overflow", value: hidden });
  for (const item of tail) out.push({ type: "item", value: item });
  return out;
}

function renderActionItem(
  item: SgBreadcrumbItem,
  index: number,
  className: string,
  iconClassName: string,
  onNavigate?: (item: SgBreadcrumbItem, index: number) => void
) {
  const content = (
    <>
      {item.icon ? <span className={cn("inline-flex items-center justify-center", iconClassName)}>{item.icon}</span> : null}
      <span className="truncate">{item.label}</span>
    </>
  );

  if (item.disabled) {
    return <span className={cn(className, "cursor-not-allowed opacity-45")}>{content}</span>;
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        onClick={() => {
          item.onClick?.();
          onNavigate?.(item, index);
        }}
      >
        {content}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          item.onClick?.();
          onNavigate?.(item, index);
        }}
      >
        {content}
      </button>
    );
  }

  return <span className={cn(className, "cursor-default")}>{content}</span>;
}

export function SgBreadcrumb(props: Readonly<SgBreadcrumbProps>) {
  const {
    items,
    separator = "chevron",
    maxItems,
    overflowBehavior = "collapse",
    showHomeIcon = false,
    homeHref = "/",
    homeLabel = "Home",
    size = "md",
    variant = "default",
    ariaLabel = "Breadcrumb",
    overflowLabel = "Mais caminhos",
    onNavigate,
    className,
    itemClassName,
    style
  } = props;

  const visibleItems = React.useMemo(
    () => items.filter((item) => !item.hidden),
    [items]
  );

  const normalizedItems = React.useMemo(() => {
    const base = visibleItems.map((item, index) => ({ item, index }));
    if (!showHomeIcon) return base;

    const homeItem: IndexedItem = {
      item: {
        id: "__sg_breadcrumb_home__",
        label: homeLabel,
        href: homeHref,
        icon: <Home className="size-full" />
      },
      index: -1
    };
    return [homeItem, ...base];
  }, [homeHref, homeLabel, showHomeIcon, visibleItems]);

  const tokens = React.useMemo(
    () => toDisplayTokens(normalizedItems, overflowBehavior, maxItems),
    [maxItems, normalizedItems, overflowBehavior]
  );

  const sizeClasses =
    size === "sm"
      ? {
          root: "text-xs gap-1.5",
          item: "px-1.5 py-0.5",
          icon: "size-3.5",
          sep: "text-[10px]"
        }
      : size === "lg"
      ? {
          root: "text-base gap-2.5",
          item: "px-2 py-1",
          icon: "size-4.5",
          sep: "text-sm"
        }
      : {
          root: "text-sm gap-2",
          item: "px-1.5 py-0.5",
          icon: "size-4",
          sep: "text-xs"
        };

  const variantClasses =
    variant === "subtle"
      ? {
          item: "rounded-md text-muted-foreground hover:bg-muted/80 hover:text-foreground",
          current: "rounded-md bg-muted text-foreground"
        }
      : variant === "primary"
      ? {
          item: "rounded-md text-primary hover:bg-primary/10",
          current: "rounded-md bg-primary/10 text-primary font-medium"
        }
      : {
          item: "text-muted-foreground hover:text-foreground",
          current: "text-foreground font-medium"
        };

  const separatorEl = separatorNode(separator, cn("text-muted-foreground", sizeClasses.sep));

  return (
    <nav aria-label={ariaLabel} className={cn("min-w-0", className)} style={style}>
      <div className={cn(overflowBehavior === "scroll" ? "overflow-x-auto" : "")}>
        <ol className={cn("flex min-w-0 items-center whitespace-nowrap", sizeClasses.root)}>
          {tokens.map((token, tokenIndex) => {
            const isLast = tokenIndex === tokens.length - 1;
            return (
              <React.Fragment key={token.type === "item" ? token.value.item.id : `overflow-${tokenIndex}`}>
                {tokenIndex > 0 ? (
                  <li aria-hidden className="inline-flex shrink-0 items-center">
                    {separatorEl}
                  </li>
                ) : null}

                {token.type === "item" ? (
                  <li className="inline-flex min-w-0 items-center">
                    {isLast ? (
                      <span
                        aria-current="page"
                        className={cn(
                          "inline-flex min-w-0 items-center gap-1.5",
                          sizeClasses.item,
                          variantClasses.current,
                          itemClassName
                        )}
                      >
                        {token.value.item.icon ? (
                          <span className={cn("inline-flex items-center justify-center", sizeClasses.icon)}>
                            {token.value.item.icon}
                          </span>
                        ) : null}
                        <span className="truncate">{token.value.item.label}</span>
                      </span>
                    ) : (
                      renderActionItem(
                        token.value.item,
                        token.value.index,
                        cn(
                          "inline-flex min-w-0 items-center gap-1.5 transition-colors",
                          sizeClasses.item,
                          variantClasses.item,
                          itemClassName
                        ),
                        sizeClasses.icon,
                        onNavigate
                      )
                    )}
                  </li>
                ) : (
                  <li className="relative inline-flex items-center">
                    <details className="group">
                      <summary
                        aria-label={overflowLabel}
                        className={cn(
                          "list-none cursor-pointer rounded-md text-muted-foreground transition-colors",
                          "inline-flex items-center justify-center",
                          sizeClasses.item,
                          "hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
                        )}
                      >
                        <MoreHorizontal className={sizeClasses.icon} />
                      </summary>

                      <ul className="absolute left-0 top-full z-20 mt-1 min-w-44 rounded-md border border-border bg-popover p-1 shadow-md">
                        {token.value.map((entry) => (
                          <li key={entry.item.id}>
                            {renderActionItem(
                              entry.item,
                              entry.index,
                              cn(
                                "inline-flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm",
                                "text-popover-foreground hover:bg-muted"
                              ),
                              "size-4",
                              onNavigate
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

SgBreadcrumb.displayName = "SgBreadcrumb";


