"use client";

import * as React from "react";
import { SgButton } from "./SgButton";
import type { SgButtonCustomColors } from "./SgButton";

type Severity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "help"
  | "danger"
  | "plain";

type Appearance = "solid" | "outline" | "ghost";

type Size = "sm" | "md" | "lg";

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
  raised?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  items: SgSplitButtonItem[];
  customColors?: SgButtonCustomColors;
  className?: string;
};

const SEVERITY_COLORS: Record<Severity, { bg: string; hoverBg: string; border: string; fg: string }> = {
  primary:   { bg: "#1d4ed8", hoverBg: "#1e40af", border: "#1d4ed8", fg: "#ffffff" },
  secondary: { bg: "#64748b", hoverBg: "#475569", border: "#64748b", fg: "#ffffff" },
  success:   { bg: "#65a30d", hoverBg: "#4d7c0f", border: "#65a30d", fg: "#ffffff" },
  info:      { bg: "#0284c7", hoverBg: "#0369a1", border: "#0284c7", fg: "#ffffff" },
  warning:   { bg: "#f59e0b", hoverBg: "#d97706", border: "#f59e0b", fg: "#111827" },
  help:      { bg: "#9333ea", hoverBg: "#7e22ce", border: "#9333ea", fg: "#ffffff" },
  danger:    { bg: "#dc2626", hoverBg: "#b91c1c", border: "#dc2626", fg: "#ffffff" },
  plain:     { bg: "#e5e7eb", hoverBg: "#d1d5db", border: "#d1d5db", fg: "#111827" }
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
      raised = false,
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

    const colors = SEVERITY_COLORS[severity];
    const menuBg = appearance === "solid" ? colors.bg : "#ffffff";
    const menuFg = appearance === "solid" ? colors.fg : colors.bg;
    const menuHoverBg = appearance === "solid" ? colors.hoverBg : `${colors.bg}18`;
    const menuBorder = appearance === "outline" ? colors.border : appearance === "solid" ? colors.hoverBg : "transparent";

    const dividerBorderClass =
      appearance === "solid"
        ? "border-l border-white/30"
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
          raised={raised}
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
          raised={raised}
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
                      borderTop: `1px solid ${appearance === "solid" ? "rgba(255,255,255,0.2)" : "#e5e7eb"}`
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
