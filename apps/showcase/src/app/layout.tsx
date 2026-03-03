import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import ShowcaseShell from "./ShowcaseShell";
import { SeedThemeProvider } from "@seedgrid/fe-theme";

export const metadata: Metadata = {
  title: "SeedGrid Components Showcase",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[rgb(var(--sg-bg))] text-[rgb(var(--sg-text))]">
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D", // Verde SeedGrid
            mode: "auto",
            radius: 8,
            persistMode: true,
          }}
          applyTo="html"
        >
          <ShowcaseShell initialLocale="pt-BR">{children}</ShowcaseShell>
        </SeedThemeProvider>
      </body>
    </html>
  );
}
