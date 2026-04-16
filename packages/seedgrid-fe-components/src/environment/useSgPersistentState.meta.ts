import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.persistent-state",
  package: "@seedgrid/fe-components",
  exportName: "useSgPersistentState",
  slug: "use-sg-persistent-state",
  displayName: "useSgPersistentState",
  category: "hook",
  subcategory: "persistent-state",
  description:
    "Hook de alto nivel para estado persistido. Similar a useState mas sincroniza com persistencia (localStorage, API ou hibrida) com carregamento asincrono e isolamento por namespace.",
  tags: ["hook", "persistent-state", "storage", "state-sync"],
  capabilities: ["state-persistence", "async-init", "serialization", "namespace-isolation"],
  fieldSemantics: ["persistentState", "syncedState", "storedValue"],
  props: [
    {
      name: "args.baseKey",
      type: "string",
      required: true,
      description: "Chave base para persistencia (sera isolada por namespace e escopo).",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "args.defaultValue",
      type: "T",
      required: true,
      description: "Valor padrao enquanto carrega do storage.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "args.serialize",
      type: "(value: T) => unknown",
      description: "Funcao customizada para serializar ao persistir.",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "args.deserialize",
      type: "(value: unknown) => T",
      description: "Funcao customizada para desserializar ao carregar.",
      semanticRole: "behavior",
      bindable: false
    },
    {
      name: "returns[0]",
      type: "T",
      description: "Valor atual (pode ser defaultValue durante carregamento asincrono).",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "returns[1]",
      type: "(value: T) => Promise<void>",
      description: "Funcao para atualizar estado e persistir asincronamente.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["loading", "loaded", "saving", "error"],
  examples: [
    {
      id: "basic",
      title: "Estado persistido simples",
      file: "apps/showcase/src/app/components/hooks/use-sg-persistent-state/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "with-serialization",
      title: "Com serializacao customizada",
      file: "apps/showcase/src/app/components/hooks/use-sg-persistent-state/samples/with-serialization.tsx.sample",
      kind: "sample"
    },
    {
      id: "form-state",
      title: "Estado persistido de formulario",
      file: "apps/showcase/src/app/components/hooks/use-sg-persistent-state/samples/form-state.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-persistent-state",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Persistir estado de formulario entre sessoes.",
    "Salvar preferencias do usuario (tema, layout, filtros).",
    "Sincronizar estado local com storage com fallback para valor padrao.",
    "Implementar historico de acoes que sobrevive a reload."
  ],
  avoidUseCases: [
    "Estado que so existe durante a sessao; use useState.",
    "Dados do servidor que mudam frequentemente; use useQuery ou SWR.",
    "Estado muito grande que pode sobrecarregar storage; considere chunking."
  ],
  synonyms: ["persistent state", "synced state", "stored state"],
  relatedEntityFields: ["preference", "setting", "cache", "history"],
  compositionHints: [
    "Combinar com SgEnvironmentProvider para estrategia de persistencia customizada.",
    "Usar baseKey semantico como 'sidebar:collapsed' ou 'form:draft:order'.",
    "Implementar serialize/deserialize para tipos complexos ou versioning."
  ],
  rankingSignals: {
    freeText: 0.6,
    structuredChoice: 0.8,
    date: 0.7,
    number: 0.8,
    denseLayout: 0.7
  }
};
