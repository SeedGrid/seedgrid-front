"use client";

import React from "react";
import { dismissSgToast, subscribeSgToasts, type SgToastRecord } from "./SgToast";

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

export type SgToasterProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  position?: SgToasterPosition;
  duration?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  richColors?: boolean;
};

const POSITION_CLASS: Record<SgToasterPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center"
};

const RICH_TYPE_CLASS: Record<SgToastRecord["type"], string> = {
  default: "border-border bg-background text-foreground",
  success: "border-green-500 bg-green-600 text-white",
  info: "border-sky-500 bg-sky-600 text-white",
  warning: "border-amber-500 bg-amber-500 text-black",
  error: "border-red-500 bg-red-600 text-white",
  loading: "border-blue-500 bg-blue-600 text-white"
};

const SOFT_TYPE_CLASS: Record<SgToastRecord["type"], string> = {
  default: "border-border bg-background text-foreground",
  success: "border-green-300 bg-green-50 text-green-900",
  info: "border-sky-300 bg-sky-50 text-sky-900",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  error: "border-red-300 bg-red-50 text-red-900",
  loading: "border-blue-300 bg-blue-50 text-blue-900"
};

export function SgToaster(props: SgToasterProps) {
  const {
    position = "top-right",
    duration = 4000,
    visibleToasts = 6,
    closeButton = true,
    richColors = true,
    className,
    style,
    ...rest
  } = props;

  const [toasts, setToasts] = React.useState<SgToastRecord[]>([]);
  const timersRef = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  React.useEffect(() => subscribeSgToasts(setToasts), []);

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

  return (
    <div
      className={cn("pointer-events-none fixed z-[1100] flex max-h-screen w-full flex-col gap-2 p-4 sm:w-auto", POSITION_CLASS[position], className)}
      style={style}
      {...rest}
    >
      {visible.map((toast) => {
        const typeClass = richColors ? RICH_TYPE_CLASS[toast.type] : SOFT_TYPE_CLASS[toast.type];
        const canClose = toast.closeButton ?? closeButton;

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex min-w-[260px] max-w-[420px] items-start gap-3 rounded-md border px-3 py-2 shadow-lg",
              typeClass,
              toast.className
            )}
            style={toast.style}
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
                aria-label="Close toast"
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
