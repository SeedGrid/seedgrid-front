"use client";

import React from "react";
import { t, useComponentsI18n } from "../i18n";
import {
  dismissSgWhistle,
  subscribeSgWhistles,
  type SgWhistleBorderStyle,
  type SgWhistleRecord,
  type SgWhistleSeverity
} from "./SgWhistle";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SgWhistleColors = {
  bg: string;
  fg: string;
  border: string;
};

export type SgWhistleHostProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  max?: number;
  newestOnTop?: boolean;
  gap?: number;
  customColors?: Partial<Record<SgWhistleSeverity, SgWhistleColors>>;
};

const DEFAULT_COLORS: Record<SgWhistleSeverity, SgWhistleColors> = {
  default: {
    bg: "hsl(var(--background))",
    fg: "hsl(var(--foreground))",
    border: "hsl(var(--border))"
  },
  success: {
    bg: "#f0fdf4",
    fg: "#14532d",
    border: "#86efac"
  },
  info: {
    bg: "#eff6ff",
    fg: "#1e3a8a",
    border: "#93c5fd"
  },
  warning: {
    bg: "#fffbeb",
    fg: "#78350f",
    border: "#fcd34d"
  },
  error: {
    bg: "#fef2f2",
    fg: "#7f1d1d",
    border: "#fca5a5"
  },
  loading: {
    bg: "#eff6ff",
    fg: "#1d4ed8",
    border: "#60a5fa"
  }
};

function clampOpacity(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return 1;
  }

  return Math.max(0, Math.min(1, value));
}

function resolveColors(
  severity: SgWhistleSeverity,
  customColors?: SgWhistleHostProps["customColors"]
) {
  const base = DEFAULT_COLORS[severity];
  const custom = customColors?.[severity];

  return {
    bg: custom?.bg ?? base.bg,
    fg: custom?.fg ?? base.fg,
    border: custom?.border ?? base.border
  };
}

function buildBorderStyle(borderStyle: SgWhistleBorderStyle, colors: SgWhistleColors): React.CSSProperties {
  if (borderStyle === "none") {
    return {
      borderWidth: 0
    };
  }

  if (borderStyle === "left-accent") {
    return {
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4
    };
  }

  if (borderStyle === "full-accent") {
    return {
      borderWidth: 1,
      borderColor: colors.border,
      boxShadow: `inset 0 0 0 1px ${colors.border}`
    };
  }

  if (borderStyle === "soft") {
    return {
      borderWidth: 1,
      borderColor: colors.border,
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)"
    };
  }

  return {
    borderWidth: 1,
    borderColor: colors.border
  };
}

function renderWhistleContent(whistle: SgWhistleRecord) {
  if (whistle.renderer !== undefined) {
    return whistle.renderer;
  }

  return (
    <div className="min-w-0 flex-1">
      {whistle.title ? <div className="text-sm font-semibold">{whistle.title}</div> : null}
      {whistle.message ? <div className={cn(whistle.title ? "mt-0.5" : undefined, "text-sm")}>{whistle.message}</div> : null}
    </div>
  );
}

export function SgWhistleHost(props: SgWhistleHostProps) {
  const {
    max = 4,
    newestOnTop = false,
    gap = 12,
    customColors,
    className,
    style,
    ...rest
  } = props;

  const i18n = useComponentsI18n();
  const [whistles, setWhistles] = React.useState<SgWhistleRecord[]>([]);
  const timersRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  React.useEffect(() => subscribeSgWhistles(setWhistles), []);

  const visible = React.useMemo(() => {
    if (max <= 0) {
      return [];
    }

    const items = whistles.slice(-max);
    return newestOnTop ? [...items].reverse() : items;
  }, [whistles, max, newestOnTop]);

  React.useEffect(() => {
    const activeIds = new Set<string>();

    visible.forEach((whistle) => {
      activeIds.add(whistle.id);

      if (timersRef.current[whistle.id]) {
        return;
      }

      if (whistle.severity === "loading") {
        return;
      }

      const timeout = whistle.duration ?? 5000;
      if (timeout <= 0) {
        return;
      }

      timersRef.current[whistle.id] = setTimeout(() => {
        dismissSgWhistle(whistle.id);
        delete timersRef.current[whistle.id];
      }, timeout);
    });

    Object.entries(timersRef.current).forEach(([id, timeoutRef]) => {
      if (activeIds.has(id)) {
        return;
      }

      clearTimeout(timeoutRef);
      delete timersRef.current[id];
    });
  }, [visible]);

  React.useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timeoutRef) => clearTimeout(timeoutRef));
      timersRef.current = {};
    };
  }, []);

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ gap, ...style }}
      {...rest}
    >
      {visible.map((whistle) => {
        const colors = resolveColors(whistle.severity, customColors);
        const dismissible = whistle.dismissible ?? true;

        return (
          <div
            key={whistle.id}
            className={cn(
              "flex items-start gap-3 rounded-lg px-3 py-2",
              whistle.borderStyle === "none" ? undefined : "border",
              whistle.className
            )}
            style={{
              backgroundColor: colors.bg,
              color: colors.fg,
              opacity: clampOpacity(whistle.opacity),
              ...buildBorderStyle(whistle.borderStyle ?? "solid", colors),
              ...whistle.style
            }}
            role="status"
            aria-live="polite"
          >
            {whistle.icon ? <div className="shrink-0 pt-0.5">{whistle.icon}</div> : null}
            {renderWhistleContent(whistle)}

            {whistle.action ? (
              <button
                type="button"
                className="shrink-0 rounded border border-current/25 px-2 py-1 text-xs font-medium"
                onClick={() => {
                  whistle.action?.onClick();
                  dismissSgWhistle(whistle.id);
                }}
              >
                {whistle.action.label}
              </button>
            ) : null}

            {dismissible ? (
              <button
                type="button"
                className="shrink-0 rounded px-1 py-0.5 text-sm leading-none opacity-80"
                aria-label={t(i18n, "components.toaster.close")}
                onClick={() => dismissSgWhistle(whistle.id)}
              >
                x
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
