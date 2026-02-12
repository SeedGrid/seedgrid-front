import type { PersistenceStrategy } from "@seedgrid/fe-core";

export type Mode = "light" | "dark" | "auto";

export type SeedThemeInput = {
  seed: string; // "#RRGGBB"
  mode?: Mode; // default "light"
  radius?: number; // px
  // optional direct semantic colors (hex). If missing, auto-generated.
  warning?: string;
  error?: string;
  info?: string;
  success?: string;
  // overrides: pass complete CSS variables to force
  customVars?: Record<string, string>;
  // persistPreference: if true saves mode choice in localStorage
  persistMode?: boolean;
  // optional persistence strategy (defaults to localStorage)
  persistenceStrategy?: PersistenceStrategy;
};

export type ThemeVars = Record<string, string>;

export type ThemeContextValue = {
  vars: ThemeVars;
  setTheme: (next: Partial<SeedThemeInput>) => void;
  setMode: (m: Exclude<Mode, "auto">) => void;
  currentMode: "light" | "dark";
  currentTheme: Pick<SeedThemeInput, "seed" | "mode" | "radius">;
};

// Legacy type for backward compatibility
export type SeedGridThemeConfig = {
  brand: {
    name: string;
    logoUrl?: string;
  };
  colors: {
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    tertiary: string;
    onTertiary: string;
    error: string;
    onError: string;
    accent: string;
    background: string;
    foreground: string;
  };
  layout: {
    sidebarWidth: number;
    radius: number;
  };
};

export const defaultTheme: SeedGridThemeConfig = {
  brand: { name: "SeedGrid" },
  colors: {
    primary: "142 76% 36%",
    onPrimary: "0 0% 100%",
    secondary: "262 83% 58%",
    onSecondary: "0 0% 100%",
    tertiary: "173 80% 40%",
    onTertiary: "0 0% 100%",
    error: "0 65% 51%",
    onError: "0 0% 100%",
    accent: "152 57% 40%",
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%"
  },
  layout: {
    sidebarWidth: 260,
    radius: 12
  }
};

export const defaultSeedTheme: SeedThemeInput = {
  seed: "#16803D", // Verde SeedGrid
  mode: "light",
  radius: 12,
  persistMode: true
};
