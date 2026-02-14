import React from "react";
import Link from "next/link";
import { SgButton, SgCard, SgPanel, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { loadSample } from "./samples/loadSample";
import BackToTopFab from "./BackToTopFab";

function Section(props: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <SgCard
      id={props.id}
      title={props.title}
      description={props.description}
      collapsible
      defaultOpen={true}
      className="rounded-lg"
    >
      <SgPanel borderStyle="none" padding={0}>
        {props.children}
      </SgPanel>
    </SgCard>
  );
}

export default async function SgCodeBlockBasePage() {
  const readonlyCode = await loadSample("readonly-button.src");
  const interactiveRenderBody = await loadSample("interactive-render-body-buttons.src");
  const interactiveWithDep = await loadSample("interactive-appfile-rhf-autocomplete.src");
  const interactiveAppFile = await loadSample("interactive-appfile-basic-button.src");
  const sectionLinks = [
    { href: "#example-readonly", label: "1) Readonly" },
    { href: "#example-render-body", label: "2) Interactive renderBody" },
    { href: "#example-dependencies", label: "3) Dependencies/defaultImports" },
    { href: "#example-app-file", label: "4) Interactive appFile" }
  ];

  return (
    <SgStack className="max-w-6xl" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">SgCodeBlockBase</h1>
        <p className="text-muted-foreground">
          Bloco de codigo com dois modos: somente leitura ou interativo com Sandpack.
        </p>
        <p className="text-xs text-muted-foreground">
          O modo interativo usa <code>@seedgrid/fe-components@0.2.6</code> por padrao. Se quiser trocar
          versao/URL, configure <code>NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY</code> ou passe a prop{" "}
          <code>seedgridDependency</code>.
        </p>
        <SgStack direction="row" gap={8} wrap>
          {sectionLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <SgButton appearance="outline" size="sm">
                {item.label}
              </SgButton>
            </Link>
          ))}
        </SgStack>
      </SgStack>

      <Section
        id="example-readonly"
        title="1) Readonly"
        description="Modo padrao (interactive=false). Exibe o codigo sem editor/preview."
      >
        <SgCodeBlockBase title="Readonly" code={readonlyCode} />
      </Section>

      <Section
        id="example-render-body"
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
        id="example-dependencies"
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
        id="example-app-file"
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
      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}
