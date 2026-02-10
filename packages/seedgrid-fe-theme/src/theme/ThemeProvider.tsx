"use client";

import React from "react";
import type { SeedThemeInput, ThemeContextValue, Mode } from "./ThemeConfig";
import { defaultSeedTheme } from "./ThemeConfig";
import { generateThemeVars, getSystemMode } from "./themeGenerator";
import { generateComponentTokens } from "./componentTokens";

/* ------------- React Provider ------------- */

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useSgTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useSgTheme must be used within SeedThemeProvider");
  return ctx;
}

export function SeedThemeProvider({
  initialTheme,
  children,
  applyTo = "html",
}: {
  initialTheme?: SeedThemeInput;
  children: React.ReactNode;
  applyTo?: "html" | "wrapper";
}) {
  const persistedModeKey = "sg:theme:mode";
  const persistedThemeKey = "sg:theme:config";

  // Try to load persisted theme from localStorage
  const getPersistedTheme = React.useCallback((): SeedThemeInput | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(persistedThemeKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that it has at least a seed
        if (parsed && typeof parsed.seed === "string") {
          return parsed;
        }
      }
    } catch {}
    return null;
  }, []);

  // Merge persisted theme with initial theme (persisted takes precedence)
  const mergedInitialTheme = React.useMemo(() => {
    const persisted = getPersistedTheme();
    const base = initialTheme ?? defaultSeedTheme;

    if (persisted) {
      // Merge: persisted overrides initial, but keep persistMode from initial
      return {
        ...base,
        ...persisted,
        persistMode: base.persistMode, // Keep persistMode from initial config
      };
    }
    return base;
  }, [initialTheme, getPersistedTheme]);

  // Resolve initial mode: if auto, detect system (or localStorage if persisted)
  const initialResolvedMode = React.useMemo(() => {
    const theme = mergedInitialTheme;
    const m = theme.mode ?? "light";
    if (m === "auto") {
      // If persisted, prefer it
      try {
        const persisted = typeof window !== "undefined" ? localStorage.getItem(persistedModeKey) : null;
        if (persisted === "light" || persisted === "dark") return persisted;
      } catch {}
      return getSystemMode();
    }
    return m;
  }, [mergedInitialTheme]) as "light" | "dark";

  const [mode, setModeState] = React.useState<"light" | "dark">(initialResolvedMode);
  const [themeInput, setThemeInput] = React.useState<SeedThemeInput>(mergedInitialTheme);

  const vars = React.useMemo(() => {
    const baseVars = generateThemeVars(themeInput, mode);
    const componentVars = generateComponentTokens(baseVars);
    return { ...baseVars, ...componentVars };
  }, [themeInput, mode]);

  // Apply CSS vars
  React.useEffect(() => {
    const el = applyTo === "html" ? document.documentElement : null;
    if (!el) return;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  }, [vars, applyTo]);

  // Optionally persist mode and theme
  React.useEffect(() => {
    if (themeInput.persistMode) {
      try {
        localStorage.setItem(persistedModeKey, mode);
        // Also persist the full theme config (seed, radius, etc.)
        const themeToStore = {
          seed: themeInput.seed,
          mode: themeInput.mode,
          radius: themeInput.radius,
        };
        localStorage.setItem(persistedThemeKey, JSON.stringify(themeToStore));
      } catch {}
    }
  }, [mode, themeInput, persistedModeKey, persistedThemeKey]);

  // Listen for system changes when initial mode = auto
  React.useEffect(() => {
    if (themeInput.mode !== "auto") return;
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (ev: MediaQueryListEvent) => setModeState(ev.matches ? "dark" : "light");
    mq.addEventListener ? mq.addEventListener("change", handler) : (mq as any).addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : (mq as any).removeListener(handler);
    };
  }, [themeInput.mode]);

  const setTheme = React.useCallback((next: Partial<SeedThemeInput>) => {
    setThemeInput((prev) => ({ ...prev, ...next }));
    // If next.mode is explicit light/dark set it too
    if (next.mode && next.mode !== "auto") setModeState(next.mode);
    else if (next.mode === "auto") setModeState(getSystemMode());
  }, []);

  const setMode = React.useCallback((m: Exclude<Mode, "auto">) => {
    setModeState(m);
    if (themeInput.persistMode) {
      try { localStorage.setItem(persistedModeKey, m); } catch {}
    }
  }, [themeInput.persistMode, persistedModeKey]);

  // Export currentMode normalized (no "auto")
  const currentMode = mode;

  if (applyTo === "wrapper") {
    return (
      <ThemeContext.Provider value={{ vars, setTheme, setMode, currentMode }}>
        <div style={Object.fromEntries(Object.entries(vars).map(([k, v]) => [k as any, v])) as React.CSSProperties}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ vars, setTheme, setMode, currentMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ------------- Legacy ThemeProvider for backward compatibility ------------- */

import type { SeedGridThemeConfig } from "./ThemeConfig";
import { defaultTheme } from "./ThemeConfig";

type ThemeCtx = { theme: SeedGridThemeConfig };

const LegacyThemeContext = React.createContext<ThemeCtx | null>(null);

function hexToHsl(hex: string) {
  const cleaned = hex.replace("#", "").trim();
  const full = cleaned.length === 3
    ? cleaned.split("").map((c) => c + c).join("")
    : cleaned.padEnd(6, "0");

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  return `${hDeg} ${sPct}% ${lPct}%`;
}

function normalizeHsl(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) return hexToHsl(trimmed);
  if (trimmed.startsWith("hsl")) {
    return trimmed.replace(/hsl\(|\)/g, "").replace(/,/g, " ").replace(/\s+/g, " ").trim();
  }
  return trimmed;
}

/**
 * @deprecated Use SeedThemeProvider instead
 */
export function ThemeProvider(props: { children: React.ReactNode; theme?: Partial<SeedGridThemeConfig> }) {
  const theme = React.useMemo<SeedGridThemeConfig>(() => {
    const merged: SeedGridThemeConfig = {
      ...defaultTheme,
      ...props.theme,
      brand: { ...defaultTheme.brand, ...(props.theme?.brand ?? {}) },
      colors: { ...defaultTheme.colors, ...(props.theme?.colors ?? {}) },
      layout: { ...defaultTheme.layout, ...(props.theme?.layout ?? {}) }
    };

    return {
      ...merged,
      colors: {
        primary: normalizeHsl(merged.colors.primary),
        onPrimary: normalizeHsl(merged.colors.onPrimary),
        secondary: normalizeHsl(merged.colors.secondary),
        onSecondary: normalizeHsl(merged.colors.onSecondary),
        tertiary: normalizeHsl(merged.colors.tertiary),
        onTertiary: normalizeHsl(merged.colors.onTertiary),
        error: normalizeHsl(merged.colors.error),
        onError: normalizeHsl(merged.colors.onError),
        accent: normalizeHsl(merged.colors.accent),
        background: normalizeHsl(merged.colors.background),
        foreground: normalizeHsl(merged.colors.foreground)
      }
    };
  }, [props.theme]);

  return (
    <LegacyThemeContext.Provider value={{ theme }}>
      <div
        style={
          {
            "--background": theme.colors.background,
            "--foreground": theme.colors.foreground,
            "--primary": theme.colors.primary,
            "--primary-foreground": theme.colors.onPrimary,
            "--secondary": theme.colors.secondary,
            "--secondary-foreground": theme.colors.onSecondary,
            "--tertiary": theme.colors.tertiary,
            "--tertiary-foreground": theme.colors.onTertiary,
            "--accent": theme.colors.accent,
            "--destructive": theme.colors.error,
            "--destructive-foreground": theme.colors.onError,
            "--ring": theme.colors.primary,
            "--radius": `${theme.layout.radius}px`,
            "--sg-primary": `hsl(${theme.colors.primary})`,
            "--sg-accent": `hsl(${theme.colors.accent})`,
            "--sg-bg": `hsl(${theme.colors.background})`,
            "--sg-fg": `hsl(${theme.colors.foreground})`,
            "--sg-radius": `${theme.layout.radius}px`,
            "--sg-sidebar": `${theme.layout.sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {props.children}
      </div>
    </LegacyThemeContext.Provider>
  );
}

/**
 * @deprecated Use useSgTheme instead
 */
export function useTheme() {
  const ctx = React.useContext(LegacyThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx.theme;
}
