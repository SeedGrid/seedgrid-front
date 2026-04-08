"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { mergeRequiredRule, resolveFieldError, type RhfFieldProps } from "../rhf";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { t, useComponentsI18n } from "../i18n";

export type SgAutocompleteItem = {
  id: string | number;
  label: string;
  value?: string;
  group?: string;
  disabled?: boolean;
  data?: unknown;
};

export type SgAutocompleteSource<T = SgAutocompleteItem> = (query: string) => Promise<T[]> | T[];

export type SgAutocompleteProps<T = SgAutocompleteItem> = Omit<SgInputTextProps, "onChange" | "value"> & {
  value?: string;
  onChange?: (value: string) => void;
  source: SgAutocompleteSource<T>;
  mapItem?: (raw: T) => SgAutocompleteItem;
  minLengthForSearch?: number;
  delay?: number;
  maxResult?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  showDropDownButton?: boolean;
  openOnFocus?: boolean;
  clearOnSelect?: boolean;
  allowCustomValue?: boolean;
  grouped?: boolean;
  groupped?: boolean;
  placeholderEmpty?: string;
  loadingText?: string;
  onSelect?: (item: SgAutocompleteItem) => void;
  onSearch?: (query: string) => void;
  onOpenChange?: (open: boolean) => void;
  renderItem?: (item: SgAutocompleteItem, isActive: boolean) => React.ReactNode;
  renderGroupHeader?: (group: string) => React.ReactNode;
  renderFooter?: (query: string, hasResults: boolean) => React.ReactNode;
  renderEmpty?: (query: string) => React.ReactNode;
  formatSelection?: (item: SgAutocompleteItem) => string;
  renderValue?: (item: SgAutocompleteItem | null) => React.ReactNode;
  itemTooltip?: (item: SgAutocompleteItem) => React.ReactNode;
} & RhfFieldProps;

type SgAutocompleteBaseProps<T> = Omit<SgAutocompleteProps<T>, "control">;

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === "function";
}

