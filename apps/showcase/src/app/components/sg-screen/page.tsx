"use client";

import React from "react";
import { SgScreen, SgMainPanel, SgPanel, SgPlayground, SgStack } from "@seedgrid/fe-components";
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

const fullExampleCode = `"use client";

import React from "react";
import { SgScreen, SgMainPanel, SgPanel, SgStack } from "@seedgrid/fe-components";

export default function ExampleSgScreenPage() {
  return (
    <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
      <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
        <SgMainPanel gap={8} padding={8}>
          <SgPanel align="top" height={12} padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm font-medium">Header</span>
              <span className="text-xs text-muted-foreground">top + height=12%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="left" width={20} padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">MENU</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="right" width="18%" padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">ACOES</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm">Footer</span>
              <span className="text-xs text-muted-foreground">bottom + height=10%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="client" padding={10} className="rounded-md">
            <SgStack gap={8}>
              <span className="text-sm font-medium">Area client</span>
              <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
              <span className="text-xs text-muted-foreground">
                Esta area ocupa todo o espaco restante.
              </span>
            </SgStack>
          </SgPanel>
        </SgMainPanel>
      </SgScreen>
    </SgPanel>
  );
}`;

const SCREEN_PLAYGROUND_CODE = `import * as React from "react";
import { SgMainPanel, SgPanel, SgScreen, SgStack } from "@seedgrid/fe-components";

export default function App() {
  return (
    <SgScreen fullscreen={false} height={360} padding={12} className="rounded-xl bg-zinc-100">
      <SgMainPanel gap={8} padding={8}>
        <SgPanel align="top" height={12} padding={10} className="rounded-md">Top</SgPanel>
        <SgPanel align="left" width={20} padding={10} className="rounded-md">Left</SgPanel>
        <SgPanel align="right" width={20} padding={10} className="rounded-md">Right</SgPanel>
        <SgPanel align="bottom" height={10} padding={10} className="rounded-md">Bottom</SgPanel>
        <SgPanel align="client" padding={10} className="rounded-md">
          <SgStack gap={6}>
            <span className="text-sm font-medium">Client</span>
            <SgPanel borderStyle="solid" className="h-20 rounded bg-muted/20" />
          </SgStack>
        </SgPanel>
      </SgMainPanel>
    </SgScreen>
  );
}`;

const SCREEN_PROPS: ShowcasePropRow[] = [
  { prop: "fullscreen", type: "boolean", defaultValue: "true", description: "Define se ocupa toda a viewport." },
  { prop: "width / height", type: "number | string", defaultValue: "-", description: "Dimensoes explicitas do container (ex.: 960, 100%, 60vh)." },
  { prop: "padding", type: "number", defaultValue: "0", description: "Padding interno aplicado ao root da tela." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Main screen content." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual do container." }
];

type ScreenTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  playgroundTitle: string;
};

const SCREEN_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ScreenTexts> = {
  "pt-BR": {
    subtitle: "Root container for screens. The example below is complete for copy/paste.",
    section1Title: "1) Complete Example",
    section1Description: "Uso com fullscreen=false em area controlada, incluindo layout top/left/right/bottom/client.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Simple and direct example with top, left, right, bottom, and client.",
    playgroundTitle: "SgScreen Playground"
  },
  "pt-PT": {
    subtitle: "Container raiz para ecras. O exemplo abaixo esta completo para copiar e colar.",
    section1Title: "1) Complete Example",
    section1Description: "Uso com fullscreen=false em area controlada, incluindo layout top/left/right/bottom/client.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Simple and direct example with top, left, right, bottom, and client.",
    playgroundTitle: "SgScreen Playground"
  },
  "en-US": {
    subtitle: "Root container for screens. The example below is complete and copy/paste ready.",
    section1Title: "1) Full Example",
    section1Description: "Usage with fullscreen=false in a constrained area including top/left/right/bottom/client layout.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Simple interactive example with top, left, right, bottom and client panels.",
    playgroundTitle: "SgScreen Playground"
  },
  es: {
    subtitle: "Contenedor raiz para pantallas. El ejemplo de abajo esta completo para copiar y pegar.",
    section1Title: "1) Ejemplo Completo",
    section1Description: "Uso con fullscreen=false en area controlada, incluyendo layout top/left/right/bottom/client.",
    section2Title: "2) Playground (SgPlayground)",
    section2Description: "Ejemplo simple y directo con top, left, right, bottom y client.",
    playgroundTitle: "SgScreen Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof SCREEN_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgScreenPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof SCREEN_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = SCREEN_TEXTS[locale];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgScreen"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
            <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
              <SgMainPanel gap={8} padding={8}>
                <SgPanel align="top" height={12} padding={10} className="rounded-md">
                  <SgStack direction="row" justify="between" align="center">
                    <span className="text-sm font-medium">Header</span>
                    <span className="text-xs text-muted-foreground">top + height=12%</span>
                  </SgStack>
                </SgPanel>

                <SgPanel align="left" width={20} padding={10} className="rounded-md">
                  <SgStack gap={6}>
                    <span className="text-xs font-medium text-muted-foreground">MENU</span>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
                  </SgStack>
                </SgPanel>

                <SgPanel align="right" width="18%" padding={10} className="rounded-md">
                  <SgStack gap={6}>
                    <span className="text-xs font-medium text-muted-foreground">ACOES</span>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
                  </SgStack>
                </SgPanel>

                <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
                  <SgStack direction="row" justify="between" align="center">
                    <span className="text-sm">Footer</span>
                    <span className="text-xs text-muted-foreground">bottom + height=10%</span>
                  </SgStack>
                </SgPanel>

                <SgPanel align="client" padding={10} className="rounded-md">
                  <SgStack gap={8}>
                    <span className="text-sm font-medium">Area client</span>
                    <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
                    <span className="text-xs text-muted-foreground">
                      Esta area ocupa todo o espaco restante.
                    </span>
                  </SgStack>
                </SgPanel>
              </SgMainPanel>
            </SgScreen>
          </SgPanel>

          <SgStack className="mt-6">
            <CodeBlockBase code={fullExampleCode} />
          </SgStack>
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={SCREEN_PLAYGROUND_CODE}
            height={540}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={SCREEN_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

