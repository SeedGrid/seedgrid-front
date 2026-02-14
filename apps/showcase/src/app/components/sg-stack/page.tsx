"use client";

import React from "react";
import { SgGrid, SgPanel, SgStack, SgButton } from "@seedgrid/fe-components";
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

export default function SgStackPage() {
  return (
    <SgStack className="max-w-5xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgStack</h1>
        <p className="mt-2 text-muted-foreground">
          Wrapper flex declarativo para direcao, alinhamento, distribuicao e espacamento.
        </p>
      </SgStack>

      <Section title="Column + Row" description="Exemplos comuns de layout com stack.">
        <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
          <SgPanel padding={12} className="rounded-lg">
            <SgStack gap={8}>
              <p className="text-sm font-medium">Stack em coluna</p>
              <SgButton>Salvar</SgButton>
              <SgButton appearance="outline">Cancelar</SgButton>
              <SgButton appearance="ghost">Ajuda</SgButton>
            </SgStack>
          </SgPanel>

          <SgPanel padding={12} className="rounded-lg">
            <SgStack direction="row" justify="between" align="center" gap={8}>
              <p className="text-sm font-medium">Titulo</p>
              <SgStack direction="row" gap={8}>
                <SgButton size="sm" appearance="outline">Voltar</SgButton>
                <SgButton size="sm">Confirmar</SgButton>
              </SgStack>
            </SgStack>
          </SgPanel>
        </SgGrid>

        <SgStack className="mt-6">
          <SgCodeBlockBase
            code={`import { SgStack, SgButton } from "@seedgrid/fe-components";

<SgStack gap={8}>
  <SgButton>Salvar</SgButton>
  <SgButton appearance="outline">Cancelar</SgButton>
</SgStack>

<SgStack direction="row" justify="between" align="center">
  <span>Titulo</span>
  <SgButton size="sm">Confirmar</SgButton>
</SgStack>`}
          />
        </SgStack>
      </Section>
    </SgStack>
  );
}



