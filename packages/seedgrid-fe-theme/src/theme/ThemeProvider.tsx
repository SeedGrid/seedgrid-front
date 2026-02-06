"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { SeedGridThemeConfig } from "./ThemeConfig";
import { defaultTheme } from "./ThemeConfig";

type ThemeCtx = { theme: SeedGridThemeConfig };

const ThemeContext = createContext<ThemeCtx | null>(null);

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

export function ThemeProvider(props: { children: React.ReactNode; theme?: Partial<SeedGridThemeConfig> }) {
  const theme = useMemo<SeedGridThemeConfig>(() => {
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
        accent: normalizeHsl(merged.colors.accent),
        background: normalizeHsl(merged.colors.background),
        foreground: normalizeHsl(merged.colors.foreground)
      }
    };
  }, [props.theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div
        style={
          {
            "--background": theme.colors.background,
            "--foreground": theme.colors.foreground,
            "--primary": theme.colors.primary,
            "--accent": theme.colors.accent,
            "--ring": theme.colors.primary,
            "--radius": `${theme.layout.radius}px`,
            "--sg-primary": `hsl(${theme.colors.primary})`,
            "--sg-accent": `hsl(${theme.colors.accent})`,
            "--sg-bg": `hsl(${theme.colors.background})`,
            "--sg-fg": `hsl(${theme.colors.foreground})`,
            "--sg-radius": `${theme.layout.radius}px`,
            "--sg-sidebar": `${theme.layout.sidebarWidth}px`
          } as React.CSSProperties
        }
      >
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx.theme;
}
