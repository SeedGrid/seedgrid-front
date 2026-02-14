import React from "react";
import { SgPanel, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { loadSample } from "./samples/loadSample";

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

export default async function SgCodeBlockBasePage() {
  const readonlyCode = await loadSample("readonly-button.src");
  const interactiveRenderBody = await loadSample("interactive-render-body-buttons.src");
  const interactiveWithDep = await loadSample("interactive-appfile-rhf-autocomplete.src");
  const interactiveAppFile = await loadSample("interactive-appfile-basic-button.src");

  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack gap={8}>
        <h1 className="text-3xl font-bold">SgCodeBlockBase</h1>
        <p className="text-muted-foreground">
          Bloco de codigo com dois modos: somente leitura ou interativo com Sandpack.
        </p>
        <p className="text-xs text-muted-foreground">
          O modo interativo usa <code>@seedgrid/fe-components@0.2.6</code> por padrao. Se quiser trocar
          versao/URL, configure <code>NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY</code> ou passe a prop{" "}
          <code>seedgridDependency</code>.
        </p>
      </SgStack>

      <Section
        title="1) Readonly"
        description="Modo padrao (interactive=false). Exibe o codigo sem editor/preview."
      >
        <SgCodeBlockBase title="Readonly" code={readonlyCode} />
      </Section>

      <Section
        title="2) Interactive + renderBody"
        description="Passa somente o JSX do body; o componente gera o App.tsx automaticamente."
      >
        <SgCodeBlockBase
          title="Interactive renderBody"
          interactive
          codeContract="renderBody"
          code={interactiveRenderBody}
        />
      </Section>

      <Section
        title="3) Interactive + dependencies/defaultImports"
        description="Exemplo com dependencia extra usando arquivo completo (appFile)."
      >
        <SgCodeBlockBase
          title="Interactive with extra dependencies"
          interactive
          codeContract="appFile"
          dependencies={{ "react-hook-form": "^7.0.0" }}
          code={interactiveWithDep}
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
          code={interactiveAppFile}
        />
      </Section>
    </SgStack>
  );
}