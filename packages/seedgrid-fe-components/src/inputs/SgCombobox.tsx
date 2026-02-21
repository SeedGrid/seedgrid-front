"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { type SgAutocompleteItem, type SgAutocompleteSource } from "./SgAutocomplete";
import { t, useComponentsI18n } from "../i18n";

type ComboboxValue = string | number | null;

type SgComboboxBaseProps = Omit<
  SgInputTextProps,
  "onChange" | "clearButton" | "iconButtons" | "inputProps" | "readOnly" | "value" | "type"
>;

export type SgComboboxSource<T = SgAutocompleteItem> = T[] | SgAutocompleteSource<T>;

export type SgComboboxProps<T = SgAutocompleteItem> = SgComboboxBaseProps & {
  source: SgComboboxSource<T>;
  value?: ComboboxValue;
  onValueChange?: (value: ComboboxValue) => void;
  mapItem?: (raw: T) => SgAutocompleteItem;
  grouped?: boolean;
  groupped?: boolean;
  loadingText?: string;
  emptyText?: string;
  openOnFocus?: boolean;
  onSelect?: (value: T) => void;
  renderItem?: (item: SgAutocompleteItem, isActive: boolean) => React.ReactNode;
  renderGroupHeader?: (group: string) => React.ReactNode;
  renderFooter?: (query: string, hasResults: boolean) => React.ReactNode;
  itemTooltip?: (item: SgAutocompleteItem) => React.ReactNode;
  inputProps?: SgInputTextProps["inputProps"];
};

type ComboboxEntry<T> = {
  item: SgAutocompleteItem;
  raw: T;
};

const TYPEAHEAD_RESET_MS = 700;

function defaultMapItem<T>(raw: T): SgAutocompleteItem {
  if (typeof raw === "string" || typeof raw === "number") {
    return {
      id: String(raw),
      label: String(raw)
    };
  }

  if (raw && typeof raw === "object") {
    const asRecord = raw as Record<string, unknown>;
    const id = asRecord.id ?? asRecord.value ?? asRecord.key ?? asRecord.label;
    const label = asRecord.label ?? asRecord.name ?? asRecord.description ?? asRecord.title ?? id;

    return {
      id: typeof id === "string" || typeof id === "number" ? id : String(id ?? ""),
      label: String(label ?? "")
    };
  }

  return {
    id: String(raw ?? ""),
    label: String(raw ?? "")
  };
}

function idEquals(left: string | number, right: ComboboxValue | undefined) {
  if (right == null) return false;
  return String(left) === String(right);
}

function findTypeAheadMatchIndex<T>(
  entries: Array<ComboboxEntry<T>>,
  query: string,
  startIndex: number
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return -1;
  if (!entries.length) return -1;

  for (let offset = 1; offset <= entries.length; offset += 1) {
    const index = (startIndex + offset + entries.length) % entries.length;
    const entry = entries[index];
    if (!entry || entry.item.disabled) continue;

    const label = entry.item.label?.toLowerCase() ?? "";
    if (label.startsWith(normalized)) return index;
  }

  return -1;
}

