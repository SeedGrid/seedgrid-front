"use client";

import * as React from "react";

export type SgCardVariant = "default" | "outlined" | "flat" | "elevated";
export type SgCardSize = "sm" | "md" | "lg";

export type SgCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title" | "onClick"> & {
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  variant?: SgCardVariant;
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
  collapseToggleAlign?: "left" | "right";
  toggleOnHeaderClick?: boolean;

  onClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function DefaultCaret({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
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
  const {
    className,
    headerClassName,
    bodyClassName,
    footerClassName,
    variant = "default",
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
    collapseToggleAlign = "left",
    toggleOnHeaderClick = true,
    onClick,
    children,
    ...rest
  } = props;

  const isInteractive = (clickable || typeof onClick === "function") && !collapsible;
  const trailingNode = trailing ?? trailer;

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
    variant === "flat"
      ? "bg-background border border-border/60 shadow-none"
      : variant === "outlined"
      ? "bg-background border border-border shadow-none"
      : variant === "elevated"
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

  const rootClasses = cn("w-full", sizeClasses.root, variantClasses, interactiveClasses, disabledClasses, className);

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  const onHeaderClick = () => {
    if (!collapsible) return;
    if (!toggleOnHeaderClick) return;
    if (disabled) return;
    toggle();
  };

  const ToggleButton = collapsible ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md",
        "text-muted-foreground hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)]"
      )}
      aria-label={isOpen ? "Recolher" : "Expandir"}
      aria-expanded={isOpen}
      disabled={disabled}
    >
      {collapseIcon ?? <DefaultCaret open={isOpen} />}
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
        collapsible && toggleOnHeaderClick ? "cursor-pointer" : ""
      )}
      onClick={onHeaderClick}
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
        collapsible && toggleOnHeaderClick ? "cursor-pointer" : ""
      )}
      onClick={onHeaderClick}
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
      <div className="overflow-hidden">
        <div className={cn(sizeClasses.body, bodyClassName)}>{children}</div>
        {footer ? (
          <div className={cn("border-t border-border/60", sizeClasses.footer, footerClassName)}>{footer}</div>
        ) : null}
      </div>
    </div>
  ) : null;

  const bodyNode = !collapsible ? <div className={cn(sizeClasses.body, bodyClassName)}>{children}</div> : null;

  const footerNode = !collapsible && footer ? (
    <div className={cn("border-t border-border/60", sizeClasses.footer, footerClassName)}>{footer}</div>
  ) : null;

  const Component: any = isInteractive ? "button" : "section";
  const buttonLikeProps = isInteractive ? { type: "button", onClick: disabled ? undefined : onClick, disabled } : {};

  return (
    <Component className={rootClasses} {...buttonLikeProps} {...rest}>
      {headerNode}
      {collapsible ? collapsibleBodyWrapper : null}
      {!collapsible ? bodyNode : null}
      {!collapsible ? footerNode : null}
    </Component>
  );
}

SgCard.displayName = "SgCard";
