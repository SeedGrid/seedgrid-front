"use client";

import React from "react";
import { useSgTheme } from "@seedgrid/fe-theme";
import SgCodeBlockBase from "../components/others/SgCodeBlockBase";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-[rgb(var(--sg-muted))]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return <SgCodeBlockBase code={code} />;
}

function ColorSwatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-lg border-2 border-[rgb(var(--sg-border))]"
        style={{ backgroundColor: `rgb(var(${varName}))` }}
      />
      <div className="flex-1">
        <div className="font-mono text-sm">{varName}</div>
        <div className="text-xs text-[rgb(var(--sg-muted))]">{label}</div>
      </div>
    </div>
  );
}

function PaletteScale({ name, label }: { name: string; label: string }) {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{label}</h3>
      <div className="flex gap-1">
        {stops.map((stop) => (
          <div key={stop} className="flex-1 space-y-1">
            <div
              className="h-16 rounded border border-[rgb(var(--sg-border))]"
              style={{ backgroundColor: `rgb(var(--sg-${name}-${stop}))` }}
            />
            <div className="text-xs text-center text-[rgb(var(--sg-muted))]">{stop}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemeShowcase() {
  const { currentMode } = useSgTheme();

  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">SeedThemeProvider</h1>
        <p className="mt-2 text-[rgb(var(--sg-muted))]">
          Sistema de temas baseado em uma Ãºnica cor seed que gera automaticamente paletas harmoniosas.
        </p>
      </div>

      {/* â”€â”€ InstalaÃ§Ã£o â”€â”€ */}
      <Section title="InstalaÃ§Ã£o" description="Adicione o pacote ao seu projeto">
        <CodeBlock code={`pnpm add @seedgrid/fe-theme`} />
      </Section>

      {/* â”€â”€ Setup BÃ¡sico â”€â”€ */}
      <Section title="Setup BÃ¡sico" description="Configure o provider no layout raiz da sua aplicaÃ§Ã£o">
        <CodeBlock code={`import { SeedThemeProvider } from "@seedgrid/fe-theme";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D",      // Cor principal do tema
            mode: "auto",         // "light" | "dark" | "auto"
            radius: 8,            // Border radius padrÃ£o
            persistMode: true,    // Salvar preferÃªncias no localStorage
          }}
          applyTo="html"          // Aplicar CSS vars no <html>
        >
          {children}
        </SeedThemeProvider>
      </body>
    </html>
  );
}`} />
      </Section>

      {/* â”€â”€ Hook useSgTheme â”€â”€ */}
      <Section title="Hook useSgTheme" description="Acesse e modifique o tema em qualquer componente">
        <CodeBlock code={`import { useSgTheme } from "@seedgrid/fe-theme";

function MyComponent() {
  const { setTheme, setMode, currentMode, vars } = useSgTheme();

  return (
    <div>
      <button onClick={() => setTheme({ seed: "#7C3AED" })}>
        Mudar para Roxo
      </button>
      
      <button onClick={() => setMode(currentMode === "light" ? "dark" : "light")}>
        Toggle Dark Mode
      </button>
    </div>
  );
}`} />
      </Section>

      {/* â”€â”€ Usando CSS Variables â”€â”€ */}
      <Section title="Usando CSS Variables" description="Todas as cores estÃ£o disponÃ­veis como CSS variables">
        <CodeBlock code={`// Em componentes React
<div className="bg-[rgb(var(--sg-primary-600))] text-[rgb(var(--sg-on-primary))]">
  BotÃ£o Primary
</div>

// Em Tailwind (configurado)
<div className="bg-sg-primary-600 text-sg-on-primary">
  BotÃ£o Primary
</div>

// Em CSS puro
.my-button {
  background-color: rgb(var(--sg-primary-600));
  color: rgb(var(--sg-on-primary));
}`} />
      </Section>

      {/* â”€â”€ Paletas de Cores â”€â”€ */}
      <Section title="Paletas de Cores" description="Cada cor possui uma escala de 50 a 900">
        <div className="space-y-6">
          <PaletteScale name="primary" label="Primary (muda com seed)" />
          <PaletteScale name="secondary" label="Secondary (muda com seed)" />
          <PaletteScale name="tertiary" label="Tertiary (muda com seed)" />
        </div>
      </Section>

      {/* â”€â”€ Cores SemÃ¢nticas â”€â”€ */}
      <Section title="Cores SemÃ¢nticas" description="Cores fixas para convenÃ§Ãµes universais de UI/UX">
        <div className="space-y-6">
          <PaletteScale name="success" label="Success (verde fixo)" />
          <PaletteScale name="info" label="Info (azul fixo)" />
          <PaletteScale name="warning" label="Warning (amarelo fixo)" />
          <PaletteScale name="error" label="Error (vermelho fixo)" />
        </div>
      </Section>

      {/* â”€â”€ Cores Neutras â”€â”€ */}
      <Section title="Cores Neutras" description="Cores harmonizadas sutilmente com a seed">
        <div className="grid grid-cols-2 gap-4">
          <ColorSwatch varName="--sg-bg" label="Background" />
          <ColorSwatch varName="--sg-surface" label="Surface (cards, modals)" />
          <ColorSwatch varName="--sg-muted-surface" label="Muted Surface" />
          <ColorSwatch varName="--sg-border" label="Border" />
          <ColorSwatch varName="--sg-text" label="Text" />
          <ColorSwatch varName="--sg-muted" label="Muted Text" />
        </div>
      </Section>

      {/* â”€â”€ Tokens de Componentes â”€â”€ */}
      <Section title="Tokens de Componentes" description="VariÃ¡veis semÃ¢nticas para componentes especÃ­ficos">
        <CodeBlock code={`// BotÃµes
--sg-btn-primary-bg
--sg-btn-primary-fg
--sg-btn-primary-border
--sg-btn-primary-hover-bg
--sg-btn-primary-ring

// Inputs
--sg-input-bg
--sg-input-fg
--sg-input-border
--sg-input-border-hover
--sg-input-border-focus
--sg-input-ring

// Cards
--sg-card-bg
--sg-card-fg
--sg-card-border
--sg-card-header-bg

// Alerts
--sg-alert-success-bg
--sg-alert-success-fg
--sg-alert-success-border
// ... (info, warning, error)`} />
      </Section>

      {/* â”€â”€ ConfiguraÃ§Ã£o do Tailwind â”€â”€ */}
      <Section title="ConfiguraÃ§Ã£o do Tailwind" description="Configure o Tailwind para usar as CSS variables">
        <CodeBlock code={`// tailwind.config.ts
import type { Config } from "tailwindcss";

const sgPalette = (name: string) => ({
  50: \`rgb(var(--sg-\${name}-50) / <alpha-value>)\`,
  100: \`rgb(var(--sg-\${name}-100) / <alpha-value>)\`,
  200: \`rgb(var(--sg-\${name}-200) / <alpha-value>)\`,
  300: \`rgb(var(--sg-\${name}-300) / <alpha-value>)\`,
  400: \`rgb(var(--sg-\${name}-400) / <alpha-value>)\`,
  500: \`rgb(var(--sg-\${name}-500) / <alpha-value>)\`,
  600: \`rgb(var(--sg-\${name}-600) / <alpha-value>)\`,
  700: \`rgb(var(--sg-\${name}-700) / <alpha-value>)\`,
  800: \`rgb(var(--sg-\${name}-800) / <alpha-value>)\`,
  900: \`rgb(var(--sg-\${name}-900) / <alpha-value>)\`,
});

export default {
  theme: {
    extend: {
      colors: {
        sg: {
          primary: sgPalette("primary"),
          secondary: sgPalette("secondary"),
          tertiary: sgPalette("tertiary"),
          success: sgPalette("success"),
          info: sgPalette("info"),
          warning: sgPalette("warning"),
          error: sgPalette("error"),
        }
      }
    }
  }
} satisfies Config;`} />
      </Section>

      {/* â”€â”€ Modo Atual â”€â”€ */}
      <Section title="Estado Atual do Tema">
        <div className="p-6 rounded-lg bg-[rgb(var(--sg-surface))] border border-[rgb(var(--sg-border))]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[rgb(var(--sg-muted))]">Modo Atual</div>
              <div className="text-lg font-semibold">{currentMode}</div>
            </div>
            <div>
              <div className="text-sm text-[rgb(var(--sg-muted))]">Cor Seed</div>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-[rgb(var(--sg-border))]"
                  style={{ backgroundColor: `rgb(var(--sg-primary-600))` }}
                />
                <div className="font-mono text-sm">rgb(var(--sg-primary-600))</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* â”€â”€ PersistÃªncia â”€â”€ */}
      <Section title="PersistÃªncia no localStorage" description="O tema Ã© salvo automaticamente">
        <div className="p-6 rounded-lg bg-[rgb(var(--sg-surface))] border border-[rgb(var(--sg-border))]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ðŸ’¾</div>
              <div>
                <div className="font-semibold">Tema salvo automaticamente</div>
                <div className="text-sm text-[rgb(var(--sg-muted))]">
                  Quando vocÃª muda a cor seed ou o modo (light/dark), as preferÃªncias sÃ£o salvas no localStorage
                  e restauradas automaticamente quando vocÃª recarrega a pÃ¡gina.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">ðŸ”‘</div>
              <div>
                <div className="font-mono text-sm">sg:theme:config</div>
                <div className="text-xs text-[rgb(var(--sg-muted))]">Chave do localStorage para configuraÃ§Ã£o do tema</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">ðŸ”‘</div>
              <div>
                <div className="font-mono text-sm">sg:theme:mode</div>
                <div className="text-xs text-[rgb(var(--sg-muted))]">Chave do localStorage para modo light/dark</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}



