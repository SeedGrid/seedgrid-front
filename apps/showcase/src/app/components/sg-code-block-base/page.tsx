"use client";

import React from "react";
import { SgPanel, SgStack } from "@seedgrid/fe-components";
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

const READONLY_CODE = `<SgButton severity="primary">Salvar</SgButton>`;

const INTERACTIVE_RENDER_BODY = `<SgStack direction="row" gap={8}>
  <SgButton severity="primary">Primary</SgButton>
  <SgButton appearance="outline">Outline</SgButton>
</SgStack>`;

const INTERACTIVE_WITH_DEP = `const { control } = useForm({
  defaultValues: { country: "" }
});

<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label="Country"
  source={async () => [
    { id: 1, label: "Brazil" },
    { id: 2, label: "Germany" }
  ]}
/>`;

const INTERACTIVE_APP_FILE = `import * as React from "react";
import { SgButton } from "@seedgrid/fe-components";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <SgButton severity="success">Full App Mode</SgButton>
    </div>
  );
}`;

export default function SgCodeBlockBasePage() {
  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgCodeBlockBase</h1>
        <p className="text-muted-foreground">
          Bloco de codigo com dois modos: somente leitura ou interativo com Sandpack.
        </p>
        <p className="text-xs text-muted-foreground">
          Para modo interativo funcionar sem mock: configure <code>NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY</code>
          com versao publica real do pacote.
        </p>
      </SgStack>

      <Section
        title="1) Readonly"
        description="Modo padrao (interactive=false). Exibe o codigo sem editor/preview."
      >
        <SgCodeBlockBase title="Readonly" code={READONLY_CODE} />
      </Section>

      <Section
        title="2) Interactive + renderBody"
        description="Passa somente o JSX do body; o componente gera o App.tsx automaticamente."
      >
        <SgCodeBlockBase
          title="Interactive renderBody"
          interactive
          codeContract="renderBody"
          code={INTERACTIVE_RENDER_BODY}
        />
      </Section>

      <Section
        title="3) Interactive + dependencies/defaultImports"
        description="Exemplo com dependencia extra e imports customizados para o snippet."
      >
        <SgCodeBlockBase
          title="Interactive with extra dependencies"
          interactive
          dependencies={{ "react-hook-form": "^7.0.0" }}
          defaultImports={`import { useForm } from "react-hook-form";
import { SgAutocomplete } from "@seedgrid/fe-components";`}
          code={INTERACTIVE_WITH_DEP}
        />
      </Section>

      <Section
        title="4) Interactive + appFile"
        description="Passa o arquivo App.tsx completo (codeContract='appFile')."
      >
        <SgCodeBlockBase
          title="Interactive appFile"
          interactive
          codeContract="appFile"
          code={INTERACTIVE_APP_FILE}
        />
      </Section>
    </SgStack>
  );
}


