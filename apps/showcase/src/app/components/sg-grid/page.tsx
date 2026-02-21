"use client";

import React from "react";
import { SgGrid, SgPanel, SgPlayground, SgStack } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

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
  { prop: "minItemWidth", type: "number | string", defaultValue: "-", description: "Habilita modo auto-fit por largura mínima." },
  { prop: "gap / padding", type: "number", defaultValue: "0 / 0", description: "Espaçamento entre itens e interno." },
  { prop: "dense", type: "boolean", defaultValue: "false", description: "Preenche lacunas no fluxo do grid." },
  { prop: "rowHeight", type: "number | string", defaultValue: "auto", description: "Altura base para uso com rowSpan." },
  { prop: "justify / align", type: "CSS justify/align", defaultValue: "-", description: "Alinhamento do grid." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Itens do grid (ex.: SgPanel)." }
];

export default function SgGridPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

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
          subtitle="Grid com colunas responsivas, auto-fit, span, rowSpan, dense e rowHeight."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section title="1) Columns Responsivo" description="`columns` com breakpoints e `span` por item.">
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

      <Section title="2) Auto-Fit + RowSpan" description="Grid fluido com `minItemWidth`, `dense` e `rowHeight`.">
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

        <Section title="3) Playground (SgPlayground)" description="Teste das props principais do SgGrid.">
          <SgPlayground
            title="SgGrid Playground"
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

