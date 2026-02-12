"use client";

import * as React from "react";
import { SgButton, resolveButtonColors } from "./SgButton";
import type { SgButtonCustomColors } from "./SgButton";

type Severity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger";

type Appearance = "solid" | "outline" | "ghost";

type Size = "sm" | "md" | "lg";

type Shape = "default" | "rounded" | "square";

type Elevation = "none" | "sm" | "md";

export type SgSplitButtonItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
};

export type SgSplitButtonProps = {
  label?: string;
  leftIcon?: React.ReactNode;
  severity?: Severity;
  appearance?: Appearance;
  size?: Size;
  shape?: Shape;
  elevation?: Elevation;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  items: SgSplitButtonItem[];
  customColors?: SgButtonCustomColors;
  className?: string;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const SgSplitButton = React.forwardRef<HTMLDivElement, SgSplitButtonProps>(
  (
    {
      label,
      leftIcon,
      severity = "primary",
      appearance = "solid",
      size = "md",
      shape = "default",
      elevation = "none",
      disabled = false,
      loading = false,
      onClick,
      items,
      customColors,
      className
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    React.useEffect(() => {
      if (!open) return;
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      function handleEscape(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open]);

    const toggle = () => {
      if (!disabled && !loading) setOpen((prev) => !prev);
    };

    const handleItemClick = (item: SgSplitButtonItem) => {
      if (item.disabled) return;
      item.onClick?.();
      setOpen(false);
    };

    const colors = resolveButtonColors(severity, customColors);
    const toneKey =
      severity === "danger"
        ? "error"
        : severity === "help"
          ? "tertiary"
          : severity;
    const tone100 = `var(--sg-${toneKey}-100, var(--sg-primary-100))`;
    const tone200 = `var(--sg-${toneKey}-200, ${tone100})`;
    const tone300 = `var(--sg-${toneKey}-300, ${tone200})`;
    const menuBg = appearance === "solid" ? `rgb(${tone100})` : "#ffffff";
    const menuFg = appearance === "solid" ? "rgb(var(--sg-text))" : colors.bg;
    const menuHoverBg = appearance === "solid"
      ? `rgb(${tone200})`
      : `rgb(${tone100})`;
    const menuBorder =
      appearance === "outline"
        ? colors.border
        : appearance === "solid"
          ? `rgb(${tone200})`
          : "transparent";

    const dividerBorderClass =
      appearance === "solid"
        ? "border-l border-[rgb(var(--sg-border))]"
        : appearance === "outline"
          ? "border-l border-[var(--sg-btn-border,currentColor)]"
          : "border-l border-current/20";

    const sizeClasses: Record<Size, { menu: string; item: string; text: string; iconSize: string }> = {
      sm: { menu: "min-w-[140px]", item: "px-3 py-1.5", text: "text-sm", iconSize: "size-3.5" },
      md: { menu: "min-w-[160px]", item: "px-4 py-2", text: "text-sm", iconSize: "size-4" },
      lg: { menu: "min-w-[180px]", item: "px-5 py-2.5", text: "text-base", iconSize: "size-5" }
    };
    const s = sizeClasses[size];

    return (
      <div ref={containerRef} className={`relative inline-flex ${className ?? ""}`}>
        <SgButton
          severity={severity}
          appearance={appearance}
          size={size}
          shape={shape}
          elevation={elevation}
          disabled={disabled}
          loading={loading}
          leftIcon={leftIcon}
          onClick={onClick}
          customColors={customColors}
          className="rounded-r-none"
        >
          {label}
        </SgButton>

        <SgButton
          severity={severity}
          appearance={appearance}
          size={size}
          shape={shape}
          elevation={elevation}
          disabled={disabled || loading}
          leftIcon={<ChevronDown className="size-4" />}
          onClick={toggle}
          customColors={customColors}
          className={`rounded-l-none ${dividerBorderClass}`}
          aria-haspopup="true"
          aria-expanded={open}
        />

        {open && (
          <div
            ref={menuRef}
            role="menu"
            className={`absolute right-0 top-full z-50 mt-1 ${s.menu} overflow-hidden rounded-lg shadow-lg`}
            style={{
              backgroundColor: menuBg,
              color: menuFg,
              border: `1px solid ${menuBorder}`
            }}
          >
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {item.separator && i > 0 ? (
                  <div
                    className="my-0.5"
                    style={{
                      borderTop: `1px solid ${appearance === "solid" ? `rgb(${tone300})` : "rgb(var(--sg-text)/0.2)"}`
                    }}
                  />
                ) : null}
                <button
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  className={`flex w-full items-center gap-2 ${s.item} ${s.text} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (!item.disabled) (e.currentTarget.style.backgroundColor = menuHoverBg);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon ? <span className={`shrink-0 ${s.iconSize}`}>{item.icon}</span> : null}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SgSplitButton.displayName = "SgSplitButton";
