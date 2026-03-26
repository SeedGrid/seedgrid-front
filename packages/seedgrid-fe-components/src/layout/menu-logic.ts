export type MenuLogicNode = {
  id: string;
  label?: string;
  children?: MenuLogicNode[];
  url?: string;
  onClick?: (() => void) | undefined;
};

export type MenuVisibleNode<T extends MenuLogicNode = MenuLogicNode> = {
  node: T;
  depth: number;
  parentId?: string;
};

export type MenuSearchEntry = {
  id: string;
  label: string;
  path: string;
  group: string;
};

export type MenuMaps<T extends MenuLogicNode = MenuLogicNode> = {
  parentById: Map<string, string>;
  nodeById: Map<string, T>;
  childrenByParent: Map<string, string[]>;
  firstByUrl: Map<string, string>;
};

export type MenuActiveSets = {
  exact: Set<string>;
  branch: Set<string>;
};

export type MenuKeyboardAction =
  | { type: "focus"; id: string }
  | { type: "toggle"; id: string }
  | { type: "activate"; id: string }
  | { type: "noop" };

export function buildMenuMaps<T extends MenuLogicNode>(
  menu: T[],
  rootParentId = "__sg_menu_root__"
): MenuMaps<T> {
  const parentById = new Map<string, string>();
  const nodeById = new Map<string, T>();
  const childrenByParent = new Map<string, string[]>();
  const firstByUrl = new Map<string, string>();

  const walk = (nodes: T[], parentId: string) => {
    childrenByParent.set(
      parentId,
      nodes.map((node) => node.id)
    );
    for (const node of nodes) {
      parentById.set(node.id, parentId);
      nodeById.set(node.id, node);
      if (node.url && !firstByUrl.has(node.url)) firstByUrl.set(node.url, node.id);
      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children as T[], node.id);
      }
    }
  };

  walk(menu, rootParentId);
  return { parentById, nodeById, childrenByParent, firstByUrl };
}

export function collectParentChain(
  parentById: Map<string, string>,
  id: string,
  rootParentId = "__sg_menu_root__"
): string[] {
  const out: string[] = [];
  let current = parentById.get(id);
  while (current && current !== rootParentId) {
    out.push(current);
    current = parentById.get(current);
  }
  return out;
}

export function computeActiveSets<T extends MenuLogicNode>(
  nodes: T[],
  activeId: string | undefined,
  activeUrl: string | undefined
): MenuActiveSets {
  const exact = new Set<string>();
  const branch = new Set<string>();

  const walk = (list: T[]): boolean => {
    let found = false;
    for (const node of list) {
      const childFound = Array.isArray(node.children) && node.children.length > 0 ? walk(node.children as T[]) : false;
      const selfActive = (activeId ? node.id === activeId : false) || (activeUrl ? node.url === activeUrl : false);
      if (selfActive) exact.add(node.id);
      if (childFound) branch.add(node.id);
      if (selfActive || childFound) found = true;
    }
    return found;
  };

  walk(nodes);
  return { exact, branch };
}

export function resolveEffectiveActiveId(args: {
  activeId?: string;
  activeUrl?: string;
  localActiveId?: string;
  firstByUrl: Map<string, string>;
}): string | undefined {
  return args.activeId ?? (args.activeUrl ? args.firstByUrl.get(args.activeUrl) : undefined) ?? args.localActiveId;
}

export function mergeExpandedIdsForActivePath(currentIds: string[], parentChain: string[]): string[] {
  if (parentChain.length === 0) return currentIds;
  return Array.from(new Set([...currentIds, ...parentChain]));
}

export function resolveTieredActiveState<T extends MenuLogicNode>(args: {
  effectiveActiveId?: string;
  maps: MenuMaps<T>;
  menu: T[];
  rootParentId?: string;
}): { tieredPath: string[]; megaActiveId?: string } {
  const { effectiveActiveId, maps, menu, rootParentId = "__sg_menu_root__" } = args;
  if (!effectiveActiveId) {
    return { tieredPath: [], megaActiveId: menu[0]?.id };
  }

  const parentChain = collectParentChain(maps.parentById, effectiveActiveId, rootParentId).reverse();
  const activeNode = maps.nodeById.get(effectiveActiveId);
  const tieredPath = [...parentChain];
  if (activeNode?.children?.length) tieredPath.push(activeNode.id);

  return {
    tieredPath,
    megaActiveId: parentChain[0] ?? activeNode?.id ?? menu[0]?.id
  };
}

