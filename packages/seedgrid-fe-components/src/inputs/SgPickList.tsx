"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { SgButton } from "../buttons/SgButton";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";

export interface SgPickListItem {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
  data?: unknown;
}

export type SgPickListListName = "source" | "target";
export type SgPickListSelectionMode = "single" | "multiple";
export type SgPickListFilterMatchMode = "contains" | "startsWith" | "endsWith";
export type SgPickListChangeType =
  | "moveToTarget"
  | "moveAllToTarget"
  | "moveToSource"
  | "moveAllToSource"
  | "reorderSource"
  | "reorderTarget"
  | "dragdrop";

export type SgPickListValue = {
  source: SgPickListItem[];
  target: SgPickListItem[];
};

export type SgPickListChangeEvent = SgPickListValue & {
  type: SgPickListChangeType;
};

export type SgPickListRef = {
  getValue: () => SgPickListValue;
  setValue: (value: SgPickListValue) => void;
  moveToTarget: () => void;
  moveAllToTarget: () => void;
  moveToSource: () => void;
  moveAllToSource: () => void;
  clearSelection: () => void;
};

export interface SgPickListProps extends RhfFieldProps {
  error?: string;
  id?: string;
  title?: string;
  source: SgPickListItem[];
  target: SgPickListItem[];
  value?: SgPickListValue;
  onChange?: (event: SgPickListChangeEvent) => void;

  sourceSelection?: (string | number)[];
  targetSelection?: (string | number)[];
  onSourceSelectionChange?: (values: (string | number)[]) => void;
  onTargetSelectionChange?: (values: (string | number)[]) => void;

  selectionMode?: SgPickListSelectionMode;
  sourceHeader?: string;
  targetHeader?: string;

  showTransferControls?: boolean;
  showSourceControls?: boolean;
  showTargetControls?: boolean;

  showSourceFilter?: boolean;
  showTargetFilter?: boolean;
  sourceFilterPlaceholder?: string;
  targetFilterPlaceholder?: string;
  filterMatchMode?: SgPickListFilterMatchMode;

  draggable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  emptyMessage?: string;

  itemTemplate?: (
    item: SgPickListItem,
    state: { index: number; selected: boolean; disabled: boolean; list: SgPickListListName }
  ) => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  listClassName?: string;
  itemClassName?: string;
  groupBoxProps?: Omit<Partial<SgGroupBoxProps>, "children" | "title"> & { title?: string };
}

type DragState = {
  from: SgPickListListName;
  fromIndex: number;
} | null;

function cn(...parts: Array<string | null | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function uniqueValues(values: (string | number)[]) {
  return Array.from(new Set(values));
}

function moveSingleItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (items.length < 2) return items;
  if (fromIndex < 0 || fromIndex >= items.length) return items;
  if (toIndex < 0 || toIndex > items.length) return items;
  if (fromIndex === toIndex || fromIndex + 1 === toIndex) return items;

  const next = [...items];
  const [picked] = next.splice(fromIndex, 1);
  if (picked === undefined) return items;
  const targetIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
  const insertAt = Math.max(0, Math.min(targetIndex, next.length));
  next.splice(insertAt, 0, picked);
  return next;
}

function moveSelectionTop(items: SgPickListItem[], selected: Set<string | number>) {
  const picked = items.filter((item) => selected.has(item.value) && !item.disabled);
  if (picked.length === 0) return items;
  const rest = items.filter((item) => !(selected.has(item.value) && !item.disabled));
  return [...picked, ...rest];
}

function moveSelectionBottom(items: SgPickListItem[], selected: Set<string | number>) {
  const picked = items.filter((item) => selected.has(item.value) && !item.disabled);
  if (picked.length === 0) return items;
  const rest = items.filter((item) => !(selected.has(item.value) && !item.disabled));
  return [...rest, ...picked];
}

