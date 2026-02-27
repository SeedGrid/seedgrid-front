"use client";

import * as React from "react";
import { useSgPersistentState } from "../environment/SgEnvironmentProvider";

export type SgDockZoneId = "top" | "bottom" | "left" | "right" | "free";

export type SgDockToolbarState = {
  id: string;
  zone: SgDockZoneId;
  collapsed?: boolean;
  orientation?: "horizontal" | "vertical";
  order?: number;
};

export type SgDockLayoutState = {
  version: 1;
  toolbars: Record<string, SgDockToolbarState>;
};

export type SgDockLayoutProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  defaultState?: SgDockLayoutState;
};

type ZoneRegistry = Map<SgDockZoneId, HTMLDivElement>;

export type SgDockDropIndicator = {
  zone: SgDockZoneId;
  index: number;
};

type DockContextValue = {
  layoutId: string;
  getZoneElement: (zone: SgDockZoneId) => HTMLDivElement | null;
  registerZone: (zone: SgDockZoneId, el: HTMLDivElement | null) => void;
  getZoneAtPoint: (x: number, y: number) => SgDockZoneId | null;
  getDropPlacementAtPoint: (x: number, y: number, draggingToolbarId: string) => SgDockDropIndicator | null;
  getZoneToolbarCount: (zone: SgDockZoneId) => number;
  isDropPreviewActive: boolean;
  setDropPreviewActive: (next: boolean) => void;
  draggingToolbarId: string | null;
  setDraggingToolbarId: (toolbarId: string | null) => void;
  dropIndicator: SgDockDropIndicator | null;
  setDropIndicator: (next: SgDockDropIndicator | null) => void;
  getToolbarZone: (id: string) => SgDockZoneId | null;
  getToolbarOrder: (id: string) => number | undefined;
  moveToolbar: (id: string, zone: SgDockZoneId) => void;
  placeToolbar: (id: string, zone: SgDockZoneId, index: number) => void;
  ensureToolbar: (id: string, state: Partial<SgDockToolbarState>) => void;
  getToolbarCollapsed: (id: string) => boolean | undefined;
  setToolbarCollapsed: (id: string, next: boolean) => void;
};

const DockContext = React.createContext<DockContextValue | null>(null);

export function useSgDockLayout() {
  return React.useContext(DockContext);
}

const EMPTY_STATE: SgDockLayoutState = { version: 1, toolbars: {} };

