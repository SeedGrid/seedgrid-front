"use client";

import React from "react";
import { SgGrid, SgPanel, SgPlayground, SgStack } from "@seedgrid/fe-components";
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
      </SgStack>
    </SgPanel>
  );
}

const GRID_PLAYGROUND_CODE = `import * as React from "react";
import { SgGrid, SgPanel } from "@seedgrid/fe-components";

export default function App() {
  const [dense, setDense] = React.useState(true);

  return (
    <div className="space-y-3 p-2">
      <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setDense((prev) => !prev)}>
        dense: {String(dense)}
      </button>
      <SgGrid minItemWidth="14rem" gap={10} rowHeight={100} dense={dense}>
        <SgPanel className="rounded-md p-3">Item 1</SgPanel>
        <SgPanel span={2} className="rounded-md p-3">Item 2 (span 2)</SgPanel>
        <SgPanel rowSpan={2} className="rounded-md p-3">Item 3 (rowSpan 2)</SgPanel>
        <SgPanel className="rounded-md p-3">Item 4</SgPanel>
        <SgPanel className="rounded-md p-3">Item 5</SgPanel>
      </SgGrid>
    </div>
  );
}`;

const GRID_PROPS: ShowcasePropRow[] = [
  { prop: "columns", type: "number | breakpoint map", defaultValue: "12", description: "Quantidade de colunas no grid." },
  { prop: "minItemWidth", type: "number | string", defaultValue: "-", description: "Habilita modo auto-fit por largura minima." },
  { prop: "gap / padding", type: "number", defaultValue: "0 / 0", description: "Espacamento entre itens e interno." },
  { prop: "dense", type: "boolean", defaultValue: "false", description: "Preenche lacunas no fluxo do grid." },
  { prop: "rowHeight", type: "number | string", defaultValue: "auto", description: "Altura base para uso com rowSpan." },
  { prop: "justify / align", type: "CSS justify/align", defaultValue: "-", description: "Alinhamento do grid." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Itens do grid (ex.: SgPanel)." }
];

type GridTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  playgroundTitle: string;
};

const GRID_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", GridTexts> = {
  "pt-BR": {
    subtitle: "Grid com colunas responsivas, auto-fit, span, rowSpan, dense e rowHeight.",
    section1Title: "1) Columns Responsivo",
    section1Description: "`columns` com breakpoints e `span` por item.",
    section2Title: "2) Auto-Fit + RowSpan",
    section2Description: "Grid fluido com `minItemWidth`, `dense` e `rowHeight`.",
    section3Title: "3) Playground (SgPlayground)",
    section3Description: "Teste das props principais do SgGrid.",
    playgroundTitle: "SgGrid Playground"
  },
  "pt-PT": {
    subtitle: "Grid com colunas responsivas, auto-fit, span, rowSpan, dense e rowHeight.",
    section1Title: "1) Columns Responsivo",
    section1Description: "`columns` com breakpoints e `span` por item.",
    section2Title: "2) Auto-Fit + RowSpan",
    section2Description: "Grid fluido com `minItemWidth`, `dense` e `rowHeight`.",
    section3Title: "3) Playground (SgPlayground)",
    section3Description: "Teste das props principais do SgGrid.",
    playgroundTitle: "SgGrid Playground"
  },
  "en-US": {
    subtitle: "Grid with responsive columns, auto-fit, span, rowSpan, dense mode and rowHeight.",
    section1Title: "1) Responsive Columns",
    section1Description: "`columns` with breakpoints and per-item `span`.",
    section2Title: "2) Auto-Fit + RowSpan",
    section2Description: "Fluid grid with `minItemWidth`, `dense`, and `rowHeight`.",
    section3Title: "3) Playground (SgPlayground)",
    section3Description: "Try the main SgGrid props.",
    playgroundTitle: "SgGrid Playground"
  },
  es: {
    subtitle: "Grid con columnas responsivas, auto-fit, span, rowSpan, dense y rowHeight.",
    section1Title: "1) Columnas Responsivas",
    section1Description: "`columns` con breakpoints y `span` por item.",
    section2Title: "2) Auto-Fit + RowSpan",
    section2Description: "Grid fluido con `minItemWidth`, `dense` y `rowHeight`.",
    section3Title: "3) Playground (SgPlayground)",
    section3Description: "Prueba las props principales de SgGrid.",
    playgroundTitle: "SgGrid Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof GRID_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgGridPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof GRID_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = GRID_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgGrid"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <SgGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={12}>
            <Card title="Card 1" />
            <Card title="Card 2" />
            <SgPanel span={2} padding={12} className="rounded-lg">
              <SgStack gap={8}>
                <p className="font-medium">Card 3 (span 2)</p>
                <p className="text-xs text-muted-foreground">Ocupa 2 colunas.</p>
              </SgStack>
            </SgPanel>
            <Card title="Card 4" />
            <Card title="Card 5" />
            <Card title="Card 6" />
          </SgGrid>

          <SgStack className="mt-6">
            <CodeBlockBase
              code={`<SgGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={12}>
  <SgPanel>Card 1</SgPanel>
  <SgPanel>Card 2</SgPanel>
  <SgPanel span={2}>Card 3 (span 2)</SgPanel>
</SgGrid>`}
            />
          </SgStack>
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <SgGrid minItemWidth="16rem" gap={12} rowHeight={120} dense>
            <Card title="Card A" />
            <SgPanel rowSpan={2} padding={12} className="rounded-lg">
              <SgStack gap={8}>
                <p className="font-medium">Card B (rowSpan 2)</p>
                <p className="text-xs text-muted-foreground">Ocupa 2 linhas do grid.</p>
              </SgStack>
            </SgPanel>
            <Card title="Card C" />
            <SgPanel span={2} padding={12} className="rounded-lg">
              <SgStack gap={8}>
                <p className="font-medium">Card D (span 2)</p>
                <p className="text-xs text-muted-foreground">Ocupa 2 colunas.</p>
              </SgStack>
            </SgPanel>
            <Card title="Card E" />
            <Card title="Card F" />
          </SgGrid>

          <SgStack className="mt-6">
            <CodeBlockBase
              code={`<SgGrid minItemWidth="16rem" gap={12} rowHeight={120} dense>
  <SgPanel>Card A</SgPanel>
  <SgPanel rowSpan={2}>Card B</SgPanel>
  <SgPanel span={2}>Card C</SgPanel>
</SgGrid>`}
            />
          </SgStack>
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={GRID_PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={GRID_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
