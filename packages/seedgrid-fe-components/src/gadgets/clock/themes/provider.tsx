"use client";

import * as React from "react";
import type { SgClockTheme, SgClockThemeResolveMode, SgClockThemeResolver } from "./types";
import { getTheme, listThemes as listGlobalThemes } from "./registry";

type SgClockThemeProviderValue = {
  mode?: SgClockThemeResolveMode;
  fallbackThemeId?: string;
  themes?: SgClockTheme[];
};

const SgClockThemeContext = React.createContext<SgClockThemeResolver | null>(null);

export function useSgClockThemeResolver() {
  return React.useContext(SgClockThemeContext);
}

export function createThemeResolver(params?: {
  mode?: SgClockThemeResolveMode;
  fallbackThemeId?: string;
  localThemes?: SgClockTheme[];
}): SgClockThemeResolver {
  const mode: SgClockThemeResolveMode = params?.mode ?? "fallback";
  const fallbackThemeId = params?.fallbackThemeId ?? "classic";

  const localMap = new Map<string, SgClockTheme>();
  (params?.localThemes ?? []).forEach((t) => localMap.set(t.id, t));

  const resolveStrict = (id: string) => localMap.get(id) ?? getTheme(id);

  return {
    resolve(id: string) {
      const found = resolveStrict(id);
      if (found) return found;
      if (mode === "strict") return null;
      if (id !== fallbackThemeId) return resolveStrict(fallbackThemeId);
      return null;
    },

    list() {
      const merged = new Map<string, SgClockTheme>();
      for (const g of listGlobalThemes()) merged.set(g.id, g);
      for (const [k, v] of localMap.entries()) merged.set(k, v);
      return Array.from(merged.values()).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    },

    registerLocal(theme: SgClockTheme) {
      if (!theme?.id) throw new Error("registerLocal: theme.id is required");
      localMap.set(theme.id, theme);
    },

    registerManyLocal(themes: SgClockTheme[]) {
      for (const t of themes) this.registerLocal(t);
    }
  };
}

export function SgClockThemeProvider({
  value,
  children
}: {
  value?: SgClockThemeProviderValue;
  children: React.ReactNode;
}) {
  const resolver = React.useMemo(() => {
    return createThemeResolver({
      mode: value?.mode ?? "fallback",
      fallbackThemeId: value?.fallbackThemeId ?? "classic",
      localThemes: value?.themes ?? []
    });
  }, [value?.mode, value?.fallbackThemeId, value?.themes]);

  return <SgClockThemeContext.Provider value={resolver}>{children}</SgClockThemeContext.Provider>;
}
