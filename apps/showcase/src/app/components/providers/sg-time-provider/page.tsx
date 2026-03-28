"use client";

import React from "react";
import { SgTimeProvider, useSgTime } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../../sgCodeBlockBase";
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function LiveClock() {
  const time = useSgTime();
  const date = new Date(time.nowMs());
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center rounded-lg border border-border bg-foreground/5 p-6">
      <span className="font-mono text-3xl tracking-widest">
        {pad(date.getHours())}:{pad(date.getMinutes())}:{pad(date.getSeconds())}
      </span>
    </div>
  );
}

function LiveClockWithProvider() {
  const now = new Date().toISOString();
  return (
    <SgTimeProvider initialServerTime={now}>
      <LiveClock />
    </SgTimeProvider>
  );
}

const TIME_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "initialServerTime", type: "string", defaultValue: "-", description: "Tempo inicial do servidor em formato ISO 8601. Usado para sincronizar o clock e evitar desvio do cliente." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore de componentes que vai consumir o tempo via useSgTime." }
];

export default function SgTimeProviderPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.timeProvider.title")}
          subtitle={t(i18n, "showcase.component.timeProvider.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.timeProvider.sections.basic.title")}
          description={t(i18n, "showcase.component.timeProvider.sections.basic.description")}
        >
          <LiveClockWithProvider />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-time-provider/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.timeProvider.sections.fallback.title")}
          description={t(i18n, "showcase.component.timeProvider.sections.fallback.description")}
        >
          <LiveClock />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-time-provider/samples/sem-provedor-fallback.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.timeProvider.sections.nextjs.title")}
          description={t(i18n, "showcase.component.timeProvider.sections.nextjs.description")}
        >
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-time-provider/samples/integracao-com-nextjs.tsx.sample" />
        </Section>

        <ShowcasePropsReference rows={TIME_PROVIDER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

