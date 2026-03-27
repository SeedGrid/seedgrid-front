"use client";

import React from "react";
import {
  useSgPersistence,
  SgEnvironmentProvider,
  SgButton
} from "@seedgrid/fe-components";
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

function ManualPersistenceDemo() {
  const persistence = useSgPersistence();
  const [log, setLog] = React.useState<string[]>([]);
  const addLog = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 6));

  const handleSave = async () => {
    const payload = { ts: Date.now(), msg: "hello from showcase" };
    await persistence.save("demo:manual", payload);
    addLog(`save → demo:manual = ${JSON.stringify(payload)}`);
  };

  const handleLoad = async () => {
    const result = await persistence.load("demo:manual");
    addLog(`load → demo:manual = ${JSON.stringify(result)}`);
  };

  const handleClear = async () => {
    await persistence.clear("demo:manual");
    addLog("clear → demo:manual");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <SgButton label="save()" onClick={handleSave} />
        <SgButton label="load()" appearance="outline" onClick={handleLoad} />
        <SgButton label="clear()" appearance="outline" severity="danger" onClick={handleClear} />
      </div>
      <div className="rounded-lg border border-border bg-foreground/5 p-3 space-y-1 min-h-[80px]">
        {log.length === 0 ? (
          <p className="text-xs text-muted-foreground">Clique nos botoes para ver o log...</p>
        ) : (
          log.map((entry, i) => (
            <p key={i} className="font-mono text-xs">{entry}</p>
          ))
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Namespace: <span className="font-mono">{persistence.namespace || "(vazio)"}</span>{" "}
        · Scope: <span className="font-mono">{persistence.scope}</span>
      </p>
    </div>
  );
}

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "load(baseKey)", type: "(baseKey: string) => Promise<unknown>", defaultValue: "-", description: "Carrega o valor associado a chave base, resolvida com namespace e scope do ambiente." },
  { prop: "save(baseKey, state)", type: "(baseKey: string, state: unknown) => Promise<void>", defaultValue: "-", description: "Persiste o valor na chave resolvida." },
  { prop: "clear(baseKey)", type: "(baseKey: string) => Promise<void>", defaultValue: "-", description: "Remove o valor da chave resolvida." },
  { prop: "namespace", type: "string | null", defaultValue: '""', description: "Namespace atual retornado pelo namespaceProvider do ambiente." },
  { prop: "scope", type: "string", defaultValue: '"app:unknown"', description: "Scope de persistencia do ambiente." },
  { prop: "mode", type: "SgPersistenceMode", defaultValue: '"fallback"', description: "Modo de persistencia: strict, fallback ou mirror." },
  { prop: "stateVersion", type: "number", defaultValue: "1", description: "Versao do estado configurada no ambiente." }
];

export default function UseSgPersistencePage() {
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
          title={t(i18n, "showcase.hook.persistence.title")}
          subtitle={t(i18n, "showcase.hook.persistence.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.persistence.sections.basic.title")}
          description={t(i18n, "showcase.hook.persistence.sections.basic.description")}
        >
          <ManualPersistenceDemo />
          <CodeBlock
            code={`import { useSgPersistence } from "@seedgrid/fe-components";

export default function SaveOnAction() {
  const persistence = useSgPersistence();

  const handleSave = async () => {
    await persistence.save("user:preferences", { theme: "dark", lang: "pt-BR" });
  };

  const handleLoad = async () => {
    const prefs = await persistence.load("user:preferences");
    console.log(prefs);
  };

  const handleClear = async () => {
    await persistence.clear("user:preferences");
  };

  return (
    <div>
      <button onClick={handleSave}>Salvar</button>
      <button onClick={handleLoad}>Carregar</button>
      <button onClick={handleClear}>Limpar</button>
    </div>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.persistence.sections.when.title")}
          description={t(i18n, "showcase.hook.persistence.sections.when.description")}
        >
          <CodeBlock
            code={`// Use useSgPersistentState quando quiser estado React sincronizado automaticamente
const { value, setValue } = useSgPersistentState({ baseKey: "key", defaultValue: 0 });

// Use useSgPersistence quando precisar controlar manualmente o momento do save
// Exemplos: salvar ao submit de um formulario, salvar em lote, ou acesso raw a estrategia
const persistence = useSgPersistence();
await persistence.save("form:draft", formData);
await persistence.load("form:draft");
await persistence.clear("form:draft");`}
          />
        </Section>

        <ShowcasePropsReference rows={HOOK_RETURN} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
