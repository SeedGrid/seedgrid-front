import "./globals.css";
import React from "react";
import ShowcaseShell from "./ShowcaseShell";

export const metadata = {
  title: "SeedGrid Components Showcase"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ShowcaseShell initialLocale="pt-BR">{children}</ShowcaseShell>
      </body>
    </html>
  );
}
