"use client";

import React from "react";
import { SgScreen, SgMainPanel, SgPanel, SgPlayground, SgStack } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

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
  const [padding, setPadding] = React.useState(10);

  return (
    <div className="space-y-3 p-2">
      <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setPadding((prev) => (prev === 10 ? 16 : 10))}>
        padding: {padding}
      </button>

      <SgPanel className="h-[360px] rounded-xl bg-muted/30" padding={12}>
        <SgScreen fullscreen={false} padding={padding} className="rounded-lg bg-zinc-100">
          <SgMainPanel gap={8} padding={8}>
            <SgPanel align="top" height={12} padding={10} className="rounded-md">Header</SgPanel>
            <SgPanel align="left" width={20} padding={10} className="rounded-md">Left</SgPanel>
            <SgPanel align="right" width={18} padding={10} className="rounded-md">Right</SgPanel>
            <SgPanel align="bottom" height={10} padding={10} className="rounded-md">Footer</SgPanel>
            <SgPanel align="client" padding={10} className="rounded-md">
              <SgStack gap={6}>
                <span className="text-sm font-medium">Area client</span>
                <SgPanel borderStyle="solid" className="h-20 rounded bg-muted/20" />
              </SgStack>
            </SgPanel>
          </SgMainPanel>
        </SgScreen>
      </SgPanel>
    </div>
  );
}`;

const SCREEN_PROPS: ShowcasePropRow[] = [
  { prop: "fullscreen", type: "boolean", defaultValue: "true", description: "Define se ocupa toda a viewport." },
  { prop: "padding", type: "number", defaultValue: "0", description: "Padding interno aplicado ao root da tela." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Conteúdo principal da tela." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customização visual do container." }
];

export default function SgScreenPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

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
          subtitle="Container raiz para telas. O exemplo abaixo está completo para copiar e colar."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title="1) Exemplo Completo"
        description="Uso com fullscreen=false em area controlada, incluindo layout top/left/right/bottom/client."
      >
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

        <Section title="2) Playground (SgPlayground)" description="Teste rápido das props principais do SgScreen.">
          <SgPlayground
            title="SgScreen Playground"
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
