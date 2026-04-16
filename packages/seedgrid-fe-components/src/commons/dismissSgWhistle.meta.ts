import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.dismiss-whistle",
  package: "@seedgrid/fe-components",
  exportName: "dismissSgWhistle",
  slug: "dismiss-sg-whistle",
  displayName: "dismissSgWhistle",
  category: "hook",
  subcategory: "notification",
  description:
    "Funcao para fechar/remover um whistle especifico ou todos os whistles. Complementa sgWhistle() para controle programatico.",
  tags: ["hook", "whistle", "notification", "dismiss"],
  capabilities: ["dismiss-specific", "dismiss-all", "programmatic-control"],
  fieldSemantics: ["dismissal", "notificationControl", "cleanup"],
  props: [
    {
      name: "id",
      type: "SgWhistleId | undefined",
      description: "ID do whistle a fechar. Se undefined, fecha todos os whistles.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["dismissed", "all-dismissed"],
  examples: [
    {
      id: "dismiss-one",
      title: "Fechar um whistle especifico",
      file: "apps/showcase/src/app/components/whistles/samples/dismiss-one.tsx.sample",
      kind: "sample"
    },
    {
      id: "dismiss-all",
      title: "Fechar todos os whistles",
      file: "apps/showcase/src/app/components/whistles/samples/dismiss-all.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/whistles",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Fechar um whistle especifico quando o usuario clica em uma acao.",
    "Limpar todos os whistles quando o usuario sai da pagina ou sessao.",
    "Controlar o ciclo de vida de whistles programaticamente."
  ],
  avoidUseCases: [
    "Fechar whistles cuja duracao ja expirou; o sistema faz isso automaticamente.",
    "Usar sem ter disparado um whistle antes; valide o ID."
  ],
  synonyms: ["dismiss whistle", "close notification", "clear alert"],
  relatedEntityFields: ["dismiss", "close", "cleanup"],
  compositionHints: [
    "Chamar apos uma acao do usuario.",
    "Usar em cleanup de componentes para fechar whistles orphos.",
    "Guardar o ID retornado por sgWhistle() para dismissSgWhistle(id) posterior."
  ],
  rankingSignals: {
    freeText: 0.7,
    structuredChoice: 0.5,
    date: 0,
    number: 0.2,
    denseLayout: 0.3
  }
};
