import type React from "react";

export type SgClockThemeRenderArgs = {
  size: number;
  dark: boolean;
};

export type SgClockTheme = {
  id: string;
  label?: string;
  tags?: string[];
  render?: (args: SgClockThemeRenderArgs) => React.ReactNode;
  url?: string;
  order?: number;
};

export type SgClockThemeResolveMode = "strict" | "fallback";

export type SgClockThemeResolver = {
  resolve: (id: string) => SgClockTheme | null;
  list: () => SgClockTheme[];
  registerLocal: (theme: SgClockTheme) => void;
  registerManyLocal: (themes: SgClockTheme[]) => void;
};
