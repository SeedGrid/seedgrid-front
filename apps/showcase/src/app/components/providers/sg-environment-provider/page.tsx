"use client";

import React from "react";
import {
  SgEnvironmentProvider,
  buildSgPersistenceKey,
  useSgEnvironment,
  SgInputText,
  SgPlayground
} from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
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
  return <CodeBlockBase code={props.code} />;
}

const ENVIRONMENT_PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgEnvironmentProvider,
  SgInputText,
  buildSgPersistenceKey,
  useSgEnvironment
} from "@seedgrid/fe-components";

function EnvInfo({ baseKey }: { baseKey: string }) {
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const fullKey = buildSgPersistenceKey(baseKey, namespace, env.persistence.scope);

  return (
    <div className="space-y-1 rounded border border-border bg-background p-3 text-xs">
      <div>namespace: <code>{namespace || "(vazio)"}</code></div>
      <div>baseKey: <code>{baseKey}</code></div>
      <div>fullKey: <code>{fullKey ?? "null"}</code></div>
    </div>
  );
}

export default function App() {
  const [namespace, setNamespace] = React.useState("u:123");
  const [scope, setScope] = React.useState("app:crm");

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-3 md:grid-cols-2">
        <SgInputText
          id="namespace"
          label="Namespace"
          inputProps={{
            value: namespace,
            onChange: (event) => setNamespace(event.currentTarget.value)
          }}
        />
        <SgInputText
          id="scope"
          label="Scope"
          inputProps={{
            value: scope,
            onChange: (event) => setScope(event.currentTarget.value)
          }}
        />
      </div>

      <SgEnvironmentProvider
        value={{
          namespaceProvider: { getNamespace: () => namespace },
          persistence: { scope, mode: "fallback", stateVersion: 1 }
        }}
      >
        <EnvInfo baseKey="fab:theme" />
      </SgEnvironmentProvider>
    </div>
  );
}`;

const ENVIRONMENT_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "value.namespaceProvider", type: "{ getNamespace: () => string }", defaultValue: "interno", description: "Fornecedor do namespace atual para isolamento dos dados." },
  { prop: "value.persistence", type: "{ scope, mode, stateVersion }", defaultValue: "interno", description: "Config padrao de persistencia do contexto." },
  { prop: "value.persistenceStrategy", type: "SgPersistenceStrategy", defaultValue: "-", description: "Estrategia de persistencia custom (API/local/composite)." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore que vai consumir o ambiente via contexto." }
];

function EnvInfo(props: { baseKey: string }) {
  const i18n = useShowcaseI18n();
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const fullKey = buildSgPersistenceKey(props.baseKey, namespace, env.persistence.scope);

  return (
    <div className="w-full rounded-lg border border-border bg-foreground/5 p-4 text-sm">
      <div className="flex flex-wrap gap-2">
        <span className="text-muted-foreground">{t(i18n, "showcase.component.environment.labels.namespace")}</span>
        <span className="font-mono">{namespace || t(i18n, "showcase.component.environment.labels.empty")}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-muted-foreground">{t(i18n, "showcase.component.environment.labels.baseKey")}</span>
        <span className="font-mono">{props.baseKey}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-muted-foreground">{t(i18n, "showcase.component.environment.labels.fullKey")}</span>
        <span className="font-mono">
          {fullKey ?? t(i18n, "showcase.component.environment.labels.noPersistence")}
        </span>
      </div>
    </div>
  );
}

export default function SgEnvironmentProviderPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [namespace, setNamespace] = React.useState("u:123");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.environment.title")}
          subtitle={t(i18n, "showcase.component.environment.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, "showcase.component.environment.sections.default.title")}
        description={t(i18n, "showcase.component.environment.sections.default.description")}
      >
        <div className="w-full">
          <EnvInfo baseKey="fab:theme" />
        </div>
        <CodeBlock
          code={`import React from "react";