export function SgCombobox<T = SgAutocompleteItem>(props: Readonly<SgComboboxProps<T>>) {
  const {
    source,
    mapItem: mapItemProp,
    value,
    onValueChange,
    grouped,
    groupped,
    loadingText: loadingTextProp,
    emptyText: emptyTextProp,
    openOnFocus = false,
    onSelect,
    renderItem,
    renderGroupHeader,
    renderFooter,
    itemTooltip,
    inputProps,
    enabled,
    borderRadius,
    ...rest
  } = props;

  const i18n = useComponentsI18n();
  const loadingText = loadingTextProp ?? t(i18n, "components.autocomplete.loading");
  const emptyText = emptyTextProp ?? t(i18n, "components.autocomplete.empty");
  const effectiveGrouped = grouped ?? groupped ?? false;
  const isControlled = value !== undefined;

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const ignoreBlurRef = React.useRef(false);
  const requestIdRef = React.useRef(0);
  const typeAheadRef = React.useRef<{ buffer: string; ts: number }>({
    buffer: "",
    ts: 0
  });

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [entries, setEntries] = React.useState<Array<ComboboxEntry<T>>>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [internalValue, setInternalValue] = React.useState<ComboboxValue>(null);
  const [lastSelectedLabel, setLastSelectedLabel] = React.useState("");
  const resolvedBorderRadius = React.useMemo(() => {
    if (borderRadius === undefined) return undefined;
    return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  }, [borderRadius]);

  const resolvedValue = isControlled ? value : internalValue;
  const isDisabled = enabled === false;

  const mapItem = React.useCallback(
    (raw: T): SgAutocompleteItem => {
      if (mapItemProp) return mapItemProp(raw);
      return defaultMapItem(raw);
    },
    [mapItemProp]
  );

  const refreshFromSource = React.useCallback(async (): Promise<Array<ComboboxEntry<T>>> => {
    if (Array.isArray(source)) {
      const nextEntries = source.map((raw) => ({
        item: mapItem(raw),
        raw
      }));
      setEntries(nextEntries);
      return nextEntries;
    }

    setLoading(true);
    const currentRequest = ++requestIdRef.current;
    try {
      const result = source("");
      const data = typeof (result as Promise<T[]>)?.then === "function"
        ? await (result as Promise<T[]>)
        : (result as T[]);
      if (currentRequest !== requestIdRef.current) return [];
      const nextEntries = data.map((raw) => ({
        item: mapItem(raw),
        raw
      }));
      setEntries(nextEntries);
      return nextEntries;
    } catch {
      if (currentRequest !== requestIdRef.current) return [];
      setEntries([]);
      return [];
    } finally {
      if (currentRequest === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [mapItem, source]);

  React.useEffect(() => {
    if (!Array.isArray(source)) return;
    setEntries(
      source.map((raw) => ({
        item: mapItem(raw),
        raw
      }))
    );
  }, [mapItem, source]);

  const selectedEntry = React.useMemo(
    () => entries.find((entry) => idEquals(entry.item.id, resolvedValue)),
    [entries, resolvedValue]
  );

  React.useEffect(() => {
    if (resolvedValue == null || resolvedValue === "") {
      if (lastSelectedLabel !== "") {
        setLastSelectedLabel("");
      }
      return;
    }

    if (selectedEntry) {
      if (lastSelectedLabel !== selectedEntry.item.label) {
        setLastSelectedLabel(selectedEntry.item.label);
      }
      return;
    }

    if (lastSelectedLabel !== "") {
      setLastSelectedLabel("");
    }
    void refreshFromSource();
  }, [lastSelectedLabel, refreshFromSource, resolvedValue, selectedEntry]);

  const displayedValue =
    resolvedValue == null || resolvedValue === ""
      ? ""
      : selectedEntry?.item.label ?? lastSelectedLabel;

  const setSelectedValue = React.useCallback(
    (nextValue: ComboboxValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const closeDropdown = React.useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    typeAheadRef.current = { buffer: "", ts: 0 };
  }, []);

  const openDropdown = React.useCallback(() => {
    if (isDisabled) return;
    setOpen(true);
    void refreshFromSource();
  }, [isDisabled, refreshFromSource]);

  const selectIndex = React.useCallback(
    (index: number) => {
      const entry = entries[index];
      if (!entry || entry.item.disabled) return;
      setSelectedValue(entry.item.id);
      setLastSelectedLabel(entry.item.label);
      onSelect?.(entry.raw);
      closeDropdown();
    },
    [closeDropdown, entries, onSelect, setSelectedValue]
  );

  const handleTypeAhead = React.useCallback(
    async (typedKey: string) => {
      const key = typedKey.toLowerCase();
      const now = Date.now();
      const previous = typeAheadRef.current;
      const buffer =
        now - previous.ts > TYPEAHEAD_RESET_MS
          ? key
          : `${previous.buffer}${key}`;

      typeAheadRef.current = {
        buffer,
        ts: now
      };

      let availableEntries = entries;
      if (!availableEntries.length) {
        availableEntries = await refreshFromSource();
      }
      if (!availableEntries.length) return;

      const selectedIndex = availableEntries.findIndex((entry) =>
        idEquals(entry.item.id, resolvedValue)
      );
      const baseIndex = selectedIndex >= 0 ? selectedIndex : activeIndex;
      let nextIndex = findTypeAheadMatchIndex(availableEntries, buffer, baseIndex);

      if (nextIndex < 0 && buffer.length > 1) {
        typeAheadRef.current = { buffer: key, ts: now };
        nextIndex = findTypeAheadMatchIndex(availableEntries, key, baseIndex);
      }
      if (nextIndex < 0) return;

      const nextEntry = availableEntries[nextIndex];
      if (!nextEntry || nextEntry.item.disabled) return;

      setSelectedValue(nextEntry.item.id);
      setLastSelectedLabel(nextEntry.item.label);
      onSelect?.(nextEntry.raw);
      if (open) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, entries, onSelect, open, refreshFromSource, resolvedValue, setSelectedValue]
  );

  React.useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return;
      closeDropdown();
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [closeDropdown, open]);

  React.useEffect(() => {
    if (!open) return;
    if (!entries.length) {
      setActiveIndex(-1);
      return;
    }
    const selectedIndex = entries.findIndex((entry) => idEquals(entry.item.id, resolvedValue));
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
      return;
    }
    setActiveIndex(0);
  }, [entries, open, resolvedValue]);

  const groupedEntries = React.useMemo(() => {
    if (!effectiveGrouped) return null;

    const map = new Map<string, Array<{ entry: ComboboxEntry<T>; index: number }>>();
    entries.forEach((entry, index) => {
      const groupKey = entry.item.group ?? "";
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)?.push({ entry, index });
    });

    return Array.from(map.entries()).map(([group, list]) => ({
      group,
      list
    }));
  }, [effectiveGrouped, entries]);

  const dropdownButton = (
    <button
      type="button"
      className="text-foreground/60 hover:text-foreground"
      onMouseDown={(event) => {
        event.preventDefault();
        ignoreBlurRef.current = true;
      }}
      onClick={() => {
        if (open) {
          closeDropdown();
          return;
        }
        openDropdown();
      }}
      aria-label="Abrir lista"
    >
      <ChevronDown size={16} />
    </button>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <SgInputText
        {...rest}
        enabled={enabled}
        borderRadius={borderRadius}
        clearButton={false}
        readOnly
        iconButtons={[dropdownButton]}
        inputProps={{
          ...inputProps,
          value: displayedValue,
          onMouseDown: (event) => {
            inputProps?.onMouseDown?.(event);
            if (isDisabled) return;
            if (!open) {
              openDropdown();
            }
          },
          onFocus: (event) => {
            inputProps?.onFocus?.(event);
            if (openOnFocus) {
              openDropdown();
            }
          },
          onBlur: (event) => {
            inputProps?.onBlur?.(event);
            if (event.relatedTarget && wrapperRef.current?.contains(event.relatedTarget as Node)) {
              return;
            }
            if (ignoreBlurRef.current) {
              setTimeout(() => {
                ignoreBlurRef.current = false;
              }, 0);
              return;
            }
            closeDropdown();
          },
          onKeyDown: (event) => {
            inputProps?.onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (isDisabled) return;

            if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1 && event.key !== " ") {
              event.preventDefault();
              void handleTypeAhead(event.key);
              return;
            }

            if (event.key === "Tab") {
              closeDropdown();
              return;
            }

            if (event.key === "Escape") {
              event.preventDefault();
              closeDropdown();
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (!open) {
                openDropdown();
                return;
              }
              setActiveIndex((prev) => Math.min(prev + 1, entries.length - 1));
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!open) {
                openDropdown();
                return;
              }
              setActiveIndex((prev) => Math.max(prev - 1, 0));
              return;
            }

            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!open) {
                openDropdown();
                return;
              }
              if (activeIndex >= 0) {
                selectIndex(activeIndex);
              }
            }
          }
        }}
      />

      {open && !isDisabled ? (
        <div
          className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-md border border-border bg-white shadow-lg"
          style={resolvedBorderRadius ? { borderRadius: resolvedBorderRadius } : undefined}
        >
          <div className="max-h-64 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</div>
            ) : entries.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</div>
            ) : groupedEntries ? (
              groupedEntries.map(({ group, list }) => (
                <div key={group || "default"} className="border-b border-border last:border-b-0">
                  <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {renderGroupHeader ? renderGroupHeader(group) : group || " "}
                  </div>
                  {list.map(({ entry, index }) => {
                    const isActive = activeIndex === index;
                    return (
                      <div
                        key={entry.item.id}
                        className={`group relative cursor-pointer px-3 py-2 text-sm ${isActive ? "bg-muted/60" : ""} ${entry.item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted/40"}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          ignoreBlurRef.current = true;
                        }}
                        onClick={() => selectIndex(index)}
                      >
                        {renderItem ? renderItem(entry.item, isActive) : entry.item.label}
                        {itemTooltip ? (
                          <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded border border-border bg-white px-2 py-1 text-xs shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                            {itemTooltip(entry.item)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              entries.map((entry, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={entry.item.id}
                    className={`group relative cursor-pointer px-3 py-2 text-sm ${isActive ? "bg-muted/60" : ""} ${entry.item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted/40"}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      ignoreBlurRef.current = true;
                    }}
                    onClick={() => selectIndex(index)}
                  >
                    {renderItem ? renderItem(entry.item, isActive) : entry.item.label}
                    {itemTooltip ? (
                      <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded border border-border bg-white px-2 py-1 text-xs shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                        {itemTooltip(entry.item)}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          {renderFooter ? (
            <div className="border-t border-border bg-white px-3 py-2">
              {renderFooter("", entries.length > 0)}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
