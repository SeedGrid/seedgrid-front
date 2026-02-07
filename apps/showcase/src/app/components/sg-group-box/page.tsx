"use client";

import React from "react";
import { SgGroupBox } from "@seedgrid/fe-components";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return (
    <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {props.code}
    </pre>
  );
}

export default function SgGroupBoxPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgGroupBox</h1>
        <p className="mt-2 text-muted-foreground">
          Container com legend (fieldset) para agrupar campos.
        </p>
      </div>

      <Section title="Basico" description="Uso simples do GroupBox.">
        <div className="w-full">
          <SgGroupBox title="Dados pessoais">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Campo 1</div>
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Campo 2</div>
            </div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Dados pessoais">
  <div className="grid gap-3 sm:grid-cols-2">
    <div>Campo 1</div>
    <div>Campo 2</div>
  </div>
</SgGroupBox>`} />
      </Section>

      <Section title="Tamanho" description="Largura e altura customizaveis.">
        <div className="w-full flex flex-wrap gap-4">
          <SgGroupBox title="Largura 320px" width={320}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Conteudo</div>
          </SgGroupBox>
          <SgGroupBox title="Altura 180px" height={180}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Conteudo</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Largura 320px" width={320}>
  <div>Conteudo</div>
</SgGroupBox>

<SgGroupBox title="Altura 180px" height={180}>
  <div>Conteudo</div>
</SgGroupBox>`} />
      </Section>

      <Section title="Classe customizada" description="Use className para ajustar layout externo.">
        <div className="w-full">
          <SgGroupBox title="Com className" className="bg-foreground/5 p-2 rounded-xl">
            <div className="rounded border border-border bg-white p-3 text-sm">Conteudo</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Com className" className="bg-foreground/5 p-2 rounded-xl">
  <div>Conteudo</div>
</SgGroupBox>`} />
      </Section>
    </div>
  );
}