export function resolveMenuLayoutState(args: {
  dockMode: boolean;
  effectiveDockZone: string | null;
  orientationDirection?: "horizontal-left" | "horizontal-right" | "vertical-up" | "vertical-top" | "vertical-down";
  position: "left" | "right";
  horizontalDockAlign: "left" | "right" | null;
  isCollapsed: boolean;
  menuStyle: "sidebar" | "drawer" | "inline" | "hybrid";
  effectiveMenuStyle: "panel" | "tiered" | "mega-horizontal" | "mega-vertical";
  pinnedState: boolean;
  expandedWidthCss: string;
  collapsedWidthCss: string;
}): {
  resolvedPosition: "left" | "right";
  isHorizontalDockZone: boolean;
  isVerticalDockZone: boolean;
  tieredOpenToLeft: boolean;
  isMegaMenuStyle: boolean;
  dockAlign: "start" | "end" | null;
  sidebarWidthCss: string;
} {
  const { dockMode, effectiveDockZone, orientationDirection, position, horizontalDockAlign, isCollapsed, menuStyle, effectiveMenuStyle, pinnedState, expandedWidthCss, collapsedWidthCss } = args;

  const resolvedPosition: "left" | "right" =
    dockMode && effectiveDockZone
      ? effectiveDockZone === "right"
        ? "right"
        : effectiveDockZone === "left"
        ? "left"
        : orientationDirection === "horizontal-right"
        ? "right"
        : "left"
      : position;

  const isHorizontalDockZone = effectiveDockZone === "top" || effectiveDockZone === "bottom";
  const isVerticalDockZone = effectiveDockZone === "left" || effectiveDockZone === "right";
  const tieredOpenToLeft =
    resolvedPosition === "right" ||
    (isHorizontalDockZone && horizontalDockAlign === "right");
  const isMegaMenuStyle =
    effectiveMenuStyle === "mega-horizontal" || effectiveMenuStyle === "mega-vertical";
  const dockAlign =
    dockMode && effectiveDockZone === "right" && !isCollapsed
      ? "end"
      : dockMode && effectiveDockZone === "left"
      ? "start"
      : null;

  const sidebarWidthCss =
    dockMode && isHorizontalDockZone && menuStyle !== "sidebar"
      ? "100%"
      : menuStyle === "inline" && isMegaMenuStyle
      ? "100%"
      : menuStyle === "hybrid"
      ? pinnedState
        ? expandedWidthCss
        : collapsedWidthCss
      : isCollapsed
      ? collapsedWidthCss
      : expandedWidthCss;

  return {
    resolvedPosition,
    isHorizontalDockZone,
    isVerticalDockZone,
    tieredOpenToLeft,
    isMegaMenuStyle,
    dockAlign,
    sidebarWidthCss
  };
}

export type MenuHintPlacement = "top" | "right";



export function resolveMenuNodeActionIntent(args: {
  variant: "panel" | "flat";
  hasChildren: boolean;
  hasActionTarget: boolean;
  isCollapsed?: boolean;
}): "toggle" | "activate" | "noop" {
  const { variant, hasChildren, hasActionTarget, isCollapsed = false } = args;

  if (variant === "panel") {
    if (hasChildren && !hasActionTarget && !isCollapsed) return "toggle";
    return "activate";
  }

  if (hasChildren && !hasActionTarget) return "noop";
  return "activate";
}
export function resolveExpandedIdsToggle(args: {
  currentIds: string[];
  nodeId: string;
  mode: "accordion" | "multiple";
  parentById: Map<string, string>;
  childrenByParent: Map<string, string[]>;
  rootParentId?: string;
}): string[] {
  const { currentIds, nodeId, mode, parentById, childrenByParent, rootParentId = "__sg_menu_root__" } = args;
  const next = new Set(currentIds);
  const isOpen = next.has(nodeId);
  if (isOpen) {
    next.delete(nodeId);
    return Array.from(next);
  }
  if (mode === "accordion") {
    const parentId = parentById.get(nodeId) ?? rootParentId;
    const siblings = childrenByParent.get(parentId) ?? [];
    for (const siblingId of siblings) {
      if (siblingId !== nodeId) next.delete(siblingId);
    }
  }
  next.add(nodeId);
  return Array.from(next);
}
export function resolveMenuHintPosition(args: {
  isConnected: boolean;
  rect: { left: number; right: number; top: number; width: number; height: number };
  placement: MenuHintPlacement;
}): { x: number; y: number } | null {
  const { isConnected, rect, placement } = args;
  if (!isConnected) return null;

  if (placement === "right") {
    return {
      x: rect.right + 8,
      y: rect.top + rect.height / 2
    };
  }

  return {
    x: rect.left + rect.width / 2,
    y: rect.top - 8
  };
}

