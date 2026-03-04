"use client";

import React from "react";
import { SgGrid, SgPanel, SgPlayground, SgStack, SgButton } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

const STACK_PLAYGROUND_CODE = `import * as React from "react";
import { SgPanel, SgStack } from "@seedgrid/fe-components";

export default function App() {
  const [direction, setDirection] = React.useState<"row" | "column">("row");
  const [gap, setGap] = React.useState(10);

  return (
    <div className="space-y-3 p-2">
      <div className="flex gap-2">
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setDirection((prev) => (prev === "row" ? "column" : "row"))}>direction: {direction}</button>
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setGap((prev) => (prev === 10 ? 16 : 10))}>gap: {gap}</button>
      </div>
      <SgPanel className="rounded-lg p-3">
        <SgStack direction={direction} gap={gap} wrap justify="between" align="center">
          <SgPanel className="rounded bg-muted/30 p-3">Item A</SgPanel>
          <SgPanel className="rounded bg-muted/30 p-3">Item B</SgPanel>
          <SgPanel className="rounded bg-muted/30 p-3">Item C</SgPanel>
        </SgStack>
      </SgPanel>
    </div>
  );
}`;

const STACK_PROPS: ShowcasePropRow[] = [
  { prop: "direction", type: "\"row\" | \"column\"", defaultValue: "column", description: "Direcao principal do flex." },
  { prop: "gap", type: "number", defaultValue: "0", description: "Espacamento entre itens." },
  { prop: "justify / align", type: "CSS justify/align", defaultValue: "-", description: "Distribuicao e alinhamento dos itens." },
  { prop: "wrap", type: "boolean", defaultValue: "false", description: "Permite quebra de linha." },
  { prop: "grow", type: "boolean", defaultValue: "false", description: "Permite crescimento do container." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Elementos filhos empilhados." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual do stack." }
];

type StackTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  playgroundTitle: string;
};

const STACK_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", StackTexts> = {
  "pt-BR": {
    subtitle: "Wrapper flex declarativo para direcao, alinhamento, distribuicao e espacamento.",
    section1Title: "1) Column + Row",
    section1Description: "Common layout examples with stack.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Teste rapido das props principais do SgStack.",
    playgroundTitle: "SgStack Playground"
  },
  "pt-PT": {
    subtitle: "Wrapper flex declarativo para direcao, alinhamento, distribuicao e espacamento.",
    section1Title: "1) Column + Row",
    section1Description: "Common layout examples with stack.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Teste rapido das props principais do SgStack.",
    playgroundTitle: "SgStack Playground"
  },
  "en-US": {
    subtitle: "Declarative flex wrapper for direction, alignment, distribution and spacing.",
    section1Title: "1) Column + Row",
    section1Description: "Common layout examples with stack.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Quickly test the main SgStack props.",
    playgroundTitle: "SgStack Playground"
  },
  es: {
    subtitle: "Wrapper flex declarativo para direccion, alineacion, distribucion y espaciado.",
    section1Title: "1) Column + Row",
    section1Description: "Ejemplos comunes de layout con stack.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Prueba rapida de las props principales de SgStack.",
    playgroundTitle: "SgStack Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof STACK_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgStackPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof STACK_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = STACK_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgStack"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
            <SgPanel padding={12} className="rounded-lg">
              <SgStack gap={8}>
                <p className="text-sm font-medium">Stack em coluna</p>
                <SgButton>Save</SgButton>
                <SgButton appearance="outline">Cancelar</SgButton>
                <SgButton appearance="ghost">Ajuda</SgButton>
              </SgStack>
            </SgPanel>

            <SgPanel padding={12} className="rounded-lg">
              <SgStack direction="row" justify="between" align="center" gap={8}>
                <p className="text-sm font-medium">Title</p>
                <SgStack direction="row" gap={8}>
                  <SgButton size="sm" appearance="outline">Voltar</SgButton>
                  <SgButton size="sm">Confirmar</SgButton>
                </SgStack>
              </SgStack>
            </SgPanel>
          </SgGrid>

          <SgStack className="mt-6">
            <CodeBlockBase
              code={`import { SgStack, SgButton } from "@seedgrid/fe-components";

<SgStack gap={8}>
  <SgButton>Save</SgButton>
  <SgButton appearance="outline">Cancelar</SgButton>
</SgStack>

<SgStack direction="row" justify="between" align="center">
  <span>Title</span>
  <SgButton size="sm">Confirmar</SgButton>
</SgStack>`}
            />
          </SgStack>
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={STACK_PLAYGROUND_CODE}
            height={500}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={STACK_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
