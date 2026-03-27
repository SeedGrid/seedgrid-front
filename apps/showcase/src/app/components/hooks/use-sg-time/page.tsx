"use client";

import React from "react";
import { useSgTime, SgTimeProvider } from "@seedgrid/fe-components";
import sgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

function DigitalClock() {
  const time = useSgTime();
  const date = new Date(time.nowMs());
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-mono text-4xl tracking-widest font-bold">
        {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        tick: {time.tick}
      </div>
    </div>
  );
}

function FallbackClock() {
  const time = useSgTime();
  const date = new Date(time.nowMs());
  return (
    <div className="font-mono text-xl">{date.toLocaleTimeString()}</div>
  );
}

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "nowMs()", type: "() => number", defaultValue: "Date.now()", description: "Retorna o tempo atual em ms, sincronizado com o servidor quando SgTimeProvider esta presente." },
  { prop: "tick", type: "number", defaultValue: "0", description: "Incrementa a cada segundo. Util para acionar re-renders em componentes que dependem do tempo." },
  { prop: "serverStartMs", type: "number", defaultValue: "Date.now()", description: "Timestamp do servidor no momento em que SgTimeProvider foi montado." },
  { prop: "perfStartMs", type: "number", defaultValue: "0", description: "performance.now() no momento de hidratacao. Usado internamente para calcular o delta." }
];

export default function UseSgTimePage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const now = React.useMemo(() => new Date().toISOString(), []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.hook.time.title")}
          subtitle={t(i18n, "showcase.hook.time.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.time.sections.basic.title")}
          description={t(i18n, "showcase.hook.time.sections.basic.description")}
        >
          <div className="flex items-center justify-center rounded-lg border border-border bg-foreground/5 p-8">
            <SgTimeProvider initialServerTime={now}>
              <DigitalClock />
            </SgTimeProvider>
          </div>
          <CodeBlock
            code={`import { useSgTime, SgTimeProvider } from "@seedgrid/fe-components";

function DigitalClock() {
  const time = useSgTime();
  const date = new Date(time.nowMs());
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span>
      {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}
    </span>
  );
}

export default function App() {
  return (
    <SgTimeProvider initialServerTime={new Date().toISOString()}>
      <DigitalClock />
    </SgTimeProvider>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.time.sections.fallback.title")}
          description={t(i18n, "showcase.hook.time.sections.fallback.description")}
        >
          <div className="flex items-center justify-center rounded-lg border border-border bg-foreground/5 p-6">
            <FallbackClock />
          </div>
          <CodeBlock
            code={`import { useSgTime } from "@seedgrid/fe-components";

// Sem SgTimeProvider, o hook retorna um fallback baseado em Date.now()
// Funciona mas sem sincronizacao com o servidor
function Clock() {
  const time = useSgTime();
  return <span>{new Date(time.nowMs()).toLocaleTimeString()}</span>;
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.time.sections.tick.title")}
          description={t(i18n, "showcase.hook.time.sections.tick.description")}
        >
          <CodeBlock
            code={`import { useSgTime, SgTimeProvider } from "@seedgrid/fe-components";

// O tick garante re-render a cada segundo mesmo que nowMs() seja chamado como funcao
// Isso evita timers redundantes em cada componente consumidor
function Uptime() {
  const { tick, serverStartMs } = useSgTime();
  const seconds = Math.floor((Date.now() - serverStartMs) / 1000);

  return <span>uptime: {seconds}s (tick: {tick})</span>;
}`}
          />
        </Section>

        <ShowcasePropsReference rows={HOOK_RETURN} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