export function SgAutocomplete<T = SgAutocompleteItem>(props: SgAutocompleteProps<T>) {
  const i18n = useComponentsI18n();
  const { control, name, register, rules, ...rest } = props;
  const resolvedRules = mergeRequiredRule(
    rules,
    rest.required,
    rest.requiredMessage ?? t(i18n, "components.inputs.required")
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={resolvedRules}
        render={({
          field,
          fieldState
        }: {
          field: ControllerRenderProps<FieldValues, string>;
          fieldState: ControllerFieldState;
        }) => (
          <SgAutocompleteBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            value={field.value ?? ""}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
    );
  }

  return (
    <SgAutocompleteBase
      {...rest}
      name={name}
      register={register}
      rules={resolvedRules}
    />
  );
}

function SgAutocompleteBase<T>(props: SgAutocompleteBaseProps<T>) {
  const {
    value,
    onChange,
    source,
    mapItem,
    minLengthForSearch = 2,
    delay = 300,
    maxResult = 50,
    cacheEnabled = true,
    cacheTTL = 5 * 60 * 1000,
    showDropDownButton = false,
    openOnFocus = false,
    clearOnSelect = false,
    allowCustomValue = false,
    grouped,
    groupped,
    placeholderEmpty: placeholderEmptyProp,
    loadingText: loadingTextProp,
    onSelect,
    onSearch,
    onOpenChange,
    renderItem,
    renderGroupHeader,
    renderFooter,
    renderEmpty,
    formatSelection,
    renderValue,
    itemTooltip,
    inputProps,
    iconButtons,
    enabled,
    readOnly,
    borderRadius,
    ...rest
  } = props;

  const i18n = useComponentsI18n();
  const placeholderEmpty = placeholderEmptyProp ?? t(i18n, "components.autocomplete.empty");
  const loadingText = loadingTextProp ?? t(i18n, "components.autocomplete.loading");
  const effectiveGrouped = grouped ?? groupped ?? false;
  const [inputValue, setInputValue] = React.useState(value ?? "");
  const [items, setItems] = React.useState<SgAutocompleteItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const ignoreBlurRef = React.useRef(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [lastSelected, setLastSelected] = React.useState<string>("");
  const [selectedItem, setSelectedItem] = React.useState<SgAutocompleteItem | null>(null);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const cacheRef = React.useRef<Map<string, { ts: number; items: SgAutocompleteItem[] }>>(new Map());
  const requestIdRef = React.useRef(0);
  const openRef = React.useRef(false);
  openRef.current = open;
  // While the user is focused (typing), every incoming `value` prop change is
  // just the parent echoing back our own onChange. Overwriting inputValue in
  // that window drops characters typed faster than one render cycle.
  const isFocusedRef = React.useRef(false);
  const resolvedBorderRadius = React.useMemo(() => {
    if (borderRadius === undefined) return undefined;
    return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  }, [borderRadius]);

  React.useEffect(() => {
    if (value === undefined) return;
    setLastSelected(value);
    // Never clobber what the user is actively typing.
    if (isFocusedRef.current) return;
    setInputValue(value);
  }, [value]);

  React.useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      return;
    }

    setSelectedItem((current) => {
      if (current && (current.value === value || current.label === value)) {
        return current;
      }
      return current;
    });
  }, [value]);

  const toItem = React.useCallback(
    (raw: T): SgAutocompleteItem => {
      if (mapItem) return mapItem(raw);
      return raw as unknown as SgAutocompleteItem;
    },
    [mapItem]
  );

  const runSearch = React.useCallback(
    (query: string, forceOpen?: boolean) => {
      const trimmed = query ?? "";
      if (trimmed.length < minLengthForSearch && !forceOpen) {
        setItems([]);
        setLoading(false);
        setOpen(false);
        onOpenChange?.(false);
        return;
      }

      onSearch?.(trimmed);
      setLoading(true);

      const now = Date.now();
      if (cacheEnabled) {
        const cached = cacheRef.current.get(trimmed);
        if (cached && now - cached.ts < cacheTTL) {
          setItems(cached.items);
          setLoading(false);
          setOpen(true);
          onOpenChange?.(true);
          return;
        }
      }

      const currentRequest = ++requestIdRef.current;
      const result = source(trimmed);
      const handle = (data: T[]) => {
        if (currentRequest !== requestIdRef.current) return;
        const mapped = data.map(toItem).slice(0, maxResult);
        if (cacheEnabled) {
          cacheRef.current.set(trimmed, { ts: Date.now(), items: mapped });
        }
        setItems(mapped);
        setLoading(false);
        setOpen(true);
        onOpenChange?.(true);
      };

      if (isPromise(result)) {
        result.then(handle).catch(() => {
          if (currentRequest !== requestIdRef.current) return;
          setItems([]);
          setLoading(false);
          setOpen(true);
          onOpenChange?.(true);
        });
      } else {
        handle(result);
      }
    },
    [cacheEnabled, cacheTTL, maxResult, minLengthForSearch, onOpenChange, onSearch, source, toItem]
  );

  React.useEffect(() => {
    if (!openRef.current) return;
    const handler = setTimeout(() => runSearch(inputValue), delay);
    return () => clearTimeout(handler);
  }, [delay, inputValue, runSearch]);

  const selectItem = (item: SgAutocompleteItem) => {
    if (item.disabled) return;
    const selection = formatSelection ? formatSelection(item) : item.label;
    setSelectedItem(item);
    setInputValue(selection);
    onChange?.(selection);
    setLastSelected(selection);
    onSelect?.(item);
    setOpen(false);
    onOpenChange?.(false);
    if (clearOnSelect) {
      setInputValue("");
      onChange?.("");
    }
  };

  const handleInputChange = (next: string) => {
    if (selectedItem && next !== (formatSelection ? formatSelection(selectedItem) : selectedItem.label)) {
      setSelectedItem(null);
    }
    setInputValue(next);
    onChange?.(next);
    if (next.length === 0) {
      setItems([]);
      setOpen(false);
      onOpenChange?.(false);
      setActiveIndex(-1);
      return;
    }
    if (!open && (openOnFocus || next.length >= minLengthForSearch)) {
      setOpen(true);
      onOpenChange?.(true);
    }
    setActiveIndex(-1);
  };

  const handleBlur = (event?: React.FocusEvent<HTMLInputElement>) => {
    if (event?.relatedTarget && wrapperRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    if (ignoreBlurRef.current) {
      setTimeout(() => {
        ignoreBlurRef.current = false;
      }, 0);
      return;
    }
    isFocusedRef.current = false;
    if (!allowCustomValue && lastSelected && inputValue !== lastSelected) {
      setInputValue(lastSelected);
      onChange?.(lastSelected);
    }
    setOpen(false);
    onOpenChange?.(false);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    if (renderValue && selectedItem) {
      const selection = formatSelection ? formatSelection(selectedItem) : selectedItem.label;
      setInputValue(selection);
    }
    if (openOnFocus) {
      setOpen(true);
      onOpenChange?.(true);
      runSearch(inputValue, true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[activeIndex];
      if (item) selectItem(item);
    } else if (event.key === "Escape") {
      setOpen(false);
      onOpenChange?.(false);
    }
  };

  const syncDropdownPosition = React.useCallback(() => {
    const anchor = wrapperRef.current?.querySelector("input") ?? inputRef.current ?? wrapperRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      minWidth: rect.width,
      width: "max-content",
      maxWidth: "min(32rem, calc(100vw - 24px))",
      borderRadius: resolvedBorderRadius
    });
  }, [resolvedBorderRadius]);

  const dropdownButton = showDropDownButton ? (
    <button
      type="button"
      className="text-foreground/60 hover:text-foreground"
      onMouseDown={(event) => {
        event.preventDefault();
        ignoreBlurRef.current = true;
      }}
      onClick={() => {
        if (open) {
          setOpen(false);
          onOpenChange?.(false);
          return;
        }
        setOpen(true);
        onOpenChange?.(true);
        runSearch(inputValue, true);
      }}
      aria-label={t(i18n, "components.actions.openList")}
    >
      <ChevronDown size={16} />
    </button>
  ) : null;

  const mergedIconButtons = dropdownButton ? [...(iconButtons ?? []), dropdownButton] : iconButtons;

  const groupedItems = React.useMemo(() => {
    if (!effectiveGrouped) return null;
    const map = new Map<string, SgAutocompleteItem[]>();
    items.forEach((item) => {
      const key = item.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(item);
    });
    return Array.from(map.entries()).map(([group, list]) => ({ group, list }));
  }, [effectiveGrouped, items]);

  const listContent = () => {
    if (loading) {
      return <div className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</div>;
    }
    if (items.length === 0) {
      return renderEmpty ? renderEmpty(inputValue) : <div className="px-3 py-2 text-sm text-muted-foreground">{placeholderEmpty}</div>;
    }
    if (groupedItems) {
      return groupedItems.map(({ group, list }) => (
        <div key={group || "default"} className="border-b border-border last:border-b-0">
          <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
            {renderGroupHeader ? renderGroupHeader(group) : group || " "}
          </div>
          {list.map((item, index) => {
            const flatIndex = items.indexOf(item);
            const isActive = flatIndex === activeIndex;
            return (
              <div
                key={item.id}
                className={`group relative cursor-pointer px-3 py-2 text-sm ${isActive ? "bg-muted/60" : ""} ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/40"}`}
                onMouseEnter={() => setActiveIndex(flatIndex)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  ignoreBlurRef.current = true;
                }}
                onClick={() => selectItem(item)}
              >
                {renderItem ? renderItem(item, isActive) : item.label}
                {itemTooltip ? (
                  <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded border border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] px-2 py-1 text-xs text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-md opacity-0 transition-opacity group-hover:opacity-100">
                    {itemTooltip(item)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ));
    }
    return items.map((item, index) => {
      const isActive = index === activeIndex;
      return (
        <div
          key={item.id}
          className={`group relative cursor-pointer px-3 py-2 text-sm ${isActive ? "bg-muted/60" : ""} ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/40"}`}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseDown={(event) => {
            event.preventDefault();
            ignoreBlurRef.current = true;
          }}
          onClick={() => selectItem(item)}
        >
          {renderItem ? renderItem(item, isActive) : item.label}
          {itemTooltip ? (
            <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded border border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] px-2 py-1 text-xs text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-md opacity-0 transition-opacity group-hover:opacity-100">
              {itemTooltip(item)}
            </div>
          ) : null}
        </div>
      );
    });
  };

  React.useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return;
      if (dropdownRef.current?.contains(event.target as Node)) return;
      if (!allowCustomValue && lastSelected && inputValue !== lastSelected) {
        setInputValue(lastSelected);
        onChange?.(lastSelected);
      }
      setOpen(false);
      onOpenChange?.(false);
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [allowCustomValue, inputValue, lastSelected, onChange, onOpenChange, open]);

  React.useEffect(() => {
    if (!open) return;

    syncDropdownPosition();

    const handleLayoutChange = () => {
      syncDropdownPosition();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [open, syncDropdownPosition]);

  return (
    <div className="relative" ref={wrapperRef}>
      <SgInputText
        {...rest}
        enabled={enabled}
        readOnly={readOnly}
        borderRadius={borderRadius}
        iconButtons={mergedIconButtons}
        inputProps={{
          ...inputProps,
          ref: inputRef,
          autoComplete: "off",
          autoCorrect: "off",
          autoCapitalize: "off",
          spellCheck: false,
          value: inputValue,
          style: renderValue && selectedItem && !open
            ? {
              ...(inputProps?.style ?? {}),
              color: "transparent",
              textShadow: "none"
            }
            : inputProps?.style,
          onChange: (event) => handleInputChange(event.currentTarget.value),
          onBlur: (event) => {
            inputProps?.onBlur?.(event);
            handleBlur(event);
          },
          onFocus: (event) => {
            inputProps?.onFocus?.(event);
            handleFocus();
          },
          onKeyDown: (event) => {
            inputProps?.onKeyDown?.(event);
            handleKeyDown(event);
          }
        }}
      />
      {renderValue && selectedItem && !open ? (
        <div className="pointer-events-none absolute inset-y-0 left-3 right-10 z-10 flex items-center overflow-hidden">
          {renderValue(selectedItem)}
        </div>
      ) : null}
      {open && !(enabled === false || readOnly) && typeof document !== "undefined"
        ? createPortal(
          <div
            ref={dropdownRef}
            className="z-[1100] overflow-hidden rounded-md border border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-lg"
            style={dropdownStyle}
          >
            <div className="max-h-64 overflow-auto">
              {listContent()}
            </div>
            {renderFooter ? (
              <div className="border-t border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] px-3 py-2">
                {renderFooter(inputValue, items.length > 0)}
              </div>
            ) : null}
          </div>,
          document.body
        )
        : null}
    </div>
  );
}

