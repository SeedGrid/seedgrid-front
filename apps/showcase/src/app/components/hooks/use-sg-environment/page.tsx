"use client";

import React from "react";
import {
  useSgEnvironment,
  buildSgPersistenceKey,
  SgEnvironmentProvider
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

function EnvDebug() {
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const exampleKey = buildSgPersistenceKey("component:state", namespace, env.persistence.scope);

  return (
    <div className="rounded-lg border border-border bg-foreground/5 p-4 text-sm space-y-2 font-mono">
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">namespace</span>
        <span>{namespace || "(vazio)"}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">scope</span>
        <span>{env.persistence.scope}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">mode</span>
        <span>{env.persistence.mode}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">stateVersion</span>
        <span>{env.persistence.stateVersion}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground w-36">exampleKey</span>
        <span>{exampleKey ?? "null (sem namespace/scope)"}</span>
      </div>
    </div>
  );
}

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "namespaceProvider", type: "{ getNamespace: () => string | null }", defaultValue: '() => ""', description: "Provedor do namespace atual. Retorna string vazia se nao houver SgEnvironmentProvider." },
  { prop: "persistenceStrategy", type: "SgPersistenceStrategy", defaultValue: "localStorage", description: "Estrategia de persistencia ativa (localStorage por padrao, ou API/composite se configurada)." },
  { prop: "persistence.scope", type: "string", defaultValue: '"app:unknown"', description: "Scope de persistencia configurado no provider." },
  { prop: "persistence.mode", type: "SgPersistenceMode", defaultValue: '"fallback"', description: "Modo: strict, fallback ou mirror." },
  { prop: "persistence.stateVersion", type: "number", defaultValue: "1", description: "Versao do estado; alterar invalida dados persistidos anteriores." }
];

export default function UseSgEnvironmentPage() {
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
          title={t(i18n, "showcase.hook.environment.title")}
          subtitle={t(i18n, "showcase.hook.environment.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.environment.sections.default.title")}
          description={t(i18n, "showcase.hook.environment.sections.default.description")}
        >
          <EnvDebug />
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-sg-environment/samples/default-sem-provider.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.environment.sections.provider.title")}
          description={t(i18n, "showcase.hook.environment.sections.provider.description")}
        >
          <SgEnvironmentProvider
            value={{
              namespaceProvider: { getNamespace: () => "user:42" },
              persistence: { scope: "app:dashboard", mode: "strict", stateVersion: 3 }
            }}
          >
            <EnvDebug />
          </SgEnvironmentProvider>
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-sg-environment/samples/com-provider.tsx.sample" />
        </Section>

        <ShowcasePropsReference rows={HOOK_RETURN} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

