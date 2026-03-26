"use client";

import * as React from "react";
import { t, useComponentsI18n } from "../i18n";
import { useHasSgEnvironmentProvider, useSgPersistence } from "../environment/SgEnvironmentProvider";

export type SgCardVariant = "default" | "outlined" | "flat" | "elevated";
export type SgCardSize = "sm" | "md" | "lg";
export type SgCardPosition = { x: number; y: number };

export type SgCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "onClick"> & {
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  bgColor?: string;
  bgColorTitle?: string;
  bgColorFooter?: string;

  cardStyle?: SgCardVariant;
  size?: SgCardSize;

  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  trailer?: React.ReactNode;

  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;

  clickable?: boolean;
  disabled?: boolean;

  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapseIcon?: React.ReactNode;
  collapseIconSize?: number;
  collapseToggleAlign?: "left" | "right";
  toggleOnHeaderClick?: boolean;
  draggable?: boolean;
  defaultPosition?: SgCardPosition;
  dragPersistKey?: string;
  onPositionChange?: (position: SgCardPosition) => void;

  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function parseStoredCardPosition(raw: unknown): SgCardPosition | null {
  const value =
    typeof raw === "string"
      ? (() => {
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })()
      : raw;

  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as { x?: unknown }).x !== "number" ||
    typeof (value as { y?: unknown }).y !== "number" ||
    !Number.isFinite((value as { x: number }).x) ||
    !Number.isFinite((value as { y: number }).y)
  ) {
    return null;
  }

  return {
    x: (value as { x: number }).x,
    y: (value as { y: number }).y
  };
}

function mergeTransforms(
  baseTransform: React.CSSProperties["transform"],
  extraTransform: string
): React.CSSProperties["transform"] {
  if (typeof baseTransform === "string" && baseTransform.trim().length > 0) {
    return `${baseTransform} ${extraTransform}`;
  }
  return extraTransform;
}

function DefaultCaret({ open, size }: { open: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn(
        "shrink-0 transition-transform duration-200",
        open ? "rotate-90" : "rotate-0"
      )}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
      />
    </svg>
  );
}

