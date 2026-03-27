"use client";

import React from "react";
import {
  useSgPersistentState,
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

function BasicCounterDemo() {
  const { value, setValue, clear, hydrated } = useSgPersistentState({
    baseKey: "showcase:counter-demo",
    defaultValue: 0
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-border bg-foreground/5 p-4 text-center">
        <div className="text-4xl font-mono font-bold">{hydrated ? value : "..."}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {hydrated ? "persistido no localStorage" : "carregando..."}
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        <SgButton label="-1" onClick={() => setValue((v) => v - 1)} />
        <SgButton label="+1" severity="success" onClick={() => setValue((v) => v + 1)} />
        <SgButton label="Reset" appearance="outline" severity="danger" onClick={() => clear()} />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Recarregue a pagina — o valor persiste no localStorage.
      </p>
    </div>
  );
}

function NamespaceDemo() {
  const [namespace, setNamespace] = React.useState("user:123");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Namespace:</span>
        <select
          className="rounded border border-border bg-background px-2 py-1 text-sm font-mono"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
        >
          <option value="user:123">user:123</option>
          <option value="user:456">user:456</option>
          <option value="">vazio (sem namespace)</option>
        </select>
      </div>
      <SgEnvironmentProvider
        value={{
          namespaceProvider: { getNamespace: () => namespace },
          persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
        }}
      >
        <NamespacedCounter />
      </SgEnvironmentProvider>
    </div>
  );
}

function NamespacedCounter() {
  const { value, setValue, hydrated } = useSgPersistentState({
    baseKey: "showcase:ns-counter",
    defaultValue: 0
  });

  return (
    <div className="rounded-lg border border-border bg-foreground/5 p-4 flex items-center gap-4">
      <span className="text-3xl font-mono font-bold">{hydrated ? value : "..."}</span>
      <div className="flex gap-2">
        <SgButton label="-" onClick={() => setValue((v) => v - 1)} />
        <SgButton label="+" severity="success" onClick={() => setValue((v) => v + 1)} />
      </div>
      <p className="text-xs text-muted-foreground">Cada namespace tem seu proprio valor.</p>
    </div>
  );
}

const HOOK_PARAMS: ShowcasePropRow[] = [
  { prop: "baseKey", type: "string", defaultValue: "-", description: "Chave base da entrada persistida. A chave final inclui namespace e scope do SgEnvironmentProvider." },
  { prop: "defaultValue", type: "T", defaultValue: "-", description: "Valor inicial usado antes do carregamento e apos clear()." },
  { prop: "serialize", type: "(value: T) => unknown", defaultValue: "identity", description: "Funcao opcional para serializar antes de salvar (ex: Date → ISO string)." },
  { prop: "deserialize", type: "(value: unknown) => T", defaultValue: "identity", description: "Funcao opcional para desserializar ao carregar (ex: ISO string → Date)." }
];

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "value", type: "T", defaultValue: "-", description: "Valor atual do estado persistido." },
  { prop: "setValue", type: "(next: T | (prev: T) => T) => void", defaultValue: "-", description: "Atualiza o valor e o persiste automaticamente." },
  { prop: "clear", type: "() => Promise<void>", defaultValue: "-", description: "Remove o valor da persistencia e reseta para defaultValue." },
  { prop: "hydrated", type: "boolean", defaultValue: "false", description: "True quando o carregamento inicial da persistencia foi concluido." }
];

export default function UseSgPersistentStatePage() {
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
          title={t(i18n, "showcase.hook.persistentState.title")}
          subtitle={t(i18n, "showcase.hook.persistentState.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.persistentState.sections.basic.title")}
          description={t(i18n, "showcase.hook.persistentState.sections.basic.description")}
        >
          <BasicCounterDemo />
          <CodeBlock
            code={`import { useSgPersistentState } from "@seedgrid/fe-components";

export default function Counter() {
  const { value, setValue, clear, hydrated } = useSgPersistentState({
    baseKey: "app:counter",
    defaultValue: 0
  });

  return (
    <div>
      <span>{hydrated ? value : "..."}</span>
      <button onClick={() => setValue((v) => v + 1)}>+1</button>
      <button onClick={() => setValue((v) => v - 1)}>-1</button>
      <button onClick={() => clear()}>Reset</button>
    </div>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.persistentState.sections.namespace.title")}
          description={t(i18n, "showcase.hook.persistentState.sections.namespace.description")}
        >
          <NamespaceDemo />
          <CodeBlock
            code={`import { useSgPersistentState, SgEnvironmentProvider } from "@seedgrid/fe-components";

function Counter() {
  const { value, setValue } = useSgPersistentState({
    baseKey: "app:counter",
    defaultValue: 0
  });
  return <button onClick={() => setValue((v) => v + 1)}>{value}</button>;
}

// Cada usuario tem seu proprio contador isolado pelo namespace
export default function App({ userId }: { userId: string }) {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => \`user:\${userId}\` },
        persistence: { scope: "app:crm", mode: "fallback", stateVersion: 1 }
      }}
    >
      <Counter />
    </SgEnvironmentProvider>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.persistentState.sections.serialize.title")}
          description={t(i18n, "showcase.hook.persistentState.sections.serialize.description")}
        >
          <CodeBlock
            code={`import { useSgPersistentState } from "@seedgrid/fe-components";

export default function DatePicker() {
  const { value: selectedDate, setValue } = useSgPersistentState<Date | null>({
    baseKey: "app:selected-date",
    defaultValue: null,
    serialize: (date) => date?.toISOString() ?? null,
    deserialize: (raw) => (typeof raw === "string" ? new Date(raw) : null)
  });

  return (
    <input
      type="date"
      value={selectedDate?.toISOString().slice(0, 10) ?? ""}
      onChange={(e) => setValue(e.target.value ? new Date(e.target.value) : null)}
    />
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.persistentState.sections.versioning.title")}
          description={t(i18n, "showcase.hook.persistentState.sections.versioning.description")}
        >
          <CodeBlock
            code={`import { useSgPersistentState, SgEnvironmentProvider } from "@seedgrid/fe-components";

// Quando stateVersion muda, chaves antigas sao ignoradas e o estado reseta
export default function App() {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => "u:1" },
        // Incrementar stateVersion descarta dados persistidos de versoes anteriores
        persistence: { scope: "app:crm", mode: "fallback", stateVersion: 2 }
      }}
    >
      <MyComponent />
    </SgEnvironmentProvider>
  );
}`}
          />
        </Section>

        <div className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Parametros</h2>
          <ShowcasePropsReference rows={HOOK_PARAMS} />
        </div>
        <div className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Retorno</h2>
          <ShowcasePropsReference rows={HOOK_RETURN} />
        </div>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
