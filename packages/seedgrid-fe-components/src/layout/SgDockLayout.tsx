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

type DockContextValue = {
  layoutId: string;
  getZoneElement: (zone: SgDockZoneId) => HTMLDivElement | null;
  registerZone: (zone: SgDockZoneId, el: HTMLDivElement | null) => void;
  getZoneAtPoint: (x: number, y: number) => SgDockZoneId | null;
  getToolbarZone: (id: string) => SgDockZoneId | null;
  moveToolbar: (id: string, zone: SgDockZoneId) => void;
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

  const zonesRef = React.useRef<ZoneRegistry>(new Map());

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

  const getToolbarZone = React.useCallback(
    (toolbarId: string) => persisted.toolbars[toolbarId]?.zone ?? null,
    [persisted]
  );

  const ensureToolbar = React.useCallback(
    (toolbarId: string, state: Partial<SgDockToolbarState>) => {
      setValue((prev) => {
        if (prev.toolbars[toolbarId]) return prev;
        return {
          ...prev,
          toolbars: {
            ...prev.toolbars,
            [toolbarId]: {
              id: toolbarId,
              zone: state.zone ?? "free",
              collapsed: state.collapsed ?? false,
              orientation: state.orientation,
              order: state.order ?? Object.keys(prev.toolbars).length
            }
          }
        };
      });
    },
    [setValue]
  );

  const moveToolbar = React.useCallback(
    (toolbarId: string, zone: SgDockZoneId) => {
      setValue((prev) => {
        const current = prev.toolbars[toolbarId];
        if (!current) return prev;
        return {
          ...prev,
          toolbars: {
            ...prev.toolbars,
            [toolbarId]: {
              ...current,
              zone
            }
          }
        };
      });
    },
    [setValue]
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
    getToolbarZone,
    moveToolbar,
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
