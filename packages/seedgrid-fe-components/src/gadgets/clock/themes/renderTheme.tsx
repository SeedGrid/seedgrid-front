"use client";

import * as React from "react";
import type { SgClockTheme, SgClockThemeRenderArgs, SgClockThemeResolver } from "./types";
import { loadSvgText } from "./urlThemeCache";

function extractInnerSvg(svgText: string) {
  const match = svgText.match(/<svg[\s\S]*?>([\s\S]*?)<\/svg>/i);
  return match?.[1] ?? svgText;
}

export function ThemeLayer({
  theme,
  args
}: {
  theme: SgClockTheme;
  args: SgClockThemeRenderArgs;
}) {
  const [inner, setInner] = React.useState<string | null>(null);
  const url = theme.url;

  React.useEffect(() => {
    let alive = true;
    setInner(null);

    if (!url) return;

    loadSvgText(url)
      .then((txt) => {
        if (!alive) return;
        setInner(extractInnerSvg(txt));
      })
      .catch(() => {
        if (!alive) return;
        setInner(null);
      });

    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <>
      {theme.render?.(args)}
      {url && inner && <g dangerouslySetInnerHTML={{ __html: inner }} />}
    </>
  );
}

export function resolveTheme(
  resolver: SgClockThemeResolver | null,
  themeId: string,
  fallbackThemeId: string
): SgClockTheme | null {
  const t = resolver?.resolve(themeId) ?? null;
  if (t) return t;
  if (themeId !== fallbackThemeId) return resolver?.resolve(fallbackThemeId) ?? null;
  return null;
}
