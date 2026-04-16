import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.time",
  package: "@seedgrid/fe-components",
  exportName: "useSgTime",
  slug: "use-sg-time",
  displayName: "useSgTime",
  category: "hook",
  subcategory: "time",
  description:
    "Hook para acessar contexto de sincronizacao de tempo com servidor. Fornece timestamp atual e tick para atualizacoes periodicas.",
  tags: ["hook", "time", "sync", "context"],
  capabilities: ["server-time-sync", "tick-updates", "fallback-local-time"],
  fieldSemantics: ["timeContext", "serverSync", "tickUpdates"],
  props: [
    {
      name: "returns.serverStartMs",
      type: "number",
      description: "Timestamp do servidor em milissegundos quando o provider foi montado.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.perfStartMs",
      type: "number",
      description: "Marca de performance.now() quando o provider hidratou.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.tick",
      type: "number",
      description: "Contador que incrementa a cada segundo, dispara atualizacoes.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.nowMs",
      type: "() => number",
      description: "Funcao que retorna o timestamp atual sincronizado com servidor.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["hydrated", "synced", "ticking"],
  examples: [
    {
      id: "basic",
      title: "Acessar tempo sincronizado",
      file: "apps/showcase/src/app/components/hooks/use-sg-time/samples/basic.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-time",
    hasPlayground: false,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Sincronizar relogios e contadores com o servidor.",
    "Animar displays de tempo ou contagens regressivas com atualizacoes de tick.",
    "Garantir que componentes vizuais permanecam alinhados apos SSR."
  ],
  avoidUseCases: [
    "Usar para polling rapido de dados; use callbacks ou react-query.",
    "Armazenar estado derivado de time; use useMemo ou useCallback."
  ],
  synonyms: ["time context", "time sync", "server time", "ticker"],
  relatedEntityFields: ["timestamp", "synchronization", "ticker"],
  compositionHints: [
    "Envolver a arvore com SgTimeProvider antes de usar este hook.",
    "Usar com SgClock ou outros gadgets de exibicao de tempo."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0.85,
    number: 0.7,
    denseLayout: 0
  }
};
