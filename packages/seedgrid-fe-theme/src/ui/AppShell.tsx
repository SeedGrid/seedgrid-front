"use client";

import React from "react";
import { useTheme } from "../theme/ThemeProvider";

export function AppShell(props: { children: React.ReactNode; nav?: React.ReactNode; header?: React.ReactNode }) {
  const theme = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{ background: `hsl(${theme.colors.background})`, color: `hsl(${theme.colors.foreground})` }}
    >
      <div className="flex min-h-screen">
        <aside
          className="border-r p-4 hidden md:block"
          style={{ width: "var(--sg-sidebar)", borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="font-semibold mb-4 flex items-center gap-2">
            {theme.brand.logoUrl ? (
              <img src={theme.brand.logoUrl} alt={theme.brand.name} className="h-6" />
            ) : null}
            <span>{theme.brand.name}</span>
          </div>
          {props.nav}
        </aside>

        <main className="flex-1 p-4">
          {props.header ? <div className="mb-4">{props.header}</div> : null}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(0,0,0,0.08)", borderRadius: "var(--sg-radius)" }}
          >
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}
