import type { SgAiHintsV0, SgMetaV0 } from "../../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.clock-theme-resolver",
  package: "@seedgrid/fe-components",
  exportName: "useSgClockThemeResolver",
  slug: "use-sg-clock-theme-resolver",
  displayName: "useSgClockThemeResolver",
  category: "hook",
  subcategory: "clock-theme",
  description:
    "Hook para resolver tema do SgClock dinamicamente. Permite consultar temas registrados, alternar entre eles e acessar a configuracao current.",
  tags: ["hook", "clock", "theme", "resolver"],
  capabilities: ["theme-resolution", "dynamic-theme-switching", "theme-registry-access"],
  fieldSemantics: ["themeResolver", "clockTheme", "dynamicStyling"],
  props: [
    {
      name: "returns.resolveMode",
      type: "SgClockThemeResolveMode",
      description: "Modo de resolucao do tema (auto, light, dark, custom).",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "returns.resolveTheme",
      type: "(themeId: string) => SgClockTheme | null",
      description: "Funcao para resolver um tema pelo ID.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.currentTheme",
      type: "SgClockTheme | null",
      description: "Tema atualmente ativo.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.setResolveMode",
      type: "(mode: SgClockThemeResolveMode) => void",
      description: "Alterar modo de resolucao do tema.",
      semanticRole: "behavior",
      bindable: false
    }
  ],
  states: ["auto", "light", "dark", "custom"],
  examples: [
    {
      id: "basic",
      title: "Resolver e alternar temas",
      file: "apps/showcase/src/app/components/hooks/use-sg-clock-theme-resolver/samples/basic.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-clock-theme-resolver",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Alternar dinamicamente entre temas de relogio.",
    "Implementar modo claro/escuro personalizado para SgClock.",
    "Consultar temas registrados e renderizar seletor de tema."
  ],
  avoidUseCases: [
    "Estilizar componentes nao-clock; use SgClockThemeProvider ou estilo CSS direto.",
    "Mutacao manual de registro de temas; use registerTheme() em vez disso."
  ],
  synonyms: ["theme resolver", "clock theme", "theme switcher"],
  relatedEntityFields: ["theme", "display", "style"],
  compositionHints: [
    "Usar dentro de SgClockThemeProvider para acesso a resolucao de temas.",
    "Combinar com SgClock para renderizar relógios com temas dinamicos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.8,
    date: 0.6,
    number: 0,
    denseLayout: 0.5
  }
};