export function resolveHorizontalDockAlign(clientX: number, zoneRect: { left: number; width: number }): "left" | "right" {
  return clientX < zoneRect.left + zoneRect.width / 2 ? "left" : "right";
}
export function resolveTieredHoverPath(currentPath: string[], depth: number, nodeId: string, hasChildren: boolean): string[] {
  if (!hasChildren) return currentPath.slice(0, depth);
  return [...currentPath.slice(0, depth), nodeId];
}

export function resolveTieredHoverIntent(args: {
  currentPath: string[];
  depth: number;
  nodeId: string;
  hasChildren: boolean;
  openSubmenuOnHover: boolean;
}): string[] | undefined {
  if (!args.openSubmenuOnHover) return undefined;
  return resolveTieredHoverPath(args.currentPath, args.depth, args.nodeId, args.hasChildren);
}

export function resolveTieredClickState(currentPath: string[], depth: number, nodeId: string): {
  nextPath: string[];
  isOpenAtDepth: boolean;
} {
  const base = currentPath.slice(0, depth);
  const isOpenAtDepth = currentPath[depth] === nodeId;
  return {
    nextPath: isOpenAtDepth ? base : [...base, nodeId],
    isOpenAtDepth
  };
}

export function resolveMenuSearchSelectionState(args: {
  currentExpandedIds: string[];
  parentChain: string[];
  rootToParent: string[];
  nodeId: string;
  hasChildren: boolean;
  hasActionTarget: boolean;
}): {
  expandedIds: string[];
  tieredPath: string[];
  megaActiveId?: string;
  localActiveId?: string;
  shouldActivateNode: boolean;
} {
  const { currentExpandedIds, parentChain, rootToParent, nodeId, hasChildren, hasActionTarget } = args;
  const expandedIds = mergeExpandedIdsForActivePath(currentExpandedIds, parentChain);
  const tieredPath = [...rootToParent, ...(hasChildren ? [nodeId] : [])];
  const megaActiveId = rootToParent[0] ?? nodeId;

  if (hasChildren && !hasActionTarget) {
    return {
      expandedIds: mergeExpandedIdsForActivePath(expandedIds, [nodeId]),
      tieredPath,
      megaActiveId,
      localActiveId: nodeId,
      shouldActivateNode: false
    };
  }

  return {
    expandedIds,
    tieredPath,
    megaActiveId,
    shouldActivateNode: true
  };
}

export function resolveTieredNodeClickIntent(args: {
  currentPath: string[];
  depth: number;
  nodeId: string;
  hasChildren: boolean;
  hasActionTarget: boolean;
}): {
  nextPath: string[];
  shouldActivateNode: boolean;
  isOpenAtDepth: boolean;
} {
  const { currentPath, depth, nodeId, hasChildren, hasActionTarget } = args;
  if (!hasChildren) {
    return {
      nextPath: currentPath,
      shouldActivateNode: true,
      isOpenAtDepth: false
    };
  }

  const nextState = resolveTieredClickState(currentPath, depth, nodeId);
  if (nextState.isOpenAtDepth) {
    return {
      nextPath: nextState.nextPath,
      shouldActivateNode: false,
      isOpenAtDepth: true
    };
  }

  return {
    nextPath: nextState.nextPath,
    shouldActivateNode: hasActionTarget,
    isOpenAtDepth: false
  };
}
export function resolveMegaMenuActiveNode<T extends MenuLogicNode>(items: T[], megaActiveId?: string): T | undefined {
  return items.find((node) => node.id === megaActiveId) ?? items[0];
}

export function resolveMegaMenuInteraction(args: {
  nodeId: string;
  hasChildren: boolean;
}): { nextMegaActiveId?: string; shouldActivateNode: boolean } {
  if (args.hasChildren) {
    return { nextMegaActiveId: args.nodeId, shouldActivateNode: false };
  }
  return { shouldActivateNode: true };
}

export function resolveMegaMenuHoverActiveId(args: {
  nodeId: string;
  hasChildren: boolean;
}): string | undefined {
  return args.hasChildren ? args.nodeId : undefined;
}
export type MenuAutocompleteItem = {
  id: string;
  label: string;
  value: string;
  group: string;
  data: { nodeId: string; path: string };
};

