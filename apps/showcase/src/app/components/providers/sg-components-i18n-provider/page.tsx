"use client";

import React from "react";
import {
  SgComponentsI18nProvider,
  useComponentsI18n,
  setComponentsI18n,
  componentsMessagesPtBr,
  componentsMessagesEnUs,
  componentsMessagesEs,
  componentsMessagesPtPt,
  SgInputText
} from "@seedgrid/fe-components";
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

const LOCALES = [
  { id: "pt-BR", label: "pt-BR", messages: componentsMessagesPtBr },
  { id: "pt-PT", label: "pt-PT", messages: componentsMessagesPtPt },
  { id: "en-US", label: "en-US", messages: componentsMessagesEnUs },
  { id: "es", label: "es", messages: componentsMessagesEs }
] as const;

function LocaleInfo() {
  const i18n = useComponentsI18n();
  return (
    <div className="rounded-lg border border-border bg-foreground/5 p-4 text-sm space-y-1">
      <div className="flex gap-2">
        <span className="text-muted-foreground font-medium w-16">locale</span>
        <span className="font-mono">{i18n.locale}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground font-medium w-16">keys</span>
        <span className="font-mono">{Object.keys(i18n.messages).length}</span>
      </div>
    </div>
  );
}

function DynamicLocaleDemo() {
  const [locale, setLocale] = React.useState<string>("pt-BR");
  const msgs = LOCALES.find((l) => l.id === locale)?.messages ?? componentsMessagesPtBr;

  return (
    <div className="space-y-4">
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
            {l.label}
          </button>
        ))}
      </div>
      <SgComponentsI18nProvider locale={locale} messages={msgs}>
        <LocaleInfo />
        <SgInputText id="demo-i18n" label="Email" inputProps={{ placeholder: "demo@exemplo.com" }} />
      </SgComponentsI18nProvider>
    </div>
  );
}

const I18N_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: 'Codigo do locale (ex: "pt-BR", "en-US", "es"). Afeta componentes que exibem mensagens internas.' },
  { prop: "messages", type: "SgComponentsMessages", defaultValue: "ptBr built-in", description: "Mapa de chaves para strings traduzidas. Pode ser o objeto completo de um locale ou apenas as chaves que deseja sobrescrever." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore que vai consumir o locale via useComponentsI18n." }
];

export default function SgComponentsI18nProviderPage() {
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
          title={t(i18n, "showcase.component.componentsI18nProvider.title")}
          subtitle={t(i18n, "showcase.component.componentsI18nProvider.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.basic.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.basic.description")}
        >
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.dynamic.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.dynamic.description")}
        >
          <DynamicLocaleDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/troca-dinamica-de-locale.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.global.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.global.description")}
        >
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/api-imperativa-setcomponentsi18n.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.custom.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.custom.description")}
        >
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/sobrescrita-de-mensagens.tsx.sample" />
        </Section>

        <ShowcasePropsReference rows={I18N_PROVIDER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

