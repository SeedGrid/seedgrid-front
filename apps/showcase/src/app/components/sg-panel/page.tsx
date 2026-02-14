"use client";

import React from "react";
import { SgGrid, SgMainPanel, SgPanel, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <SgPanel borderStyle="solid" className="rounded-lg border-border" padding={24}>
      <SgStack gap={16}>
        <SgStack gap={4}>
          <h2 className="text-lg font-semibold">{props.title}</h2>
          {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
        </SgStack>
        {props.children}
      </SgStack>
    </SgPanel>
  );
}

export default function SgPanelPage() {
  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgPanel</h1>
        <p className="mt-2 text-muted-foreground">
          Showcase com exemplos de todas as props do `SgPanel`.
        </p>
      </SgStack>

      <Section
        title="align + width + height"
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
          <SgCodeBlockBase
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
        title="span + rowSpan"
        description="`span` e `rowSpan` fazem sentido dentro do `SgGrid`."
      >
        <SgGrid columns={{ base: 1, md: 4 }} gap={8} rowHeight={90} dense>
          <SgPanel padding={10} className="rounded-md">Item 1</SgPanel>
          <SgPanel span={2} padding={10} className="rounded-md">
            {"span={2}"}
          </SgPanel>
          <SgPanel rowSpan={2} padding={10} className="rounded-md">
            {"rowSpan={2}"}
          </SgPanel>
          <SgPanel padding={10} className="rounded-md">Item 4</SgPanel>
          <SgPanel padding={10} className="rounded-md">Item 5</SgPanel>
          <SgPanel span={2} rowSpan={2} padding={10} className="rounded-md">
            {"span={2} + rowSpan={2}"}
          </SgPanel>
        </SgGrid>

        <SgStack className="mt-6">
          <SgCodeBlockBase
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

      <Section title="borderStyle + padding + children" description="Estilizacao basica do panel.">
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
          <SgCodeBlockBase
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
        title="scrollable + scrollbarGutter"
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
          <SgCodeBlockBase
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

      <Section title="Snippet com todas as props" description="Resumo rapido de uso cobrindo toda a API do SgPanel.">
        <SgCodeBlockBase
          code={`import { SgMainPanel, SgGrid, SgPanel } from "@seedgrid/fe-components";

// Props de dock/layout
<SgMainPanel>
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

// Props de grid
<SgGrid columns={{ base: 1, md: 3 }} gap={8}>
  <SgPanel span={2}>span=2</SgPanel>
  <SgPanel rowSpan={2}>rowSpan=2</SgPanel>
</SgGrid>`}
        />
      </Section>
    </SgStack>
  );
}


