"use client";

import React from "react";
import {
  useComponentsI18n,
  SgComponentsI18nProvider,
  componentsMessagesPtBr,
  componentsMessagesEnUs,
  componentsMessagesEs,
  componentsMessagesPtPt
} from "@seedgrid/fe-components";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../../i18n";

function tComp(messages: Record<string, string>, key: string): string {
  return messages[key] ?? key;
}

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

const LOCALES = [
  { id: "pt-BR", messages: componentsMessagesPtBr },
  { id: "pt-PT", messages: componentsMessagesPtPt },
  { id: "en-US", messages: componentsMessagesEnUs },
  { id: "es", messages: componentsMessagesEs }
] as const;

function I18nConsumer() {
  const i18n = useComponentsI18n();
  const clearLabel = tComp(i18n.messages,"sg.input.clear");
  const showLabel = tComp(i18n.messages,"sg.input.password.show");
  const requiredLabel = tComp(i18n.messages,"sg.input.required");

  return (
    <div className="rounded-lg border border-border bg-foreground/5 p-4 text-sm space-y-2 font-mono">
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">locale</span>
        <span>{i18n.locale}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">sg.input.clear</span>
        <span>{clearLabel}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">sg.input.password.show</span>
        <span>{showLabel}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">sg.input.required</span>
        <span>{requiredLabel}</span>
      </div>
    </div>
  );
}

function DynamicDemo() {
  const [locale, setLocale] = React.useState<string>("pt-BR");
  const msgs = LOCALES.find((l) => l.id === locale)?.messages ?? componentsMessagesPtBr;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLocale(l.id)}
            className={`rounded border px-3 py-1 text-sm font-mono transition-colors ${
              locale === l.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-foreground/5"
            }`}
          >
            {l.id}
          </button>
        ))}
      </div>
      <SgComponentsI18nProvider locale={locale} messages={msgs}>
        <I18nConsumer />
      </SgComponentsI18nProvider>
    </div>
  );
}

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: "Locale atual dos componentes. Usado por componentes para formatar datas, numeros e mensagens." },
  { prop: "messages", type: "Record<string, string>", defaultValue: "ptBr built-in", description: "Mapa de todas as chaves de traducao disponiveis para o locale atual." }
];

export default function UseComponentsI18nPage() {
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
          title={t(i18n, "showcase.hook.componentsI18n.title")}
          subtitle={t(i18n, "showcase.hook.componentsI18n.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.componentsI18n.sections.basic.title")}
          description={t(i18n, "showcase.hook.componentsI18n.sections.basic.description")}
        >
          <DynamicDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-components-i18n/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.componentsI18n.sections.custom.title")}
          description={t(i18n, "showcase.hook.componentsI18n.sections.custom.description")}
        >
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-components-i18n/samples/componentes-conscientes-do-locale.tsx.sample" />
        </Section>

        <ShowcasePropsReference rows={HOOK_RETURN} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

