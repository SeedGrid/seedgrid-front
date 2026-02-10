# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2026-02-10

### Added

- **SeedThemeProvider**: Novo provider de tema baseado em seed color
  - Geração automática de paletas harmoniosas a partir de uma única cor
  - Suporte a dark/light/auto mode com detecção de preferência do sistema
  - Paletas completas 50-900 para todas as cores (primary, secondary, tertiary, warning, error, info, success)
  - Tokens de componentes pré-configurados (botões, inputs, cards, alerts, etc.)
  - Persistência de preferências no localStorage
  - Troca dinâmica de tema em runtime

- **Color Utilities**: Funções de conversão e manipulação de cores
  - `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb`, `hslToHex`
  - `relativeLuminance`: Cálculo de luminância relativa (WCAG)
  - `pickOnColor`: Escolha automática de cor de texto (preto/branco) baseada em contraste
  - `buildScaleFromHex`: Geração de escalas de cores 50-900

- **Theme Generator**: Geração automática de tokens de tema
  - Cores primárias, secundárias e terciárias derivadas da seed
  - Cores semânticas (warning, error, info, success) com hues fixos
  - Neutrals harmonizados (background, surface, border, etc.)
  - Suporte a customização via `customVars`

- **Component Tokens**: Tokens semânticos para componentes
  - Botões: primary, secondary, success, info, warning, danger, plain
  - Inputs: background, border, focus, disabled
  - Cards: background, border, header
  - Alerts: info, success, warning, error
  - Badge, Tooltip, Modal, Menu, Table

- **Hook `useSgTheme`**: Acesso ao contexto do tema
  - `vars`: Todas as CSS variables geradas
  - `setTheme`: Atualizar tema dinamicamente
  - `setMode`: Alternar entre light/dark
  - `currentMode`: Modo atual (light ou dark)

- **Documentação**:
  - README.md com exemplos de uso
  - tailwind.config.example.js com configuração do Tailwind
  - ThemeDemo.tsx com componente de demonstração

### Changed

- **ThemeProvider (legacy)**: Marcado como deprecated
  - Mantido para compatibilidade com código existente
  - Recomenda-se migrar para `SeedThemeProvider`

### Migration Guide

#### De ThemeProvider para SeedThemeProvider

**Antes:**
```tsx
import { ThemeProvider, useTheme } from "@seedgrid/fe-theme";

<ThemeProvider theme={{ colors: { primary: "#16803D" } }}>
  {children}
</ThemeProvider>
```

**Depois:**
```tsx
import { SeedThemeProvider, useSgTheme } from "@seedgrid/fe-theme";

<SeedThemeProvider initialTheme={{ seed: "#16803D", mode: "auto" }}>
  {children}
</SeedThemeProvider>
```

## [0.2.0] - Previous version

- Initial theme system with manual color configuration
- Basic ThemeProvider and useTheme hook
- Static color tokens

## [0.1.0] - Initial release

- Basic theme structure
- AppShell component
- i18n support

