import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.dismiss-toast",
  package: "@seedgrid/fe-components",
  exportName: "dismissSgToast",
  slug: "dismiss-sg-toast",
  displayName: "dismissSgToast",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para fechar/remover um toast especifico ou todos os toasts. Complementa a funcao toast() para controle programatico.",
  tags: ["hook", "toast", "notification", "dismiss"],
  capabilities: ["dismiss-specific", "dismiss-all", "programmatic-control"],
  fieldSemantics: ["dismissal", "notificationControl", "cleanup"],
  props: [
    {
      name: "id",
      type: "SgToastId | undefined",
      description: "ID do toast a fechar. Se undefined, fecha todos os toasts.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["dismissed", "all-dismissed"],
  examples: [
    {
      id: "dismiss-one",
      title: "Fechar um toast especifico",
      file: "apps/showcase/src/app/components/toasts/samples/dismiss-one.tsx.sample",
      kind: "sample"
    },
    {
      id: "dismiss-all",
      title: "Fechar todos os toasts",
      file: "apps/showcase/src/app/components/toasts/samples/dismiss-all.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/toasts",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Fechar um toast especifico quando o usuario clica em uma acao.",
    "Limpar todos os toasts quando o usuario sai da pagina ou sessao.",
    "Controlar o ciclo de vida de toasts programaticamente."
  ],
  avoidUseCases: [
    "Fechar toasts cuja duracao ja expirou; o sistema faz isso automaticamente.",
    "Usar sem ter disparado um toast antes; valide o ID."
  ],
  synonyms: ["dismiss toast", "close notification", "clear toast"],
  relatedEntityFields: ["dismiss", "close", "cleanup"],
  compositionHints: [
    "Chamar apos uma acao do usuario.",
    "Usar em cleanup de componentes para fechar toasts orphos.",
    "Guardar o ID retornado por toast() para dismissSgToast(id) posterior."
  ],
  rankingSignals: {
    freeText: 0.7,
    structuredChoice: 0.5,
    date: 0,
    number: 0.2,
    denseLayout: 0.3
  }
};
