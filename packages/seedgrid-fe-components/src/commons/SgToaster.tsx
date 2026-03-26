"use client";

import React from "react";
import { dismissSgToast, subscribeSgToasts, type SgToastRecord } from "./SgToast";
import { hasAnyHost, subscribeHostRegistry } from "./sgToastHostRegistry";
import { t, useComponentsI18n } from "../i18n";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgToasterPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type SgToasterTypeColors = {
  bg?: string;
  fg?: string;
  border?: string;
};

export type SgToasterCustomColors = Partial<
  Record<SgToastRecord["type"], SgToasterTypeColors>
>;

export type SgToasterProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  position?: SgToasterPosition;
  duration?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  richColors?: boolean;
  transparency?: number;
  customColors?: SgToasterCustomColors;
};

const POSITION_CLASS: Record<SgToasterPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center"
};

const RICH_TYPE_COLORS: Record<SgToastRecord["type"], Required<SgToasterTypeColors>> = {
  default: {
    border: "hsl(var(--border))",
    bg: "hsl(var(--background))",
    fg: "hsl(var(--foreground))"
  },
  success: {
    border: "#22c55e",
    bg: "#16a34a",
    fg: "#ffffff"
  },
  info: {
    border: "#0ea5e9",
    bg: "#0284c7",
    fg: "#ffffff"
  },
  warning: {
    border: "#f59e0b",
    bg: "#f59e0b",
    fg: "#000000"
  },
  error: {
    border: "#ef4444",
    bg: "#dc2626",
    fg: "#ffffff"
  },
  loading: {
    border: "#3b82f6",
    bg: "#2563eb",
    fg: "#ffffff"
  }
};

const SOFT_TYPE_COLORS: Record<SgToastRecord["type"], Required<SgToasterTypeColors>> = {
  default: {
    border: "hsl(var(--border))",
    bg: "hsl(var(--background))",
    fg: "hsl(var(--foreground))"
  },
  success: {
    border: "#86efac",
    bg: "#f0fdf4",
    fg: "#14532d"
  },
  info: {
    border: "#7dd3fc",
    bg: "#f0f9ff",
    fg: "#0c4a6e"
  },
  warning: {
    border: "#fcd34d",
    bg: "#fffbeb",
    fg: "#78350f"
  },
  error: {
    border: "#fca5a5",
    bg: "#fef2f2",
    fg: "#7f1d1d"
  },
  loading: {
    border: "#93c5fd",
    bg: "#eff6ff",
    fg: "#1e3a8a"
  }
};

function clampTransparency(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function resolveToastColors(
  type: SgToastRecord["type"],
  richColors: boolean,
  customColors?: SgToasterCustomColors
): Required<SgToasterTypeColors> {
  const base = richColors ? RICH_TYPE_COLORS[type] : SOFT_TYPE_COLORS[type];
  const custom = customColors?.[type];
  return {
    border: custom?.border ?? base.border,
    bg: custom?.bg ?? base.bg,
    fg: custom?.fg ?? base.fg
  };
}

/** @internal — used by SgToastHost to skip the host-presence check */
export const SgToasterHostContext = React.createContext(false);

export function SgToaster(props: SgToasterProps) {
  const renderedByHost = React.useContext(SgToasterHostContext);

  const {
    position = "top-right",
    duration = 4000,
    visibleToasts = 6,
    closeButton = true,
    richColors = true,
    transparency = 0,
    customColors,
    className,
    style,
    ...rest
  } = props;

  const i18n = useComponentsI18n();
  const [toasts, setToasts] = React.useState<SgToastRecord[]>([]);
  const timersRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [hostPresent, setHostPresent] = React.useState(() => !renderedByHost && hasAnyHost());

  React.useEffect(() => subscribeSgToasts(setToasts), []);

  React.useEffect(() => {
    if (renderedByHost) return;
    setHostPresent(hasAnyHost());
    return subscribeHostRegistry(() => setHostPresent(hasAnyHost()));
  }, [renderedByHost]);

  const visible = React.useMemo(() => {
    if (visibleToasts <= 0) {
      return [];
    }
    return toasts.slice(-visibleToasts);
  }, [toasts, visibleToasts]);

  React.useEffect(() => {
    const activeIds = new Set<string>();

    visible.forEach((toast) => {
      const toastId = toast.id;
      activeIds.add(toastId);

      if (timersRef.current[toastId]) {
        return;
      }

      if (toast.type === "loading") {
        return;
      }

      const timeout = toast.duration ?? duration;
      if (timeout <= 0) {
        return;
      }

      timersRef.current[toastId] = setTimeout(() => {
        dismissSgToast(toastId);
        delete timersRef.current[toastId];
      }, timeout);
    });

    Object.entries(timersRef.current).forEach(([toastId, timeoutRef]) => {
      if (activeIds.has(toastId)) {
        return;
      }
      clearTimeout(timeoutRef);
      delete timersRef.current[toastId];
    });
  }, [visible, duration]);

  React.useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timeoutRef) => clearTimeout(timeoutRef));
      timersRef.current = {};
    };
  }, []);

  const toastOpacity = 1 - clampTransparency(transparency) / 100;

  if (hostPresent) return null;

  return (
    <div
      className={cn("pointer-events-none fixed z-[1100] flex max-h-screen w-full flex-col gap-2 p-4 sm:w-auto", POSITION_CLASS[position], className)}
      style={style}
      {...rest}
    >
      {visible.map((toast) => {
        const typeColors = resolveToastColors(toast.type, richColors, customColors);
        const canClose = toast.closeButton ?? closeButton;

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex min-w-[260px] max-w-[420px] items-start gap-3 rounded-md border px-3 py-2 shadow-lg",
              toast.className
            )}
            style={{
              borderColor: typeColors.border,
              backgroundColor: typeColors.bg,
              color: typeColors.fg,
              opacity: toastOpacity,
              ...toast.style
            }}
            role="status"
            aria-live="polite"
          >
            <div className="min-w-0 flex-1">
              {toast.title ? <div className="text-sm font-semibold">{toast.title}</div> : null}
              {toast.description ? <div className="mt-0.5 text-xs opacity-90">{toast.description}</div> : null}
            </div>

            {toast.action ? (
              <button
                type="button"
                className="rounded border border-current/30 px-2 py-1 text-xs font-medium opacity-95 hover:opacity-100"
                onClick={() => {
                  toast.action?.onClick?.();
                  dismissSgToast(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            ) : null}

            {canClose ? (
              <button
                type="button"
                className="rounded px-1.5 py-0.5 text-xs opacity-80 hover:opacity-100"
                onClick={() => dismissSgToast(toast.id)}
                aria-label={t(i18n, "components.toaster.close")}
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

