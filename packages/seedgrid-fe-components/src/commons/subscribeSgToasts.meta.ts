import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.subscribe-toasts",
  package: "@seedgrid/fe-components",
  exportName: "subscribeSgToasts",
  slug: "subscribe-sg-toasts",
  displayName: "subscribeSgToasts",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para se inscrever em mudancas de toasts. Permite monitorar e reagir quando novos toasts sao criados ou removidos.",
  tags: ["hook", "toast", "subscription", "reactive"],
  capabilities: ["subscribe", "listen", "reactive-updates"],
  fieldSemantics: ["subscription", "reactiveUpdates", "toastMonitoring"],
  props: [
    {
      name: "listener",
      type: "(toasts: SgToastRecord[]) => void",
      required: true,
      description: "Callback chamado quando toasts mudam. Recebe lista snapshot de toasts atual.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["subscribed", "unsubscribed"],
  examples: [
    {
      id: "basic",
      title: "Monitorar mudancas de toasts",
      file: "apps/showcase/src/app/components/toasts/samples/subscribe.tsx.sample",
      kind: "sample"
    },
    {
      id: "in-effect",
      title: "Usar em useEffect",
      file: "apps/showcase/src/app/components/toasts/samples/subscribe-effect.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/toasts",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Renderizar lista customizada de toasts.",
    "Implementar analytics ou logging de notificacoes.",
    "Sincronizar estado de toasts com componente nao-React.",
    "Reagir quando um toast especifico aparece (ex: loading → success)."
  ],
  avoidUseCases: [
    "Controlar exibicao de toasts; use SgToastHost para isso.",
    "Modificar toasts dentro do listener; cria efeitos colaterais."
  ],
  synonyms: ["subscribe", "listen to toasts", "toast observer"],
  relatedEntityFields: ["notification", "reactive", "subscription"],
  compositionHints: [
    "Usar em useEffect com cleanup para unsubscribe.",
    "Guardar o unsubscribe retornado para limpeza.",
    "Combinar com toast() e dismissSgToast() para controle completo."
  ],
  rankingSignals: {
    freeText: 0.6,
    structuredChoice: 0.5,
    date: 0.3,
    number: 0.2,
    denseLayout: 0.4
  }
};
