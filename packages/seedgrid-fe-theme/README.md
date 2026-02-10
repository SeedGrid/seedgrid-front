# @seedgrid/fe-theme

Sistema de temas do SeedGrid baseado em **seed color** com geração automática de paletas harmoniosas.

## Características

- 🎨 **Geração automática de paletas** a partir de uma cor seed
- 🌓 **Dark/Light mode** com suporte a `auto` (detecta preferência do sistema)
- 📦 **Paletas completas** 50-900 para todas as cores (primary, secondary, tertiary, warning, error, info, success)
- 🎯 **Tokens de componentes** pré-configurados (botões, inputs, cards, etc.)
- 💾 **Persistência** de preferências no localStorage
- ⚡ **CSS Variables** para integração com Tailwind
- 🔄 **Troca dinâmica** de tema em runtime

## Instalação

```bash
pnpm add @seedgrid/fe-theme
```

## Uso Básico

### 1. Configurar o Provider

```tsx
import { SeedThemeProvider } from "@seedgrid/fe-theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-[rgb(var(--sg-bg))] text-[rgb(var(--sg-text))]">
        <SeedThemeProvider
          initialTheme={{
            seed: "#16803D", // Verde SeedGrid
            mode: "auto", // "light" | "dark" | "auto"
            radius: 12,
            persistMode: true,
          }}
        >
          {children}
        </SeedThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Usar o Hook

```tsx
"use client";

import { useSgTheme } from "@seedgrid/fe-theme";

export function ThemeToggle() {
  const { setMode, currentMode, setTheme } = useSgTheme();

  return (
    <div className="flex gap-2">
      <button onClick={() => setMode(currentMode === "light" ? "dark" : "light")}>
        Toggle Mode ({currentMode})
      </button>
      
      <button onClick={() => setTheme({ seed: "#0EA5E9" })}>
        Mudar para Azul
      </button>
    </div>
  );
}
```

## CSS Variables Disponíveis

### Cores Base
- `--sg-bg` - Background principal
- `--sg-surface` - Superfícies (cards, modais)
- `--sg-text` - Texto principal
- `--sg-muted` - Texto secundário
- `--sg-border` - Bordas
- `--sg-ring` - Focus ring

### Paletas (50-900)
- `--sg-primary-{50-900}` - Cor primária
- `--sg-secondary-{50-900}` - Cor secundária
- `--sg-tertiary-{50-900}` - Cor terciária
- `--sg-warning-{50-900}` - Avisos
- `--sg-error-{50-900}` - Erros
- `--sg-info-{50-900}` - Informações
- `--sg-success-{50-900}` - Sucesso

### Tokens de Componentes
- `--sg-btn-{variant}-bg` - Background de botões
- `--sg-input-border` - Borda de inputs
- `--sg-card-bg` - Background de cards
- E muitos outros...

## Exemplos de Uso com Tailwind

### Botão
```tsx
<button className="
  rounded-[var(--sg-radius)]
  bg-[rgb(var(--sg-primary-600))]
  text-[rgb(var(--sg-on-primary))]
  hover:bg-[rgb(var(--sg-primary-700))]
  active:bg-[rgb(var(--sg-primary-800))]
  border border-[rgb(var(--sg-border))]
  focus:outline-none focus:ring-2 focus:ring-[rgb(var(--sg-ring))]
  px-4 py-2
">
  Salvar
</button>
```

### Card
```tsx
<div className="
  rounded-[var(--sg-radius)]
  bg-[rgb(var(--sg-surface))]
  border border-[rgb(var(--sg-border))]
  p-4
">
  <h3 className="text-[rgb(var(--sg-text))] font-semibold">Título</h3>
  <p className="text-[rgb(var(--sg-muted))]">Descrição</p>
</div>
```

### Alert
```tsx
<div className="
  rounded-[var(--sg-radius)]
  bg-[rgb(var(--sg-warning-100))]
  text-[rgb(var(--sg-warning-700))]
  border border-[rgb(var(--sg-warning-300))]
  p-4
">
  <strong>Atenção:</strong> Algo importante aconteceu.
</div>
```

## Customização Avançada

### Sobrescrever Cores Semânticas
```tsx
<SeedThemeProvider
  initialTheme={{
    seed: "#16803D",
    warning: "#FF9800", // Laranja customizado
    error: "#F44336",   // Vermelho customizado
    info: "#2196F3",    // Azul customizado
    success: "#4CAF50", // Verde customizado
  }}
/>
```

### Custom CSS Variables
```tsx
<SeedThemeProvider
  initialTheme={{
    seed: "#16803D",
    customVars: {
      "--sg-radius": "8px",
      "--sg-primary-600": "255 0 0", // RGB format
    },
  }}
/>
```

## Migração do ThemeProvider Antigo

O provider antigo ainda está disponível para compatibilidade, mas está marcado como deprecated:

```tsx
// ❌ Antigo (deprecated)
import { ThemeProvider, useTheme } from "@seedgrid/fe-theme";

// ✅ Novo (recomendado)
import { SeedThemeProvider, useSgTheme } from "@seedgrid/fe-theme";
```

## Licença

MIT

