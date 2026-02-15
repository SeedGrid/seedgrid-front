"use client";

import React from "react";
import {
  SgEnvironmentProvider,
  buildSgPersistenceKey,
  useSgEnvironment,
  SgInputText,
  createLocalStorageStrategy,
  createApiPersistenceStrategy,
  createCompositePersistenceStrategy
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

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
  const [namespace, setNamespace] = React.useState("u:123");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.environment.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.environment.subtitle")}
        </p>
      </div>

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
    </div>
  );
}
