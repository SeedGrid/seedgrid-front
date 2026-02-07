import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "SeedGrid Components Showcase"
};

const COMPONENTS = [
  { slug: "sg-input-text", label: "SgInputText" },
  { slug: "sg-input-text-area", label: "SgInputTextArea" },
  { slug: "sg-input-password", label: "SgInputPassword" },
  { slug: "sg-input-select", label: "SgInputSelect" },
  { slug: "sg-input-date", label: "SgInputDate" },
  { slug: "sg-input-birth-date", label: "SgInputBirthDate" },
  { slug: "sg-input-email", label: "SgInputEmail" },
  { slug: "sg-input-cpf", label: "SgInputCPF" },
  { slug: "sg-input-cnpj", label: "SgInputCNPJ" },
  { slug: "sg-input-cpf-cnpj", label: "SgInputCPFCNPJ" },
  { slug: "sg-input-cep", label: "SgInputCEP" },
  { slug: "sg-input-phone", label: "SgInputPhone" },
  { slug: "sg-group-box", label: "SgGroupBox" },
  { slug: "sg-wizard", label: "SgWizard" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-border bg-muted/30 p-4 overflow-y-auto">
          <Link href="/" className="block mb-6">
            <span className="text-lg font-bold text-primary">SeedGrid</span>
            <span className="block text-xs text-muted-foreground">Components Showcase</span>
          </Link>
          <nav className="flex flex-col gap-0.5">
            {COMPONENTS.map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
