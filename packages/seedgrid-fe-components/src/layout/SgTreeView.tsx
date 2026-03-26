"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { SgInputText } from "../inputs/SgInputText";
import { SgButton } from "../buttons/SgButton";
import { t, useComponentsI18n } from "../i18n";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgSize = "sm" | "md" | "lg";
export type SgDensity = "compact" | "normal" | "comfortable";
export type SgTone = "default" | "muted";

export type SgTreeNode = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: SgTreeNode[];
  disabled?: boolean;
  meta?: unknown;
};

export type SgTreeNodeJson = {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  checked?: boolean;
  children?: SgTreeNodeJson[];
  meta?: unknown;
};

export type SgTreeIconRegistry = Record<string, React.ReactNode>;

export function sgTreeFromJson(json: SgTreeNodeJson[], iconRegistry?: SgTreeIconRegistry): SgTreeNode[] {
  const walk = (list: SgTreeNodeJson[]): SgTreeNode[] =>
    list.map((n) => ({
      id: n.id,
      label: n.label,
      disabled: n.disabled,
      icon: n.icon ? iconRegistry?.[n.icon] : undefined,
      children: n.children?.length ? walk(n.children) : undefined,
      meta: n.meta
    }));
  return walk(json);
}

export function sgTreeFromJsonWithChecked(
  json: SgTreeNodeJson[],
  iconRegistry?: SgTreeIconRegistry
): { nodes: SgTreeNode[]; checkedIds: string[] } {
  const checkedIds: string[] = [];

  const walk = (list: SgTreeNodeJson[]): SgTreeNode[] =>
    list.map((n) => {
      if (n.checked) checkedIds.push(n.id);
      return {
        id: n.id,
        label: n.label,
        disabled: n.disabled,
        icon: n.icon ? iconRegistry?.[n.icon] : undefined,
        children: n.children?.length ? walk(n.children) : undefined,
        meta: n.meta
      };
    });

  const nodes = walk(json);

  // If a branch is checked, include all descendants to reflect the visual state.
  const maps = buildMaps(nodes);
  const expandedChecked = new Set<string>();
  for (const id of checkedIds) {
    expandedChecked.add(id);
    const descendants = collectDescendants(maps.childrenById, id);
    for (const d of descendants) expandedChecked.add(d);
  }

  return { nodes, checkedIds: Array.from(expandedChecked) };
}

type CheckedState = "unchecked" | "checked" | "indeterminate";

function collectAllIds(nodes: SgTreeNode[], out: Set<string>) {
  for (const n of nodes) {
    out.add(n.id);
    if (n.children?.length) collectAllIds(n.children, out);
  }
}

function buildMaps(nodes: SgTreeNode[]) {
  const parentById = new Map<string, string | null>();
  const nodeById = new Map<string, SgTreeNode>();
  const childrenById = new Map<string, string[]>();

  function walk(list: SgTreeNode[], parentId: string | null) {
    for (const n of list) {
      parentById.set(n.id, parentId);
      nodeById.set(n.id, n);
      childrenById.set(n.id, (n.children ?? []).map((c) => c.id));
      if (n.children?.length) walk(n.children, n.id);
    }
  }

  walk(nodes, null);
  return { parentById, nodeById, childrenById };
}

function collectDescendants(childrenById: Map<string, string[]>, id: string) {
  const out: string[] = [];
  const stack = [...(childrenById.get(id) ?? [])];
  while (stack.length) {
    const cur = stack.pop()!;
    out.push(cur);
    const kids = childrenById.get(cur);
    if (kids?.length) stack.push(...kids);
  }
  return out;
}

function collectAncestors(parentById: Map<string, string | null>, id: string) {
  const out: string[] = [];
  let cur = parentById.get(id) ?? null;
  while (cur) {
    out.push(cur);
    cur = parentById.get(cur) ?? null;
  }
  return out;
}

