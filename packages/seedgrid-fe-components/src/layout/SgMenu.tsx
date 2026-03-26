"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SgAvatar } from "../commons/SgAvatar";
import { SgExpandablePanel, type SgExpandablePanelSize } from "./SgExpandablePanel";
import { SgAutocomplete, type SgAutocompleteItem } from "../inputs/SgAutocomplete";
import { SgCard } from "./SgCard";
import { useSgDockLayout, type SgDockZoneId } from "./SgDockLayout";
import { useHasSgEnvironmentProvider, useSgPersistence } from "../environment/SgEnvironmentProvider";
import { t, useComponentsI18n } from "../i18n";
import { buildMenuMaps, collectMenuSearchEntries, collectParentChain, computeActiveSets, filterMenuNodes, flattenVisibleNodes, mergeExpandedIdsForActivePath, resolveEffectiveActiveId, resolveExpandedIdsToggle, resolveHorizontalDockAlign, resolveMegaMenuActiveNode, resolveMegaMenuHoverActiveId, resolveMegaMenuInteraction, resolveMenuAutocompleteItems, resolveMenuHintPosition as resolveMenuHintPositionHelper, resolveMenuKeyboardAction, resolveMenuLayoutState, resolveMenuNodeActionIntent, resolveMenuSearchSelectionState, resolveTieredActiveState, resolveTieredClickState, resolveTieredHoverIntent, resolveTieredHoverPath, resolveTieredNodeClickIntent, type MenuMaps } from "./menu-logic";

