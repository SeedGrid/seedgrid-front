import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.persistence",
  package: "@seedgrid/fe-components",
  exportName: "useSgPersistence",
  slug: "use-sg-persistence",
  displayName: "useSgPersistence",
  category: "hook",
  subcategory: "persistence",
  description:
    "Hook de baixo nivel para carregar, salvar e limpar estado persistido. Gerencia chaves isoladas por namespace e escopo, respeitando a estrategia configurada.",
  tags: ["hook", "persistence", "storage", "state-management"],
  capabilities: ["load-state", "save-state", "clear-state", "namespace-isolation"],
  fieldSemantics: ["persistenceLayer", "stateStorage", "asyncStorage"],
  props: [
    {
      name: "returns.namespace",
      type: "string",
      description: "Namespace/tenant atual.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.scope",
      type: "string",
      description: "Escopo logico para chaves (ex: 'app:myapp').",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.mode",
      type: "SgPersistenceMode",
      description: "Modo de persistencia (local, api, fallback).",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns.stateVersion",
      type: "number",
      description: "Versao logica do estado para migracao.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.load",
      type: "(baseKey: string) => Promise<unknown>",
      description: "Carregar valor persistido da chave (isolada por namespace e escopo).",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.save",
      type: "(baseKey: string, state: unknown) => Promise<void>",
      description: "Salvar valor persistido na chave (isolada por namespace e escopo).",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.clear",
      type: "(baseKey: string) => Promise<void>",
      description: "Limpar valor persistido da chave.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["idle", "loading", "saving", "error"],
  examples: [
    {
      id: "basic",
      title: "Carregar e salvar estado",
      file: "apps/showcase/src/app/components/hooks/use-sg-persistence/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "form-state",
      title: "Persistir estado de formulario",
      file: "apps/showcase/src/app/components/hooks/use-sg-persistence/samples/form-state.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-persistence",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Carregar estado persistido de componentes customizados no init.",
    "Salvar layout, preferencias ou estado do usuario.",
    "Implementar cache persistente com isolamento por namespace."
  ],
  avoidUseCases: [
    "Estado simples e sem persistencia; use useState.",
    "Dados de negocio que vem do servidor; use useQuery ou hooks de data-fetching."
  ],
  synonyms: ["persistence hook", "state storage", "persistence layer"],
  relatedEntityFields: ["storage", "cache", "state", "persistence"],
  compositionHints: [
    "Envolver a arvore com SgEnvironmentProvider para estrategia customizada.",
    "Usar com try-catch para tratar erros de persistencia.",
    "Preferir useSgPersistentState para casos simples de estado persistido."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.8,
    date: 0.6,
    number: 0.7,
    denseLayout: 0.6
  }
};
