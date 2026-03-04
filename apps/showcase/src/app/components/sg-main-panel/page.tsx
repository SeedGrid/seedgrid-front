"use client";

import React from "react";
import {
  SgScreen,
  SgMainPanel,
  SgPanel,
  SgGrid,
  SgStack,
  SgButton,
  SgInputText,
  SgBadge,
  SgPlayground
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)]"
    >
      <SgPanel borderStyle="solid" className="rounded-lg border-border p-6" padding={24}>
        <SgStack gap={16}>
          <SgStack gap={4}>
            <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
            {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
          </SgStack>
          {props.children}
        </SgStack>
      </SgPanel>
    </section>
  );
}

function Card(props: { title: string; subtitle?: string }) {
  return (
    <SgPanel padding={12} className="rounded-lg">
      <SgStack gap={8}>
        <p className="font-medium">{props.title}</p>
        <p className="text-xs text-muted-foreground">{props.subtitle ?? "Card padrao"}</p>
        <SgPanel borderStyle="solid" className="h-16 rounded bg-muted/30" />
        <SgStack direction="row" justify="between" align="center">
          <span className="text-xs text-muted-foreground">Status: OK</span>
          <SgButton size="sm" appearance="outline">Abrir</SgButton>
        </SgStack>
      </SgStack>
    </SgPanel>
  );
}

const MAIN_PANEL_PLAYGROUND_CODE = `import * as React from "react";
import { SgMainPanel, SgPanel, SgScreen } from "@seedgrid/fe-components";

export default function App() {
  const [gap, setGap] = React.useState(10);
  const [padding, setPadding] = React.useState(10);

  return (
    <div className="space-y-3 p-2">
      <div className="flex gap-2">
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setGap((prev) => (prev === 10 ? 16 : 10))}>
          gap: {gap}
        </button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setPadding((prev) => (prev === 10 ? 14 : 10))}>
          padding: {padding}
        </button>
      </div>

      <SgPanel className="h-[360px] rounded-xl bg-muted/30" padding={10}>
        <SgScreen fullscreen={false} padding={8} className="rounded-lg bg-zinc-100">
          <SgMainPanel gap={gap} padding={padding}>
            <SgPanel align="top" height={12} className="rounded-md p-3">Top</SgPanel>
            <SgPanel align="left" width={22} className="rounded-md p-3">Left</SgPanel>
            <SgPanel align="right" width={18} className="rounded-md p-3">Right</SgPanel>
            <SgPanel align="bottom" height={10} className="rounded-md p-3">Bottom</SgPanel>
            <SgPanel align="client" className="rounded-md p-3">Client</SgPanel>
          </SgMainPanel>
        </SgScreen>
      </SgPanel>
    </div>
  );
}`;

