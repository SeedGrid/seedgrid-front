"use client";

import * as React from "react";

export function useDarkFlag() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;

    const compute = () => {
      const mode = getComputedStyle(root).getPropertyValue("--sg-mode").trim().toLowerCase();
      if (mode === "dark") {
        setDark(true);
        return;
      }
      if (mode === "light") {
        setDark(false);
        return;
      }
      if (root.classList.contains("dark")) {
        setDark(true);
        return;
      }
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    };
    compute();

    const obs = new MutationObserver(() => compute());
    obs.observe(root, { attributes: true, attributeFilter: ["class", "style"] });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => compute();
    if (media.addEventListener) {
      media.addEventListener("change", onMediaChange);
    } else {
      media.addListener(onMediaChange);
    }

    return () => {
      obs.disconnect();
      if (media.removeEventListener) {
        media.removeEventListener("change", onMediaChange);
      } else {
        media.removeListener(onMediaChange);
      }
    };
  }, []);

  return dark;
}
