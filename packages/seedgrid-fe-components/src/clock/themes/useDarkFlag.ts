"use client";

import * as React from "react";

export function useDarkFlag() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;

    const compute = () => setDark(root.classList.contains("dark"));
    compute();

    const obs = new MutationObserver(() => compute());
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  return dark;
}