function moveSelectionUp(items: SgPickListItem[], selected: Set<string | number>) {
  const next = [...items];
  for (let index = 1; index < next.length; index += 1) {
    const current = next[index]!;
    const prev = next[index - 1]!;
    if (!(selected.has(current.value) && !current.disabled)) continue;
    if (selected.has(prev.value) && !prev.disabled) continue;
    next[index] = prev;
    next[index - 1] = current;
  }
  return next;
}

function moveSelectionDown(items: SgPickListItem[], selected: Set<string | number>) {
  const next = [...items];
  for (let index = next.length - 2; index >= 0; index -= 1) {
    const current = next[index]!;
    const nextItem = next[index + 1]!;
    if (!(selected.has(current.value) && !current.disabled)) continue;
    if (selected.has(nextItem.value) && !nextItem.disabled) continue;
    next[index] = nextItem;
    next[index + 1] = current;
  }
  return next;
}

function resolveMessage(translated: string, key: string, fallback: string) {
  return translated === key ? fallback : translated;
}

function matchFilter(label: string, query: string, mode: SgPickListFilterMatchMode) {
  const text = label.toLowerCase();
  const search = query.toLowerCase();
  if (mode === "startsWith") return text.startsWith(search);
  if (mode === "endsWith") return text.endsWith(search);
  return text.includes(search);
}

