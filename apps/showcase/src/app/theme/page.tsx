"use client";

import React from "react";
import { useSgTheme } from "@seedgrid/fe-theme";
import CodeBlockBase from "../components/CodeBlockBase";
import I18NReady from "../components/I18NReady";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

type ThemeTexts = {
  title: string;
  subtitle: string;
  installTitle: string;
  installDescription: string;
  setupTitle: string;
  setupDescription: string;
  hookTitle: string;
  hookDescription: string;
  cssVarsTitle: string;
  cssVarsDescription: string;
  paletteTitle: string;
  paletteDescription: string;
  semanticTitle: string;
  semanticDescription: string;
  neutralTitle: string;
  neutralDescription: string;
  tokensTitle: string;
  tokensDescription: string;
  tailwindTitle: string;
  tailwindDescription: string;
  statusTitle: string;
  currentModeLabel: string;
  seedLabel: string;
  persistenceTitle: string;
  persistenceDescription: string;
  persistenceSavedTitle: string;
  persistenceSavedDescription: string;
  persistenceConfigKeyDescription: string;
  persistenceModeKeyDescription: string;
  palettePrimary: string;
  paletteSecondary: string;
  paletteTertiary: string;
  semanticSuccess: string;
  semanticInfo: string;
  semanticWarning: string;
  semanticError: string;
};

