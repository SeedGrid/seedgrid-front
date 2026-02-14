"use client";

import React from "react";
import { SgGrid, SgPanel, SgStack } from "@seedgrid/fe-components";
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

export default function SgGridPage() {
  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgGrid</h1>
        <p className="mt-2 text-muted-foreground">
          Grid com colunas responsivas, modo `auto-fit`, suporte a `span`, `rowSpan`, `dense` e `rowHeight`.
        </p>
      </SgStack>

      <Section title="Columns Responsivo" description="`columns` com breakpoints e `span` por item.">
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
          <SgCodeBlockBase
            code={`<SgGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={12}>
  <SgPanel>Card 1</SgPanel>
  <SgPanel>Card 2</SgPanel>
  <SgPanel span={2}>Card 3 (span 2)</SgPanel>
</SgGrid>`}
          />
        </SgStack>
      </Section>

      <Section title="Auto-Fit + RowSpan" description="Grid fluido com `minItemWidth`, `dense` e `rowHeight`.">
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
          <SgCodeBlockBase
            code={`<SgGrid minItemWidth="16rem" gap={12} rowHeight={120} dense>
  <SgPanel>Card A</SgPanel>
  <SgPanel rowSpan={2}>Card B</SgPanel>
  <SgPanel span={2}>Card C</SgPanel>
</SgGrid>`}
          />
        </SgStack>
      </Section>
    </SgStack>
  );
}