function filterTreeByQuery(nodes: SgTreeNode[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { filtered: nodes, matchIds: new Set<string>() };

  const matchIds = new Set<string>();

  function dfs(list: SgTreeNode[]): SgTreeNode[] {
    const res: SgTreeNode[] = [];
    for (const n of list) {
      const selfMatch = n.label.toLowerCase().includes(q);
      const kids = n.children?.length ? dfs(n.children) : [];
      if (selfMatch || kids.length) {
        if (selfMatch) matchIds.add(n.id);
        res.push({ ...n, children: kids.length ? kids : n.children ? [] : undefined });
      }
    }
    return res;
  }

  return { filtered: dfs(nodes), matchIds };
}

function computeCheckedState(
  id: string,
  childrenById: Map<string, string[]>,
  checked: Set<string>
): CheckedState {
  const kids = childrenById.get(id) ?? [];
  if (!kids.length) return checked.has(id) ? "checked" : "unchecked";

  let hasChecked = false;
  let hasUnchecked = false;

  for (const k of kids) {
    const st = computeCheckedState(k, childrenById, checked);
    if (st === "indeterminate") return "indeterminate";
    if (st === "checked") hasChecked = true;
    if (st === "unchecked") hasUnchecked = true;
    if (hasChecked && hasUnchecked) return "indeterminate";
  }

  if (hasChecked && !hasUnchecked) return "checked";
  if (!hasChecked && hasUnchecked) return "unchecked";
  return checked.has(id) ? "checked" : "unchecked";
}

function setBranchChecked(
  id: string,
  value: boolean,
  childrenById: Map<string, string[]>,
  checked: Set<string>
) {
  const all = [id, ...collectDescendants(childrenById, id)];
  for (const x of all) {
    if (value) checked.add(x);
    else checked.delete(x);
  }
}

type Controlled<T> =
  | { value: T; defaultValue?: never; onChange: (v: T) => void }
  | { value?: never; defaultValue: T; onChange?: (v: T) => void }
  | { value?: never; defaultValue?: never; onChange?: (v: T) => void };

function useControllable<T>(opts: Controlled<T>, fallback: T) {
  const isControlled = "value" in opts && (opts as any).value !== undefined;
  const [inner, setInner] = React.useState<T>(
    "defaultValue" in opts && (opts as any).defaultValue !== undefined ? (opts as any).defaultValue : fallback
  );
  const value = isControlled ? (opts as any).value : inner;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      (opts as any).onChange?.(next);
    },
    [isControlled, opts]
  );

  return [value, setValue] as const;
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