export function SgDockLayout(props: Readonly<SgDockLayoutProps>) {
  const { id, className, children, defaultState } = props;
  const { value: persisted, setValue } = useSgPersistentState<SgDockLayoutState>({
    baseKey: `dock-layout:${id}`,
    defaultValue: defaultState ?? EMPTY_STATE
  });
  const [isDropPreviewActive, setIsDropPreviewActive] = React.useState(false);
  const [draggingToolbarId, setDraggingToolbarIdState] = React.useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = React.useState<SgDockDropIndicator | null>(null);

  const zonesRef = React.useRef<ZoneRegistry>(new Map());

  const getSortedZoneToolbarIds = React.useCallback(
    (
      state: Record<string, SgDockToolbarState>,
      zone: SgDockZoneId,
      excludingId?: string
    ) => {
      return Object.values(state)
        .filter((tb) => tb.zone === zone && tb.id !== excludingId)
        .sort((a, b) => {
          const orderA = a.order ?? 0;
          const orderB = b.order ?? 0;
          if (orderA !== orderB) return orderA - orderB;
          return a.id.localeCompare(b.id);
        })
        .map((tb) => tb.id);
    },
    []
  );

  const registerZone = React.useCallback((zone: SgDockZoneId, el: HTMLDivElement | null) => {
    if (!el) {
      zonesRef.current.delete(zone);
      return;
    }
    zonesRef.current.set(zone, el);
  }, []);

  const getZoneElement = React.useCallback((zone: SgDockZoneId) => {
    return zonesRef.current.get(zone) ?? null;
  }, []);

  const getZoneAtPoint = React.useCallback((x: number, y: number) => {
    for (const [zone, el] of zonesRef.current.entries()) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return zone;
      }
    }
    return null;
  }, []);

  const getDropPlacementAtPoint = React.useCallback(
    (x: number, y: number, draggingToolbarId: string): SgDockDropIndicator | null => {
      const zone = getZoneAtPoint(x, y);
      if (!zone) return null;
      const zoneEl = zonesRef.current.get(zone);
      if (!zoneEl) return null;

      const axisHorizontal = zone === "top" || zone === "bottom";
      const toolbarEls = Array.from(
        zoneEl.querySelectorAll<HTMLElement>("[data-sg-toolbar-root='true'][data-sg-toolbar-id]")
      )
        .filter((el) => el.dataset.sgToolbarId !== draggingToolbarId)
        .sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();
          if (axisHorizontal) {
            if (rectA.top !== rectB.top) return rectA.top - rectB.top;
            return rectA.left - rectB.left;
          }
          if (rectA.left !== rectB.left) return rectA.left - rectB.left;
          return rectA.top - rectB.top;
        });

      const cursorMajor = axisHorizontal ? x : y;
      let index = toolbarEls.length;
      for (let i = 0; i < toolbarEls.length; i += 1) {
        const toolbarEl = toolbarEls[i];
        if (!toolbarEl) continue;
        const rect = toolbarEl.getBoundingClientRect();
        const majorCenter = axisHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
        if (cursorMajor < majorCenter) {
          index = i;
          break;
        }
      }

      return { zone, index };
    },
    [getZoneAtPoint]
  );

  const setDropPreviewActive = React.useCallback((next: boolean) => {
    setIsDropPreviewActive((prev) => (prev === next ? prev : next));
    if (!next) {
      setDropIndicator(null);
      setDraggingToolbarIdState(null);
    }
  }, []);

  const setDraggingToolbarId = React.useCallback((toolbarId: string | null) => {
    setDraggingToolbarIdState((prev) => (prev === toolbarId ? prev : toolbarId));
  }, []);

  React.useEffect(() => {
    if (!isDropPreviewActive) return;

    const clearPreview = () => setDropPreviewActive(false);
    const handleVisibilityChange = () => {
      if (document.hidden) clearPreview();
    };

    window.addEventListener("pointerup", clearPreview);
    window.addEventListener("pointercancel", clearPreview);
    window.addEventListener("blur", clearPreview);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointerup", clearPreview);
      window.removeEventListener("pointercancel", clearPreview);
      window.removeEventListener("blur", clearPreview);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isDropPreviewActive, setDropPreviewActive]);

  const getToolbarZone = React.useCallback(
    (toolbarId: string) => persisted.toolbars[toolbarId]?.zone ?? null,
    [persisted]
  );

  const getToolbarOrder = React.useCallback(
    (toolbarId: string) => {
      const toolbar = persisted.toolbars[toolbarId];
      if (!toolbar) return undefined;
      if (draggingToolbarId && toolbarId === draggingToolbarId) return undefined;
      const ids = getSortedZoneToolbarIds(
        persisted.toolbars,
        toolbar.zone,
        draggingToolbarId ?? undefined
      );
      const index = ids.indexOf(toolbarId);
      return index === -1 ? undefined : index;
    },
    [draggingToolbarId, getSortedZoneToolbarIds, persisted]
  );

  const getZoneToolbarCount = React.useCallback(
    (zone: SgDockZoneId) => {
      const zoneEl = zonesRef.current.get(zone);
      if (!zoneEl) return 0;
      return Array.from(
        zoneEl.querySelectorAll<HTMLElement>("[data-sg-toolbar-root='true'][data-sg-toolbar-id]")
      ).filter((el) => el.dataset.sgToolbarId !== draggingToolbarId).length;
    },
    [draggingToolbarId]
  );

  const ensureToolbar = React.useCallback(
    (toolbarId: string, state: Partial<SgDockToolbarState>) => {
      setValue((prev) => {
        if (prev.toolbars[toolbarId]) return prev;
        const targetZone = state.zone ?? "free";
        const zoneIds = getSortedZoneToolbarIds(prev.toolbars, targetZone);
        return {
          ...prev,
          toolbars: {
            ...prev.toolbars,
            [toolbarId]: {
              id: toolbarId,
              zone: targetZone,
              collapsed: state.collapsed ?? false,
              orientation: state.orientation,
              order: state.order ?? zoneIds.length
            }
          }
        };
      });
    },
    [getSortedZoneToolbarIds, setValue]
  );

  const placeToolbar = React.useCallback(
    (toolbarId: string, zone: SgDockZoneId, index: number) => {
      setValue((prev) => {
        const current = prev.toolbars[toolbarId];
        if (!current) return prev;
        const sourceZone = current.zone;
        const targetZone = zone;
        const nextToolbars: Record<string, SgDockToolbarState> = {
          ...prev.toolbars
        };

        const targetIds = getSortedZoneToolbarIds(prev.toolbars, targetZone, toolbarId);
        const safeIndex = Math.max(0, Math.min(index, targetIds.length));
        targetIds.splice(safeIndex, 0, toolbarId);

        targetIds.forEach((tbId, i) => {
          const base = nextToolbars[tbId];
          if (!base) return;
          nextToolbars[tbId] = { ...base, zone: targetZone, order: i };
        });

        if (sourceZone !== targetZone) {
          const sourceIds = getSortedZoneToolbarIds(prev.toolbars, sourceZone, toolbarId);
          sourceIds.forEach((tbId, i) => {
            const base = nextToolbars[tbId];
            if (!base) return;
            nextToolbars[tbId] = { ...base, order: i };
          });
        }

        return {
          ...prev,
          toolbars: nextToolbars
        };
      });
    },
    [getSortedZoneToolbarIds, setValue]
  );

  const moveToolbar = React.useCallback(
    (toolbarId: string, zone: SgDockZoneId) => {
      const currentZoneIds = getSortedZoneToolbarIds(persisted.toolbars, zone, toolbarId);
      placeToolbar(toolbarId, zone, currentZoneIds.length);
    },
    [getSortedZoneToolbarIds, persisted.toolbars, placeToolbar]
  );

  const getToolbarCollapsed = React.useCallback(
    (toolbarId: string) => persisted.toolbars[toolbarId]?.collapsed,
    [persisted]
  );

  const setToolbarCollapsed = React.useCallback(
    (toolbarId: string, next: boolean) => {
      setValue((prev) => {
        const current = prev.toolbars[toolbarId];
        if (!current) return prev;
        return {
          ...prev,
          toolbars: {
            ...prev.toolbars,
            [toolbarId]: { ...current, collapsed: next }
          }
        };
      });
    },
    [setValue]
  );

  const ctx: DockContextValue = {
    layoutId: id,
    getZoneElement,
    registerZone,
    getZoneAtPoint,
    getDropPlacementAtPoint,
    getZoneToolbarCount,
    isDropPreviewActive,
    setDropPreviewActive,
    draggingToolbarId,
    setDraggingToolbarId,
    dropIndicator,
    setDropIndicator,
    getToolbarZone,
    getToolbarOrder,
    moveToolbar,
    placeToolbar,
    ensureToolbar,
    getToolbarCollapsed,
    setToolbarCollapsed
  };

  return (
    <DockContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </DockContext.Provider>
  );
}

SgDockLayout.displayName = "SgDockLayout";