export type SgMenuNode = {
  id: string;
  label: string;
  hint?: string;
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

  menuStyle?: "sidebar" | "drawer" | "inline" | "hybrid";
  menuVariantStyle?: SgMenuStyle;
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

type DockDragStart = {
  x: number;
  y: number;
};

type MenuHintPlacement = "top" | "right";

type MenuHintAnchor = {
  target: HTMLElement;
  text: string;
  placement: MenuHintPlacement;
};

type MenuHintState = {
  text: string;
  x: number;
  y: number;
  placement: MenuHintPlacement;
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

function elevationClass(elevation: "none" | "sm" | "md") {
  if (elevation === "sm") return "shadow-sm";
  if (elevation === "md") return "shadow-md";
  return "";
}
function resolveIcon(node: SgMenuNode) {
  return node.icon ?? null;
}

export function SgMenu(props: Readonly<SgMenuProps>) {
  const i18n = useComponentsI18n();
  const {
    id,
    menu,
    selection,
    brand,
    user,
    userMenu,
    menuStyle = "sidebar",
    menuVariantStyle = "panel",
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
    ariaLabel,
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

  const resolvedAriaLabel = ariaLabel ?? t(i18n, "components.menu.ariaLabel");

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
  const resolvedMenuStyle = normalizeMenuStyle(menuVariantStyle);
  const dock = useSgDockLayout();
  const autoId = React.useId();
  const dockableId = React.useMemo(
    () => id ?? `sg-menu-${autoId.replace(/[:]/g, "")}`,
    [autoId, id]
  );
  const dockMode = Boolean(dockable && dock && menuStyle !== "drawer" && menuStyle !== "hybrid");
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

  const hasEnvironmentProvider = useHasSgEnvironmentProvider();
  const { load: loadPersistedState, save: savePersistedState } = useSgPersistence();
  const collapsePersistKey = id ? `sg-menu:${id}:collapsed` : null;
  const isCollapsedPropControlled = collapsed !== undefined;
  const [collapsedInternal, setCollapsedInternal] = React.useState(defaultCollapsed);

  React.useEffect(() => {
    if (!collapsePersistKey || isCollapsedPropControlled) return;
    let alive = true;
    (async () => {
      try {
        let loaded: unknown;
        if (hasEnvironmentProvider) {
          loaded = await loadPersistedState(collapsePersistKey);
        } else {
          const raw = localStorage.getItem(collapsePersistKey);
          loaded = raw !== null ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : null;
        }
        if (!alive || loaded === null || loaded === undefined) return;
        if (typeof loaded === "boolean") setCollapsedInternal(loaded);
      } catch {
        // ignore
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsePersistKey]);

  const collapsedState = isCollapsedPropControlled ? (collapsed as boolean) : collapsedInternal;

  const setCollapsedState = React.useCallback(
    (next: boolean) => {
      if (!isCollapsedPropControlled) {
        setCollapsedInternal(next);
        if (collapsePersistKey) {
          if (hasEnvironmentProvider) {
            void savePersistedState(collapsePersistKey, next);
          } else {
            try {
              localStorage.setItem(collapsePersistKey, JSON.stringify(next));
            } catch {
              // ignore
            }
          }
        }
      }
      onCollapsedChange?.(next);
    },
    [isCollapsedPropControlled, collapsePersistKey, hasEnvironmentProvider, savePersistedState, onCollapsedChange]
  );

  const [drawerOpen, setDrawerOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const [pinnedState, setPinnedState] = useControllableState<boolean>(
    pinned,
    defaultPinned,
    onPinnedChange
  );
  const isCollapsed =
    menuStyle === "drawer" ? false : menuStyle === "hybrid" ? !pinnedState : collapsedState;
  const collapsedWidthCss = toCssSize(collapsedWidth, 72);
  const expandedWidthCss = toCssSize(expandedWidth, 280);
  const resolvedOverlaySize: SgExpandablePanelSize =
    overlaySize ?? { default: menuStyle === "drawer" ? 320 : expandedWidth, min: 240, max: 520 };
  const overlayBackdropResolved = overlayBackdrop ?? (menuStyle === "drawer");

  const closeOnNavigateResolved = closeOnNavigate ?? true;
  const searchEnabled = search?.enabled ?? false;
  const [searchValue, setSearchValue] = React.useState("");
  const menuRootRef = React.useRef<HTMLDivElement | null>(null);
  const sidebarShellRef = React.useRef<HTMLElement | null>(null);
  const menuHintAnchorRef = React.useRef<MenuHintAnchor | null>(null);
  const [menuHint, setMenuHint] = React.useState<MenuHintState | null>(null);
  const [dockDragActive, setDockDragActive] = React.useState(false);
  const [horizontalDockAlign, setHorizontalDockAlign] = React.useState<"left" | "right" | null>(null);
  const dockDragStartRef = React.useRef<DockDragStart | null>(null);
  const dockDragMovedRef = React.useRef(false);
  const dockHoverZoneRef = React.useRef<SgDockZoneId | null>(null);
  const searchEntries = React.useMemo(() => collectMenuSearchEntries(menu), [menu]);
  const autocompleteSource = React.useCallback(
    (query: string): SgAutocompleteItem[] => resolveMenuAutocompleteItems(searchEntries, query),
    [searchEntries]
  );
  const filteredMenu = React.useMemo(
    () => (searchEnabled ? filterMenuNodes(menu, searchValue) : menu),
    [menu, searchEnabled, searchValue]
  );
  const hasSearch = searchEnabled && searchValue.trim().length > 0;
  const effectiveMenuStyle = isCollapsed || hasSearch ? "panel" : resolvedMenuStyle;
  const layoutState = React.useMemo(
    () =>
      resolveMenuLayoutState({
        dockMode,
        effectiveDockZone,
        orientationDirection,
        position,
        horizontalDockAlign,
        isCollapsed,
        menuStyle,
        effectiveMenuStyle,
        pinnedState,
        expandedWidthCss,
        collapsedWidthCss
      }),
    [
      collapsedWidthCss,
      dockMode,
      effectiveDockZone,
      effectiveMenuStyle,
      expandedWidthCss,
      horizontalDockAlign,
      isCollapsed,
      menuStyle,
      orientationDirection,
      pinnedState,
      position
    ]
  );
  const {
    resolvedPosition,
    isHorizontalDockZone,
    isVerticalDockZone,
    tieredOpenToLeft,
    isMegaMenuStyle,
    dockAlign,
    sidebarWidthCss
  } = layoutState;

  const hideMenuHint = React.useCallback(() => {
    menuHintAnchorRef.current = null;
    setMenuHint(null);
  }, []);

  const resolveMenuHintPosition = React.useCallback((anchor: MenuHintAnchor) => {
    const rect = anchor.target.getBoundingClientRect();
    return resolveMenuHintPositionHelper({
      isConnected: anchor.target.isConnected,
      rect,
      placement: anchor.placement
    });
  }, []);

  const showMenuHint = React.useCallback(
    (target: HTMLElement, text: string | undefined, placement: MenuHintPlacement = "top") => {
      if (!text) return;

      const anchor: MenuHintAnchor = { target, text, placement };
      menuHintAnchorRef.current = anchor;
      const nextPosition = resolveMenuHintPosition(anchor);
      if (!nextPosition) {
        hideMenuHint();
        return;
      }

      setMenuHint({
        text: anchor.text,
        placement: anchor.placement,
        ...nextPosition
      });
    },
    [hideMenuHint, resolveMenuHintPosition]
  );

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
    if (menuStyle !== "hybrid") return;
    if (!pinnedState || !drawerOpen) return;
    setDrawerOpen(false);
  }, [drawerOpen, pinnedState, setDrawerOpen, menuStyle]);

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

  const effectiveActiveId = resolveEffectiveActiveId({
    activeId: selection?.activeId,
    activeUrl: selection?.activeUrl,
    localActiveId,
    firstByUrl: maps.firstByUrl
  });
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
      const next = mergeExpandedIdsForActivePath(prev, chain);
      return sameStringArray(prev, next) ? prev : next;
    });
  }, [effectiveActiveId, maps.parentById, setExpandedIds]);

  React.useEffect(() => {
    const nextState = resolveTieredActiveState({
      effectiveActiveId,
      maps,
      menu,
      rootParentId: ROOT_PARENT_ID
    });
    setTieredPath(nextState.tieredPath);
    setMegaActiveId(nextState.megaActiveId);
  }, [effectiveActiveId, maps, menu]);

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

  const hasVisibleMenuHint = menuHint !== null;

  React.useEffect(() => {
    if (!hasVisibleMenuHint || !menuHintAnchorRef.current) return;

    const reposition = () => {
      const anchor = menuHintAnchorRef.current;
      if (!anchor) return;

      const nextPosition = resolveMenuHintPosition(anchor);
      if (!nextPosition) {
        hideMenuHint();
        return;
      }

      setMenuHint({
        text: anchor.text,
        placement: anchor.placement,
        ...nextPosition
      });
    };

    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [hasVisibleMenuHint, hideMenuHint, resolveMenuHintPosition]);

  React.useEffect(() => {
    const anchor = menuHintAnchorRef.current;
    if (!anchor) return;
    if (!anchor.target.isConnected) hideMenuHint();
  }, [filteredMenu, effectiveMenuStyle, isCollapsed, drawerOpen, pinnedState, hideMenuHint]);

  const toggleExpanded = React.useCallback(
    (nodeId: string) => {
      setExpandedIds((prev) =>
        resolveExpandedIdsToggle({
          currentIds: prev,
          nodeId,
          mode,
          parentById: maps.parentById,
          childrenByParent: maps.childrenByParent,
          rootParentId: ROOT_PARENT_ID
        })
      );
    },
    [maps.childrenByParent, maps.parentById, mode, setExpandedIds]
  );

  const activateNode = React.useCallback(
    (node: SgMenuNode) => {
      if (node.disabled) return;
      hideMenuHint();
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

      if ((menuStyle === "drawer" || menuStyle === "hybrid") && hasUrl && closeOnNavigateResolved && !pinnedState) {
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
      menuStyle,
      hideMenuHint
    ]
  );

  const handleDockDragPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      if (!dockMode || !dock || !draggable || !effectiveDockZone) return;

      event.preventDefault();
      event.stopPropagation();
      const shellRectBeforeDrag = sidebarShellRef.current?.getBoundingClientRect() ?? null;
      dock.setDropPreviewActive(true);
      setDockDragActive(true);
      dockDragStartRef.current = { x: event.clientX, y: event.clientY };
      dockDragMovedRef.current = false;
      dockHoverZoneRef.current = dock.getZoneAtPoint(event.clientX, event.clientY) ?? effectiveDockZone;
      applyDockDragVisual(0, 0);

      if (shellRectBeforeDrag) {
        window.requestAnimationFrame(() => {
          const shell = sidebarShellRef.current;
          const start = dockDragStartRef.current;
          if (!shell || !start) return;
          const shellRectAfterDrag = shell.getBoundingClientRect();
          const adjustDx = shellRectBeforeDrag.left - shellRectAfterDrag.left;
          const adjustDy = shellRectBeforeDrag.top - shellRectAfterDrag.top;
          if (Math.abs(adjustDx) < 0.5 && Math.abs(adjustDy) < 0.5) return;
          start.x -= adjustDx;
          start.y -= adjustDy;
          applyDockDragVisual(adjustDx, adjustDy);
        });
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
              setHorizontalDockAlign(resolveHorizontalDockAlign(upEvent.clientX, zoneRect));
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
      const action = resolveMenuKeyboardAction({
        key: event.key,
        visibleNodes,
        focusedId,
        expandedIds: expandedSet,
        hasSearch,
        isCollapsed,
        parentById: maps.parentById,
        rootParentId: ROOT_PARENT_ID
      });
      if (action.type === "noop") return;
      event.preventDefault();
      if (action.type === "focus") {
        focusById(action.id);
        return;
      }
      if (action.type === "toggle") {
        toggleExpanded(action.id);
        return;
      }
      const node = maps.nodeById.get(action.id);
      if (node) activateNode(node);
    },
    [
      activateNode,
      expandedSet,
      focusById,
      focusedId,
      hasSearch,
      isCollapsed,
      keyboardNavigation,
      maps.nodeById,
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
      const nodeHint = node.hint ?? (isCollapsed ? node.label : undefined);
      const nodeHintPlacement: MenuHintPlacement = "right";

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
            onMouseEnter={
              nodeHint
                ? (event) => showMenuHint(event.currentTarget, nodeHint, nodeHintPlacement)
                : undefined
            }
            onMouseLeave={nodeHint ? hideMenuHint : undefined}
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
                const intent = resolveMenuNodeActionIntent({
                  variant: "panel",
                  hasChildren,
                  hasActionTarget: Boolean(node.url || node.onClick),
                  isCollapsed
                });
                if (intent === "toggle") {
                  toggleExpanded(node.id);
                  return;
                }
                activateNode(node);
              }}
              className={cn(
                "min-w-0 flex-1 rounded-md",
                "flex items-center text-left",
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
                aria-label={openNow ? t(i18n, "components.actions.collapse") : t(i18n, "components.actions.expand")}
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
      hideMenuHint,
      showMenuHint,
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
          onMouseEnter={node.hint ? (event) => showMenuHint(event.currentTarget, node.hint) : undefined}
          onMouseLeave={node.hint ? hideMenuHint : undefined}
          onClick={() => {
            if (node.disabled) return;
            const intent = resolveMenuNodeActionIntent({
              variant: "flat",
              hasChildren,
              hasActionTarget: Boolean(node.url || node.onClick)
            });
            if (intent === "noop") return;
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
    [activateNode, activeSets.branch, activeSets.exact, densityCfg.icon, hideMenuHint, showMenuHint]
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
                  onMouseEnter={(event) => {
                    if (node.hint) showMenuHint(event.currentTarget, node.hint);
                    setTieredPath((prev) =>
                      resolveTieredHoverIntent({
                        currentPath: prev,
                        depth,
                        nodeId: node.id,
                        hasChildren,
                        openSubmenuOnHover
                      }) ?? prev
                    );
                  }}
                  onMouseLeave={node.hint ? hideMenuHint : undefined}
                  onClick={() => {
                    if (node.disabled) return;
                    const nextState = resolveTieredNodeClickIntent({
                      currentPath: tieredPath,
                      depth,
                      nodeId: node.id,
                      hasChildren,
                      hasActionTarget: Boolean(node.url || node.onClick)
                    });
                    if (hasChildren) {
                      setTieredPath(nextState.nextPath);
                    }
                    if (!nextState.shouldActivateNode) return;
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
    [
      activateNode,
      activeSets.exact,
      densityCfg.icon,
      hideMenuHint,
      openSubmenuOnHover,
      showMenuHint,
      tieredOpenToLeft,
      tieredPath
    ]
  );

  const renderMegaColumns = React.useCallback(
    (nodes: SgMenuNode[]) => {
      if (!nodes.length) {
        return <div className="text-sm text-muted-foreground">{t(i18n, "components.menu.empty")}</div>;
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
      return <div className="px-3 py-2 text-xs text-muted-foreground">{t(i18n, "components.menu.empty")}</div>;
    }

    if (effectiveMenuStyle === "panel") {
      return <div className="space-y-0.5">{items.map((node) => renderNode(node, 0))}</div>;
    }

    if (effectiveMenuStyle === "tiered") {
      return <div className="relative min-h-[120px]">{renderTieredLevels(items, 0)}</div>;
    }

    const activeMegaNode = resolveMegaMenuActiveNode(items, megaActiveId);

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
                  onMouseEnter={(event) => {
                    if (node.hint) showMenuHint(event.currentTarget, node.hint);
                    const nextMegaActiveId = resolveMegaMenuHoverActiveId({
                      nodeId: node.id,
                      hasChildren
                    });
                    if (nextMegaActiveId) setMegaActiveId(nextMegaActiveId);
                  }}
                  onMouseLeave={node.hint ? hideMenuHint : undefined}
                  onClick={() => {
                    if (node.disabled) return;
                    const nextState = resolveMegaMenuInteraction({
                      nodeId: node.id,
                      hasChildren
                    });
                    if (nextState.nextMegaActiveId) {
                      setMegaActiveId(nextState.nextMegaActiveId);
                    }
                    if (!nextState.shouldActivateNode) return;
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
                onMouseEnter={(event) => {
                  if (node.hint) showMenuHint(event.currentTarget, node.hint);
                  const nextMegaActiveId = resolveMegaMenuHoverActiveId({
                    nodeId: node.id,
                    hasChildren
                  });
                  if (nextMegaActiveId) setMegaActiveId(nextMegaActiveId);
                }}
                onMouseLeave={node.hint ? hideMenuHint : undefined}
                onClick={() => {
                  if (node.disabled) return;
                  const nextState = resolveMegaMenuInteraction({
                    nodeId: node.id,
                    hasChildren
                  });
                  if (nextState.nextMegaActiveId) {
                    setMegaActiveId(nextState.nextMegaActiveId);
                  }
                  if (!nextState.shouldActivateNode) return;
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
    showCollapseButton && menuStyle !== "drawer" ? (
      <button
        type="button"
        onClick={() => {
          if (menuStyle === "hybrid") {
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
          menuStyle === "hybrid"
            ? pinnedState
              ? t(i18n, "components.menu.unpinAndCollapse")
              : drawerOpen
              ? t(i18n, "components.menu.close")
              : t(i18n, "components.menu.open")
            : collapsedState
            ? t(i18n, "components.menu.expand")
            : t(i18n, "components.menu.collapse")
        }
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
          "bg-background hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        )}
      >
        <CollapseIcon
          collapsed={menuStyle === "hybrid" ? !(pinnedState || drawerOpen) : collapsedState}
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
            "min-w-0 rounded-md",
            isHorizontalDockZone ? "flex-none" : "flex-1",
            "flex items-center gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          )}
        >
          {brand.image ? (
            <span className="inline-flex shrink-0 items-center justify-center">{brand.image}</span>
          ) : brand.imageSrc ? (
            <img src={brand.imageSrc} alt={brand.title ?? t(i18n, "components.menu.brandAlt")} className={cn("w-auto", isHorizontalDockZone ? "h-7 max-w-[120px]" : "h-12 max-w-[160px]")} />
          ) : null}
          {brand.title ? (
            <span className="truncate text-sm font-semibold">{brand.title}</span>
          ) : null}
        </button>
      ) : showBrandSpacer ? (
        <div className="flex-1" />
      ) : null}

      {showDockDragHandle ? (
        <button
          type="button"
          onPointerDown={handleDockDragPointerDown}
          aria-label={t(i18n, "components.menu.drag")}
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
            if (menuStyle === "hybrid" && next) setDrawerOpen(false);
          }}
          aria-label={pinnedState ? t(i18n, "components.menu.unpin") : t(i18n, "components.menu.pin")}
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
            label={search?.placeholder ?? t(i18n, "components.actions.search")}
            placeholder={search?.placeholder ?? t(i18n, "components.actions.search")}
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
              const nextState = resolveMenuSearchSelectionState({
                currentExpandedIds: expandedIds,
                parentChain,
                rootToParent,
                nodeId: node.id,
                hasChildren: Boolean(node.children?.length),
                hasActionTarget: Boolean(node.url || node.onClick)
              });

              setExpandedIds((prev) => {
                const next = nextState.expandedIds;
                return sameStringArray(prev, next) ? prev : next;
              });
              setTieredPath(nextState.tieredPath);
              setMegaActiveId(nextState.megaActiveId);

              if (!nextState.shouldActivateNode) {
                setLocalActiveId(nextState.localActiveId);
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
        aria-label={resolvedAriaLabel}
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
                cardStyle="outlined"
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

  const dockAlignStyle: React.CSSProperties | undefined =
    dockAlign === "end"
      ? { alignSelf: "flex-end" }
      : dockAlign === "start"
      ? { alignSelf: "flex-start" }
      : undefined;

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
          !dockDragActive ? "self-stretch" : "",
          !dockDragActive && horizontalDockAlign === "right" ? "ml-auto" : "",
          border ? "border border-border" : "",
          elevationClass(elevation),
          className
        )}
        style={{
          width: !isHorizontalDockZone && isCollapsed ? collapsedWidthCss : expandedWidthCss,
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

  const menuHintNode =
    menuHint && typeof document !== "undefined"
      ? createPortal(
          <span
            className="pointer-events-none fixed z-[1200] max-w-[min(28rem,calc(100vw-24px))] rounded bg-foreground/90 px-2 py-1 text-[11px] text-background shadow-md whitespace-normal break-words"
            style={{
              left: menuHint.x,
              top: menuHint.y,
              transform: menuHint.placement === "right" ? "translateY(-50%)" : "translate(-50%, -100%)"
            }}
          >
            {menuHint.text}
          </span>,
          document.body
        )
      : null;

  if (dockMode && portalTarget) {
    return (
      <>
        {createPortal(shellForRender, portalTarget)}
        {menuHintNode}
      </>
    );
  }

  if (menuStyle === "drawer") {
    return (
      <>
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
          ariaLabel={resolvedAriaLabel}
          role="dialog"
          className={className}
          style={style}
        >
          {shellBody}
        </SgExpandablePanel>
        {menuHintNode}
      </>
    );
  }

  if (menuStyle === "hybrid") {
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
            ariaLabel={resolvedAriaLabel}
            role="dialog"
          >
            <SgMenu
              menu={menu}
              selection={{ activeId: effectiveActiveId, activeUrl: effectiveActiveUrl }}
              brand={brand}
              user={user}
              userMenu={userMenu}
              menuStyle="inline"
              menuVariantStyle={menuVariantStyle}
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
              ariaLabel={resolvedAriaLabel}
              keyboardNavigation={keyboardNavigation}
              openSubmenuOnHover={openSubmenuOnHover}
              search={search}
              elevation="none"
              border={false}
              footer={footer}
            />
          </SgExpandablePanel>
        ) : null}
        {menuHintNode}
      </>
    );
  }

  return (
    <>
      {shellForRender}
      {menuHintNode}
    </>
  );
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












