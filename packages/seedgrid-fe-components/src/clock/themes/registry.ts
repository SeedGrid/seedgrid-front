import type { SgClockTheme } from "./types";

const globalMap = new Map<string, SgClockTheme>();

export function registerTheme(theme: SgClockTheme) {
  if (!theme?.id) throw new Error("registerTheme: theme.id is required");
  globalMap.set(theme.id, theme);
}

export function registerThemes(themes: SgClockTheme[]) {
  for (const theme of themes) registerTheme(theme);
}

export function getTheme(id: string): SgClockTheme | null {
  return globalMap.get(id) ?? null;
}

export function hasTheme(id: string): boolean {
  return globalMap.has(id);
}

export function listThemes(): SgClockTheme[] {
  return Array.from(globalMap.values()).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function unregisterTheme(id: string) {
  globalMap.delete(id);
}

export function clearThemes() {
  globalMap.clear();
}
