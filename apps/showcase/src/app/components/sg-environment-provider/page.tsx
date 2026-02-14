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
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

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
  return <SgCodeBlockBase code={props.code} />;
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
          code={loadSample("sg-environment-provider-example-01.src")}
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
          code={loadSample("sg-environment-provider-example-02.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.environment.sections.rest.title")}
        description={t(i18n, "showcase.component.environment.sections.rest.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={loadSample("sg-environment-provider-example-03.src")}
          />
        </div>
      </Section>

      <Section
        title={t(i18n, "showcase.component.environment.sections.hybrid.title")}
        description={t(i18n, "showcase.component.environment.sections.hybrid.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={loadSample("sg-environment-provider-example-04.src")}
          />
        </div>
      </Section>
    </div>
  );
}