function SgPickListBase(props: SgPickListProps, imperativeRef?: React.ForwardedRef<SgPickListRef>) {
  const i18n = useComponentsI18n();
  const {
    id,
    title,
    source,
    target,
    value: controlledValue,
    onChange,
    sourceSelection: controlledSourceSelection,
    targetSelection: controlledTargetSelection,
    onSourceSelectionChange,
    onTargetSelectionChange,
    selectionMode = "multiple",
    sourceHeader,
    targetHeader,
    showTransferControls = true,
    showSourceControls = true,
    showTargetControls = true,
    showSourceFilter = false,
    showTargetFilter = false,
    sourceFilterPlaceholder,
    targetFilterPlaceholder,
    filterMatchMode = "contains",
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

  const [internalValue, setInternalValue] = React.useState<SgPickListValue>(() => ({ source, target }));
  const [internalSourceSelection, setInternalSourceSelection] = React.useState<(string | number)[]>(
    () => uniqueValues(controlledSourceSelection ?? [])
  );
  const [internalTargetSelection, setInternalTargetSelection] = React.useState<(string | number)[]>(
    () => uniqueValues(controlledTargetSelection ?? [])
  );
  const [sourceFilter, setSourceFilter] = React.useState("");
  const [targetFilter, setTargetFilter] = React.useState("");
  const [dragState, setDragState] = React.useState<DragState>(null);

  const isValueControlled = controlledValue !== undefined;
  const isSourceSelectionControlled = controlledSourceSelection !== undefined;
  const isTargetSelectionControlled = controlledTargetSelection !== undefined;

  React.useEffect(() => {
    if (isValueControlled) return;
    setInternalValue({ source, target });
  }, [source, target, isValueControlled]);

  const currentValue = isValueControlled ? controlledValue : internalValue;
  const sourceItems = currentValue.source ?? [];
  const targetItems = currentValue.target ?? [];

  const sourceSelectionRaw = isSourceSelectionControlled ? (controlledSourceSelection ?? []) : internalSourceSelection;
  const targetSelectionRaw = isTargetSelectionControlled ? (controlledTargetSelection ?? []) : internalTargetSelection;
  const sourceSelection = uniqueValues(sourceSelectionRaw.filter((valueItem) => sourceItems.some((item) => item.value === valueItem)));
  const targetSelection = uniqueValues(targetSelectionRaw.filter((valueItem) => targetItems.some((item) => item.value === valueItem)));

  const sourceSelectedSet = new Set(sourceSelection);
  const targetSelectedSet = new Set(targetSelection);
  const canInteract = !disabled && !readOnly;

  const commitValue = React.useCallback((nextValue: SgPickListValue, type: SgPickListChangeType) => {
    if (!isValueControlled) setInternalValue(nextValue);
    onChange?.({ ...nextValue, type });
  }, [isValueControlled, onChange]);

  const commitSourceSelection = React.useCallback((values: (string | number)[]) => {
    const normalized = uniqueValues(values);
    if (!isSourceSelectionControlled) setInternalSourceSelection(normalized);
    onSourceSelectionChange?.(normalized);
  }, [isSourceSelectionControlled, onSourceSelectionChange]);

  const commitTargetSelection = React.useCallback((values: (string | number)[]) => {
    const normalized = uniqueValues(values);
    if (!isTargetSelectionControlled) setInternalTargetSelection(normalized);
    onTargetSelectionChange?.(normalized);
  }, [isTargetSelectionControlled, onTargetSelectionChange]);

  const clearSelection = React.useCallback(() => {
    commitSourceSelection([]);
    commitTargetSelection([]);
  }, [commitSourceSelection, commitTargetSelection]);

  const moveToTarget = React.useCallback(() => {
    if (!canInteract) return;
    const picked = sourceItems.filter((item) => sourceSelectedSet.has(item.value) && !item.disabled);
    if (picked.length === 0) return;
    const nextSource = sourceItems.filter((item) => !(sourceSelectedSet.has(item.value) && !item.disabled));
    const nextTarget = [...targetItems, ...picked];
    commitValue({ source: nextSource, target: nextTarget }, "moveToTarget");
    commitSourceSelection([]);
    commitTargetSelection(picked.map((item) => item.value));
  }, [canInteract, sourceItems, sourceSelectedSet, targetItems, commitValue, commitSourceSelection, commitTargetSelection]);

  const moveAllToTarget = React.useCallback(() => {
    if (!canInteract) return;
    const picked = sourceItems.filter((item) => !item.disabled);
    if (picked.length === 0) return;
    const nextSource = sourceItems.filter((item) => item.disabled);
    const nextTarget = [...targetItems, ...picked];
    commitValue({ source: nextSource, target: nextTarget }, "moveAllToTarget");
    commitSourceSelection([]);
    commitTargetSelection(picked.map((item) => item.value));
  }, [canInteract, sourceItems, targetItems, commitValue, commitSourceSelection, commitTargetSelection]);

  const moveToSource = React.useCallback(() => {
    if (!canInteract) return;
    const picked = targetItems.filter((item) => targetSelectedSet.has(item.value) && !item.disabled);
    if (picked.length === 0) return;
    const nextTarget = targetItems.filter((item) => !(targetSelectedSet.has(item.value) && !item.disabled));
    const nextSource = [...sourceItems, ...picked];
    commitValue({ source: nextSource, target: nextTarget }, "moveToSource");
    commitTargetSelection([]);
    commitSourceSelection(picked.map((item) => item.value));
  }, [canInteract, targetItems, targetSelectedSet, sourceItems, commitValue, commitTargetSelection, commitSourceSelection]);

  const moveAllToSource = React.useCallback(() => {
    if (!canInteract) return;
    const picked = targetItems.filter((item) => !item.disabled);
    if (picked.length === 0) return;
    const nextTarget = targetItems.filter((item) => item.disabled);
    const nextSource = [...sourceItems, ...picked];
    commitValue({ source: nextSource, target: nextTarget }, "moveAllToSource");
    commitTargetSelection([]);
    commitSourceSelection(picked.map((item) => item.value));
  }, [canInteract, targetItems, sourceItems, commitValue, commitTargetSelection, commitSourceSelection]);

  const moveSingleByDoubleClick = React.useCallback((from: SgPickListListName, fromIndex: number) => {
    if (!canInteract) return;

    if (from === "source") {
      const moving = sourceItems[fromIndex];
      if (!moving || moving.disabled) return;
      const nextSource = sourceItems.filter((_, index) => index !== fromIndex);
      const nextTarget = [...targetItems, moving];
      commitValue({ source: nextSource, target: nextTarget }, "moveToTarget");
      commitSourceSelection(sourceSelection.filter((valueItem) => valueItem !== moving.value));
      commitTargetSelection([moving.value]);
      return;
    }

    const moving = targetItems[fromIndex];
    if (!moving || moving.disabled) return;
    const nextTarget = targetItems.filter((_, index) => index !== fromIndex);
    const nextSource = [...sourceItems, moving];
    commitValue({ source: nextSource, target: nextTarget }, "moveToSource");
    commitTargetSelection(targetSelection.filter((valueItem) => valueItem !== moving.value));
    commitSourceSelection([moving.value]);
  }, [
    canInteract,
    sourceItems,
    targetItems,
    sourceSelection,
    targetSelection,
    commitValue,
    commitSourceSelection,
    commitTargetSelection
  ]);

  React.useImperativeHandle(imperativeRef, () => ({
    getValue: () => ({ source: sourceItems, target: targetItems }),
    setValue: (nextValue) => commitValue(nextValue, "dragdrop"),
    moveToTarget,
    moveAllToTarget,
    moveToSource,
    moveAllToSource,
    clearSelection
  }), [sourceItems, targetItems, commitValue, moveToTarget, moveAllToTarget, moveToSource, moveAllToSource, clearSelection]);

  const applyReorder = (list: SgPickListListName, direction: "top" | "up" | "down" | "bottom") => {
    if (!canInteract) return;
    const items = list === "source" ? sourceItems : targetItems;
    const selected = list === "source" ? sourceSelectedSet : targetSelectedSet;
    if (selected.size === 0) return;

    let nextItems = items;
    if (direction === "top") nextItems = moveSelectionTop(items, selected);
    if (direction === "up") nextItems = moveSelectionUp(items, selected);
    if (direction === "down") nextItems = moveSelectionDown(items, selected);
    if (direction === "bottom") nextItems = moveSelectionBottom(items, selected);

    if (list === "source") commitValue({ source: nextItems, target: targetItems }, "reorderSource");
    if (list === "target") commitValue({ source: sourceItems, target: nextItems }, "reorderTarget");
  };

  const handleSelect = (
    list: SgPickListListName,
    item: SgPickListItem
  ) => {
    if (!canInteract || item.disabled) return;
    const selected = list === "source" ? sourceSelectedSet : targetSelectedSet;
    const commit = list === "source" ? commitSourceSelection : commitTargetSelection;
    const current = list === "source" ? sourceSelection : targetSelection;

    if (selectionMode === "single") {
      commit([item.value]);
      return;
    }

    if (selected.has(item.value)) {
      commit(current.filter((valueItem) => valueItem !== item.value));
    } else {
      commit([...current, item.value]);
    }
  };

  const dragEnabled = canInteract && draggable;
  const handleDrop = (to: SgPickListListName, toIndex: number) => {
    if (!dragEnabled || !dragState) return;

    if (dragState.from === to) {
      const list = to === "source" ? sourceItems : targetItems;
      const next = moveSingleItem(list, dragState.fromIndex, toIndex);
      if (to === "source") commitValue({ source: next, target: targetItems }, "reorderSource");
      if (to === "target") commitValue({ source: sourceItems, target: next }, "reorderTarget");
      setDragState(null);
      return;
    }

    const fromList = dragState.from === "source" ? sourceItems : targetItems;
    const toList = to === "source" ? sourceItems : targetItems;
    const moving = fromList[dragState.fromIndex];
    if (!moving || moving.disabled) {
      setDragState(null);
      return;
    }

    const nextFrom = fromList.filter((_, idx) => idx !== dragState.fromIndex);
    const nextTo = [...toList];
    const insertAt = Math.max(0, Math.min(toIndex, nextTo.length));
    nextTo.splice(insertAt, 0, moving);

    if (dragState.from === "source" && to === "target") {
      commitValue({ source: nextFrom, target: nextTo }, "dragdrop");
      commitSourceSelection(sourceSelection.filter((valueItem) => valueItem !== moving.value));
    } else {
      commitValue({ source: nextTo, target: nextFrom }, "dragdrop");
      commitTargetSelection(targetSelection.filter((valueItem) => valueItem !== moving.value));
    }
    setDragState(null);
  };

  const moveTopLabel = t(i18n, "components.orderlist.moveTop");
  const moveUpLabel = t(i18n, "components.orderlist.moveUp");
  const moveDownLabel = t(i18n, "components.orderlist.moveDown");
  const moveBottomLabel = t(i18n, "components.orderlist.moveBottom");
  const moveToTargetLabel = t(i18n, "components.picklist.moveToTarget");
  const moveAllToTargetLabel = t(i18n, "components.picklist.moveAllToTarget");
  const moveToSourceLabel = t(i18n, "components.picklist.moveToSource");
  const moveAllToSourceLabel = t(i18n, "components.picklist.moveAllToSource");
  const sourceHeaderLabel = sourceHeader ?? t(i18n, "components.picklist.sourceHeader");
  const targetHeaderLabel = targetHeader ?? t(i18n, "components.picklist.targetHeader");
  const sourceFilterLabel = sourceFilterPlaceholder ?? t(i18n, "components.picklist.sourceFilterPlaceholder");
  const targetFilterLabel = targetFilterPlaceholder ?? t(i18n, "components.picklist.targetFilterPlaceholder");
  const emptyLabel = emptyMessage ?? t(i18n, "components.picklist.empty");

  const filteredSource = sourceItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !sourceFilter || matchFilter(item.label, sourceFilter, filterMatchMode));
  const filteredTarget = targetItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !targetFilter || matchFilter(item.label, targetFilter, filterMatchMode));

  const renderList = (list: SgPickListListName, items: Array<{ item: SgPickListItem; index: number }>, selected: Set<string | number>) => (
    <ul
      id={id ? `${id}-${list}` : undefined}
      role="listbox"
      aria-multiselectable={selectionMode === "multiple" || undefined}
      className={cn("max-h-[22rem] min-w-0 w-full overflow-y-auto rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface))] p-1", listClassName)}
      onDragOver={(event) => {
        if (!dragEnabled) return;
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (!dragEnabled) return;
        event.preventDefault();
        handleDrop(list, list === "source" ? sourceItems.length : targetItems.length);
      }}
    >
      {items.length === 0 ? (
        <li className="list-none px-3 py-4 text-sm text-[rgb(var(--sg-muted))]">{emptyLabel}</li>
      ) : (
        items.map(({ item, index }) => {
          const selectedItem = selected.has(item.value);
          const itemDisabled = disabled || Boolean(item.disabled);
          return (
            <li key={`${item.value}-${index}`} className="list-none">
              <button
                type="button"
                role="option"
                aria-selected={selectedItem}
                disabled={itemDisabled}
                draggable={dragEnabled && !item.disabled}
                onClick={(event) => {
                  if (event.detail >= 2) {
                    moveSingleByDoubleClick(list, index);
                    return;
                  }
                  handleSelect(list, item);
                }}
                onDragStart={(event) => {
                  setDragState({ from: list, fromIndex: index });
                  event.dataTransfer.effectAllowed = "move";
                  try {
                    event.dataTransfer.setData("text/plain", String(item.value));
                  } catch {
                    // Ignore setData failures in restrictive browser contexts.
                  }
                }}
                onDragOver={(event) => {
                  if (!dragEnabled) return;
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  if (!dragEnabled) return;
                  event.preventDefault();
                  event.stopPropagation();
                  handleDrop(list, index);
                }}
                onDragEnd={() => setDragState(null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                  selectedItem
                    ? "bg-[rgb(var(--sg-primary-100))] ring-1 ring-[rgb(var(--sg-primary-300))]"
                    : "bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] hover:bg-[rgb(var(--sg-primary-50))]",
                  itemDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  itemClassName
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {itemTemplate
                    ? itemTemplate(item, { index, selected: selectedItem, disabled: itemDisabled, list })
                    : (
                      <span className="flex items-center gap-2">
                        {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                        <span className="truncate">{item.label}</span>
                      </span>
                    )}
                </span>
                {dragEnabled && !item.disabled ? (
                  <span aria-hidden="true" className="shrink-0 text-xs text-[rgb(var(--sg-muted))]">::</span>
                ) : null}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );

  const renderReorderControls = (list: SgPickListListName) => (
    <div className="flex shrink-0 flex-col gap-2">
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveTopLabel} title={moveTopLabel} onClick={() => applyReorder(list, "top")}>{t(i18n, "components.actions.top")}</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveUpLabel} title={moveUpLabel} onClick={() => applyReorder(list, "up")}>{t(i18n, "components.actions.up")}</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveDownLabel} title={moveDownLabel} onClick={() => applyReorder(list, "down")}>{t(i18n, "components.actions.down")}</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveBottomLabel} title={moveBottomLabel} onClick={() => applyReorder(list, "bottom")}>{t(i18n, "components.actions.bottom")}</SgButton>
    </div>
  );

  const transferControls = showTransferControls ? (
    <div className="flex shrink-0 flex-row gap-2 md:flex-col">
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveToTargetLabel} title={moveToTargetLabel} onClick={moveToTarget}>&gt;</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveAllToTargetLabel} title={moveAllToTargetLabel} onClick={moveAllToTarget}>&gt;&gt;</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveToSourceLabel} title={moveToSourceLabel} onClick={moveToSource}>&lt;</SgButton>
      <SgButton size="sm" appearance="outline" disabled={!canInteract} aria-label={moveAllToSourceLabel} title={moveAllToSourceLabel} onClick={moveAllToSource}>&lt;&lt;</SgButton>
    </div>
  ) : null;

  const resolvedTitle = (groupBoxProps.title ?? title ?? "").trim() || " ";

  return (
    <div className={className} style={style}>
      <SgGroupBox {...groupBoxProps} title={resolvedTitle}>
        {error ? <p className="mb-2 text-xs text-red-600">{error}</p> : null}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--sg-muted))]">{sourceHeaderLabel}</p>
            {showSourceFilter ? (
              <input
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                placeholder={sourceFilterLabel}
                className="w-full rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] px-2 py-1 text-sm text-[rgb(var(--sg-input-fg,var(--sg-text)))] placeholder:text-[rgb(var(--sg-input-placeholder,var(--sg-muted)))] outline-none focus:ring-2 focus:ring-[rgb(var(--sg-ring))]"
              />
            ) : null}
            <div className="flex items-start gap-2">
              {showSourceControls ? renderReorderControls("source") : null}
              <div className="min-w-0 flex-1">{renderList("source", filteredSource, sourceSelectedSet)}</div>
            </div>
          </div>

          <div className="flex justify-center md:pt-7">{transferControls}</div>

          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--sg-muted))]">{targetHeaderLabel}</p>
            {showTargetFilter ? (
              <input
                value={targetFilter}
                onChange={(event) => setTargetFilter(event.target.value)}
                placeholder={targetFilterLabel}
                className="w-full rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] px-2 py-1 text-sm text-[rgb(var(--sg-input-fg,var(--sg-text)))] placeholder:text-[rgb(var(--sg-input-placeholder,var(--sg-muted)))] outline-none focus:ring-2 focus:ring-[rgb(var(--sg-ring))]"
              />
            ) : null}
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">{renderList("target", filteredTarget, targetSelectedSet)}</div>
              {showTargetControls ? renderReorderControls("target") : null}
            </div>
          </div>
        </div>
      </SgGroupBox>
    </div>
  );
}

export const SgPickList = React.forwardRef<SgPickListRef, SgPickListProps>((props, ref) => {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) =>
          SgPickListBase(
            {
              ...rest,
              error: resolveFieldError(rest.error, fieldState.error?.message),
              value: (field.value as SgPickListValue | undefined) ?? rest.value,
              onChange: (event) => {
                rest.onChange?.(event);
                field.onChange({ source: event.source, target: event.target });
              }
            } as SgPickListProps,
            ref
          )
        }
      />
    );
  }

  return SgPickListBase(rest as SgPickListProps, ref);
});

