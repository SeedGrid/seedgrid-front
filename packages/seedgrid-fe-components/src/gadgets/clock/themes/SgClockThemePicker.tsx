"use client";

import * as React from "react";
import type { SgClockTheme } from "./types";
import { useSgClockThemeResolver } from "./provider";
import { SgClockThemePreview } from "./SgClockThemePreview";
import { filterClockThemes, resolveClockThemeSelection } from "./search";
import { SgAutocomplete, type SgAutocompleteItem } from "../../../inputs/SgAutocomplete";
import { t, useComponentsI18n } from "../../../i18n";

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
  defaultOpen?: boolean;
};

export function SgClockThemePicker({
  value,
  onChange,
  label: labelProp,
  placeholder: placeholderProp,
  className,
  filter,
  previewSize = 56,
  searchable = true,
  fallbackThemeId = "classic",
  defaultOpen = false
}: SgClockThemePickerProps) {
  const i18n = useComponentsI18n();
  const label = labelProp ?? t(i18n, "components.gadgets.clock.theme");
  const placeholder = placeholderProp ?? t(i18n, "components.gadgets.clock.selectTheme");
  const resolver = useSgClockThemeResolver();

  const all = React.useMemo(() => {
    const list = resolver?.list() ?? [];
    return filter ? list.filter(filter) : list;
  }, [resolver, filter]);

  const popupId = React.useId();
  const [open, setOpen] = React.useState(defaultOpen);
  const [q, setQ] = React.useState("");

  const currentTheme = React.useMemo(
    () =>
      resolveClockThemeSelection({
        resolver,
        allThemes: all,
        value,
        fallbackThemeId
      }),
    [resolver, value, all, fallbackThemeId]
  );

  const filtered = React.useMemo(() => filterClockThemes(all, q), [all, q]);

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
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={popupId}
        className={cn(
          "w-full rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface,var(--sg-bg)))] px-3 py-2 text-left text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-sm",
          "hover:bg-[rgb(var(--sg-surface-2,var(--sg-surface,var(--sg-bg))))]"
        )}
      >
        <div className="flex items-center gap-3">
          {currentTheme ? (
            <div className="text-[rgb(var(--sg-text,var(--sg-fg)))]">
              <SgClockThemePreview theme={currentTheme} size={previewSize} />
            </div>
          ) : (
            <div className="h-[56px] w-[56px] rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface-2,var(--sg-surface,var(--sg-bg))))]" />
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
          id={popupId}
          role="listbox"
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface,var(--sg-bg)))] text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-lg"
          )}
        >
          {searchable && (
            <div className="p-2">
              <SgAutocomplete<SgAutocompleteItem>
                value={q}
                onChange={setQ}
                id="sg-clock-theme-search"
                label={t(i18n, "components.gadgets.clock.searchTheme")}
                placeholder={t(i18n, "components.gadgets.clock.searchThemePlaceholder")}
                openOnFocus
                showDropDownButton
                clearOnSelect
                minLengthForSearch={0}
                source={(query: string | null | undefined) => {
                  const items: SgAutocompleteItem[] = filterClockThemes(all, query ?? "").map((t) => ({
                    id: t.id,
                    label: t.label ?? t.id,
                    value: t.id,
                    data: t
                  }));
                  return items;
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
              <div className="p-3 text-sm opacity-60">{t(i18n, "components.gadgets.clock.noThemesFound")}</div>
            ) : (
              <div className="space-y-1">
                {filtered.map((themeOption) => {
                  const active = themeOption.id === value;
                  return (
                    <button
                      key={themeOption.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(themeOption.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-lg p-2 text-left transition",
                        active
                          ? "bg-[rgb(var(--sg-primary))] text-[rgb(var(--sg-primary-contrast,var(--sg-bg)))]"
                          : "hover:bg-[rgb(var(--sg-surface-2,var(--sg-surface,var(--sg-bg))))]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(active ? "text-[rgb(var(--sg-primary-contrast,var(--sg-bg)))]" : "text-[rgb(var(--sg-text,var(--sg-fg)))]")}>
                          <SgClockThemePreview theme={themeOption} size={44} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{themeOption.label ?? themeOption.id}</div>
                          <div className={cn("truncate text-xs", active ? "opacity-80" : "opacity-60")}>{themeOption.id}</div>
                        </div>
                        {active ? <div className="text-xs opacity-80">{t(i18n, "components.gadgets.clock.activeTheme")}</div> : null}
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