export function resolveMenuAutocompleteItems(
  searchEntries: MenuSearchEntry[],
  query: string,
  limit = 120
): MenuAutocompleteItem[] {
  const q = query.trim().toLowerCase();
  const matches = !q
    ? searchEntries
    : searchEntries.filter(
        (entry) =>
          entry.label.toLowerCase().includes(q) ||
          entry.path.toLowerCase().includes(q)
      );

  return matches.slice(0, limit).map((entry) => ({
    id: entry.id,
    label: entry.label,
    value: entry.path,
    group: entry.group,
    data: { nodeId: entry.id, path: entry.path }
  }));
}
export function filterMenuNodes<T extends MenuLogicNode>(nodes: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const walk = (list: T[]): T[] => {
    const out: T[] = [];
    for (const node of list) {
      const selfMatch = (node.label ?? "").toLowerCase().includes(q);
      const children = Array.isArray(node.children) && node.children.length > 0 ? walk(node.children as T[]) : [];
      if (selfMatch || children.length > 0) {
        out.push({
          ...node,
          children: children.length > 0 ? children : undefined
        });
      }
    }
    return out;
  };

  return walk(nodes);
}

export function collectMenuSearchEntries<T extends MenuLogicNode>(
  nodes: T[],
  trail: string[] = [],
  out: MenuSearchEntry[] = []
): MenuSearchEntry[] {
  for (const node of nodes) {
    const label = node.label ?? node.id;
    const nextTrail = [...trail, label];
    out.push({
      id: node.id,
      label,
      path: nextTrail.join(" > "),
      group: trail[0] ?? label
    });
    if (Array.isArray(node.children) && node.children.length > 0) {
      collectMenuSearchEntries(node.children as T[], nextTrail, out);
    }
  }
  return out;
}

export function flattenVisibleNodes<T extends MenuLogicNode>(
  nodes: T[],
  expandedSet: Set<string>,
  collapsed: boolean,
  forceExpand: boolean,
  depth = 0,
  parentId = "__sg_menu_root__",
  out: MenuVisibleNode<T>[] = []
): MenuVisibleNode<T>[] {
  for (const node of nodes) {
    out.push({ node, depth, parentId });
    if (collapsed) continue;
    const hasChildren = Boolean(node.children?.length);
    const isOpen = forceExpand || expandedSet.has(node.id);
    if (hasChildren && isOpen) {
      flattenVisibleNodes(node.children as T[], expandedSet, collapsed, forceExpand, depth + 1, node.id, out);
    }
  }
  return out;
}

export function resolveMenuKeyboardAction(args: {
  key: string;
  visibleNodes: MenuVisibleNode[];
  focusedId?: string;
  expandedIds: Set<string>;
  hasSearch: boolean;
  isCollapsed: boolean;
  parentById: Map<string, string>;
  rootParentId: string;
}): MenuKeyboardAction {
  const {
    key,
    visibleNodes,
    focusedId,
    expandedIds,
    hasSearch,
    isCollapsed,
    parentById,
    rootParentId
  } = args;

  if (visibleNodes.length === 0) return { type: "noop" };

  const currentIndex = visibleNodes.findIndex((item) => item.node.id === focusedId);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const current = visibleNodes[activeIndex];
  if (!current) return { type: "noop" };

  const node = current.node;
  const hasChildren = Boolean(node.children?.length);
  const isOpen = hasSearch || expandedIds.has(node.id);

  if (key === "ArrowDown") {
    const next = visibleNodes[Math.min(activeIndex + 1, visibleNodes.length - 1)];
    return next ? { type: "focus", id: next.node.id } : { type: "noop" };
  }

  if (key === "ArrowUp") {
    const next = visibleNodes[Math.max(activeIndex - 1, 0)];
    return next ? { type: "focus", id: next.node.id } : { type: "noop" };
  }

  if (key === "ArrowRight") {
    if (hasChildren && !isCollapsed && !isOpen && !hasSearch) {
      return { type: "toggle", id: node.id };
    }
    if (hasChildren && !isCollapsed) {
      const next = visibleNodes[activeIndex + 1];
      if (next && next.depth > current.depth) {
        return { type: "focus", id: next.node.id };
      }
    }
    return { type: "noop" };
  }

  if (key === "ArrowLeft") {
    if (hasChildren && !isCollapsed && isOpen && !hasSearch) {
      return { type: "toggle", id: node.id };
    }
    const parentId = parentById.get(node.id);
    if (parentId && parentId !== rootParentId) {
      return { type: "focus", id: parentId };
    }
    return { type: "noop" };
  }

  if (key === "Enter" || key === " ") {
    if (hasChildren && !node.url && !node.onClick && !isCollapsed) {
      return { type: "toggle", id: node.id };
    }
    return { type: "activate", id: node.id };
  }

  return { type: "noop" };
}




