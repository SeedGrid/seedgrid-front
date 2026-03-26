"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { SgButton } from "../buttons/SgButton";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";

export interface SgOrderListItem {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
  data?: unknown;
}

export type SgOrderListSelectionMode = "single" | "multiple";
export type SgOrderListControlsPosition = "left" | "right";

export type SgOrderListRef = {
  getItems: () => SgOrderListItem[];
  setItems: (items: SgOrderListItem[]) => void;
  getSelection: () => (string | number)[];
  setSelection: (values: (string | number)[]) => void;
  moveTop: () => void;
  moveUp: () => void;
  moveDown: () => void;
  moveBottom: () => void;
  clearSelection: () => void;
};

export interface SgOrderListProps extends RhfFieldProps {
  error?: string;
  id?: string;
  title?: string;
  source: SgOrderListItem[];
  value?: SgOrderListItem[];
  onChange?: (items: SgOrderListItem[]) => void;
  selectedValues?: (string | number)[];
  onSelectionChange?: (values: (string | number)[]) => void;
  selectionMode?: SgOrderListSelectionMode;
  showControls?: boolean;
  controlsPosition?: SgOrderListControlsPosition;
  draggable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;
  itemTemplate?: (
    item: SgOrderListItem,
    state: { index: number; selected: boolean; disabled: boolean }
  ) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  listClassName?: string;
  itemClassName?: string;
  groupBoxProps?: Omit<Partial<SgGroupBoxProps>, "children" | "title"> & { title?: string };
}

function cn(...parts: Array<string | null | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function uniqueValues(values: (string | number)[]) {
  return Array.from(new Set(values));
}

function isSameValueList(a: (string | number)[], b: (string | number)[]) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}

function isSameOrder(a: SgOrderListItem[], b: SgOrderListItem[]) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}

function getMovableSelection(items: SgOrderListItem[], selection: (string | number)[]) {
  const selectedValues = new Set(selection);
  return new Set(
    items
      .filter((item) => selectedValues.has(item.value) && !item.disabled)
      .map((item) => item.value)
  );
}

function moveSelectionTop(items: SgOrderListItem[], selected: Set<string | number>) {
  if (items.length < 2 || selected.size === 0) return items;
  const picked = items.filter((item) => selected.has(item.value));
  if (picked.length === 0) return items;
  const rest = items.filter((item) => !selected.has(item.value));
  const next = [...picked, ...rest];
  return isSameOrder(items, next) ? items : next;
}

function moveSelectionBottom(items: SgOrderListItem[], selected: Set<string | number>) {
  if (items.length < 2 || selected.size === 0) return items;
  const picked = items.filter((item) => selected.has(item.value));
  if (picked.length === 0) return items;
  const rest = items.filter((item) => !selected.has(item.value));
  const next = [...rest, ...picked];
  return isSameOrder(items, next) ? items : next;
}

function moveSelectionUp(items: SgOrderListItem[], selected: Set<string | number>) {
  if (items.length < 2 || selected.size === 0) return items;

  const next = [...items];
  let moved = false;
  for (let index = 1; index < next.length; index += 1) {
    const current = next[index]!;
    const previous = next[index - 1]!;
    if (!selected.has(current.value) || selected.has(previous.value)) continue;
    next[index] = previous;
    next[index - 1] = current;
    moved = true;
  }
  return moved ? next : items;
}

function moveSelectionDown(items: SgOrderListItem[], selected: Set<string | number>) {
  if (items.length < 2 || selected.size === 0) return items;

  const next = [...items];
  let moved = false;
  for (let index = next.length - 2; index >= 0; index -= 1) {
    const current = next[index]!;
    const nextItem = next[index + 1]!;
    if (!selected.has(current.value) || selected.has(nextItem.value)) continue;
    next[index] = nextItem;
    next[index + 1] = current;
    moved = true;
  }
  return moved ? next : items;
}

function moveSingleItem(items: SgOrderListItem[], fromIndex: number, toIndex: number) {
  if (items.length < 2) return items;
  if (fromIndex < 0 || fromIndex >= items.length) return items;
  if (toIndex < 0 || toIndex > items.length) return items;
  if (fromIndex === toIndex || fromIndex + 1 === toIndex) return items;

  const next = [...items];
  const [picked] = next.splice(fromIndex, 1);
  if (!picked) return items;

  const targetIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
  const insertAt = Math.max(0, Math.min(targetIndex, next.length));
  next.splice(insertAt, 0, picked);
  return isSameOrder(items, next) ? items : next;
}

function resolveMessage(
  translated: string,
  key: string,
  fallback: string
) {
  return translated === key ? fallback : translated;
}

