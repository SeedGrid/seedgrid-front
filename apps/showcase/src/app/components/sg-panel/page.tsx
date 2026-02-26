"use client";

import React from "react";
import { SgGrid, SgMainPanel, SgPanel, SgPlayground, SgStack } from "@seedgrid/fe-components";
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

const PANEL_PLAYGROUND_CODE = `import * as React from "react";
import { SgMainPanel, SgPanel } from "@seedgrid/fe-components";

export default function App() {
  const [leftWidth, setLeftWidth] = React.useState(20);
  const [rightWidth, setRightWidth] = React.useState(18);
  const [bottomHeight, setBottomHeight] = React.useState(10);

  return (
    <div className="space-y-3 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setLeftWidth((prev) => (prev === 20 ? 25 : 20))}>left: {leftWidth}%</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setRightWidth((prev) => (prev === 18 ? 22 : 18))}>right: {rightWidth}%</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setBottomHeight((prev) => (prev === 10 ? 14 : 10))}>bottom: {bottomHeight}%</button>
      </div>

      <div className="h-[360px] rounded-xl bg-muted/30 p-3">
        <SgMainPanel gap={8} className="h-full rounded-lg bg-background p-3">
          <SgPanel align="top" height={12} className="rounded-md p-3">Top</SgPanel>
          <SgPanel align="left" width={leftWidth} className="rounded-md p-3">Left</SgPanel>
          <SgPanel align="right" width={rightWidth} className="rounded-md p-3">Right</SgPanel>
          <SgPanel align="bottom" height={bottomHeight} className="rounded-md p-3">Bottom</SgPanel>
          <SgPanel align="client" className="rounded-md p-3">Client</SgPanel>
        </SgMainPanel>
      </div>
    </div>
  );
}`;

const PANEL_PROPS: ShowcasePropRow[] = [
  { prop: "align", type: "\"top\" | \"left\" | \"right\" | \"bottom\" | \"client\"", defaultValue: "-", description: "Posicionamento dentro do SgMainPanel." },
  { prop: "width / height", type: "number | string", defaultValue: "-", description: "Dimensão do painel (número vira %)." },
  { prop: "span / rowSpan", type: "number", defaultValue: "-", description: "Span de colunas/linhas dentro do SgGrid." },
  { prop: "borderStyle", type: "\"none\" | \"solid\" | \"dashed\"", defaultValue: "solid", description: "Estilo da borda do panel." },
  { prop: "padding", type: "number", defaultValue: "0", description: "Espaçamento interno." },
  { prop: "scrollable", type: "boolean | \"auto\" | \"x\" | \"y\"", defaultValue: "false", description: "Comportamento de rolagem." },
  { prop: "scrollbarGutter", type: "boolean", defaultValue: "false", description: "Reserva espaço para scrollbar." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Conteúdo do painel." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customização visual." }
];