export function SgCard(props: Readonly<SgCardProps>) {
  const i18n = useComponentsI18n();

  const {
    id,
    className,
    headerClassName,
    bodyClassName,
    footerClassName,
    bgColor,
    bgColorTitle,
    bgColorFooter,
    cardStyle = "default",
    size = "md",
    leading,
    trailing,
    trailer,
    title,
    description,
    actions,
    header,
    footer,
    clickable = false,
    disabled = false,
    collapsible = false,
    defaultOpen = true,
    open: controlledOpen,
    onOpenChange,
    collapseIcon,
    collapseIconSize = 18,
    collapseToggleAlign = "left",
    toggleOnHeaderClick = true,
    draggable = false,
    defaultPosition,
    dragPersistKey,
    onPositionChange,
    style,
    onClick,
    children,
    ...rest
  } = props;

  const hasEnvironmentProvider = useHasSgEnvironmentProvider();
  const { load: loadPersistedState, save: savePersistedState, clear: clearPersistedState } = useSgPersistence();
  const isInteractive = (clickable || typeof onClick === "function") && !collapsible && !draggable;
  const trailingNode = trailing ?? trailer;
  const [dragPosition, setDragPosition] = React.useState<SgCardPosition>({
    x: defaultPosition?.x ?? 0,
    y: defaultPosition?.y ?? 0
  });
  const dragPositionRef = React.useRef<SgCardPosition>(dragPosition);
  const [dragHydrated, setDragHydrated] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const dragStateRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressNextToggleRef = React.useRef(false);
  const dragStorageKey = React.useMemo(() => {
    if (typeof dragPersistKey === "string" && dragPersistKey.trim().length > 0) {
      return dragPersistKey.trim();
    }
    if (typeof id === "string" && id.trim().length > 0) {
      return `sg-card-pos:${id.trim()}`;
    }
    return null;
  }, [dragPersistKey, id]);

  React.useEffect(() => {
    dragPositionRef.current = dragPosition;
    onPositionChange?.(dragPosition);
  }, [dragPosition, onPositionChange]);

  React.useEffect(() => {
    if (!draggable) {
      setDragHydrated(false);
      return;
    }

    let alive = true;
    (async () => {
      let loaded: SgCardPosition | null = null;
      if (dragStorageKey) {
        if (hasEnvironmentProvider) {
          try {
            const state = await loadPersistedState(dragStorageKey);
            loaded = parseStoredCardPosition(state);
            if (!loaded && state !== null && state !== undefined) {
              await clearPersistedState(dragStorageKey);
            }
          } catch {
            loaded = null;
          }
        } else {
          try {
            const raw = localStorage.getItem(dragStorageKey);
            loaded = parseStoredCardPosition(raw);
            if (!loaded && raw !== null) {
              localStorage.removeItem(dragStorageKey);
            }
          } catch {
            loaded = null;
          }
        }
      }

      if (!alive) return;
      if (loaded) {
        setDragPosition(loaded);
      } else {
        setDragPosition({
          x: defaultPosition?.x ?? 0,
          y: defaultPosition?.y ?? 0
        });
      }
      setDragHydrated(true);
    })();

    return () => {
      alive = false;
    };
  }, [
    clearPersistedState,
    defaultPosition?.x,
    defaultPosition?.y,
    dragStorageKey,
    draggable,
    hasEnvironmentProvider,
    loadPersistedState
  ]);

  React.useEffect(() => {
    if (!draggable || !dragHydrated || !dragStorageKey || dragging) return;

    if (hasEnvironmentProvider) {
      void savePersistedState(dragStorageKey, dragPosition);
      return;
    }

    try {
      localStorage.setItem(dragStorageKey, JSON.stringify(dragPosition));
    } catch {
      // ignore
    }
  }, [
    dragHydrated,
    dragPosition,
    dragStorageKey,
    draggable,
    dragging,
    hasEnvironmentProvider,
    savePersistedState
  ]);

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(defaultOpen);
  const isControlled = typeof controlledOpen === "boolean";
  const isOpen = collapsible ? (isControlled ? (controlledOpen as boolean) : uncontrolledOpen) : true;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!collapsible) return;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [collapsible, isControlled, onOpenChange]
  );

  const sizeClasses =
    size === "sm"
      ? {
          root: "rounded-xl",
          header: "px-3 py-2",
          body: "px-3 py-3",
          footer: "px-3 py-2",
          title: "text-sm",
          desc: "text-xs"
        }
      : size === "lg"
      ? {
          root: "rounded-2xl",
          header: "px-6 py-4",
          body: "px-6 py-6",
          footer: "px-6 py-4",
          title: "text-base",
          desc: "text-sm"
        }
      : {
          root: "rounded-2xl",
          header: "px-4 py-3",
          body: "px-4 py-4",
          footer: "px-4 py-3",
          title: "text-sm",
          desc: "text-xs"
        };

  const variantClasses =
    cardStyle === "flat"
      ? "bg-background border border-border/60 shadow-none"
      : cardStyle === "outlined"
      ? "bg-background border border-border shadow-none"
      : cardStyle === "elevated"
      ? "bg-background border border-border shadow-md"
      : "bg-background border border-border shadow-sm";

  const interactiveClasses = isInteractive
    ? cn(
        "transition-[box-shadow,transform] duration-150",
        "hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--primary)/0.35)]",
        disabled ? "" : "cursor-pointer",
        disabled ? "" : "active:translate-y-[0.5px]"
      )
    : "";

  const disabledClasses = disabled ? "opacity-60 pointer-events-none select-none" : "";

  const rootClasses = cn(
    "w-full",
    sizeClasses.root,
    variantClasses,
    interactiveClasses,
    disabledClasses,
    draggable ? "touch-none" : "",
    className
  );

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  const onHeaderClick = () => {
    if (suppressNextToggleRef.current) {
      suppressNextToggleRef.current = false;
      return;
    }
    if (!collapsible) return;
    if (!toggleOnHeaderClick) return;
    if (disabled) return;
    toggle();
  };

  const onHeaderPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggable || disabled) return;
      if (event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      const interactiveAncestor = target?.closest(
        "[data-sg-card-toggle=\"true\"],button,a,input,textarea,select,[role=\"button\"],[data-sg-card-no-drag=\"true\"]"
      );
      if (interactiveAncestor && interactiveAncestor !== event.currentTarget) {
        return;
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: dragPositionRef.current.x,
        originY: dragPositionRef.current.y,
        moved: false
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setDragging(true);
      event.preventDefault();
    },
    [disabled, draggable]
  );

  const onHeaderPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
      state.moved = true;
    }

    setDragPosition({
      x: state.originX + dx,
      y: state.originY + dy
    });

    if (state.moved) {
      event.preventDefault();
    }
  }, []);

  const endHeaderDrag = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== event.pointerId) return;

    if (state.moved) {
      suppressNextToggleRef.current = true;
    }
    dragStateRef.current = null;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }
  }, []);

  const headerInteractionClasses = disabled
    ? ""
    : draggable
    ? dragging
      ? "cursor-grabbing"
      : "cursor-grab"
    : collapsible && toggleOnHeaderClick
    ? "cursor-pointer"
    : "";

  const ToggleButton = collapsible ? (
    <button
      data-sg-card-toggle="true"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md",
        "text-muted-foreground hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)]"
      )}
      aria-label={isOpen ? t(i18n, "components.actions.collapse") : t(i18n, "components.actions.expand")}
      aria-expanded={isOpen}
      disabled={disabled}
    >
      {collapseIcon ?? <DefaultCaret open={isOpen} size={collapseIconSize} />}
    </button>
  ) : null;

  const headerHasContent =
    Boolean(header) ||
    Boolean(leading) ||
    Boolean(title) ||
    Boolean(description) ||
    Boolean(trailingNode) ||
    Boolean(actions) ||
    collapsible;

  const renderDefaultHeader = headerHasContent ? (
    <div
      className={cn(
        "flex items-start gap-3",
        "border-b border-border/60",
        sizeClasses.header,
        headerClassName,
        headerInteractionClasses
      )}
      style={bgColorTitle ? { backgroundColor: bgColorTitle } : undefined}
      onClick={onHeaderClick}
      onPointerDown={onHeaderPointerDown}
      onPointerMove={onHeaderPointerMove}
      onPointerUp={endHeaderDrag}
      onPointerCancel={endHeaderDrag}
      role={collapsible && toggleOnHeaderClick ? "button" : undefined}
      tabIndex={collapsible && toggleOnHeaderClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (!collapsible || !toggleOnHeaderClick || disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={collapsible ? isOpen : undefined}
    >
      {collapseToggleAlign === "left" ? ToggleButton : null}

      {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}

      <div className="min-w-0 flex-1">
        {title ? (
          <div className={cn("font-medium text-foreground", sizeClasses.title)}>{title}</div>
        ) : null}
        {description ? (
          <div className={cn("mt-0.5 text-muted-foreground", sizeClasses.desc)}>{description}</div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {trailingNode ? <div className="shrink-0">{trailingNode}</div> : null}
        {actions ? <div className="shrink-0">{actions}</div> : null}
        {collapseToggleAlign === "right" ? ToggleButton : null}
      </div>
    </div>
  ) : null;

  const headerNode = header ? (
    <div
      className={cn(
        "border-b border-border/60",
        sizeClasses.header,
        headerClassName,
        headerInteractionClasses
      )}
      style={bgColorTitle ? { backgroundColor: bgColorTitle } : undefined}
      onClick={onHeaderClick}
      onPointerDown={onHeaderPointerDown}
      onPointerMove={onHeaderPointerMove}
      onPointerUp={endHeaderDrag}
      onPointerCancel={endHeaderDrag}
      role={collapsible && toggleOnHeaderClick ? "button" : undefined}
      tabIndex={collapsible && toggleOnHeaderClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (!collapsible || !toggleOnHeaderClick || disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={collapsible ? isOpen : undefined}
    >
      {header}
    </div>
  ) : (
    renderDefaultHeader
  );

  const collapsibleBodyWrapper = collapsible ? (
    <div
      className={cn(
        "grid transition-all duration-200 ease-out motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className={isOpen ? "overflow-visible" : "overflow-hidden"}>
        <div className={cn(sizeClasses.body, bodyClassName)}>{children}</div>
        {footer ? (
          <div
            className={cn("border-t border-border/60", sizeClasses.footer, footerClassName)}
            style={bgColorFooter ? { backgroundColor: bgColorFooter } : undefined}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;

  const bodyNode = !collapsible ? <div className={cn(sizeClasses.body, bodyClassName)}>{children}</div> : null;

  const footerNode = !collapsible && footer ? (
    <div
      className={cn("border-t border-border/60", sizeClasses.footer, footerClassName)}
      style={bgColorFooter ? { backgroundColor: bgColorFooter } : undefined}
    >
      {footer}
    </div>
  ) : null;

  const Component: any = isInteractive ? "button" : "section";
  const buttonLikeProps = isInteractive ? { type: "button", onClick: disabled ? undefined : onClick, disabled } : {};
  const passiveOnClickProps =
    !isInteractive && typeof onClick === "function" ? { onClick: disabled ? undefined : onClick } : {};
  const roundedDragX = Math.round(dragPosition.x);
  const roundedDragY = Math.round(dragPosition.y);
  const shouldApplyDragTransform = draggable && (dragging || roundedDragX !== 0 || roundedDragY !== 0);
  const rootStyle: React.CSSProperties = {
    ...style,
    backgroundColor: bgColor ?? style?.backgroundColor,
    transform: shouldApplyDragTransform
      ? mergeTransforms(
          style?.transform,
          `translate3d(${roundedDragX}px, ${roundedDragY}px, 0)`
        )
      : style?.transform,
    willChange: shouldApplyDragTransform ? "transform" : style?.willChange
  };

  return (
    <Component id={id} className={rootClasses} style={rootStyle} {...buttonLikeProps} {...passiveOnClickProps} {...rest}>
      {headerNode}
      {collapsible ? collapsibleBodyWrapper : null}
      {!collapsible ? bodyNode : null}
      {!collapsible ? footerNode : null}
    </Component>
  );
}

SgCard.displayName = "SgCard";
