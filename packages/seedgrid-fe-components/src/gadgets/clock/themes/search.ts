import type { SgClockTheme, SgClockThemeResolver } from "./types";

export function filterClockThemes(themes: SgClockTheme[], query: string) {
  const s = query.trim().toLowerCase();
  if (!s) return themes;
  return themes.filter((theme) => {
    const hay = `${theme.id} ${theme.label ?? ""} ${(theme.tags ?? []).join(" ")}`.toLowerCase();
    return hay.includes(s);
  });
}

export function resolveClockThemeSelection(params: {
  resolver?: SgClockThemeResolver | null;
  allThemes: SgClockTheme[];
  value: string;
  fallbackThemeId: string;
}) {
  const found = params.resolver?.resolve(params.value) ?? params.allThemes.find((t) => t.id === params.value) ?? null;
  if (found) return found;
  return params.resolver?.resolve(params.fallbackThemeId) ?? params.allThemes.find((t) => t.id === params.fallbackThemeId) ?? null;
}
