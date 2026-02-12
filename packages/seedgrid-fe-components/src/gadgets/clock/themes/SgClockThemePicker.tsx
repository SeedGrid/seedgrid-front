"use client";

import * as React from "react";
import type { SgClockTheme } from "./types";
import { useSgClockThemeResolver } from "./provider";
import { SgClockThemePreview } from "./SgClockThemePreview";
import { SgAutocomplete, type SgAutocompleteItem } from "../../../inputs/SgAutocomplete";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgClockThemePickerProps = {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  filter?: (theme: SgClockTheme) => boolean;
  previewSize?: number;
  searchable?: boolean;
  fallbackThemeId?: string;
};

export function SgClockThemePicker({
  value,
  onChange,
  label = "Theme",
  placeholder = "Select a theme...",
  className,
  filter,
  previewSize = 56,
  searchable = true,
  fallbackThemeId = "classic"
}: SgClockThemePickerProps) {
  const resolver = useSgClockThemeResolver();

  const all = React.useMemo(() => {
    const list = resolver?.list() ?? [];
    return filter ? list.filter(filter) : list;
  }, [resolver, filter]);

  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const currentTheme = React.useMemo(() => {
    const found = resolver?.resolve(value) ?? all.find((t) => t.id === value) ?? null;
    if (found) return found;
    return resolver?.resolve(fallbackThemeId) ?? all.find((t) => t.id === fallbackThemeId) ?? null;
  }, [resolver, value, all, fallbackThemeId]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((t) => {
      const hay = `${t.id} ${t.label ?? ""} ${(t.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [all, q]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label ? <div className="mb-1 text-xs font-medium opacity-70">{label}</div> : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left shadow-sm",
          "hover:bg-neutral-50",
          "dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900/40"
        )}
      >
        <div className="flex items-center gap-3">
          {currentTheme ? (
            <div className="text-neutral-800 dark:text-neutral-200">
              <SgClockThemePreview theme={currentTheme} size={previewSize} />
            </div>
          ) : (
            <div className="h-[56px] w-[56px] rounded-md border border-neutral-200 dark:border-neutral-800" />
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {currentTheme?.label ?? currentTheme?.id ?? placeholder}
            </div>
            <div className="truncate text-xs opacity-60">{currentTheme?.id ?? ""}</div>
          </div>

          <div className="text-xs opacity-60">{open ? "^" : "v"}</div>
        </div>
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg",
            "dark:border-neutral-800 dark:bg-neutral-950"
          )}
        >
          {searchable && (
            <div className="p-2">
              <SgAutocomplete<SgAutocompleteItem>
                id="sg-clock-theme-search"
                label="Search theme"
                placeholder="Search theme..."
                openOnFocus
                showDropDownButton
                clearOnSelect
                minLengthForSearch={0}
                source={(query: string | null | undefined) => {
                  const s = (query ?? "").trim().toLowerCase();
                  const items: SgAutocompleteItem[] = all.map((t) => ({
                    id: t.id,
                    label: t.label ?? t.id,
                    value: t.id,
                    data: t
                  }));
                  if (!s) return items;
                  return items.filter((item) => item.label?.toLowerCase().includes(s));
                }}
                onSelect={(item: SgAutocompleteItem) => {
                  const id = item.value ?? item.id;
                  onChange(String(id));
                  setOpen(false);
                }}
              />
            </div>
          )}

          <div className="max-h-80 overflow-auto p-2">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm opacity-60">No themes found.</div>
            ) : (
              <div className="space-y-1">
                {filtered.map((t) => {
                  const active = t.id === value;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onChange(t.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-lg p-2 text-left transition",
                        active
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(active ? "text-white dark:text-neutral-900" : "text-neutral-800 dark:text-neutral-200")}>
                          <SgClockThemePreview theme={t} size={44} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{t.label ?? t.id}</div>
                          <div className={cn("truncate text-xs", active ? "opacity-80" : "opacity-60")}>{t.id}</div>
                        </div>
                        {active ? <div className="text-xs opacity-80">OK</div> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
