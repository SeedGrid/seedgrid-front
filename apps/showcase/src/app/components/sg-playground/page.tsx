"use client";

import React from "react";
import { SgCard, SgPlayground } from "@seedgrid/fe-components";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
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

const SG_PLAYGROUND_PROPS: ShowcasePropRow[] = [
  { prop: "title / description", type: "string", defaultValue: "- / -", description: "Cabecalho exibido no card do playground." },
  { prop: "interactive", type: "boolean", defaultValue: "false", description: "Liga editor + preview executavel." },
  { prop: "code", type: "string", defaultValue: "-", description: "Codigo inicial exibido no editor/bloco." },
  { prop: "codeContract", type: "\"renderBody\" | \"appFile\"", defaultValue: "\"renderBody\"", description: "Contrato do codigo interpretado no sandbox." },
  { prop: "defaultImports", type: "string", defaultValue: "-", description: "Imports injetados automaticamente no modo renderBody." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Define estado inicial expandido." },
  { prop: "height", type: "number", defaultValue: "420", description: "Altura da area de preview/editor." },
  { prop: "withCard", type: "boolean", defaultValue: "true", description: "Renderiza ou nao card externo." },
  { prop: "expandable / resizable", type: "boolean / boolean", defaultValue: "true / true", description: "Controla expansao e resize da UI." },
  { prop: "previewPadding", type: "number", defaultValue: "24", description: "Padding aplicado no iframe/preview." }
];

export default function SgPlaygroundPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPlayground"
          subtitle="Playground com editor de codigo + preview, com suporte a renderBody e appFile."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

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

      <ShowcasePropsReference rows={SG_PLAYGROUND_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}
