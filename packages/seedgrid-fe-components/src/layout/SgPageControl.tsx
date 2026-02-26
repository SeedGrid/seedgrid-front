"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgPageControlPageProps = {
  id?: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  hidden?: boolean;
  disabled?: boolean;
  keepMounted?: boolean;
  className?: string;
  tabClassName?: string;
  children: React.ReactNode;
};

export type SgPageControlProps = {
  children: React.ReactNode;

  activePageId?: string;
  activeIndex?: number;
  defaultActivePageId?: string;
  defaultActiveIndex?: number;
  onActivePageIdChange?: (
    pageId: string,
    context: { index: number; page: SgPageControlPageProps }
  ) => void;
  onActiveIndexChange?: (
    index: number,
    context: { pageId: string; page: SgPageControlPageProps }
  ) => void;

  hiddenPageIds?: string[];

  keepMounted?: boolean;
  variant?: "underline" | "pills";
  size?: "sm" | "md" | "lg";
  fullWidthTabs?: boolean;
  keyboardNavigation?: boolean;

  ariaLabel?: string;
  emptyMessage?: React.ReactNode;

  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  panelClassName?: string;
  style?: React.CSSProperties;
};

type PageRecord = {
  id: string;
  props: SgPageControlPageProps;
  element: React.ReactElement<SgPageControlPageProps>;
  hidden: boolean;
};

function resolveRecords(
  children: React.ReactNode,
  hiddenPageIds?: string[]
): PageRecord[] {
  const hiddenSet = new Set(hiddenPageIds ?? []);
  const pageElements = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<SgPageControlPageProps> =>
      React.isValidElement(child) &&
      (child.type === SgPageControlPage || (child.type as any)?.displayName === "SgPageControlPage")
  );

  return pageElements.map((element, index) => {
    const id = element.props.id ?? `sg-page-control-page-${index + 1}`;
    const hidden = !!element.props.hidden || hiddenSet.has(id);
    return { id, props: element.props, element, hidden };
  });
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(length - 1, Math.floor(index)));
}

