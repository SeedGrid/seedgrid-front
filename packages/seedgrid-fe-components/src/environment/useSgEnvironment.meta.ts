import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.environment",
  package: "@seedgrid/fe-components",
  exportName: "useSgEnvironment",
  slug: "use-sg-environment",
  displayName: "useSgEnvironment",
  category: "hook",
  subcategory: "environment",
  description:
    "Hook para acessar configuracao de ambiente (namespace, estrategia de persistencia, modo e escopo). Retorna o contexto completo do SgEnvironmentProvider.",
  tags: ["hook", "environment", "persistence", "namespace"],
  capabilities: ["namespace-access", "persistence-config", "environment-context"],
  fieldSemantics: ["environmentContext", "persistenceConfig", "namespaceScope"],
  props: [
    {
      name: "returns.namespaceProvider",
      type: "NamespaceProvider",
      description: "Provedor que fornece namespace/tenant atual.",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns.persistenceStrategy",
      type: "PersistenceStrategy",
      description: "Estrategia que carrega, salva e limpa estado persistido.",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns.persistence.scope",
      type: "string",
      description: "Escopo logico para chaves persistidas (ex: 'app:myapp').",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.persistence.mode",
      type: "SgPersistenceMode",
      description: "Modo de persistencia (local, api, fallback).",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns.persistence.stateVersion",
      type: "number",
      description: "Versao logica do estado persistido para migracao.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "custom", "persisted"],
  examples: [
    {
      id: "basic",
      title: "Acessar config de ambiente",
      file: "apps/showcase/src/app/components/hooks/use-sg-environment/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "with-namespace",
      title: "Com namespace customizado",
      file: "apps/showcase/src/app/components/hooks/use-sg-environment/samples/with-namespace.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-environment",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acessar namespace e escopo de persistencia dentro de uma subtree.",
    "Validar que SgEnvironmentProvider esta presente.",
    "Implementar persistencia customizada em cima da estrategia configurada."
  ],
  avoidUseCases: [
    "Usar para dados de aplicacao; use useSgPersistence ou useSgPersistentState.",
    "Mudar configuracao de ambiente em tempo de execucao; provider e imutavel."
  ],
  synonyms: ["environment context", "environment hook", "persistence context"],
  relatedEntityFields: ["namespace", "persistence", "scope", "configuration"],
  compositionHints: [
    "Envolver a arvore com SgEnvironmentProvider antes de usar.",
    "Usar com useSgPersistence e useSgPersistentState para persistencia."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.8,
    date: 0,
    number: 0.5,
    denseLayout: 0.6
  }
};
