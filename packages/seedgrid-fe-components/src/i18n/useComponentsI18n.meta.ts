import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.components-i18n",
  package: "@seedgrid/fe-components",
  exportName: "useComponentsI18n",
  slug: "use-components-i18n",
  displayName: "useComponentsI18n",
  category: "hook",
  subcategory: "internationalization",
  description:
    "Hook para acessar contexto de internacionalizacao dos componentes SeedGrid. Fornece locale atual e funcoes de traducao.",
  tags: ["hook", "i18n", "internationalization", "locale", "translation"],
  capabilities: ["locale-access", "message-resolution", "dynamic-translation"],
  fieldSemantics: ["i18nContext", "locale", "translation"],
  props: [
    {
      name: "returns.locale",
      type: "SgComponentsLocale",
      description: "Locale atual (pt-BR, en-US, es, fr, pt-PT, en, etc).",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "returns.messages",
      type: "SgComponentsMessages",
      description: "Dicionario de mensagens para o locale atual.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["pt-BR", "pt-PT", "en-US", "en", "es", "fr"],
  examples: [
    {
      id: "basic",
      title: "Acessar locale e mensagens",
      file: "apps/showcase/src/app/components/hooks/use-components-i18n/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "with-translation",
      title: "Usar para traducao de mensagens",
      file: "apps/showcase/src/app/components/hooks/use-components-i18n/samples/with-translation.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-components-i18n",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acessar mensagens traduzidas dentro de componentes customizados.",
    "Validar se um locale especifico esta configurado.",
    "Implementar fallback para mensagens customizadas em diferentes locales."
  ],
  avoidUseCases: [
    "Usar para traducao de strings fora do contexto de componentes SeedGrid.",
    "Supor que o hook valida o locale; sempre checar o resultado."
  ],
  synonyms: ["i18n context", "locale hook", "translation context"],
  relatedEntityFields: ["locale", "language", "translation", "i18n"],
  compositionHints: [
    "Envolver a arvore com SgComponentsI18nProvider antes de usar.",
    "Usar setComponentsI18n() para alternar locale dinamicamente.",
    "Combinar com getBuiltInComponentsMessages() para mensagens builtin."
  ],
  rankingSignals: {
    freeText: 0.8,
    structuredChoice: 0.7,
    date: 0,
    number: 0,
    denseLayout: 0.4
  }
};