const MAIN_PANEL_FULL_EXAMPLE_CODE = `import React from "react";
import {
  SgScreen,
  SgMainPanel,
  SgPanel,
  SgGrid,
  SgStack,
  SgButton,
  SgInputText,
  SgBadge
} from "@seedgrid/fe-components";

function Card(props: { title: string; subtitle?: string }) {
  return (
    <SgPanel padding={12} className="rounded-lg">
      <SgStack gap={8}>
        <p className="font-medium">{props.title}</p>
        <p className="text-xs text-muted-foreground">{props.subtitle ?? "Card padrao"}</p>
        <SgPanel borderStyle="solid" className="h-16 rounded bg-muted/30" />
        <SgStack direction="row" justify="between" align="center">
          <span className="text-xs text-muted-foreground">Status: OK</span>
          <SgButton size="sm" appearance="outline">Abrir</SgButton>
        </SgStack>
      </SgStack>
    </SgPanel>
  );
}

export default function Example() {
  const [mode, setMode] = React.useState<"columns" | "autofit">("columns");
  const [search, setSearch] = React.useState("");

  return (
    <SgPanel className="h-[780px] rounded-xl bg-muted/30" padding={12}>
      <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
        <SgMainPanel gap={10} padding={10}>
          <SgPanel align="top" height={10} padding={10} className="rounded-lg">
            <SgStack direction="row" justify="between" align="center" wrap gap={10}>
              <SgStack direction="row" align="center" gap={8}>
                <SgPanel borderStyle="none" className="h-8 w-8 rounded bg-zinc-900" />
                <SgStack gap={2}>
                  <p className="text-sm font-semibold">SeedGrid Layout Showcase</p>
                  <p className="text-xs text-muted-foreground">Header (height = 10%)</p>
                </SgStack>
              </SgStack>

              <SgStack direction="row" gap={8} align="center" wrap>
                <SgInputText
                  id="search-main-panel"
                  label="Pesquisa"
                  width={220}
                  inputProps={{ value: search, placeholder: "Pesquisar..." }}
                  onChange={setSearch}
                />
                <SgButton appearance="outline" onClick={() => setMode("columns")}>
                  Grid Responsivo
                </SgButton>
                <SgButton appearance="outline" onClick={() => setMode("autofit")}>
                  Auto-fit
                </SgButton>
                <SgButton>Novo</SgButton>
              </SgStack>
            </SgStack>
          </SgPanel>

          <SgPanel align="left" width={18} padding={10} scrollable="y" className="rounded-lg">
            <SgStack gap={8}>
              <p className="text-xs font-medium text-muted-foreground">MENU</p>
              <SgButton appearance="outline">Dashboard</SgButton>
              <SgButton appearance="outline">Relatorios</SgButton>
              <SgButton appearance="outline">Clientes</SgButton>
              <SgButton appearance="outline">Produtos</SgButton>
              <p className="pt-2 text-xs font-medium text-muted-foreground">STATUS</p>
              <SgPanel borderStyle="dashed" padding={8} className="rounded-md">
                <SgStack gap={6}>
                  <p className="text-xs">Ambiente: dev</p>
                  <p className="text-xs">Tenant: seedgrid-demo</p>
                </SgStack>
              </SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="right" width={18} padding={10} scrollable="y" className="rounded-lg">
            <SgStack gap={8}>
              <p className="text-xs font-medium text-muted-foreground">ACOES</p>
              <SgPanel padding={8} className="rounded-md">
                <SgStack gap={6}>
                  <p className="text-xs font-medium">Filtros rapidos</p>
                  <SgStack direction="row" gap={6} wrap>
                    <SgBadge value="Hoje" />
                    <SgBadge value="7 dias" />
                    <SgBadge value="Mes" />
                    <SgBadge value="Ativos" />
                  </SgStack>
                </SgStack>
              </SgPanel>
              <SgPanel borderStyle="dashed" padding={8} className="rounded-md">
                <SgStack gap={6}>
                  <p className="text-xs">Modo: {mode}</p>
                  <p className="text-xs">Search: {search || "(vazio)"}</p>
                </SgStack>
              </SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="bottom" height={7} padding={10} className="rounded-lg">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-xs text-muted-foreground">Footer (height = 7%)</span>
              <SgStack direction="row" gap={8}>
                <SgButton size="sm" appearance="outline">Ajuda</SgButton>
                <SgButton size="sm">Salvar</SgButton>
              </SgStack>
            </SgStack>
          </SgPanel>

          <SgPanel align="client" padding={10} scrollable="y" scrollbarGutter className="rounded-lg">
            <SgStack gap={12}>
              <SgStack direction="row" justify="between" align="center" wrap>
                <SgStack gap={2}>
                  <p className="text-sm font-semibold">Conteudo (client)</p>
                  <p className="text-xs text-muted-foreground">
                    Area restante do layout com scroll vertical.
                  </p>
                </SgStack>
              </SgStack>

              {mode === "columns" ? (
                <SgGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={10}>
                  <Card title="Card 1" />
                  <Card title="Card 2" />
                  <SgPanel span={2} padding={12} className="rounded-lg">
                    <SgStack gap={8}>
                      <p className="font-medium">Card 3 (span 2)</p>
                      <p className="text-xs text-muted-foreground">Ocupa duas colunas.</p>
                    </SgStack>
                  </SgPanel>
                  <Card title="Card 4" />
                  <Card title="Card 5" />
                </SgGrid>
              ) : (
                <SgGrid minItemWidth="16rem" gap={10} rowHeight={120} dense>
                  <Card title="Card A" />
                  <SgPanel rowSpan={2} padding={12} className="rounded-lg">
                    <SgStack gap={8}>
                      <p className="font-medium">Card B (rowSpan 2)</p>
                      <p className="text-xs text-muted-foreground">Com dense + rowHeight.</p>
                    </SgStack>
                  </SgPanel>
                  <Card title="Card C" />
                  <SgPanel span={2} padding={12} className="rounded-lg">
                    <SgStack gap={8}>
                      <p className="font-medium">Card D (span 2)</p>
                      <p className="text-xs text-muted-foreground">Tambem funciona em auto-fit.</p>
                    </SgStack>
                  </SgPanel>
                  <Card title="Card E" />
                </SgGrid>
              )}
            </SgStack>
          </SgPanel>
        </SgMainPanel>
      </SgScreen>
    </SgPanel>
  );
}`;
const MAIN_PANEL_PROPS: ShowcasePropRow[] = [
  { prop: "gap", type: "number", defaultValue: "0", description: "Spacing between child panels." },
  { prop: "padding", type: "number", defaultValue: "0", description: "Padding interno do container." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Aligned panels (`top|left|right|bottom|client`)." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Additional visual and layout customization." }
];

type MainPanelTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  playgroundTitle: string;
};

const MAIN_PANEL_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", MainPanelTexts> = {
  "pt-BR": {
    subtitle: "Layout estilo Delphi com align=\"top|left|bottom|right|client\". width e height numericos viram porcentagem.",
    section1Title: "1) Complete Example",
    section1Description: "Combina SgScreen, SgMainPanel, SgPanel, SgGrid e SgStack em uma tela de dashboard.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Teste rapido das principais props do SgMainPanel.",
    playgroundTitle: "SgMainPanel Playground"
  },
  "pt-PT": {
    subtitle: "Layout estilo Delphi com align=\"top|left|bottom|right|client\". width e height numericos viram percentagem.",
    section1Title: "1) Complete Example",
    section1Description: "Combina SgScreen, SgMainPanel, SgPanel, SgGrid e SgStack num ecra de dashboard.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Teste rapido das principais props do SgMainPanel.",
    playgroundTitle: "SgMainPanel Playground"
  },
  "en-US": {
    subtitle: "Delphi-style layout with align=\"top|left|bottom|right|client\". Numeric width and height are treated as percentages.",
    section1Title: "1) Full Example",
    section1Description: "Combines SgScreen, SgMainPanel, SgPanel, SgGrid and SgStack in a dashboard screen.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Quick test for the main SgMainPanel props.",
    playgroundTitle: "SgMainPanel Playground"
  },
  es: {
    subtitle: "Layout estilo Delphi con align=\"top|left|bottom|right|client\". width y height numericos se tratan como porcentaje.",
    section1Title: "1) Ejemplo Completo",
    section1Description: "Combina SgScreen, SgMainPanel, SgPanel, SgGrid y SgStack en una pantalla dashboard.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Prueba rapida de las props principales de SgMainPanel.",
    playgroundTitle: "SgMainPanel Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof MAIN_PANEL_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgMainPanelPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof MAIN_PANEL_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = MAIN_PANEL_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const [mode, setMode] = React.useState<"columns" | "autofit">("columns");
  const [search, setSearch] = React.useState("");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-7xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMainPanel"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={texts.section1Title}
        description={texts.section1Description}
      >
        <SgPanel className="h-[780px] rounded-xl bg-muted/30" padding={12}>
          <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
            <SgMainPanel gap={10} padding={10}>
              <SgPanel align="top" height={10} padding={10} className="rounded-lg">
                <SgStack direction="row" justify="between" align="center" wrap gap={10}>
                  <SgStack direction="row" align="center" gap={8}>
                    <SgPanel borderStyle="none" className="h-8 w-8 rounded bg-zinc-900" />
                    <SgStack gap={2}>
                      <p className="text-sm font-semibold">SeedGrid Layout Showcase</p>
                      <p className="text-xs text-muted-foreground">Header (height = 10%)</p>
                    </SgStack>
                  </SgStack>

                  <SgStack direction="row" gap={8} align="center" wrap>
                    <SgInputText
                      id="search-main-panel"
                      label="Pesquisa"
                      width={220}
                      inputProps={{ value: search, placeholder: "Pesquisar..." }}
                      onChange={setSearch}
                    />
                    <SgButton appearance="outline" onClick={() => setMode("columns")}>
                      Grid Responsivo
                    </SgButton>
                    <SgButton appearance="outline" onClick={() => setMode("autofit")}>
                      Auto-fit
                    </SgButton>
                    <SgButton>Novo</SgButton>
                  </SgStack>
                </SgStack>
              </SgPanel>

              <SgPanel align="left" width={18} padding={10} scrollable="y" className="rounded-lg">
                <SgStack gap={8}>
                  <p className="text-xs font-medium text-muted-foreground">MENU</p>
                  <SgButton appearance="outline">Dashboard</SgButton>
                  <SgButton appearance="outline">Relatorios</SgButton>
                  <SgButton appearance="outline">Clientes</SgButton>
                  <SgButton appearance="outline">Produtos</SgButton>
                  <p className="pt-2 text-xs font-medium text-muted-foreground">STATUS</p>
                  <SgPanel borderStyle="dashed" padding={8} className="rounded-md">
                    <SgStack gap={6}>
                      <p className="text-xs">Ambiente: dev</p>
                      <p className="text-xs">Tenant: seedgrid-demo</p>
                    </SgStack>
                  </SgPanel>
                </SgStack>
              </SgPanel>

              <SgPanel align="right" width={18} padding={10} scrollable="y" className="rounded-lg">
                <SgStack gap={8}>
                  <p className="text-xs font-medium text-muted-foreground">ACOES</p>
                  <SgPanel padding={8} className="rounded-md">
                    <SgStack gap={6}>
                      <p className="text-xs font-medium">Filtros rapidos</p>
                      <SgStack direction="row" gap={6} wrap>
                        <SgBadge value="Hoje" />
                        <SgBadge value="7 dias" />
                        <SgBadge value="Mes" />
                        <SgBadge value="Ativos" />
                      </SgStack>
                    </SgStack>
                  </SgPanel>
                  <SgPanel borderStyle="dashed" padding={8} className="rounded-md">
                    <SgStack gap={6}>
                      <p className="text-xs">Modo: {mode}</p>
                      <p className="text-xs">Search: {search || "(vazio)"}</p>
                    </SgStack>
                  </SgPanel>
                </SgStack>
              </SgPanel>

              <SgPanel align="bottom" height={7} padding={10} className="rounded-lg">
                <SgStack direction="row" justify="between" align="center">
                  <span className="text-xs text-muted-foreground">Footer (height = 7%)</span>
                  <SgStack direction="row" gap={8}>
                    <SgButton size="sm" appearance="outline">Ajuda</SgButton>
                    <SgButton size="sm">Save</SgButton>
                  </SgStack>
                </SgStack>
              </SgPanel>

              <SgPanel align="client" padding={10} scrollable="y" scrollbarGutter className="rounded-lg">
                <SgStack gap={12}>
                  <SgStack direction="row" justify="between" align="center" wrap>
                    <SgStack gap={2}>
                      <p className="text-sm font-semibold">Conteudo (client)</p>
                      <p className="text-xs text-muted-foreground">
                        Area restante do layout com scroll vertical.
                      </p>
                    </SgStack>
                  </SgStack>

                  {mode === "columns" ? (
                    <SgGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={10}>
                      <Card title="Card 1" />
                      <Card title="Card 2" />
                      <SgPanel span={2} padding={12} className="rounded-lg">
                        <SgStack gap={8}>
                          <p className="font-medium">Card 3 (span 2)</p>
                          <p className="text-xs text-muted-foreground">Ocupa duas colunas.</p>
                        </SgStack>
                      </SgPanel>
                      <Card title="Card 4" />
                      <Card title="Card 5" />
                    </SgGrid>
                  ) : (
                    <SgGrid minItemWidth="16rem" gap={10} rowHeight={120} dense>
                      <Card title="Card A" />
                      <SgPanel rowSpan={2} padding={12} className="rounded-lg">
                        <SgStack gap={8}>
                          <p className="font-medium">Card B (rowSpan 2)</p>
                          <p className="text-xs text-muted-foreground">Com dense + rowHeight.</p>
                        </SgStack>
                      </SgPanel>
                      <Card title="Card C" />
                      <SgPanel span={2} padding={12} className="rounded-lg">
                        <SgStack gap={8}>
                          <p className="font-medium">Card D (span 2)</p>
                          <p className="text-xs text-muted-foreground">Tambem funciona em auto-fit.</p>
                        </SgStack>
                      </SgPanel>
                      <Card title="Card E" />
                    </SgGrid>
                  )}
                </SgStack>
              </SgPanel>
            </SgMainPanel>
          </SgScreen>
        </SgPanel>

        <SgStack className="mt-6">
          <CodeBlockBase code={MAIN_PANEL_FULL_EXAMPLE_CODE} />
        </SgStack>
      </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={MAIN_PANEL_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={MAIN_PANEL_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


