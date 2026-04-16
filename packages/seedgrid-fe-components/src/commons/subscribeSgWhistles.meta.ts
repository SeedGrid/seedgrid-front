import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.subscribe-whistles",
  package: "@seedgrid/fe-components",
  exportName: "subscribeSgWhistles",
  slug: "subscribe-sg-whistles",
  displayName: "subscribeSgWhistles",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para se inscrever em mudancas de whistles. Permite monitorar e reagir quando novos whistles sao criados ou removidos.",
  tags: ["hook", "whistle", "subscription", "reactive"],
  capabilities: ["subscribe", "listen", "reactive-updates"],
  fieldSemantics: ["subscription", "reactiveUpdates", "whistleMonitoring"],
  props: [
    {
      name: "listener",
      type: "(whistles: SgWhistleRecord[]) => void",
      required: true,
      description: "Callback chamado quando whistles mudam. Recebe lista snapshot de whistles atual.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["subscribed", "unsubscribed"],
  examples: [
    {
      id: "basic",
      title: "Monitorar mudancas de whistles",
      file: "apps/showcase/src/app/components/whistles/samples/subscribe.tsx.sample",
      kind: "sample"
    },
    {
      id: "in-effect",
      title: "Usar em useEffect",
      file: "apps/showcase/src/app/components/whistles/samples/subscribe-effect.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/whistles",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Renderizar lista customizada de whistles.",
    "Implementar analytics ou logging de notificacoes.",
    "Sincronizar estado de whistles com componente nao-React.",
    "Reagir quando um whistle especifico aparece (ex: loading → success)."
  ],
  avoidUseCases: [
    "Controlar exibicao de whistles; use SgWhistleHost para isso.",
    "Modificar whistles dentro do listener; cria efeitos colaterais."
  ],
  synonyms: ["subscribe", "listen to whistles", "whistle observer"],
  relatedEntityFields: ["notification", "reactive", "subscription"],
  compositionHints: [
    "Usar em useEffect com cleanup para unsubscribe.",
    "Guardar o unsubscribe retornado para limpeza.",
    "Combinar com sgWhistle() e dismissSgWhistle() para controle completo."
  ],
  rankingSignals: {
    freeText: 0.7,
    structuredChoice: 0.6,
    date: 0.3,
    number: 0.2,
    denseLayout: 0.4
  }
};
