import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.namespace-provider",
  package: "@seedgrid/fe-components",
  exportName: "useSgNamespaceProvider",
  slug: "use-sg-namespace-provider",
  displayName: "useSgNamespaceProvider",
  category: "hook",
  subcategory: "namespace",
  description:
    "Hook para acessar o NamespaceProvider configurado. Permite obter o namespace/tenant atual para isolamento de estado e chaves de persistencia.",
  tags: ["hook", "namespace", "tenant", "isolation"],
  capabilities: ["namespace-access", "tenant-isolation", "state-key-building"],
  fieldSemantics: ["namespaceContext", "tenantId", "isolationScope"],
  props: [
    {
      name: "returns.getNamespace",
      type: "() => string",
      description: "Funcao que retorna o namespace/tenant atual.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "custom"],
  examples: [
    {
      id: "basic",
      title: "Obter namespace atual",
      file: "apps/showcase/src/app/components/hooks/use-sg-namespace-provider/samples/basic.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-namespace-provider",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Isolar estado e chaves de persistencia por namespace/tenant.",
    "Construir chaves de storage que respeitam namespace.",
    "Implementar multi-tenancy em componentes customizados."
  ],
  avoidUseCases: [
    "Usar para dados de negocio; use useSgEnvironment em vez disso.",
    "Assumir um namespace vazio; sempre validar a resposta."
  ],
  synonyms: ["namespace context", "tenant provider", "isolation scope"],
  relatedEntityFields: ["namespace", "tenant", "isolation"],
  compositionHints: [
    "Envolver a arvore com SgEnvironmentProvider com um NamespaceProvider customizado.",
    "Usar com useSgPersistence para construir chaves isoladas."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.7,
    date: 0,
    number: 0.4,
    denseLayout: 0.5
  }
};