export function SgPageControl(props: Readonly<SgPageControlProps>) {
  const {
    children,
    activePageId,
    activeIndex,
    defaultActivePageId,
    defaultActiveIndex = 0,
    onActivePageIdChange,
    onActiveIndexChange,
    hiddenPageIds,
    keepMounted = false,
    variant = "underline",
    size = "md",
    fullWidthTabs = false,
    keyboardNavigation = true,
    ariaLabel = "Page control",
    emptyMessage = "No visible pages.",
    className,
    tabListClassName,
    tabClassName,
    panelClassName,
    style
  } = props;

  const records = React.useMemo(
    () => resolveRecords(children, hiddenPageIds),
    [children, hiddenPageIds]
  );
  const visiblePages = React.useMemo(
    () => records.filter((record) => !record.hidden),
    [records]
  );

  const isControlled = activePageId !== undefined || activeIndex !== undefined;

  const defaultIdFromProps =
    defaultActivePageId !== undefined
      ? defaultActivePageId
      : visiblePages[clampIndex(defaultActiveIndex, visiblePages.length)]?.id;

  const [internalActiveId, setInternalActiveId] = React.useState<string | undefined>(
    defaultIdFromProps ?? visiblePages[0]?.id
  );

  const controlledId =
    activePageId !== undefined
      ? activePageId
      : activeIndex !== undefined
      ? visiblePages[clampIndex(activeIndex, visiblePages.length)]?.id
      : undefined;

  const tentativeActiveId = controlledId ?? internalActiveId;
  const resolvedActiveId =
    tentativeActiveId && visiblePages.some((record) => record.id === tentativeActiveId)
      ? tentativeActiveId
      : visiblePages[0]?.id;

  React.useEffect(() => {
    if (isControlled) return;
    if (resolvedActiveId === internalActiveId) return;
    setInternalActiveId(resolvedActiveId);
  }, [isControlled, internalActiveId, resolvedActiveId]);

  const activeIndexResolved = React.useMemo(
    () => visiblePages.findIndex((record) => record.id === resolvedActiveId),
    [resolvedActiveId, visiblePages]
  );

  const activePage = activeIndexResolved >= 0 ? visiblePages[activeIndexResolved] : undefined;

  const fireOnChange = React.useCallback(
    (nextId: string) => {
      const nextIndex = visiblePages.findIndex((record) => record.id === nextId);
      if (nextIndex < 0) return;
      const nextPage = visiblePages[nextIndex]?.props;
      if (!nextPage) return;
      onActivePageIdChange?.(nextId, { index: nextIndex, page: nextPage });
      onActiveIndexChange?.(nextIndex, { pageId: nextId, page: nextPage });
    },
    [onActiveIndexChange, onActivePageIdChange, visiblePages]
  );

  const selectPage = React.useCallback(
    (nextId: string) => {
      const next = visiblePages.find((record) => record.id === nextId);
      if (!next || next.props.disabled) return;
      if (!isControlled) setInternalActiveId(nextId);
      fireOnChange(nextId);
    },
    [fireOnChange, isControlled, visiblePages]
  );

  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const rootId = React.useId();

  const sizeClasses =
    size === "sm"
      ? {
          tab: "h-8 px-3 text-xs gap-1.5",
          icon: "size-4",
          panel: "p-3"
        }
      : size === "lg"
      ? {
          tab: "h-11 px-4 text-sm gap-2.5",
          icon: "size-5",
          panel: "p-5"
        }
      : {
          tab: "h-9 px-3.5 text-sm gap-2",
          icon: "size-4.5",
          panel: "p-4"
        };

  const tabStyle =
    variant === "pills"
      ? {
          base: cn(
            "rounded-full border border-transparent text-muted-foreground",
            "hover:bg-muted/70 hover:text-foreground"
          ),
          active: "bg-primary text-primary-foreground border-primary shadow-sm",
          inactive: ""
        }
      : {
          base: cn(
            "rounded-t-md border-b-2 border-transparent text-muted-foreground",
            "hover:text-foreground hover:bg-muted/40"
          ),
          active: "border-primary text-primary bg-muted/30",
          inactive: ""
        };

  return (
    <div className={cn("w-full", className)} style={style}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "flex min-h-0 items-end gap-1 overflow-x-auto border-b border-border pb-0.5",
          fullWidthTabs ? "grid auto-cols-fr grid-flow-col" : "",
          tabListClassName
        )}
        onKeyDown={(event) => {
          if (!keyboardNavigation || visiblePages.length === 0) return;
          const focused = document.activeElement as HTMLElement | null;
          const focusedIndex = tabsRef.current.findIndex((tab) => tab === focused);
          if (focusedIndex < 0) return;

          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            const nextIndex = (focusedIndex + 1) % visiblePages.length;
            tabsRef.current[nextIndex]?.focus();
            return;
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            const nextIndex = (focusedIndex - 1 + visiblePages.length) % visiblePages.length;
            tabsRef.current[nextIndex]?.focus();
            return;
          }
          if (event.key === "Home") {
            event.preventDefault();
            tabsRef.current[0]?.focus();
            return;
          }
          if (event.key === "End") {
            event.preventDefault();
            tabsRef.current[visiblePages.length - 1]?.focus();
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const record = visiblePages[focusedIndex];
            if (record) selectPage(record.id);
          }
        }}
      >
        {visiblePages.map((record, index) => {
          const isActive = record.id === resolvedActiveId;
          const tabId = `${rootId}-tab-${record.id}`;
          const panelId = `${rootId}-panel-${record.id}`;
          return (
            <button
              key={record.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              type="button"
              id={tabId}
              role="tab"
              aria-controls={panelId}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={record.props.disabled}
              onClick={() => selectPage(record.id)}
              className={cn(
                "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors",
                sizeClasses.tab,
                tabStyle.base,
                isActive ? tabStyle.active : tabStyle.inactive,
                fullWidthTabs ? "w-full" : "",
                record.props.disabled ? "cursor-not-allowed opacity-45" : "",
                tabClassName,
                record.props.tabClassName
              )}
            >
              {record.props.icon ? (
                <span className={cn("inline-flex items-center justify-center", sizeClasses.icon)}>
                  {record.props.icon}
                </span>
              ) : null}
              <span className="truncate">{record.props.title}</span>
            </button>
          );
        })}
      </div>

      <div className={cn("rounded-b-md border border-t-0 border-border bg-background", panelClassName)}>
        {visiblePages.length === 0 ? (
          <div className={cn(sizeClasses.panel, "text-sm text-muted-foreground")}>{emptyMessage}</div>
        ) : keepMounted ? (
          visiblePages.map((record) => {
            const isActive = record.id === resolvedActiveId;
            const tabId = `${rootId}-tab-${record.id}`;
            const panelId = `${rootId}-panel-${record.id}`;
            return (
              <div
                key={record.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!isActive}
                className={cn(
                  sizeClasses.panel,
                  !isActive ? "hidden" : "",
                  record.props.className
                )}
              >
                {record.props.children}
              </div>
            );
          })
        ) : (
          <div
            id={`${rootId}-panel-${activePage?.id ?? "empty"}`}
            role="tabpanel"
            aria-labelledby={`${rootId}-tab-${activePage?.id ?? "empty"}`}
            className={cn(sizeClasses.panel, activePage?.props.className)}
          >
            {activePage?.props.children}
          </div>
        )}
      </div>
    </div>
  );
}

SgPageControl.displayName = "SgPageControl";

export function SgPageControlPage(props: Readonly<SgPageControlPageProps>) {
  return <>{props.children}</>;
}

SgPageControlPage.displayName = "SgPageControlPage";

