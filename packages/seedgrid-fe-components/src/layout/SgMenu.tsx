"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SgAvatar } from "../commons/SgAvatar";
import { SgExpandablePanel, type SgExpandablePanelSize } from "./SgExpandablePanel";
import { SgAutocomplete, type SgAutocompleteItem } from "../inputs/SgAutocomplete";
import { SgCard } from "./SgCard";
import { useSgDockLayout, type SgDockZoneId } from "./SgDockLayout";

export type SgMenuNode = {
  id: string;
  label: string;
  url?: string;
  children?: SgMenuNode[];
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
};

export type SgMenuSelection = {
  activeId?: string;
  activeUrl?: string;
};

export type SgMenuBrand = {
  title?: string;
  imageSrc?: string;
  image?: React.ReactNode;
  onClick?: () => void;
};

export type SgMenuUser = {
  name: string;
  subtitle?: string;
  avatarSrc?: string;
  avatar?: React.ReactNode;
  onClick?: () => void;
};

export type SgMenuStyle =
  | "panel"
  | "tiered"
  | "mega-horizontal"
  | "mega-vertical"
  | "PanelMenu"
  | "Tiered"
  | "MegaMenuHorizontal"
  | "MegaMenuVertical";

export type SgMenuOrientationDirection =
  | "horizontal-left"
  | "horizontal-right"
  | "vertical-up"
  | "vertical-top"
  | "vertical-down";

export type SgMenuProps = {
  id?: string;
  menu: SgMenuNode[];
  selection?: SgMenuSelection;

  brand?: SgMenuBrand;

  user?: SgMenuUser;
  userMenu?: SgMenuNode[];

  variant?: "sidebar" | "drawer" | "inline" | "hybrid";
  menuStyle?: SgMenuStyle;
  position?: "left" | "right";
  density?: "compact" | "comfortable";
  indent?: number;
  collapsedWidth?: number | string;
  expandedWidth?: number | string;
  overlaySize?: SgExpandablePanelSize;
  overlayBackdrop?: boolean;
  dockable?: boolean;
  dockZone?: SgDockZoneId;
  draggable?: boolean;
  orientationDirection?: SgMenuOrientationDirection;

  mode?: "accordion" | "multiple";
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;

  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (value: boolean) => void;
  showCollapseButton?: boolean;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  closeOnNavigate?: boolean;

  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (value: boolean) => void;
  showPinButton?: boolean;

  onNavigate?: (node: SgMenuNode) => void;
  onAction?: (node: SgMenuNode) => void;
  onItemClick?: (node: SgMenuNode) => void;

  ariaLabel?: string;
  keyboardNavigation?: boolean;
  openSubmenuOnHover?: boolean;
  search?: { enabled: boolean; placeholder?: string };

  elevation?: "none" | "sm" | "md";
  border?: boolean;
  className?: string;
  style?: React.CSSProperties;
  userSectionClassName?: string;
  userSectionStyle?: React.CSSProperties;

  footer?: React.ReactNode;
};

type VisibleNode = {
  node: SgMenuNode;
  depth: number;
  parentId: string;
};

type MenuMaps = {
  parentById: Map<string, string>;
  nodeById: Map<string, SgMenuNode>;
  childrenByParent: Map<string, string[]>;
  firstByUrl: Map<string, string>;
};

type DockDragStart = {
  x: number;
  y: number;
};

const ROOT_PARENT_ID = "__sg_menu_root__";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value: number | string | undefined, fallback: number) {
  if (value === undefined || value === null) return `${fallback}px`;
  if (typeof value === "number") return `${value}px`;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : `${fallback}px`;
}

function normalizeMenuStyle(value: SgMenuStyle | undefined) {
  if (!value) return "panel" as const;
  if (value === "PanelMenu") return "panel" as const;
  if (value === "Tiered") return "tiered" as const;
  if (value === "MegaMenuHorizontal") return "mega-horizontal" as const;
  if (value === "MegaMenuVertical") return "mega-vertical" as const;
  return value;
}

function resolveDockZoneFromOrientationDirection(
  orientationDirection: SgMenuOrientationDirection | undefined
): SgDockZoneId {
  switch (orientationDirection) {
    case "horizontal-right":
      return "bottom";
    case "horizontal-left":
      return "top";
    case "vertical-up":
    case "vertical-top":
      return "left";
    case "vertical-down":
      return "right";
    default:
      return "left";
  }
}

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
) {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const currentRef = React.useRef(current);

  React.useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const base = currentRef.current;
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(base) : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange]
  );

  return [current, setValue] as const;
}

function buildMenuMaps(menu: SgMenuNode[]): MenuMaps {
  const parentById = new Map<string, string>();
  const nodeById = new Map<string, SgMenuNode>();
  const childrenByParent = new Map<string, string[]>();
  const firstByUrl = new Map<string, string>();

  const walk = (nodes: SgMenuNode[], parentId: string) => {
    childrenByParent.set(
      parentId,
      nodes.map((node) => node.id)
    );
    for (const node of nodes) {
      parentById.set(node.id, parentId);
      nodeById.set(node.id, node);
      if (node.url && !firstByUrl.has(node.url)) firstByUrl.set(node.url, node.id);
      if (node.children?.length) walk(node.children, node.id);
    }
  };

  walk(menu, ROOT_PARENT_ID);
  return { parentById, nodeById, childrenByParent, firstByUrl };
}

function filterMenuNodes(nodes: SgMenuNode[], query: string): SgMenuNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const walk = (list: SgMenuNode[]): SgMenuNode[] => {
    const out: SgMenuNode[] = [];
    for (const node of list) {
      const selfMatch = node.label.toLowerCase().includes(q);
      const children = node.children?.length ? walk(node.children) : [];
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

type MenuSearchEntry = {
  id: string;
  label: string;
  path: string;
  group: string;
};

function collectMenuSearchEntries(
  nodes: SgMenuNode[],
  trail: string[] = [],
  out: MenuSearchEntry[] = []
) {
  for (const node of nodes) {
    const nextTrail = [...trail, node.label];
    out.push({
      id: node.id,
      label: node.label,
      path: nextTrail.join(" > "),
      group: trail[0] ?? node.label
    });
    if (node.children?.length) collectMenuSearchEntries(node.children, nextTrail, out);
  }
  return out;
}

function flattenVisibleNodes(
  nodes: SgMenuNode[],
  expandedSet: Set<string>,
  collapsed: boolean,
  forceExpand: boolean,
  depth = 0,
  parentId = ROOT_PARENT_ID,
  out: VisibleNode[] = []
) {
  for (const node of nodes) {
    out.push({ node, depth, parentId });
    if (collapsed) continue;
    const hasChildren = !!node.children?.length;
    const isOpen = forceExpand || expandedSet.has(node.id);
    if (hasChildren && isOpen) {
      flattenVisibleNodes(
        node.children as SgMenuNode[],
        expandedSet,
        collapsed,
        forceExpand,
        depth + 1,
        node.id,
        out
      );
    }
  }
  return out;
}

function collectParentChain(parentById: Map<string, string>, id: string) {
  const out: string[] = [];
  let current = parentById.get(id);
  while (current && current !== ROOT_PARENT_ID) {
    out.push(current);
    current = parentById.get(current);
  }
  return out;
}

function firstChars(value: string, amount = 2) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) return "?";
  const words = normalized.split(" ");
  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
  }
  return normalized.slice(0, amount).toUpperCase();
}