function sameStringArray(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const sizeMap: Record<SgSize, { text: string; btn: string; input: string; checkbox: string; icon: string }> = {
  sm: { text: "text-xs", btn: "h-8 px-2.5 text-xs", input: "h-8 px-2.5 text-xs", checkbox: "h-3.5 w-3.5", icon: "h-3.5 w-3.5" },
  md: { text: "text-sm", btn: "h-9 px-3 text-sm", input: "h-9 px-3 text-sm", checkbox: "h-4 w-4", icon: "h-4 w-4" },
  lg: { text: "text-base", btn: "h-10 px-3.5 text-base", input: "h-10 px-3.5 text-base", checkbox: "h-5 w-5", icon: "h-5 w-5" }
};

const densityMap: Record<SgDensity, { rowPy: string; rowPx: string; gap: string; caret: string; indent: number }> = {
  compact: { rowPy: "py-0.5", rowPx: "px-1.5", gap: "gap-1.5", caret: "h-5 w-5", indent: 14 },
  normal: { rowPy: "py-1", rowPx: "px-2", gap: "gap-2", caret: "h-6 w-6", indent: 16 },
  comfortable: { rowPy: "py-1.5", rowPx: "px-2.5", gap: "gap-2.5", caret: "h-7 w-7", indent: 18 }
};

function toneClasses(tone: SgTone) {
  if (tone === "muted") {
    return {
      panelBg: "bg-sg-surface2 bg-muted/30",
      rowHover: "hover:bg-sg-hover hover:bg-foreground/5",
      subtle: "text-sg-muted text-muted-foreground"
    };
  }
  return {
    panelBg: "bg-sg-surface bg-background",
    rowHover: "hover:bg-sg-hover hover:bg-foreground/5",
    subtle: "text-sg-muted text-muted-foreground"
  };
}

export type SgTreeViewRef = {
  getCheckedIds: () => string[];
  getCheckedLeafIds: () => string[];
  setCheckedIds: (ids: string[]) => void;
  getExpandedIds: () => string[];
  setExpandedIds: (ids: string[]) => void;
  expandAll: () => void;
  collapseAll: () => void;
  clearChecked: () => void;
};

export type SgTreeConfirmBar =
  | false
  | {
      label?: string;
      hint?: string;
      showCancel?: boolean;
      cancelLabel?: string;
      sticky?: boolean;
      disabledWhenEmpty?: boolean;
      resetAfterConfirm?: boolean;
      onConfirm: (selectedIds: string[]) => void;
      onCancel?: () => void;
    };

export type SgTreeViewProps = {
  nodes: SgTreeNode[];
  className?: string;
  style?: React.CSSProperties;
  size?: SgSize;
  density?: SgDensity;
  tone?: SgTone;
  iconTone?: "default" | "primary";
  checkable?: boolean;
  checkMode?: "live" | "confirm";
  confirmSelection?: "all" | "leafOnly";
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  onCheckedChange?: (ids: string[]) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  onExpand?: (node: SgTreeNode) => void;
  onCollapse?: (node: SgTreeNode) => void;
  onLeafClick?: (id: string) => void;
  branchLabelBehavior?: "toggle" | "none";
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (v: string) => void;
  expandMatchesOnSearch?: boolean;
  confirmBar?: SgTreeConfirmBar;
  emptyText?: string;
  maxHeightClassName?: string;
};

export const SgTreeView = React.forwardRef<SgTreeViewRef, SgTreeViewProps>(function SgTreeView(props, ref) {
  const i18n = useComponentsI18n();
  const {
    nodes,
    className,
    style,
    size = "md",
    density = "normal",
    tone = "default",
    iconTone = "default",
    checkable = false,
    checkMode = "live",
    confirmSelection = "leafOnly",
    searchable = false,
    searchPlaceholder: searchPlaceholderProp,
    expandMatchesOnSearch = true,
    branchLabelBehavior = "toggle",
    emptyText: emptyTextProp,
    maxHeightClassName = "max-h-[60vh]"
  } = props;

  const searchPlaceholder = searchPlaceholderProp ?? `${t(i18n, "components.actions.search")}...`;
  const emptyText = emptyTextProp ?? t(i18n, "components.tree.empty");
  const SZ = sizeMap[size];
  const DY = densityMap[density];
  const T = toneClasses(tone);

  const maps = React.useMemo(() => buildMaps(nodes), [nodes]);
  const allIds = React.useMemo(() => {
    const s = new Set<string>();
    collectAllIds(nodes, s);
    return s;
  }, [nodes]);

  const [expandedIds, setExpandedIds] = useControllable<string[]>(
    props.expandedIds !== undefined
      ? { value: props.expandedIds, onChange: props.onExpandedChange! }
      : { defaultValue: props.defaultExpandedIds ?? [], onChange: props.onExpandedChange },
    []
  );

  const [checkedIdsLive, setCheckedIdsLive] = useControllable<string[]>(
    props.checkedIds !== undefined
      ? { value: props.checkedIds, onChange: (ids) => props.onCheckedChange?.(ids) }
      : { defaultValue: props.defaultCheckedIds ?? [], onChange: props.onCheckedChange },
    []
  );

  const [pendingCheckedIds, setPendingCheckedIds] = React.useState<string[]>(
    props.defaultCheckedIds ?? []
  );

  React.useEffect(() => {
    if (checkMode !== "confirm") return;
    if (props.checkedIds) setPendingCheckedIds(props.checkedIds);
  }, [checkMode, props.checkedIds]);

  const effectiveCheckedIds = checkMode === "confirm" ? pendingCheckedIds : checkedIdsLive;

  const [search, setSearch] = useControllable<string>(
    props.searchValue !== undefined
      ? { value: props.searchValue, onChange: props.onSearchChange! }
      : { defaultValue: props.defaultSearchValue ?? "", onChange: props.onSearchChange },
    ""
  );
  const searchId = React.useId();

  const expandedSet = React.useMemo(() => new Set<string>(expandedIds), [expandedIds]);
  const checkedSet = React.useMemo(() => new Set<string>(effectiveCheckedIds), [effectiveCheckedIds]);

  const { filtered, matchIds } = React.useMemo(() => filterTreeByQuery(nodes, search), [nodes, search]);

  React.useEffect(() => {
    if (!expandMatchesOnSearch) return;
    const q = search.trim();
    if (!q) return;
    const add = new Set<string>(expandedSet);
    for (const id of matchIds) {
      for (const a of collectAncestors(maps.parentById, id)) add.add(a);
    }
    const nextIds = Array.from(add);
    if (!sameStringArray(nextIds, expandedIds)) setExpandedIds(nextIds);
  }, [search, expandMatchesOnSearch, matchIds, maps.parentById, expandedSet, expandedIds, setExpandedIds]);

  const toggleExpand = React.useCallback(
    (node: SgTreeNode) => {
      const isOpen = expandedSet.has(node.id);
      const next = new Set<string>(expandedSet);
      if (isOpen) {
        next.delete(node.id);
        props.onCollapse?.(node);
      } else {
        next.add(node.id);
        props.onExpand?.(node);
      }
      setExpandedIds(Array.from(next));
    },
    [expandedSet, props, setExpandedIds]
  );

  const applyCheckedIds = React.useCallback(
    (nextIds: string[]) => {
      const next = uniq(nextIds);
      if (checkMode === "confirm") {
        setPendingCheckedIds(next);
      } else {
        setCheckedIdsLive(next);
      }
    },
    [checkMode, setCheckedIdsLive]
  );

  const toggleCheck = React.useCallback(
    (node: SgTreeNode) => {
      if (!checkable || node.disabled) return;
      const next = new Set<string>(checkedSet);
      const st = computeCheckedState(node.id, maps.childrenById, checkedSet);
      const willCheck = st !== "checked";
      setBranchChecked(node.id, willCheck, maps.childrenById, next);
      applyCheckedIds(Array.from(next));
    },
    [applyCheckedIds, checkable, checkedSet, maps.childrenById]
  );

  const expandAll = React.useCallback(() => {
    setExpandedIds(Array.from(allIds));
  }, [allIds, setExpandedIds]);

  const collapseAll = React.useCallback(() => {
    setExpandedIds([]);
  }, [setExpandedIds]);

  const clearChecked = React.useCallback(() => {
    applyCheckedIds([]);
  }, [applyCheckedIds]);

  const getCheckedLeafIds = React.useCallback(
    (ids: string[]) =>
      ids.filter((id) => {
        const n = maps.nodeById.get(id);
        return !!n && !(n.children?.length);
      }),
    [maps.nodeById]
  );

  React.useImperativeHandle(ref, () => ({
    getCheckedIds: () => effectiveCheckedIds,
    getCheckedLeafIds: () => getCheckedLeafIds(effectiveCheckedIds),
    setCheckedIds: (ids) => applyCheckedIds(ids),
    getExpandedIds: () => expandedIds,
    setExpandedIds: (ids) => setExpandedIds(ids),
    expandAll,
    collapseAll,
    clearChecked
  }));

  const confirmCfg = props.confirmBar ?? false;
  const confirmEnabled = !!confirmCfg && checkable && checkMode === "confirm";
  const confirmSelectedIds = React.useMemo(() => {
    if (confirmSelection === "all") return effectiveCheckedIds;
    return getCheckedLeafIds(effectiveCheckedIds);
  }, [confirmSelection, effectiveCheckedIds, getCheckedLeafIds]);

  const confirmDisabled =
    confirmEnabled &&
    (confirmCfg && confirmCfg.disabledWhenEmpty !== false) &&
    confirmSelectedIds.length === 0;

  const onConfirm = () => {
    if (!confirmEnabled || !confirmCfg) return;
    confirmCfg.onConfirm(confirmSelectedIds);
    if (confirmCfg.resetAfterConfirm) applyCheckedIds([]);
  };

  const onCancel = () => {
    if (!confirmEnabled || !confirmCfg) return;
    confirmCfg.onCancel?.();
  };

  const renderNode = (node: SgTreeNode, depth: number) => {
    const hasChildren = !!node.children?.length;
    const isOpen = expandedSet.has(node.id);
    const isDisabled = !!node.disabled;
    const checkedState = checkable ? computeCheckedState(node.id, maps.childrenById, checkedSet) : "unchecked";

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center rounded-md",
            DY.rowPx, DY.rowPy, DY.gap,
            T.rowHover,
            isDisabled && "opacity-60"
          )}
          style={{ paddingLeft: 8 + depth * DY.indent }}
        >
          <button
            type="button"
            className={cn(
              DY.caret,
              "shrink-0 rounded-md flex items-center justify-center",
              "hover:bg-sg-hover2 hover:bg-foreground/10",
              "focus:outline-none focus:ring-2 focus:ring-sg-focus/30",
              !hasChildren && "opacity-0 pointer-events-none"
            )}
            onClick={() => hasChildren && !isDisabled && toggleExpand(node)}
            aria-label={isOpen ? t(i18n, "components.actions.collapse") : t(i18n, "components.actions.expand")}
            disabled={isDisabled}
          >
            <span className={cn("transition-transform", isOpen && "rotate-90")}>{">"}</span>
          </button>

          {checkable && (
            <input
              type="checkbox"
              className={cn(
                SZ.checkbox,
                "rounded border border-sg-border bg-sg-surface",
                "focus:outline-none focus:ring-2 focus:ring-sg-focus/30"
              )}
              disabled={isDisabled}
              checked={checkedState === "checked"}
              ref={(el) => {
                if (el) el.indeterminate = checkedState === "indeterminate";
              }}
              onChange={() => toggleCheck(node)}
            />
          )}

          {node.icon && (
            <div
              className={cn(
                "shrink-0",
                SZ.icon,
                iconTone === "primary" ? "text-[rgb(var(--sg-primary-600))]" : ""
              )}
            >
              {node.icon}
            </div>
          )}

          <button
            type="button"
            className={cn(
              "flex-1 text-left rounded-md",
              SZ.text,
              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-sg-focus/30"
            )}
            onClick={() => {
              if (isDisabled) return;
              if (!hasChildren) {
                props.onLeafClick?.(node.id);
                return;
              }
              if (branchLabelBehavior === "toggle") {
                toggleExpand(node);
              }
            }}
            disabled={isDisabled}
          >
            {node.label}
          </button>
        </div>

        {hasChildren && isOpen && <div>{node.children!.map((c) => renderNode(c, depth + 1))}</div>}
      </div>
    );
  };

  const hasAny = filtered.length > 0;

  return (
    <div className={cn("w-full", className)} style={style}>
      <div className="mb-2 flex items-center gap-2">
        {searchable && (
          <SgInputText
            id={searchId}
            labelText={searchPlaceholder}
            placeholder={searchPlaceholder}
            prefixIcon={<Search size={16} />}
            clearButton
            filled
            inputProps={{ value: search }}
            onChange={(value) => setSearch(value)}
          />
        )}

        <SgButton
          severity="secondary"
          appearance="ghost"
          size="sm"
          shape="rounded"
          onClick={expandAll}
          leftIcon={<ChevronDown className="size-4" />}
        >
          {t(i18n, "components.actions.expandAll")}
        </SgButton>

        <SgButton
          severity="secondary"
          appearance="ghost"
          size="sm"
          shape="rounded"
          onClick={collapseAll}
          leftIcon={<ChevronUp className="size-4" />}
        >
          {t(i18n, "components.actions.collapseAll")}
        </SgButton>

        {checkable && (
          <SgButton
            severity="danger"
            appearance="outline"
            size="sm"
            shape="rounded"
            onClick={clearChecked}
            title={t(i18n, "components.actions.clearSelection")}
          >
            {t(i18n, "components.actions.clear")}
          </SgButton>
        )}
      </div>

      <div className={cn("rounded-sg border border-sg-border", T.panelBg, "text-sg-text")}>
        <div className={cn("overflow-auto", maxHeightClassName)}>
          <div className="p-2">
            {!hasAny ? (
              <div className={cn("p-6 text-center", SZ.text, T.subtle)}>{emptyText}</div>
            ) : (
              filtered.map((n) => renderNode(n, 0))
            )}
          </div>
        </div>

        {confirmEnabled && confirmCfg && (
          <div
            className={cn(
              "border-t border-sg-border px-3 py-2",
              (confirmCfg.sticky ?? true) && "sticky bottom-0 bg-sg-surface/95 bg-background/95 backdrop-blur"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className={cn("text-xs", T.subtle)}>
                {confirmCfg.hint ?? (
                  <>
                    {t(i18n, "components.tree.selected", { count: confirmSelectedIds.length })}
                    {confirmSelection === "leafOnly" ? t(i18n, "components.tree.selectedLeafs") : ""}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(confirmCfg.showCancel ?? false) && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className={cn(
                      "rounded-md border border-sg-border",
                      T.panelBg,
                      "text-sg-text hover:bg-sg-hover",
                      "focus:outline-none focus:ring-2 focus:ring-sg-focus/30",
                      SZ.btn
                    )}
                  >
                    {confirmCfg.cancelLabel ?? t(i18n, "components.actions.cancel")}
                  </button>
                )}

                <SgButton
                  severity="secondary"
                  appearance="outline"
                  size="md"
                  shape="rounded"
                  onClick={clearChecked}
                  disabled={!!confirmDisabled}
                >
                  {t(i18n, "components.actions.clear")}
                </SgButton>

                <SgButton
                  severity="primary"
                  appearance="solid"
                  elevation="sm"
                  size="md"
                  shape="rounded"
                  disabled={!!confirmDisabled}
                  onClick={onConfirm}
                >
                  {confirmCfg.label ?? t(i18n, "components.actions.confirm")}
                </SgButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SgTreeView.displayName = "SgTreeView";





