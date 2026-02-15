"use client";

import React from "react";
import { SgCard, SgPlayground } from "@seedgrid/fe-components";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function ExampleCodeCard(props: { code: string }) {
  return (
    <SgCard
      title="Codigo do exemplo"
      description="JSX usado para montar este playground."
      collapsible
      defaultOpen={false}
      className="mt-4"
    >
      <pre className="overflow-auto rounded-md bg-foreground/5 p-4 text-xs leading-relaxed">
        <code>{props.code}</code>
      </pre>
    </SgCard>
  );
}

const READONLY_CODE = `<SgButton severity="primary">Salvar</SgButton>
<SgButton appearance="outline">Cancelar</SgButton>`;

const RENDER_BODY_CODE = `<SgStack gap={12}>
  <SgInputText id="nome" label="Nome" />
  <SgStack direction="row" gap={8}>
    <SgButton severity="primary">Salvar</SgButton>
    <SgButton appearance="outline">Cancelar</SgButton>
  </SgStack>
</SgStack>`;

const APP_FILE_CODE = `import * as React from "react";
import { SgButton, SgCard, SgInputText, SgStack } from "@seedgrid/fe-components";

export default function App() {
  const [name, setName] = React.useState("");

  return (
    <SgCard title="Cadastro rapido" description="Exemplo no modo appFile">
      <SgStack gap={12}>
        <SgInputText
          id="name"
          label="Nome"
          value={name}
          onChange={setName}
        />
        <SgButton severity="primary" onClick={() => alert("Salvo: " + name)}>
          Salvar
        </SgButton>
      </SgStack>
    </SgCard>
  );
}`;

const READONLY_EXAMPLE_IMPL = `<SgPlayground
  title="Snippet somente leitura"
  description="Ideal para documentacao simples."
  code={READONLY_CODE}
  defaultOpen={false}
/>;
`;

const RENDER_BODY_EXAMPLE_IMPL = `<SgPlayground
  title="Editor + preview em tempo real"
  description="Use Run para atualizar o preview."
  interactive
  code={RENDER_BODY_CODE}
  defaultImports={'import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";'}
  height={380}
/>;
`;

const APP_FILE_EXAMPLE_IMPL = `<SgPlayground
  title="App.tsx completo"
  interactive
  codeContract="appFile"
  code={APP_FILE_CODE}
  height={420}
/>;
`;

const VISUAL_VARIANTS_EXAMPLE_IMPL = `<SgPlayground
  interactive
  code={RENDER_BODY_CODE}
  defaultImports={'import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";'}
  withCard={false}
  expandable={false}
  resizable={false}
  height={300}
  previewPadding={16}
/>;
`;

export default function SgPlaygroundPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgPlayground</h1>
        <p className="mt-2 text-muted-foreground">
          Playground com editor de codigo + preview, suporte a snippet (`renderBody`) e arquivo completo (`appFile`).
        </p>
      </div>

      <Section
        title="1) Modo leitura (somente codigo)"
        description="Quando interactive=false, ele funciona como bloco de codigo colapsavel."
      >
        <div className="space-y-4">
          <SgPlayground
            title="Snippet somente leitura"
            description="Ideal para documentacao simples."
            code={READONLY_CODE}
            defaultOpen={false}
          />
          <ExampleCodeCard code={READONLY_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="2) Modo interativo (renderBody)"
        description="Recebe apenas o corpo do JSX e monta um App de exemplo automaticamente."
      >
        <div className="space-y-4">
          <SgPlayground
            title="Editor + preview em tempo real"
            description="Use Run para atualizar o preview."
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            height={380}
          />
          <ExampleCodeCard code={RENDER_BODY_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="3) Modo appFile"
        description="Quando codeContract=appFile, voce controla o arquivo App.tsx completo."
      >
        <div className="space-y-4">
          <SgPlayground
            title="App.tsx completo"
            interactive
            codeContract="appFile"
            code={APP_FILE_CODE}
            height={420}
          />
          <ExampleCodeCard code={APP_FILE_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="4) Variacoes visuais"
        description="Exemplo sem card externo e sem resize/expand."
      >
        <div className="space-y-4">
          <SgPlayground
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            withCard={false}
            expandable={false}
            resizable={false}
            height={300}
            previewPadding={16}
          />
          <ExampleCodeCard code={VISUAL_VARIANTS_EXAMPLE_IMPL} />
        </div>
      </Section>
    </div>
  );
}