const THEME_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ThemeTexts> = {
  "pt-BR": {
    title: "SeedThemeProvider",
    subtitle: "Sistema de temas baseado em uma cor seed que gera paletas harmoniosas automaticamente.",
    installTitle: "Instalacao",
    installDescription: "Adicione o pacote ao projeto.",
    setupTitle: "Setup Basico",
    setupDescription: "Configure o provider no layout raiz da aplicacao.",
    hookTitle: "Hook useSgTheme",
    hookDescription: "Acesse e altere o tema em qualquer componente.",
    cssVarsTitle: "Usando CSS Variables",
    cssVarsDescription: "Todas as cores ficam disponiveis como CSS variables.",
    paletteTitle: "Paletas de Cores",
    paletteDescription: "Cada cor possui escala de 50 a 900.",
    semanticTitle: "Cores Semanticas",
    semanticDescription: "Cores fixas para convencoes universais de UI/UX.",
    neutralTitle: "Cores Neutras",
    neutralDescription: "Cores harmonizadas com a seed.",
    tokensTitle: "Tokens de Componentes",
    tokensDescription: "Variaveis semanticas para componentes especificos.",
    tailwindTitle: "Configuracao do Tailwind",
    tailwindDescription: "Configure o Tailwind para usar as CSS variables.",
    statusTitle: "Estado Atual do Tema",
    currentModeLabel: "Modo Atual",
    seedLabel: "Cor Seed",
    persistenceTitle: "Persistencia no localStorage",
    persistenceDescription: "O tema e salvo automaticamente.",
    persistenceSavedTitle: "Tema salvo automaticamente",
    persistenceSavedDescription:
      "Quando voce altera seed ou modo (light/dark), as preferencias sao salvas no localStorage e restauradas ao recarregar a pagina.",
    persistenceConfigKeyDescription: "Chave do localStorage para configuracao do tema",
    persistenceModeKeyDescription: "Chave do localStorage para modo light/dark",
    palettePrimary: "Primary (muda com seed)",
    paletteSecondary: "Secondary (muda com seed)",
    paletteTertiary: "Tertiary (muda com seed)",
    semanticSuccess: "Success (verde fixo)",
    semanticInfo: "Info (azul fixo)",
    semanticWarning: "Warning (amarelo fixo)",
    semanticError: "Error (vermelho fixo)"
  },
  "pt-PT": {
    title: "SeedThemeProvider",
    subtitle: "Sistema de temas baseado numa cor seed que gera paletas harmoniosas automaticamente.",
    installTitle: "Instalacao",
    installDescription: "Adicione o pacote ao projeto.",
    setupTitle: "Setup Basico",
    setupDescription: "Configure o provider no layout raiz da aplicacao.",
    hookTitle: "Hook useSgTheme",
    hookDescription: "Aceda e altere o tema em qualquer componente.",
    cssVarsTitle: "Usando CSS Variables",
    cssVarsDescription: "Todas as cores ficam disponiveis como CSS variables.",
    paletteTitle: "Paletas de Cores",
    paletteDescription: "Cada cor possui escala de 50 a 900.",
    semanticTitle: "Cores Semanticas",
    semanticDescription: "Cores fixas para convencoes universais de UI/UX.",
    neutralTitle: "Cores Neutras",
    neutralDescription: "Cores harmonizadas com a seed.",
    tokensTitle: "Tokens de Componentes",
    tokensDescription: "Variaveis semanticas para componentes especificos.",
    tailwindTitle: "Configuracao do Tailwind",
    tailwindDescription: "Configure o Tailwind para usar as CSS variables.",
    statusTitle: "Estado Atual do Tema",
    currentModeLabel: "Modo Atual",
    seedLabel: "Cor Seed",
    persistenceTitle: "Persistencia no localStorage",
    persistenceDescription: "O tema e guardado automaticamente.",
    persistenceSavedTitle: "Tema guardado automaticamente",
    persistenceSavedDescription:
      "Quando altera seed ou modo (light/dark), as preferencias sao guardadas no localStorage e restauradas ao recarregar a pagina.",
    persistenceConfigKeyDescription: "Chave do localStorage para configuracao do tema",
    persistenceModeKeyDescription: "Chave do localStorage para modo light/dark",
    palettePrimary: "Primary (muda com seed)",
    paletteSecondary: "Secondary (muda com seed)",
    paletteTertiary: "Tertiary (muda com seed)",
    semanticSuccess: "Success (verde fixo)",
    semanticInfo: "Info (azul fixo)",
    semanticWarning: "Warning (amarelo fixo)",
    semanticError: "Error (vermelho fixo)"
  },
  "en-US": {
    title: "SeedThemeProvider",
    subtitle: "Theme system based on a single seed color that automatically generates harmonic palettes.",
    installTitle: "Installation",
    installDescription: "Add the package to your project.",
    setupTitle: "Basic Setup",
    setupDescription: "Configure the provider in your app root layout.",
    hookTitle: "useSgTheme Hook",
    hookDescription: "Access and update theme settings from any component.",
    cssVarsTitle: "Using CSS Variables",
    cssVarsDescription: "All colors are available as CSS variables.",
    paletteTitle: "Color Palettes",
    paletteDescription: "Each color has a scale from 50 to 900.",
    semanticTitle: "Semantic Colors",
    semanticDescription: "Fixed colors for common UI/UX semantics.",
    neutralTitle: "Neutral Colors",
    neutralDescription: "Neutral colors harmonized with the seed.",
    tokensTitle: "Component Tokens",
    tokensDescription: "Semantic variables for specific components.",
    tailwindTitle: "Tailwind Setup",
    tailwindDescription: "Configure Tailwind to consume CSS variables.",
    statusTitle: "Current Theme State",
    currentModeLabel: "Current Mode",
    seedLabel: "Seed Color",
    persistenceTitle: "localStorage Persistence",
    persistenceDescription: "Theme data is saved automatically.",
    persistenceSavedTitle: "Theme saved automatically",
    persistenceSavedDescription:
      "When you change the seed or mode (light/dark), preferences are stored in localStorage and restored on page reload.",
    persistenceConfigKeyDescription: "localStorage key for theme configuration",
    persistenceModeKeyDescription: "localStorage key for light/dark mode",
    palettePrimary: "Primary (changes with seed)",
    paletteSecondary: "Secondary (changes with seed)",
    paletteTertiary: "Tertiary (changes with seed)",
    semanticSuccess: "Success (fixed green)",
    semanticInfo: "Info (fixed blue)",
    semanticWarning: "Warning (fixed yellow)",
    semanticError: "Error (fixed red)"
  },
  es: {
    title: "SeedThemeProvider",
    subtitle: "Sistema de temas basado en un color seed que genera paletas armoniosas automaticamente.",
    installTitle: "Instalacion",
    installDescription: "Agrega el paquete a tu proyecto.",
    setupTitle: "Setup Basico",
    setupDescription: "Configura el provider en el layout raiz de la aplicacion.",
    hookTitle: "Hook useSgTheme",
    hookDescription: "Accede y modifica el tema desde cualquier componente.",
    cssVarsTitle: "Uso de CSS Variables",
    cssVarsDescription: "Todos los colores estan disponibles como CSS variables.",
    paletteTitle: "Paletas de Colores",
    paletteDescription: "Cada color tiene una escala de 50 a 900.",
    semanticTitle: "Colores Semanticos",
    semanticDescription: "Colores fijos para convenciones universales de UI/UX.",
    neutralTitle: "Colores Neutros",
    neutralDescription: "Colores neutros armonizados con la seed.",
    tokensTitle: "Tokens de Componentes",
    tokensDescription: "Variables semanticas para componentes especificos.",
    tailwindTitle: "Configuracion de Tailwind",
    tailwindDescription: "Configura Tailwind para usar CSS variables.",
    statusTitle: "Estado Actual del Tema",
    currentModeLabel: "Modo Actual",
    seedLabel: "Color Seed",
    persistenceTitle: "Persistencia en localStorage",
    persistenceDescription: "El tema se guarda automaticamente.",
    persistenceSavedTitle: "Tema guardado automaticamente",
    persistenceSavedDescription:
      "Cuando cambias la seed o el modo (light/dark), las preferencias se guardan en localStorage y se restauran al recargar la pagina.",
    persistenceConfigKeyDescription: "Clave de localStorage para configuracion del tema",
    persistenceModeKeyDescription: "Clave de localStorage para modo light/dark",
    palettePrimary: "Primary (cambia con la seed)",
    paletteSecondary: "Secondary (cambia con la seed)",
    paletteTertiary: "Tertiary (cambia con la seed)",
    semanticSuccess: "Success (verde fijo)",
    semanticInfo: "Info (azul fijo)",
    semanticWarning: "Warning (amarillo fijo)",
    semanticError: "Error (rojo fijo)"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof THEME_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[rgb(var(--sg-muted))]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return <CodeBlockBase code={code} />;
}

function ColorSwatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-12 w-12 rounded-lg border-2 border-[rgb(var(--sg-border))]"
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
            <div className="text-center text-xs text-[rgb(var(--sg-muted))]">{stop}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemeShowcase() {
  const { currentMode } = useSgTheme();
  const i18n = useShowcaseI18n();
  const locale: keyof typeof THEME_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = THEME_TEXTS[locale];

  return (
    <I18NReady>
      <div className="max-w-6xl space-y-10">
        <div>
          <h1 className="text-3xl font-bold">{texts.title}</h1>
          <p className="mt-2 text-[rgb(var(--sg-muted))]">{texts.subtitle}</p>
        </div>

        <Section title={texts.installTitle} description={texts.installDescription}>
          <CodeBlock code={`pnpm add @seedgrid/fe-theme`} />
        </Section>

        <Section title={texts.setupTitle} description={texts.setupDescription}>
          <CodeBlock
            code={`import { SeedThemeProvider } from "@seedgrid/fe-theme";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D",
            mode: "auto",
            radius: 8,
            persistMode: true,
          }}
          applyTo="html"
        >
          {children}
        </SeedThemeProvider>
      </body>
    </html>
  );
}`}
          />
        </Section>

        <Section title={texts.hookTitle} description={texts.hookDescription}>
          <CodeBlock
            code={`import { useSgTheme } from "@seedgrid/fe-theme";

function MyComponent() {
  const { setTheme, setMode, currentMode } = useSgTheme();

  return (
    <div>
      <button onClick={() => setTheme({ seed: "#7C3AED" })}>
        Set Purple Seed
      </button>

      <button onClick={() => setMode(currentMode === "light" ? "dark" : "light")}>
        Toggle Dark Mode
      </button>
    </div>
  );
}`}
          />
        </Section>

        <Section title={texts.cssVarsTitle} description={texts.cssVarsDescription}>
          <CodeBlock
            code={`// React component
<div className="bg-[rgb(var(--sg-primary-600))] text-[rgb(var(--sg-on-primary))]">
  Primary Button
</div>

// Tailwind classes
<div className="bg-sg-primary-600 text-sg-on-primary">
  Primary Button
</div>

// Plain CSS
.my-button {
  background-color: rgb(var(--sg-primary-600));
  color: rgb(var(--sg-on-primary));
}`}
          />
        </Section>

        <Section title={texts.paletteTitle} description={texts.paletteDescription}>
          <div className="space-y-6">
            <PaletteScale name="primary" label={texts.palettePrimary} />
            <PaletteScale name="secondary" label={texts.paletteSecondary} />
            <PaletteScale name="tertiary" label={texts.paletteTertiary} />
          </div>
        </Section>

        <Section title={texts.semanticTitle} description={texts.semanticDescription}>
          <div className="space-y-6">
            <PaletteScale name="success" label={texts.semanticSuccess} />
            <PaletteScale name="info" label={texts.semanticInfo} />
            <PaletteScale name="warning" label={texts.semanticWarning} />
            <PaletteScale name="error" label={texts.semanticError} />
          </div>
        </Section>

        <Section title={texts.neutralTitle} description={texts.neutralDescription}>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch varName="--sg-bg" label="Background" />
            <ColorSwatch varName="--sg-surface" label="Surface (cards, modals)" />
            <ColorSwatch varName="--sg-muted-surface" label="Muted Surface" />
            <ColorSwatch varName="--sg-border" label="Border" />
            <ColorSwatch varName="--sg-text" label="Text" />
            <ColorSwatch varName="--sg-muted" label="Muted Text" />
          </div>
        </Section>

        <Section title={texts.tokensTitle} description={texts.tokensDescription}>
          <CodeBlock
            code={`// Buttons
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
--sg-alert-success-border`}
          />
        </Section>

        <Section title={texts.tailwindTitle} description={texts.tailwindDescription}>
          <CodeBlock
            code={`// tailwind.config.ts
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
});`}
          />
        </Section>

        <Section title={texts.statusTitle}>
          <div className="rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface))] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-[rgb(var(--sg-muted))]">{texts.currentModeLabel}</div>
                <div className="text-lg font-semibold">{currentMode}</div>
              </div>
              <div>
                <div className="text-sm text-[rgb(var(--sg-muted))]">{texts.seedLabel}</div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded border border-[rgb(var(--sg-border))]"
                    style={{ backgroundColor: "rgb(var(--sg-primary-600))" }}
                  />
                  <div className="font-mono text-sm">rgb(var(--sg-primary-600))</div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title={texts.persistenceTitle} description={texts.persistenceDescription}>
          <div className="rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface))] p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">LS</div>
                <div>
                  <div className="font-semibold">{texts.persistenceSavedTitle}</div>
                  <div className="text-sm text-[rgb(var(--sg-muted))]">{texts.persistenceSavedDescription}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">Key</div>
                <div>
                  <div className="font-mono text-sm">sg:theme:config</div>
                  <div className="text-xs text-[rgb(var(--sg-muted))]">{texts.persistenceConfigKeyDescription}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">Key</div>
                <div>
                  <div className="font-mono text-sm">sg:theme:mode</div>
                  <div className="text-xs text-[rgb(var(--sg-muted))]">{texts.persistenceModeKeyDescription}</div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </I18NReady>
  );
}