import { buildSgPersistenceKey, useSgEnvironment } from "@seedgrid/fe-components";

function Example() {
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const fullKey = buildSgPersistenceKey("fab:theme", namespace, env.persistence.scope);

  return <div>fullKey: {fullKey ?? "null"}</div>;
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.environment.sections.custom.title")}
        description={t(i18n, "showcase.component.environment.sections.custom.description")}
      >
        <div className="w-full flex flex-col gap-4">
          <SgInputText
            id="namespace"
            label={t(i18n, "showcase.component.environment.labels.namespace")}
            inputProps={{
              value: namespace,
              onChange: (event) => setNamespace(event.currentTarget.value)
            }}
          />
          <SgEnvironmentProvider
            value={{ namespaceProvider: { getNamespace: () => namespace } }}
          >
            <EnvInfo baseKey="fab:theme" />
          </SgEnvironmentProvider>
        </div>
        <CodeBlock
          code={`import React from "react";
import {
  SgEnvironmentProvider,
  buildSgPersistenceKey,
  useSgEnvironment
} from "@seedgrid/fe-components";

function EnvInfo() {
  const env = useSgEnvironment();
  const namespace = env.namespaceProvider.getNamespace();
  const fullKey = buildSgPersistenceKey("fab:theme", namespace, env.persistence.scope);
  return <div>fullKey: {fullKey ?? "null"}</div>;
}

export default function Example() {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => "u:123" },
        persistence: { scope: "app:crm", mode: "fallback", stateVersion: 1 }
      }}
    >
      <EnvInfo />
    </SgEnvironmentProvider>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.environment.sections.rest.title")}
        description={t(i18n, "showcase.component.environment.sections.rest.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={`import React from "react";
import {
  SgEnvironmentProvider,
  createApiPersistenceStrategy,
  createCompositePersistenceStrategy,
  createLocalStorageStrategy
} from "@seedgrid/fe-components";

const api = createApiPersistenceStrategy({
  baseUrl: "https://api.seedgrid.com",
  scope: "app:crm",
  stateVersion: 1
});

const local = createLocalStorageStrategy();
const persistence = createCompositePersistenceStrategy({
  mode: "fallback",
  primary: api,
  secondary: local
});

export default function Example() {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => "u:123" },
        persistenceStrategy: persistence,
        persistence: { scope: "app:crm", mode: "fallback", stateVersion: 1 }
      }}
    >
      {/* componentes persistentes */}
    </SgEnvironmentProvider>
  );
}`}
          />
        </div>
      </Section>

      <Section
        title={t(i18n, "showcase.component.environment.sections.hybrid.title")}
        description={t(i18n, "showcase.component.environment.sections.hybrid.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={`import React from "react";
import {
  SgEnvironmentProvider,
  createApiPersistenceStrategy,
  createCompositePersistenceStrategy,
  createLocalStorageStrategy
} from "@seedgrid/fe-components";

const api = createApiPersistenceStrategy({
  baseUrl: "https://api.seedgrid.com",
  scope: "app:crm",
  stateVersion: 1
});

const local = createLocalStorageStrategy();
const persistence = createCompositePersistenceStrategy({
  mode: "mirror",
  primary: api,
  secondary: local
});

export default function Example() {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => "u:123" },
        persistenceStrategy: persistence,
        persistence: { scope: "app:crm", mode: "mirror", stateVersion: 1 }
      }}
    >
      {/* componentes persistentes */}
    </SgEnvironmentProvider>
  );
}`}
          />
        </div>
      </Section>

      <Section
        title="Playground"
        description="Simule namespace e scope para visualizar a chave final de persistencia."
      >
        <SgPlayground
          title="SgEnvironmentProvider Playground"
          interactive
          codeContract="appFile"
          code={ENVIRONMENT_PLAYGROUND_APP_FILE}
          height={540}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={ENVIRONMENT_PROVIDER_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}