export default function SgPanelPage() {
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
          title="SgPanel"
          subtitle="Showcase com exemplos de todas as props do SgPanel."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title="1) align + width + height"
        description="`align` so faz sentido dentro do `SgMainPanel`. `width`/`height` em numero sao tratados como porcentagem."
      >
        <SgPanel className="h-[430px] rounded-xl bg-muted/30" padding={12}>
          <SgMainPanel gap={8} className="h-full w-full rounded-lg bg-background p-3">
            <SgPanel align="top" height={12} padding={10} className="rounded-md">
              <SgStack direction="row" justify="between" align="center">
                <span className="text-sm font-medium">Header</span>
                <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  top + height=12%
                </span>
              </SgStack>
            </SgPanel>
            <SgPanel align="left" width={20} padding={10} className="rounded-md">
              <SgStack gap={6}>
                <span className="text-xs font-medium text-muted-foreground">MENU</span>
                <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
                <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
                <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
                <span className="pt-1 text-[11px] text-muted-foreground">left + width=20%</span>
              </SgStack>
            </SgPanel>
            <SgPanel align="right" width="18%" padding={10} className="rounded-md">
              <SgStack gap={6}>
                <span className="text-xs font-medium text-muted-foreground">ACOES</span>
                <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
                <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
                <span className="pt-1 text-[11px] text-muted-foreground">right + width=18%</span>
              </SgStack>
            </SgPanel>
            <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
              <SgStack direction="row" justify="between" align="center">
                <span className="text-sm">Footer</span>
                <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  bottom + height=10%
                </span>
              </SgStack>
            </SgPanel>
            <SgPanel align="client" padding={10} className="rounded-md">
              <SgStack gap={8}>
                <span className="text-sm font-medium">Area client</span>
                <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
                <span className="text-xs text-muted-foreground">client ocupa o restante automaticamente.</span>
              </SgStack>
            </SgPanel>
          </SgMainPanel>
        </SgPanel>

        <SgStack className="mt-6">
          <CodeBlockBase
            code={`<SgPanel className="h-[430px] rounded-xl bg-muted/30" padding={12}>
  <SgMainPanel gap={8} className="h-full w-full rounded-lg bg-background p-3">
    <SgPanel align="top" height={12} padding={10} className="rounded-md">
      <SgStack direction="row" justify="between" align="center">
        <span className="text-sm font-medium">Header</span>
        <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
          top + height=12%
        </span>
      </SgStack>
    </SgPanel>
    <SgPanel align="left" width={20} padding={10} className="rounded-md">
      <SgStack gap={6}>
        <span className="text-xs font-medium text-muted-foreground">MENU</span>
        <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
        <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
        <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
        <span className="pt-1 text-[11px] text-muted-foreground">left + width=20%</span>
      </SgStack>
    </SgPanel>
    <SgPanel align="right" width="18%" padding={10} className="rounded-md">
      <SgStack gap={6}>
        <span className="text-xs font-medium text-muted-foreground">ACOES</span>
        <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
        <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
        <span className="pt-1 text-[11px] text-muted-foreground">right + width=18%</span>
      </SgStack>
    </SgPanel>
    <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
      <SgStack direction="row" justify="between" align="center">
        <span className="text-sm">Footer</span>
        <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
          bottom + height=10%
        </span>
      </SgStack>
    </SgPanel>
    <SgPanel align="client" padding={10} className="rounded-md">
      <SgStack gap={8}>
        <span className="text-sm font-medium">Area client</span>
        <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
        <span className="text-xs text-muted-foreground">client ocupa o restante automaticamente.</span>
      </SgStack>
    </SgPanel>
  </SgMainPanel>
</SgPanel>`}
          />
        </SgStack>
      </Section>

      <Section
        title="2) span + rowSpan"
        description="`span` e `rowSpan` fazem sentido dentro do `SgGrid`."
      >
        <SgGrid columns={{ base: 1, md: 4 }} gap={8} rowHeight={90} dense>
          <SgPanel padding={10} className="rounded-md">Item 1</SgPanel>
          <SgPanel span={2} padding={10} className="rounded-md">span={2}</SgPanel>
          <SgPanel rowSpan={2} padding={10} className="rounded-md">rowSpan={2}</SgPanel>
          <SgPanel padding={10} className="rounded-md">Item 4</SgPanel>
          <SgPanel padding={10} className="rounded-md">Item 5</SgPanel>
          <SgPanel span={2} rowSpan={2} padding={10} className="rounded-md">span={2} + rowSpan={2}</SgPanel>
        </SgGrid>

        <SgStack className="mt-6">
          <CodeBlockBase
            code={`<SgGrid columns={{ base: 1, md: 4 }} gap={8} rowHeight={90} dense>
  <SgPanel padding={10} className="rounded-md">Item 1</SgPanel>
  <SgPanel span={2} padding={10} className="rounded-md">
    span={2}
  </SgPanel>
  <SgPanel rowSpan={2} padding={10} className="rounded-md">
    rowSpan={2}
  </SgPanel>
  <SgPanel padding={10} className="rounded-md">Item 4</SgPanel>
  <SgPanel padding={10} className="rounded-md">Item 5</SgPanel>
  <SgPanel span={2} rowSpan={2} padding={10} className="rounded-md">
    span={2} + rowSpan={2}
  </SgPanel>
</SgGrid>`}
          />
        </SgStack>
      </Section>

      <Section title="3) borderStyle + padding + children" description="Estilizacao basica do panel.">
        <SgGrid columns={{ base: 1, md: 3 }} gap={4}>
          <SgPanel borderStyle="none" padding={12} className="rounded-lg bg-muted/50">
            children + borderStyle="none"
          </SgPanel>
          <SgPanel borderStyle="solid" padding={12} className="rounded-lg">
            children + borderStyle="solid"
          </SgPanel>
          <SgPanel borderStyle="dashed" padding={12} className="rounded-lg">
            children + borderStyle="dashed"
          </SgPanel>
        </SgGrid>

        <SgStack className="mt-6">
          <CodeBlockBase
            code={`<SgGrid columns={{ base: 1, md: 3 }} gap={4}>
  <SgPanel borderStyle="none" padding={12} className="rounded-lg bg-muted/50">
    children + borderStyle="none"
  </SgPanel>
  <SgPanel borderStyle="solid" padding={12} className="rounded-lg">
    children + borderStyle="solid"
  </SgPanel>
  <SgPanel borderStyle="dashed" padding={12} className="rounded-lg">
    children + borderStyle="dashed"
  </SgPanel>
</SgGrid>`}
          />
        </SgStack>
      </Section>

      <Section
        title="4) scrollable + scrollbarGutter"
        description="Cobertura de scrollable boolean | auto | y | x e uso de scrollbarGutter."
      >
        <SgGrid columns={{ base: 1, md: 2 }} gap={4}>
          <SgPanel scrollable padding={10} className="h-48 rounded-lg">
            <SgStack gap={6}>
              {Array.from({ length: 10 }).map((_, i) => (
                <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
                  scrollable=true - linha {i + 1}
                </SgPanel>
              ))}
            </SgStack>
          </SgPanel>

          <SgPanel scrollable="auto" padding={10} className="h-48 rounded-lg">
            <SgStack gap={6}>
              {Array.from({ length: 10 }).map((_, i) => (
                <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
                  scrollable="auto" - linha {i + 1}
                </SgPanel>
              ))}
            </SgStack>
          </SgPanel>

          <SgPanel scrollable="y" padding={10} className="h-48 rounded-lg">
            <SgStack gap={6}>
              {Array.from({ length: 15 }).map((_, i) => (
                <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
                  Item vertical {i + 1}
                </SgPanel>
              ))}
            </SgStack>
          </SgPanel>

          <SgPanel scrollable="x" scrollbarGutter padding={10} className="h-48 rounded-lg">
            <SgStack direction="row" gap={8} className="w-[960px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <SgPanel
                  key={i}
                  borderStyle="solid"
                  className="h-24 w-24 rounded bg-muted/30"
                >
                  <SgStack className="h-full" justify="center" align="center">Box {i + 1}</SgStack>
                </SgPanel>
              ))}
            </SgStack>
          </SgPanel>
        </SgGrid>

        <SgStack className="mt-6">
          <CodeBlockBase
            code={`<SgGrid columns={{ base: 1, md: 2 }} gap={4}>
  <SgPanel scrollable padding={10} className="h-48 rounded-lg">
    <SgStack gap={6}>
      {Array.from({ length: 10 }).map((_, i) => (
        <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
          scrollable=true - linha {i + 1}
        </SgPanel>
      ))}
    </SgStack>
  </SgPanel>

  <SgPanel scrollable="auto" padding={10} className="h-48 rounded-lg">
    <SgStack gap={6}>
      {Array.from({ length: 10 }).map((_, i) => (
        <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
          scrollable="auto" - linha {i + 1}
        </SgPanel>
      ))}
    </SgStack>
  </SgPanel>

  <SgPanel scrollable="y" padding={10} className="h-48 rounded-lg">
    <SgStack gap={6}>
      {Array.from({ length: 15 }).map((_, i) => (
        <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" padding={8}>
          Item vertical {i + 1}
        </SgPanel>
      ))}
    </SgStack>
  </SgPanel>

  <SgPanel scrollable="x" scrollbarGutter padding={10} className="h-48 rounded-lg">
    <SgStack direction="row" gap={8} className="w-[960px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <SgPanel key={i} borderStyle="solid" className="h-24 w-24 rounded bg-muted/30">
          <SgStack className="h-full" justify="center" align="center">Box {i + 1}</SgStack>
        </SgPanel>
      ))}
    </SgStack>
  </SgPanel>
</SgGrid>`}
          />
        </SgStack>
      </Section>

      <Section title="5) Exemplo combinado" description="Exemplo unico com props de dock/layout e de grid, com codigo 1:1.">
        <SgStack gap={10}>
          <SgPanel className="h-[260px] rounded-xl bg-muted/30" padding={10}>
            <SgMainPanel gap={8} className="h-full rounded-lg bg-background p-3">
              <SgPanel align="top" height={10} borderStyle="solid" padding={12}>
                header
              </SgPanel>
              <SgPanel align="left" width={18} borderStyle="dashed" padding={8} scrollable="y">
                menu
              </SgPanel>
              <SgPanel align="client" borderStyle="none" padding={10} scrollable="auto" scrollbarGutter>
                conteudo
              </SgPanel>
            </SgMainPanel>
          </SgPanel>

          <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
            <SgPanel span={2}>span=2</SgPanel>
            <SgPanel rowSpan={2}>rowSpan=2</SgPanel>
          </SgGrid>
        </SgStack>

        <SgStack className="mt-6">
          <CodeBlockBase
            code={`<SgStack gap={10}>
  <SgPanel className="h-[260px] rounded-xl bg-muted/30" padding={10}>
    <SgMainPanel gap={8} className="h-full rounded-lg bg-background p-3">
      <SgPanel align="top" height={10} borderStyle="solid" padding={12}>
        header
      </SgPanel>
      <SgPanel align="left" width={18} borderStyle="dashed" padding={8} scrollable="y">
        menu
      </SgPanel>
      <SgPanel align="client" borderStyle="none" padding={10} scrollable="auto" scrollbarGutter>
        conteudo
      </SgPanel>
    </SgMainPanel>
  </SgPanel>

  <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
    <SgPanel span={2}>span=2</SgPanel>
    <SgPanel rowSpan={2}>rowSpan=2</SgPanel>
  </SgGrid>
</SgStack>`}
          />
        </SgStack>
      </Section>

        <Section title="6) Playground (SgPlayground)" description="Teste rápido das principais props do SgPanel.">
          <SgPlayground
            title="SgPanel Playground"
            interactive
            codeContract="appFile"
            code={PANEL_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PANEL_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