function sameStringArray(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function computeActiveSets(
  nodes: SgMenuNode[],
  activeId: string | undefined,
  activeUrl: string | undefined
) {
  const exact = new Set<string>();
  const branch = new Set<string>();

  const walk = (list: SgMenuNode[]): boolean => {
    let found = false;
    for (const node of list) {
      const childFound = node.children?.length ? walk(node.children) : false;
      const selfActive =
        (activeId ? node.id === activeId : false) ||
        (activeUrl ? node.url === activeUrl : false);
      if (selfActive) exact.add(node.id);
      if (childFound) branch.add(node.id);
      if (selfActive || childFound) found = true;
    }
    return found;
  };

  walk(nodes);
  return { exact, branch };
}

function elevationClass(elevation: "none" | "sm" | "md") {
  if (elevation === "sm") return "shadow-sm";
  if (elevation === "md") return "shadow-md";
  return "";
}

function resolveIcon(node: SgMenuNode) {
  return node.icon ?? null;
}

export function SgMenu(props: Readonly<SgMenuProps>) {
  const {
    id,
    menu,
    selection,
    brand,
    user,
    userMenu,
    variant = "sidebar",
    menuStyle = "panel",
    position = "left",
    density = "comfortable",
    indent = 16,
    collapsedWidth = 72,
    expandedWidth = 280,
    overlaySize,
    overlayBackdrop,
    dockable = false,
    dockZone,
    draggable = false,
    orientationDirection,
    mode = "multiple",
    expandedIds: expandedIdsProp,
    defaultExpandedIds = [],
    onExpandedIdsChange,
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    showCollapseButton = false,
    open,
    defaultOpen = false,
    onOpenChange,
    closeOnNavigate,
    pinned,
    defaultPinned = false,
    onPinnedChange,
    showPinButton = false,
    onNavigate,
    onAction,
    onItemClick,
    ariaLabel = "Menu",
    keyboardNavigation = true,
    openSubmenuOnHover = false,
    search,
    elevation = "none",
    border = true,
    className,
    style,
    userSectionClassName,
    userSectionStyle,
    footer
  } = props;

  const densityCfg =
    density === "compact"
      ? {
          row: "min-h-8 px-2 py-1 text-xs",
          icon: "size-4",
          badge: "text-[10px] px-1.5 py-0.5",
          section: "px-2 py-2",
          gap: "gap-2"
        }
      : {
          row: "min-h-10 px-3 py-1.5 text-sm",
          icon: "size-5",
          badge: "text-xs px-2 py-0.5",
          section: "px-3 py-3",
          gap: "gap-2.5"
        };

  const maps = React.useMemo(() => buildMenuMaps(menu), [menu]);
  const resolvedMenuStyle = normalizeMenuStyle(menuStyle);
  const dock = useSgDockLayout();
  const autoId = React.useId();
  const dockableId = React.useMemo(
    () => id ?? `sg-menu-${autoId.replace(/[:]/g, "")}`,
    [autoId, id]
  );
  const dockMode = Boolean(dockable && dock && variant !== "drawer" && variant !== "hybrid");
  const defaultDockZone = dockZone ?? resolveDockZoneFromOrientationDirection(orientationDirection);
  const assignedDockZone = dockMode && dock ? dock.getToolbarZone(dockableId) : null;
  const effectiveDockZone = dockMode ? assignedDockZone ?? defaultDockZone : null;
  const portalTarget = dockMode && dock && effectiveDockZone ? dock.getZoneElement(effectiveDockZone) : null;

  const [expandedIds, setExpandedIds] = useControllableState<string[]>(
    expandedIdsProp,
    defaultExpandedIds,
    onExpandedIdsChange
  );
  const expandedSet = React.useMemo(() => new Set(expandedIds), [expandedIds]);

  const [collapsedState, setCollapsedState] = useControllableState<boolean>(
    collapsed,
    defaultCollapsed,
    onCollapsedChange
  );

  const [drawerOpen, setDrawerOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const [pinnedState, setPinnedState] = useControllableState<boolean>(
    pinned,
    defaultPinned,
    onPinnedChange
  );
  const isCollapsed =
    variant === "drawer" ? false : variant === "hybrid" ? !pinnedState : collapsedState;
  const collapsedWidthCss = toCssSize(collapsedWidth, 72);
  const expandedWidthCss = toCssSize(expandedWidth, 280);
  const resolvedOverlaySize: SgExpandablePanelSize =
    overlaySize ?? { default: variant === "drawer" ? 320 : expandedWidth, min: 240, max: 520 };
  const overlayBackdropResolved = overlayBackdrop ?? (variant === "drawer");

  const closeOnNavigateResolved = closeOnNavigate ?? true;
  const searchEnabled = search?.enabled ?? false;
  const [searchValue, setSearchValue] = React.useState("");
  const menuRootRef = React.useRef<HTMLDivElement | null>(null);
  const sidebarShellRef = React.useRef<HTMLElement | null>(null);
  const [dockDragActive, setDockDragActive] = React.useState(false);
  const [horizontalDockAlign, setHorizontalDockAlign] = React.useState<"left" | "right" | null>(null);
  const dockDragStartRef = React.useRef<DockDragStart | null>(null);
  const dockDragMovedRef = React.useRef(false);
  const dockHoverZoneRef = React.useRef<SgDockZoneId | null>(null);
  const searchEntries = React.useMemo(() => collectMenuSearchEntries(menu), [menu]);
  const autocompleteSource = React.useCallback(
    (query: string): SgAutocompleteItem[] => {
      const q = query.trim().toLowerCase();
      const matches = !q
        ? searchEntries
        : searchEntries.filter(
            (entry) =>
              entry.label.toLowerCase().includes(q) ||
              entry.path.toLowerCase().includes(q)
          );
      return matches.slice(0, 120).map((entry) => ({
        id: entry.id,
        label: entry.label,
        value: entry.path,
        group: entry.group,
        data: { nodeId: entry.id, path: entry.path }
      }));
    },
    [searchEntries]
  );
  const filteredMenu = React.useMemo(
    () => (searchEnabled ? filterMenuNodes(menu, searchValue) : menu),
    [menu, searchEnabled, searchValue]
  );
  const hasSearch = searchEnabled && searchValue.trim().length > 0;
  const effectiveMenuStyle = isCollapsed || hasSearch ? "panel" : resolvedMenuStyle;
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

  const [localActiveId, setLocalActiveId] = React.useState<string | undefined>(selection?.activeId);
  const [tieredPath, setTieredPath] = React.useState<string[]>([]);
  const [megaActiveId, setMegaActiveId] = React.useState<string | undefined>(menu[0]?.id);

  React.useEffect(() => {
    if (selection?.activeId) setLocalActiveId(selection.activeId);
  }, [selection?.activeId]);

  React.useEffect(() => {
    if (menu.length === 0) {
      setMegaActiveId(undefined);
      return;
    }
    if (!megaActiveId || !menu.some((node) => node.id === megaActiveId)) {
      setMegaActiveId(menu[0]?.id);
    }
  }, [megaActiveId, menu]);

  React.useEffect(() => {
    if (variant !== "hybrid") return;
    if (!pinnedState || !drawerOpen) return;
    setDrawerOpen(false);
  }, [drawerOpen, pinnedState, setDrawerOpen, variant]);

  React.useEffect(() => {
    if (!dockMode || !dock) return;
    const orientation = defaultDockZone === "top" || defaultDockZone === "bottom" ? "horizontal" : "vertical";
    dock.ensureToolbar(dockableId, {
      zone: defaultDockZone,
      collapsed: defaultCollapsed,
      orientation
    });
  }, [defaultCollapsed, defaultDockZone, dock, dockMode, dockableId]);

  React.useEffect(() => {
    if (!dockDragActive) return;
    const previousBodyCursor = document.body.style.cursor;
    const previousHtmlCursor = document.documentElement.style.cursor;
    document.body.style.cursor = "grabbing";
    document.documentElement.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = previousBodyCursor;
      document.documentElement.style.cursor = previousHtmlCursor;
    };
  }, [dockDragActive]);

  const applyDockDragVisual = React.useCallback((dx: number, dy: number) => {
    const shell = sidebarShellRef.current;
    if (!shell) return;
    shell.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    shell.style.willChange = "transform";
    shell.style.zIndex = "1300";
  }, []);

  const clearDockDragVisual = React.useCallback(() => {
    const shell = sidebarShellRef.current;
    if (!shell) return;
    shell.style.transform = "";
    shell.style.willChange = "";
    shell.style.zIndex = "";
  }, []);

  React.useEffect(
    () => () => {
      clearDockDragVisual();
    },
    [clearDockDragVisual]
  );

  const effectiveActiveId =
    selection?.activeId ??
    (selection?.activeUrl ? maps.firstByUrl.get(selection.activeUrl) : undefined) ??
    localActiveId;
  const effectiveActiveUrl = selection?.activeUrl;

  const activeSets = React.useMemo(
    () => computeActiveSets(menu, effectiveActiveId, effectiveActiveUrl),
    [menu, effectiveActiveId, effectiveActiveUrl]
  );

  React.useEffect(() => {
    if (!effectiveActiveId) return;
    const chain = collectParentChain(maps.parentById, effectiveActiveId);
    if (chain.length === 0) return;
    setExpandedIds((prev) => {
      const next = Array.from(new Set([...prev, ...chain]));
      return sameStringArray(prev, next) ? prev : next;
    });
  }, [effectiveActiveId, maps.parentById, setExpandedIds]);

  React.useEffect(() => {
    if (!effectiveActiveId) return;
    const parentChain = collectParentChain(maps.parentById, effectiveActiveId).reverse();
    const activeNode = maps.nodeById.get(effectiveActiveId);
    const nextTieredPath = [...parentChain];
    if (activeNode?.children?.length) nextTieredPath.push(activeNode.id);
    setTieredPath(nextTieredPath);
    setMegaActiveId(parentChain[0] ?? activeNode?.id ?? menu[0]?.id);
  }, [effectiveActiveId, maps.nodeById, maps.parentById, menu]);

  React.useEffect(() => {
    if (effectiveMenuStyle !== "tiered") return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuRootRef.current?.contains(target)) return;
      setTieredPath((prev) => (prev.length > 0 ? [] : prev));
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [effectiveMenuStyle]);

  const toggleExpanded = React.useCallback(
    (nodeId: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        const isOpen = next.has(nodeId);
        if (isOpen) {
          next.delete(nodeId);
          return Array.from(next);
        }
        if (mode === "accordion") {
          const parentId = maps.parentById.get(nodeId) ?? ROOT_PARENT_ID;
          const siblings = maps.childrenByParent.get(parentId) ?? [];
          for (const siblingId of siblings) {
            if (siblingId !== nodeId) next.delete(siblingId);
          }
        }
        next.add(nodeId);
        return Array.from(next);
      });
    },
    [maps.childrenByParent, maps.parentById, mode, setExpandedIds]
  );

  const activateNode = React.useCallback(
    (node: SgMenuNode) => {
      if (node.disabled) return;
      onItemClick?.(node);
      setLocalActiveId(node.id);

      const hasUrl = typeof node.url === "string" && node.url.length > 0;
      if (hasUrl) {
        if (onNavigate) onNavigate(node);
        else if (typeof window !== "undefined") window.location.assign(node.url as string);
      }

      if (node.onClick) {
        node.onClick();
        onAction?.(node);
      }

      if ((variant === "drawer" || variant === "hybrid") && hasUrl && closeOnNavigateResolved && !pinnedState) {
        setDrawerOpen(false);
      }
    },
    [
      closeOnNavigateResolved,
      onAction,
      onItemClick,
      onNavigate,
      pinnedState,
      setDrawerOpen,
      variant
    ]
  );

  const handleDockDragPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      if (!dockMode || !dock || !draggable || !effectiveDockZone) return;

      event.preventDefault();
      event.stopPropagation();
      dock.setDropPreviewActive(true);
      setDockDragActive(true);
      dockDragStartRef.current = { x: event.clientX, y: event.clientY };
      dockDragMovedRef.current = false;
      dockHoverZoneRef.current = dock.getZoneAtPoint(event.clientX, event.clientY) ?? effectiveDockZone;

      if (isHorizontalDockZone && sidebarShellRef.current) {
        const compactWidth = parseFloat(isCollapsed ? collapsedWidthCss : expandedWidthCss) || 280;
        // After dockDragActive=true, ml-auto is removed and element's natural left = zone's left edge.
        // Use zone left (not element rect.left) so the offset is correct regardless of current alignment.
        const zoneEl = effectiveDockZone ? dock.getZoneElement(effectiveDockZone) : null;
        const zoneLeft = zoneEl ? zoneEl.getBoundingClientRect().left : 0;
        const initialDx = event.clientX - zoneLeft - Math.max(0, compactWidth - 40);
        dockDragStartRef.current.x = event.clientX - initialDx;
        applyDockDragVisual(initialDx, 0);
      } else {
        applyDockDragVisual(0, 0);
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const start = dockDragStartRef.current;
        if (!start) return;
        const dx = moveEvent.clientX - start.x;
        const dy = moveEvent.clientY - start.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dockDragMovedRef.current = true;
        applyDockDragVisual(dx, dy);
        dockHoverZoneRef.current = dock.getZoneAtPoint(moveEvent.clientX, moveEvent.clientY);
      };

      const handleEnd = (upEvent: PointerEvent) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleEnd);
        window.removeEventListener("pointercancel", handleEnd);

        setDockDragActive(false);
        dock.setDropPreviewActive(false);
        clearDockDragVisual();

        if (!dockDragStartRef.current) return;
        dockDragStartRef.current = null;
        if (!dockDragMovedRef.current) {
          dockHoverZoneRef.current = null;
          return;
        }

        const zone = dockHoverZoneRef.current ?? dock.getZoneAtPoint(upEvent.clientX, upEvent.clientY);
        dockHoverZoneRef.current = null;
        if (zone) {
          dock.moveToolbar(dockableId, zone);
          if (zone === "top" || zone === "bottom") {
            const zoneEl = dock.getZoneElement(zone);
            if (zoneEl) {
              const zoneRect = zoneEl.getBoundingClientRect();
              setHorizontalDockAlign(upEvent.clientX < zoneRect.left + zoneRect.width / 2 ? "left" : "right");
            }
          } else {
            setHorizontalDockAlign(null);
          }
        }
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleEnd);
      window.addEventListener("pointercancel", handleEnd);
    },
    [applyDockDragVisual, clearDockDragVisual, dock, dockMode, dockableId, draggable, effectiveDockZone, setHorizontalDockAlign]
  );

  const visibleNodes = React.useMemo(
    () =>
      effectiveMenuStyle === "panel"
        ? flattenVisibleNodes(filteredMenu, expandedSet, isCollapsed, hasSearch)
        : [],
    [effectiveMenuStyle, expandedSet, filteredMenu, hasSearch, isCollapsed]
  );
  const searchInputId = React.useId();

  const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [focusedId, setFocusedId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (visibleNodes.length === 0) {
      setFocusedId(undefined);
      return;
    }
    const exists = visibleNodes.some((item) => item.node.id === focusedId);
    if (!exists) setFocusedId(visibleNodes[0]?.node.id);
  }, [focusedId, visibleNodes]);

  const focusById = React.useCallback((id: string | undefined) => {
    if (!id) return;
    itemRefs.current[id]?.focus?.();
    setFocusedId(id);
  }, []);

  const onListKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!keyboardNavigation) return;
      if (visibleNodes.length === 0) return;

      const currentIndex = visibleNodes.findIndex((item) => item.node.id === focusedId);
      const activeIndex = currentIndex >= 0 ? currentIndex : 0;
      const current = visibleNodes[activeIndex];
      if (!current) return;
      const node = current.node;
      const hasChildren = !!node.children?.length;
      const isOpen = hasSearch || expandedSet.has(node.id);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = visibleNodes[Math.min(activeIndex + 1, visibleNodes.length - 1)];
        focusById(next?.node.id);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = visibleNodes[Math.max(activeIndex - 1, 0)];
        focusById(next?.node.id);
        return;
      }
      if (event.key === "ArrowRight") {
        if (hasChildren && !isCollapsed && !isOpen && !hasSearch) {
          event.preventDefault();
          toggleExpanded(node.id);
          return;
        }
        if (hasChildren && !isCollapsed) {
          event.preventDefault();
          const next = visibleNodes[activeIndex + 1];
          if (next && next.depth > current.depth) focusById(next.node.id);
        }
        return;
      }
      if (event.key === "ArrowLeft") {
        if (hasChildren && !isCollapsed && isOpen && !hasSearch) {
          event.preventDefault();
          toggleExpanded(node.id);
          return;
        }
        event.preventDefault();
        const parentId = maps.parentById.get(node.id);
        if (parentId && parentId !== ROOT_PARENT_ID) focusById(parentId);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (hasChildren && !node.url && !node.onClick && !isCollapsed) {
          toggleExpanded(node.id);
          return;
        }
        activateNode(node);
      }
    },
    [
      activateNode,
      expandedSet,
      focusById,
      focusedId,
      hasSearch,
      isCollapsed,
      keyboardNavigation,
      maps.parentById,
      toggleExpanded,
      visibleNodes
    ]
  );

  const renderNode = React.useCallback(
    (node: SgMenuNode, depth: number) => {
      const hasChildren = !!node.children?.length;
      const openNow = hasSearch || expandedSet.has(node.id);
      const isExactActive = activeSets.exact.has(node.id);
      const isBranchActive = activeSets.branch.has(node.id);
      const disabled = !!node.disabled;
      const iconNode = resolveIcon(node);
      const hideChildren = isCollapsed;

      return (
        <div key={node.id} className="min-w-0">
          <div
            className={cn(
              "group flex items-center rounded-md",
              densityCfg.row,
              densityCfg.gap,
              isExactActive
                ? "bg-primary/15 text-primary"
                : isBranchActive
                ? "bg-muted/60 text-foreground"
                : "text-foreground hover:bg-muted/60",
              disabled ? "cursor-not-allowed opacity-55" : ""
            )}
            style={isCollapsed ? undefined : { paddingLeft: 8 + depth * indent }}
            title={isCollapsed ? node.label : undefined}
          >
            <button
              ref={(el) => {
                itemRefs.current[node.id] = el;
              }}
              data-sg-menu-node={node.id}
              type="button"
              aria-disabled={disabled || undefined}
              aria-current={isExactActive ? "page" : undefined}
              onFocus={() => setFocusedId(node.id)}
              onClick={() => {
                if (disabled) return;
                if (hasChildren && !node.url && !node.onClick && !isCollapsed) {
                  toggleExpanded(node.id);
                  return;
                }
                activateNode(node);
              }}
              className={cn(
                "min-w-0 flex-1 rounded-md",
                "flex items-center",
                densityCfg.gap,
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              )}
            >
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center rounded",
                  densityCfg.icon,
                  iconNode ? "" : "bg-muted text-[10px] font-semibold"
                )}
              >
                {iconNode ?? firstChars(node.label, 1)}
              </span>
              {!isCollapsed ? <span className="min-w-0 flex-1 truncate">{node.label}</span> : null}
              {!isCollapsed && node.badge !== undefined ? (
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground",
                    densityCfg.badge
                  )}
                >
                  {node.badge}
                </span>
              ) : null}
            </button>

            {!isCollapsed && hasChildren ? (
              <button
                type="button"
                aria-label={openNow ? "Collapse group" : "Expand group"}
                onClick={() => !disabled && toggleExpanded(node.id)}
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                )}
              >
                {openNow ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </button>
            ) : null}
          </div>

          {!hideChildren && hasChildren && openNow ? (
            <div className="mt-0.5 space-y-0.5">
              {node.children?.map((child) => renderNode(child, depth + 1))}
            </div>
          ) : null}
        </div>
      );
    },
    [
      activateNode,
      activeSets.branch,
      activeSets.exact,
      densityCfg.badge,
      densityCfg.gap,
      densityCfg.icon,
      densityCfg.row,
      expandedSet,
      hasSearch,
      indent,
      isCollapsed,
      toggleExpanded
    ]
  );

  const renderFlatAction = React.useCallback(
    (node: SgMenuNode, className?: string) => {
      const isExactActive = activeSets.exact.has(node.id);
      const isBranchActive = activeSets.branch.has(node.id);
      const hasChildren = !!node.children?.length;
      const iconNode = resolveIcon(node);

      return (
        <button
          key={node.id}
          type="button"
          disabled={node.disabled}
          aria-current={isExactActive ? "page" : undefined}
          onClick={() => {
            if (node.disabled) return;
            if (hasChildren && !node.url && !node.onClick) return;
            activateNode(node);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
            isExactActive
              ? "bg-primary/15 text-primary"
              : isBranchActive
              ? "bg-muted/60 text-foreground"
              : "text-foreground hover:bg-muted/60",
            node.disabled ? "cursor-not-allowed opacity-55" : "",
            className
          )}
        >
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded",
              densityCfg.icon,
              iconNode ? "" : "bg-muted text-[10px] font-semibold"
            )}
          >
            {iconNode ?? firstChars(node.label, 1)}
          </span>
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
          {hasChildren ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" /> : null}
        </button>
      );
    },
    [activateNode, activeSets.branch, activeSets.exact, densityCfg.icon]
  );

  const renderTieredLevels = React.useCallback(
    (nodes: SgMenuNode[], depth: number): React.ReactNode => {
      if (!nodes.length) return null;
      const activeIdAtDepth = tieredPath[depth];
      const activeNode = nodes.find((node) => node.id === activeIdAtDepth);

      return (
        <div
          className={cn(
            depth === 0
              ? "relative w-full"
              : cn(
                "absolute top-0 min-w-[220px]",
                tieredOpenToLeft ? "right-full mr-1" : "left-full ml-1"
              ),
            depth > 0 ? "z-20" : ""
          )}
        >
          <div className="rounded-md border border-border bg-background p-1 shadow-sm">
            {nodes.map((node) => {
              const hasChildren = !!node.children?.length;
              const isOpen = activeIdAtDepth === node.id;
              const isExactActive = activeSets.exact.has(node.id);
              const iconNode = resolveIcon(node);
              return (
                <button
                  key={node.id}
                  type="button"
                  disabled={node.disabled}
                  aria-current={isExactActive ? "page" : undefined}
                  onMouseEnter={() => {
                    if (!openSubmenuOnHover) return;
                    if (!hasChildren) {
                      setTieredPath((prev) => prev.slice(0, depth));
                      return;
                    }
                    setTieredPath((prev) => [...prev.slice(0, depth), node.id]);
                  }}
                  onClick={() => {
                    if (node.disabled) return;
                    if (hasChildren) {
                      const isOpenAtDepth = tieredPath[depth] === node.id;
                      setTieredPath((prev) => {
                        const base = prev.slice(0, depth);
                        return isOpenAtDepth ? base : [...base, node.id];
                      });
                      if (isOpenAtDepth) return;
                      if (!node.url && !node.onClick) return;
                    }
                    activateNode(node);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                    isExactActive ? "bg-primary/15 text-primary" : isOpen ? "bg-muted/70" : "hover:bg-muted/60",
                    node.disabled ? "cursor-not-allowed opacity-55" : ""
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center rounded",
                      densityCfg.icon,
                      iconNode ? "" : "bg-muted text-[10px] font-semibold"
                    )}
                  >
                    {iconNode ?? firstChars(node.label, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{node.label}</span>
                  {hasChildren ? (
                    tieredOpenToLeft ? (
                      <ChevronLeft className="size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )
                  ) : null}
                </button>
              );
            })}
          </div>

          {activeNode?.children?.length
            ? renderTieredLevels(activeNode.children, depth + 1)
            : null}
        </div>
      );
    },
    [activateNode, activeSets.exact, densityCfg.icon, openSubmenuOnHover, tieredOpenToLeft, tieredPath]
  );

  const renderMegaColumns = React.useCallback(
    (nodes: SgMenuNode[]) => {
      if (!nodes.length) {
        return <div className="text-sm text-muted-foreground">No items found.</div>;
      }

      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.map((group) => (
            <div key={group.id} className="space-y-3">
              {group.children?.length ? (
                <>
                  <p className="text-base font-semibold">{group.label}</p>
                  <div className="space-y-1">
                    {group.children.map((item) =>
                      item.children?.length ? (
                        <div key={item.id} className="space-y-1 pt-1">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <div className="space-y-1 pl-1">
                            {item.children.map((leaf) => renderFlatAction(leaf, "px-1.5 py-1.5 text-sm"))}
                          </div>
                        </div>
                      ) : (
                        renderFlatAction(item, "px-1.5 py-1.5 text-sm")
                      )
                    )}
                  </div>
                </>
              ) : (
                renderFlatAction(group, "px-1.5 py-1.5 text-sm")
              )}
            </div>
          ))}
        </div>
      );
    },
    [renderFlatAction]
  );

  const renderMenuTree = (items: SgMenuNode[]) => {
    if (items.length === 0) {
      return <div className="px-3 py-2 text-xs text-muted-foreground">No items found.</div>;
    }

    if (effectiveMenuStyle === "panel") {
      return <div className="space-y-0.5">{items.map((node) => renderNode(node, 0))}</div>;
    }

    if (effectiveMenuStyle === "tiered") {
      return <div className="relative min-h-[120px]">{renderTieredLevels(items, 0)}</div>;
    }

    const activeMegaNode =
      items.find((node) => node.id === megaActiveId) ??
      items[0];

    if (effectiveMenuStyle === "mega-horizontal") {
      return (
        <div className="rounded-md border border-border bg-background">
          <div className="flex flex-wrap items-center gap-1 border-b border-border p-1">
            {items.map((node) => {
              const hasChildren = !!node.children?.length;
              const active = activeMegaNode?.id === node.id;
              const iconNode = resolveIcon(node);
              return (
                <button
                  key={node.id}
                  type="button"
                  disabled={node.disabled}
                  onMouseEnter={() => hasChildren && setMegaActiveId(node.id)}
                  onClick={() => {
                    if (node.disabled) return;
                    if (hasChildren) {
                      setMegaActiveId(node.id);
                      return;
                    }
                    activateNode(node);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-muted/80 text-foreground" : "hover:bg-muted/60",
                    node.disabled ? "cursor-not-allowed opacity-55" : ""
                  )}
                >
                  {iconNode ? (
                    <span className={cn("inline-flex shrink-0 items-center justify-center", densityCfg.icon)}>
                      {iconNode}
                    </span>
                  ) : null}
                  <span className="truncate">{node.label}</span>
                  {hasChildren ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" /> : null}
                </button>
              );
            })}
          </div>
          <div className="p-4">{renderMegaColumns(activeMegaNode?.children ?? [])}</div>
        </div>
      );
    }

    return (
      <div className="flex rounded-md border border-border bg-background">
        <div className="w-52 shrink-0 border-r border-border p-1">
          {items.map((node) => {
            const hasChildren = !!node.children?.length;
            const active = activeMegaNode?.id === node.id;
            const iconNode = resolveIcon(node);
            return (
              <button
                key={node.id}
                type="button"
                disabled={node.disabled}
                onMouseEnter={() => hasChildren && setMegaActiveId(node.id)}
                onClick={() => {
                  if (node.disabled) return;
                  if (hasChildren) {
                    setMegaActiveId(node.id);
                    return;
                  }
                  activateNode(node);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  active ? "bg-muted/80 text-foreground" : "hover:bg-muted/60",
                  node.disabled ? "cursor-not-allowed opacity-55" : ""
                )}
              >
                {iconNode ? (
                  <span className={cn("inline-flex shrink-0 items-center justify-center", densityCfg.icon)}>
                    {iconNode}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate">{node.label}</span>
                {hasChildren ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" /> : null}
              </button>
            );
          })}
        </div>
        <div className="min-h-[220px] flex-1 p-4">{renderMegaColumns(activeMegaNode?.children ?? [])}</div>
      </div>
    );
  };

  const showDockDragHandle = dockMode && draggable && (!isCollapsed || isHorizontalDockZone);
  const collapseIconSide: "left" | "right" | "top" | "bottom" =
    isHorizontalDockZone ? (effectiveDockZone as "top" | "bottom") : resolvedPosition;
  const collapseButton =
    showCollapseButton && variant !== "drawer" ? (
      <button
        type="button"
        onClick={() => {
          if (variant === "hybrid") {
            if (pinnedState) {
              setPinnedState(false);
              setDrawerOpen(false);
              return;
            }
            setDrawerOpen(!drawerOpen);
            return;
          }
          setCollapsedState(!collapsedState);
        }}
        aria-label={
          variant === "hybrid"
            ? pinnedState
              ? "Unpin and collapse menu"
              : drawerOpen
              ? "Close menu"
              : "Open menu"
            : collapsedState
            ? "Expand menu"
            : "Collapse menu"
        }
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
          "bg-background hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        )}
      >
        <CollapseIcon
          collapsed={variant === "hybrid" ? !(pinnedState || drawerOpen) : collapsedState}
          side={collapseIconSide}
        />
      </button>
    ) : null;
  const showBrandContent = Boolean(brand && (!isCollapsed || isHorizontalDockZone));
  const showBrandSpacer = !showBrandContent && !isCollapsed;
  // In horizontal zones: collapse goes left when aligned left/center, right when aligned right.
  // In vertical zones: keep the original resolvedPosition logic.
  const collapseOnLeft = isHorizontalDockZone
    ? horizontalDockAlign !== "right"
    : resolvedPosition === "right";

  const shellHeaderRow = (brand || showCollapseButton || showPinButton || showDockDragHandle) ? (
    <div className={cn("flex items-center gap-2 border-b border-border", densityCfg.section)}>
      {collapseOnLeft ? collapseButton : null}

      {showBrandContent && brand ? (
        <button
          type="button"
          onClick={brand.onClick}
          className={cn(
            "min-w-0 flex-1 rounded-md",
            "flex items-center gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          )}
        >
          {brand.image ? (
            <span className="inline-flex shrink-0 items-center justify-center">{brand.image}</span>
          ) : brand.imageSrc ? (
            <img src={brand.imageSrc} alt={brand.title ?? "brand"} className="h-7 w-auto max-w-[120px]" />
          ) : null}
          <span className="truncate text-sm font-semibold">{brand.title ?? "Menu"}</span>
        </button>
      ) : showBrandSpacer ? (
        <div className="flex-1" />
      ) : null}

      {showDockDragHandle ? (
        <button
          type="button"
          onPointerDown={handleDockDragPointerDown}
          aria-label="Drag menu"
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
            "bg-background hover:bg-muted/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
            dockDragActive ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <circle cx="8" cy="8" r="1.25" fill="currentColor" />
            <circle cx="8" cy="12" r="1.25" fill="currentColor" />
            <circle cx="8" cy="16" r="1.25" fill="currentColor" />
            <circle cx="16" cy="8" r="1.25" fill="currentColor" />
            <circle cx="16" cy="12" r="1.25" fill="currentColor" />
            <circle cx="16" cy="16" r="1.25" fill="currentColor" />
          </svg>
        </button>
      ) : null}

      {showPinButton ? (
        <button
          type="button"
          onClick={() => {
            const next = !pinnedState;
            setPinnedState(next);
            if (variant === "hybrid" && next) setDrawerOpen(false);
          }}
          aria-label={pinnedState ? "Unpin menu" : "Pin menu"}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
            "bg-background hover:bg-muted/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          )}
        >
          <PinIcon pinned={pinnedState} />
        </button>
      ) : null}

      {!collapseOnLeft ? collapseButton : null}
    </div>
  ) : null;

  const shellContentArea = (
    <>
      {searchEnabled && !isCollapsed ? (
        <div className={cn("border-b border-border", densityCfg.section)}>
          <SgAutocomplete
            id={`${searchInputId}-menu-search`}
            label={search?.placeholder ?? "Search"}
            placeholder={search?.placeholder ?? "Search"}
            value={searchValue}
            onChange={setSearchValue}
            source={autocompleteSource}
            minLengthForSearch={0}
            openOnFocus
            showDropDownButton
            clearOnSelect
            grouped
            onSelect={(item) => {
              const nodeId = (item.data as { nodeId?: string } | undefined)?.nodeId;
              if (!nodeId) return;
              const node = maps.nodeById.get(nodeId);
              if (!node || node.disabled) return;

              const parentChain = collectParentChain(maps.parentById, node.id);
              const rootToParent = [...parentChain].reverse();
              if (parentChain.length > 0) {
                setExpandedIds((prev) => {
                  const next = Array.from(new Set([...prev, ...parentChain]));
                  return sameStringArray(prev, next) ? prev : next;
                });
              }

              setTieredPath([
                ...rootToParent,
                ...(node.children?.length ? [node.id] : [])
              ]);
              setMegaActiveId(rootToParent[0] ?? node.id);

              if (node.children?.length && !node.url && !node.onClick) {
                setExpandedIds((prev) => {
                  const nextSet = new Set(prev);
                  nextSet.add(node.id);
                  const next = Array.from(nextSet);
                  return sameStringArray(prev, next) ? prev : next;
                });
                setLocalActiveId(node.id);
                return;
              }

              activateNode(node);
            }}
            renderItem={(item) => {
              const data = item.data as { path?: string; nodeId?: string } | undefined;
              const path = data?.path;
              const node = data?.nodeId ? maps.nodeById.get(data.nodeId) : undefined;
              const iconNode = node ? resolveIcon(node) : null;
              return (
                <div className="flex min-w-0 items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex shrink-0 items-center justify-center rounded",
                      densityCfg.icon,
                      iconNode ? "" : "bg-muted text-[10px] font-semibold"
                    )}
                  >
                    {iconNode ?? firstChars(item.label, 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">{item.label}</div>
                    {path ? <div className="truncate text-xs text-muted-foreground">{path}</div> : null}
                  </div>
                </div>
              );
            }}
          />
        </div>
      ) : null}

      <div
        className={cn(
          "min-h-0 flex-1",
          effectiveMenuStyle === "panel" ? "overflow-auto" : "overflow-visible",
          densityCfg.section
        )}
        role="navigation"
        aria-label={ariaLabel}
        onKeyDown={effectiveMenuStyle === "panel" ? onListKeyDown : undefined}
      >
        {renderMenuTree(filteredMenu)}
      </div>

      {(user || (userMenu && userMenu.length > 0) || footer) ? (
        <div className={cn("border-t border-border", densityCfg.section, userSectionClassName)} style={userSectionStyle}>
          {user ? (
            isCollapsed ? (
              <button
                type="button"
                onClick={user.onClick}
                className={cn(
                  "mb-2 w-full rounded-md",
                  "flex items-center gap-2",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                  "hover:bg-muted/60",
                  densityCfg.row
                )}
                title={user.name}
              >
                <SgAvatar
                  src={user.avatar ? undefined : user.avatarSrc}
                  label={user.name}
                  size={density === "compact" ? "sm" : "md"}
                  severity="secondary"
                >
                  {user.avatar ?? undefined}
                </SgAvatar>
              </button>
            ) : (
              <SgCard
                className="mb-2"
                variant="outlined"
                size={density === "compact" ? "sm" : "md"}
                collapsible
                defaultOpen={false}
                title={user.name}
                description={user.subtitle}
                leading={(
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      user.onClick?.();
                    }}
                    className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    aria-label={user.name}
                  >
                    <SgAvatar
                      src={user.avatar ? undefined : user.avatarSrc}
                      label={user.name}
                      size={density === "compact" ? "sm" : "md"}
                      severity="secondary"
                    >
                      {user.avatar ?? undefined}
                    </SgAvatar>
                  </button>
                )}
              >
                {userMenu && userMenu.length > 0 ? (
                  <div className="space-y-0.5">{userMenu.map((node) => renderNode(node, 0))}</div>
                ) : null}
                {footer ? <div className={userMenu && userMenu.length > 0 ? "mt-2" : undefined}>{footer}</div> : null}
              </SgCard>
            )
          ) : (
            <>
              {userMenu && userMenu.length > 0 && !isCollapsed ? (
                <div className="space-y-0.5">{userMenu.map((node) => renderNode(node, 0))}</div>
              ) : null}
              {footer ? <div className="mt-2">{footer}</div> : null}
            </>
          )}
        </div>
      ) : null}
    </>
  );

  const shellBody = (
    <div ref={menuRootRef} className={cn("flex h-full min-h-0 flex-col bg-background text-foreground")}>
      {shellHeaderRow}
      {shellContentArea}
    </div>
  );

  const isMegaMenuStyle =
    effectiveMenuStyle === "mega-horizontal" || effectiveMenuStyle === "mega-vertical";
  const dockAlignStyle: React.CSSProperties | undefined =
    dockMode && effectiveDockZone === "right" && !isCollapsed
      ? { alignSelf: "flex-end" }
      : dockMode && effectiveDockZone === "left"
      ? { alignSelf: "flex-start" }
      : undefined;

  const sidebarWidthCss =
    dockMode && isHorizontalDockZone
      ? "100%"
      : variant === "inline" && isMegaMenuStyle
      ? "100%"
      : variant === "hybrid"
      ? pinnedState
        ? expandedWidthCss
        : collapsedWidthCss
      : isCollapsed
      ? collapsedWidthCss
      : expandedWidthCss;
  const sidebarWidthStyle = sidebarWidthCss;

  const sidebarShell = (
    <aside
      ref={(node) => {
        sidebarShellRef.current = node;
      }}
      className={cn(
        "flex h-full min-h-0 flex-col bg-background text-foreground",
        effectiveMenuStyle === "tiered" ? "overflow-visible" : "overflow-hidden",
        border ? "border border-border" : "",
        elevationClass(elevation),
        resolvedPosition === "right" ? "ml-auto" : "",
        className
      )}
      style={{ width: sidebarWidthStyle, ...dockAlignStyle, ...style }}
    >
      {shellBody}
    </aside>
  );
  const shellForRender =
    dockMode && effectiveDockZone === "right" && isCollapsed ? (
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "flex-end" }}>
        {sidebarShell}
      </div>
    ) : dockMode && isHorizontalDockZone ? (
      <aside
        ref={(node) => {
          (menuRootRef as React.MutableRefObject<HTMLElement | null>).current = node;
          sidebarShellRef.current = node;
        }}
        className={cn(
          "relative flex flex-col bg-background text-foreground",
          !dockDragActive && horizontalDockAlign === null ? "w-full" : "",
          !dockDragActive ? "self-stretch" : "",
          !dockDragActive && horizontalDockAlign === "right" ? "ml-auto" : "",
          border ? "border border-border" : "",
          elevationClass(elevation),
          className
        )}
        style={{
          width: dockDragActive || horizontalDockAlign !== null
            ? expandedWidthCss
            : undefined,
          ...style
        }}
      >
        {shellHeaderRow}
        {!isCollapsed ? (
          <div
            className={cn(
              "absolute z-50 flex flex-col bg-background text-foreground",
              effectiveMenuStyle === "tiered" ? "overflow-visible" : "overflow-auto",
              effectiveDockZone === "bottom" ? "bottom-full" : "top-full",
              horizontalDockAlign === "right" ? "right-0" : "left-0",
              "min-w-[240px]",
              effectiveMenuStyle !== "tiered" ? "max-h-[60vh]" : "",
              "border border-border",
              elevationClass(elevation === "none" ? "sm" : elevation)
            )}
          >
            {shellContentArea}
          </div>
        ) : null}
      </aside>
    ) : (
      sidebarShell
    );

  if (dockMode && portalTarget) {
    return createPortal(shellForRender, portalTarget);
  }

  if (variant === "drawer") {
    return (
      <SgExpandablePanel
        mode="overlay"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        expandTo={resolvedPosition === "left" ? "right" : "left"}
        placement="start"
        size={resolvedOverlaySize}
        animation={{ type: "slide", durationMs: 180 }}
        border={border}
        elevation={elevation === "md" ? "lg" : elevation}
        rounded="none"
        closeOnOutsideClick={!pinnedState}
        closeOnEsc={!pinnedState}
        trapFocus
        showBackdrop={overlayBackdropResolved}
        ariaLabel={ariaLabel}
        role="dialog"
        className={className}
        style={style}
      >
        {shellBody}
      </SgExpandablePanel>
    );
  }

  if (variant === "hybrid") {
    return (
      <>
        {shellForRender}
        {!pinnedState ? (
          <SgExpandablePanel
            mode="overlay"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            expandTo={resolvedPosition === "left" ? "right" : "left"}
            placement="start"
            size={resolvedOverlaySize}
            animation={{ type: "slide", durationMs: 180 }}
            border={border}
            elevation={elevation === "md" ? "lg" : elevation}
            rounded="none"
            closeOnOutsideClick
            closeOnEsc
            trapFocus
            showBackdrop={overlayBackdropResolved}
            ariaLabel={ariaLabel}
            role="dialog"
          >
            <SgMenu
              menu={menu}
              selection={{ activeId: effectiveActiveId, activeUrl: effectiveActiveUrl }}
              brand={brand}
              user={user}
              userMenu={userMenu}
              variant="inline"
              menuStyle={menuStyle}
              position={position}
              density={density}
              indent={indent}
              collapsed={false}
              collapsedWidth={collapsedWidth}
              expandedWidth={expandedWidth}
              mode={mode}
              expandedIds={expandedIds}
              onExpandedIdsChange={setExpandedIds}
              showCollapseButton={false}
              showPinButton={showPinButton}
              pinned={pinnedState}
              onPinnedChange={(next) => {
                setPinnedState(next);
                if (next) setDrawerOpen(false);
              }}
              closeOnNavigate={closeOnNavigateResolved}
              onNavigate={(node) => {
                setLocalActiveId(node.id);
                if (onNavigate) onNavigate(node);
                else if (typeof window !== "undefined" && node.url) window.location.assign(node.url);
                if (closeOnNavigateResolved && !pinnedState) setDrawerOpen(false);
              }}
              onAction={onAction}
              onItemClick={(node) => {
                setLocalActiveId(node.id);
                onItemClick?.(node);
              }}
              ariaLabel={ariaLabel}
              keyboardNavigation={keyboardNavigation}
              openSubmenuOnHover={openSubmenuOnHover}
              search={search}
              elevation="none"
              border={false}
              footer={footer}
            />
          </SgExpandablePanel>
        ) : null}
      </>
    );
  }

  return shellForRender;
}

SgMenu.displayName = "SgMenu";

function CollapseIcon(props: { collapsed: boolean; side: "left" | "right" | "top" | "bottom" }) {
  const { collapsed, side } = props;
  const rotation =
    side === "top" ? (collapsed ? 90 : -90) :
    side === "bottom" ? (collapsed ? -90 : 90) :
    side === "left" ? (collapsed ? 0 : 180) :
    (collapsed ? 180 : 0);
  return (
    <svg viewBox="0 0 24 24" className="size-4" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="currentColor" />
    </svg>
  );
}

function PinIcon(props: { pinned: boolean }) {
  if (props.pinned) {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M9 3h6v3l2 3v2H7V9l2-3V3zm3 8v10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M9 3h6v3l2 3v2H7V9l2-3V3m-3 14l12-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