function SgOrderListBase(
  props: SgOrderListProps,
  imperativeRef?: React.ForwardedRef<SgOrderListRef>
) {
  const i18n = useComponentsI18n();
  const {
    id,
    title,
    source,
    value: controlledValue,
    onChange,
    selectedValues: controlledSelection,
    onSelectionChange,
    selectionMode = "multiple",
    showControls = true,
    controlsPosition = "left",
    draggable = true,
    disabled = false,
    readOnly = false,
    emptyMessage,
    itemTemplate,
    className = "",
    style,
    listClassName = "",
    itemClassName = "",
    groupBoxProps = {},
    error
  } = props;

  const [internalItems, setInternalItems] = React.useState<SgOrderListItem[]>(
    () => controlledValue ?? source
  );
  const [internalSelection, setInternalSelection] = React.useState<(string | number)[]>(
    () => uniqueValues(controlledSelection ?? [])
  );
  const [anchorValue, setAnchorValue] = React.useState<string | number | null>(null);

  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [dropIndex, setDropIndex] = React.useState<number | null>(null);

  const isControlled = controlledValue !== undefined;
  const isSelectionControlled = controlledSelection !== undefined;

  React.useEffect(() => {
    if (isControlled) return;
    setInternalItems(source);
  }, [source, isControlled]);

  const currentItems = isControlled ? controlledValue : internalItems;
  const rawSelection = isSelectionControlled ? (controlledSelection ?? []) : internalSelection;
  const currentSelection = React.useMemo(() => {
    const validValues = new Set(currentItems.map((item) => item.value));
    return uniqueValues(rawSelection.filter((value) => validValues.has(value)));
  }, [rawSelection, currentItems]);
  const selectedSet = React.useMemo(() => new Set(currentSelection), [currentSelection]);

  React.useEffect(() => {
    if (isSelectionControlled) return;
    setInternalSelection((previous) => {
      const validValues = new Set(currentItems.map((item) => item.value));
      const next = uniqueValues(previous.filter((value) => validValues.has(value)));
      return isSameValueList(previous, next) ? previous : next;
    });
  }, [currentItems, isSelectionControlled]);

  const canInteract = !disabled && !readOnly;
  const allowDrag = draggable && canInteract;
  const movableSelection = React.useMemo(
    () => getMovableSelection(currentItems, currentSelection),
    [currentItems, currentSelection]
  );

  const commitItems = React.useCallback((nextItems: SgOrderListItem[]) => {
    if (!isControlled) setInternalItems(nextItems);
    onChange?.(nextItems);
  }, [isControlled, onChange]);

  const commitSelection = React.useCallback((nextSelection: (string | number)[]) => {
    const normalized = uniqueValues(nextSelection);
    if (!isSelectionControlled) setInternalSelection(normalized);
    onSelectionChange?.(normalized);
  }, [isSelectionControlled, onSelectionChange]);

  const applyMove = React.useCallback((direction: "top" | "up" | "down" | "bottom") => {
    if (!canInteract || movableSelection.size === 0) return;

    let nextItems = currentItems;
    if (direction === "top") nextItems = moveSelectionTop(currentItems, movableSelection);
    if (direction === "up") nextItems = moveSelectionUp(currentItems, movableSelection);
    if (direction === "down") nextItems = moveSelectionDown(currentItems, movableSelection);
    if (direction === "bottom") nextItems = moveSelectionBottom(currentItems, movableSelection);

    if (nextItems !== currentItems) commitItems(nextItems);
  }, [canInteract, commitItems, currentItems, movableSelection]);

  React.useImperativeHandle(imperativeRef, () => ({
    getItems: () => currentItems,
    setItems: (items) => commitItems(items),
    getSelection: () => currentSelection,
    setSelection: (values) => commitSelection(values),
    moveTop: () => applyMove("top"),
    moveUp: () => applyMove("up"),
    moveDown: () => applyMove("down"),
    moveBottom: () => applyMove("bottom"),
    clearSelection: () => commitSelection([])
  }), [applyMove, commitItems, commitSelection, currentItems, currentSelection]);

  const handleItemSelection = React.useCallback((
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    item: SgOrderListItem,
    index: number
  ) => {
    if (!canInteract || item.disabled) return;

    const itemValue = item.value;
    if (selectionMode === "single") {
      commitSelection([itemValue]);
      setAnchorValue(itemValue);
      return;
    }

    if (event.shiftKey && anchorValue !== null) {
      const anchorIndex = currentItems.findIndex((entry) => entry.value === anchorValue);
      if (anchorIndex >= 0) {
        const start = Math.min(anchorIndex, index);
        const end = Math.max(anchorIndex, index);
        const rangeValues = currentItems
          .slice(start, end + 1)
          .filter((entry) => !entry.disabled)
          .map((entry) => entry.value);
        if (event.metaKey || event.ctrlKey) {
          commitSelection([...currentSelection, ...rangeValues]);
        } else {
          commitSelection(rangeValues);
        }
        return;
      }
    }

    const alreadySelected = selectedSet.has(itemValue);
    const nextSelection = alreadySelected
      ? currentSelection.filter((value) => value !== itemValue)
      : [...currentSelection, itemValue];
    commitSelection(nextSelection);
    setAnchorValue(itemValue);
  }, [
    anchorValue,
    canInteract,
    commitSelection,
    currentItems,
    currentSelection,
    selectedSet,
    selectionMode
  ]);

  const clearDragState = React.useCallback(() => {
    setDraggingIndex(null);
    setDropIndex(null);
  }, []);

  const handleDragStart = React.useCallback((
    event: React.DragEvent<HTMLButtonElement>,
    item: SgOrderListItem,
    index: number
  ) => {
    if (!allowDrag || item.disabled) {
      event.preventDefault();
      return;
    }

    setDraggingIndex(index);
    setDropIndex(index);
    event.dataTransfer.effectAllowed = "move";
    try {
      event.dataTransfer.setData("text/plain", String(item.value));
    } catch {
      // Ignore setData failures in restrictive browser contexts.
    }

    if (!selectedSet.has(item.value)) {
      const nextSelection = selectionMode === "single" ? [item.value] : [item.value];
      commitSelection(nextSelection);
      setAnchorValue(item.value);
    }
  }, [allowDrag, commitSelection, selectedSet, selectionMode]);

  const handleDragOver = React.useCallback((
    event: React.DragEvent<HTMLElement>,
    index: number
  ) => {
    if (!allowDrag || draggingIndex === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropIndex(index);
  }, [allowDrag, draggingIndex]);

  const handleDrop = React.useCallback((event: React.DragEvent<HTMLElement>, index: number) => {
    if (!allowDrag || draggingIndex === null) return;
    event.preventDefault();
    const nextItems = moveSingleItem(currentItems, draggingIndex, index);
    if (nextItems !== currentItems) commitItems(nextItems);
    clearDragState();
  }, [allowDrag, clearDragState, commitItems, currentItems, draggingIndex]);

  const handleItemKeyDown = React.useCallback((
    event: React.KeyboardEvent<HTMLButtonElement>,
    item: SgOrderListItem,
    index: number
  ) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleItemSelection(event, item, index);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "ArrowUp") {
      event.preventDefault();
      applyMove("up");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "ArrowDown") {
      event.preventDefault();
      applyMove("down");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Home") {
      event.preventDefault();
      applyMove("top");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "End") {
      event.preventDefault();
      applyMove("bottom");
    }
  }, [applyMove, handleItemSelection]);

  const moveTopLabel = resolveMessage(
    t(i18n, "components.orderlist.moveTop"),
    "components.orderlist.moveTop",
    "Move to top"
  );
  const moveUpLabel = resolveMessage(
    t(i18n, "components.orderlist.moveUp"),
    "components.orderlist.moveUp",
    "Move up"
  );
  const moveDownLabel = resolveMessage(
    t(i18n, "components.orderlist.moveDown"),
    "components.orderlist.moveDown",
    "Move down"
  );
  const moveBottomLabel = resolveMessage(
    t(i18n, "components.orderlist.moveBottom"),
    "components.orderlist.moveBottom",
    "Move to bottom"
  );
  const emptyLabel = emptyMessage ?? resolveMessage(
    t(i18n, "components.orderlist.empty"),
    "components.orderlist.empty",
    "No items available."
  );

  const canMoveTop = canInteract && moveSelectionTop(currentItems, movableSelection) !== currentItems;
  const canMoveUp = canInteract && moveSelectionUp(currentItems, movableSelection) !== currentItems;
  const canMoveDown = canInteract && moveSelectionDown(currentItems, movableSelection) !== currentItems;
  const canMoveBottom = canInteract && moveSelectionBottom(currentItems, movableSelection) !== currentItems;

  const renderedList = (
    <ul
      id={id}
      role="listbox"
      aria-multiselectable={selectionMode === "multiple" ? true : undefined}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      className={cn(
        "w-full min-w-0 overflow-y-auto rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface))] p-1",
        "max-h-[22rem]",
        listClassName
      )}
    >
      {currentItems.length === 0 ? (
        <li className="list-none px-3 py-4 text-sm text-[rgb(var(--sg-muted))]">
          {emptyLabel}
        </li>
      ) : (
        currentItems.map((item, index) => {
          const isItemSelected = selectedSet.has(item.value);
          const isItemDisabled = disabled || Boolean(item.disabled);
          const isDropTarget = dropIndex === index && draggingIndex !== null && draggingIndex !== index;
          const isDragging = draggingIndex === index;

          return (
            <li key={`${item.value}-${index}`} className="list-none">
              <button
                type="button"
                role="option"
                aria-selected={isItemSelected}
                draggable={allowDrag && !item.disabled}
                disabled={isItemDisabled}
                onClick={(event) => handleItemSelection(event, item, index)}
                onKeyDown={(event) => handleItemKeyDown(event, item, index)}
                onDragStart={(event) => handleDragStart(event, item, index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={(event) => handleDrop(event, index)}
                onDragEnd={clearDragState}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all",
                  isItemSelected
                    ? "bg-[rgb(var(--sg-primary-100))] text-[rgb(var(--sg-text))] ring-1 ring-[rgb(var(--sg-primary-300))]"
                    : "bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] text-[rgb(var(--sg-text))] hover:bg-[rgb(var(--sg-primary-50))]",
                  isItemDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  allowDrag && !item.disabled ? "active:cursor-grabbing" : "",
                  isDropTarget ? "ring-2 ring-[rgb(var(--sg-primary-400))]" : "",
                  isDragging ? "opacity-50" : "",
                  itemClassName
                )}
              >
                <span className="min-w-0 flex-1">
                  {itemTemplate ? (
                    itemTemplate(item, {
                      index,
                      selected: isItemSelected,
                      disabled: isItemDisabled
                    })
                  ) : (
                    <span className="flex items-center gap-2">
                      {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                      <span className="truncate">{item.label}</span>
                    </span>
                  )}
                </span>
                {allowDrag && !item.disabled ? (
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xs tracking-wide text-[rgb(var(--sg-muted))]"
                  >
                    ::
                  </span>
                ) : null}
              </button>
            </li>
          );
        })
      )}
      {allowDrag && currentItems.length > 0 ? (
        <li className="list-none">
          <div
            onDragOver={(event) => handleDragOver(event, currentItems.length)}
            onDrop={(event) => handleDrop(event, currentItems.length)}
            className={cn(
              "mt-1 h-3 rounded-md border border-dashed border-transparent transition-colors",
              dropIndex === currentItems.length ? "border-[rgb(var(--sg-primary-400))] bg-[rgb(var(--sg-primary-100))]" : ""
            )}
          />
        </li>
      ) : null}
    </ul>
  );

  const controls = showControls ? (
    <div className="flex shrink-0 flex-col gap-2">
      <SgButton
        size="sm"
        appearance="outline"
        disabled={!canMoveTop}
        title={moveTopLabel}
        aria-label={moveTopLabel}
        onClick={() => applyMove("top")}
      >
        Top
      </SgButton>
      <SgButton
        size="sm"
        appearance="outline"
        disabled={!canMoveUp}
        title={moveUpLabel}
        aria-label={moveUpLabel}
        onClick={() => applyMove("up")}
      >
        Up
      </SgButton>
      <SgButton
        size="sm"
        appearance="outline"
        disabled={!canMoveDown}
        title={moveDownLabel}
        aria-label={moveDownLabel}
        onClick={() => applyMove("down")}
      >
        Down
      </SgButton>
      <SgButton
        size="sm"
        appearance="outline"
        disabled={!canMoveBottom}
        title={moveBottomLabel}
        aria-label={moveBottomLabel}
        onClick={() => applyMove("bottom")}
      >
        Bottom
      </SgButton>
    </div>
  ) : null;

  const containerDirection = controlsPosition === "right" ? "flex-row-reverse" : "flex-row";
  const resolvedTitle = (groupBoxProps.title ?? title ?? "").trim() || " ";

  return (
    <div className={className} style={style}>
      <SgGroupBox {...groupBoxProps} title={resolvedTitle}>
        {error ? <p className="mb-2 text-xs text-red-600">{error}</p> : null}
        <div className={cn("flex items-start gap-3", containerDirection)}>
          {controls}
          <div className="min-w-0 flex-1">{renderedList}</div>
        </div>
      </SgGroupBox>
    </div>
  );
}

export const SgOrderList = React.forwardRef<SgOrderListRef, SgOrderListProps>((props, ref) => {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) =>
          SgOrderListBase(
            {
              ...rest,
              error: resolveFieldError(rest.error, fieldState.error?.message),
              value: Array.isArray(field.value) ? field.value : rest.value,
              onChange: (items) => {
                rest.onChange?.(items);
                field.onChange(items);
              }
            } as SgOrderListProps,
            ref
          )
        }
      />
    );
  }

  return SgOrderListBase(rest as SgOrderListProps, ref);
});
