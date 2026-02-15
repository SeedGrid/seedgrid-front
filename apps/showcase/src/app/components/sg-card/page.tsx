"use client";

import React from "react";
import { SgButton, SgCard } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 grid gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

export default function SgCardPage() {
  const i18n = useShowcaseI18n();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.card.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.card.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.card.sections.basic.title")}
        description={t(i18n, "showcase.component.card.sections.basic.description")}
      >
        <SgCard
          title={t(i18n, "showcase.component.card.labels.basicTitle")}
          description={t(i18n, "showcase.component.card.labels.basicDescription")}
          footer={
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t(i18n, "showcase.component.card.labels.basicFooterLeft")}</span>
              <span>{t(i18n, "showcase.component.card.labels.basicFooterRight")}</span>
            </div>
          }
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.basicLine1")}</span>
              <span className="font-semibold">R$ 12.400</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.basicLine2")}</span>
              <span className="font-semibold">83</span>
            </div>
          </div>
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import { SgCard } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgCard
      title="${t(i18n, "showcase.component.card.labels.basicTitle")}"
      description="${t(i18n, "showcase.component.card.labels.basicDescription")}"
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${t(i18n, "showcase.component.card.labels.basicFooterLeft")}</span>
          <span>${t(i18n, "showcase.component.card.labels.basicFooterRight")}</span>
        </div>
      }
    >
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.basicLine1")}</span>
          <span className="font-semibold">R$ 12.400</span>
        </div>
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.basicLine2")}</span>
          <span className="font-semibold">83</span>
        </div>
      </div>
    </SgCard>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.card.sections.leading.title")}
        description={t(i18n, "showcase.component.card.sections.leading.description")}
      >
        <SgCard
          leading={
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              SG
            </div>
          }
          trailing={
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {t(i18n, "showcase.component.card.labels.trailing")}
            </span>
          }
          title={t(i18n, "showcase.component.card.labels.leadingTitle")}
          description={t(i18n, "showcase.component.card.labels.leadingDescription")}
          actions={<SgButton appearance="ghost" size="sm">{t(i18n, "showcase.component.card.labels.action")}</SgButton>}
          footer={
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t(i18n, "showcase.component.card.labels.leadingFooterLeft")}</span>
              <span className="text-emerald-600">{t(i18n, "showcase.component.card.labels.leadingFooterRight")}</span>
            </div>
          }
        >
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.leadingMetric1")}</span>
              <span className="font-semibold">R$ 128.400</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.leadingMetric2")}</span>
              <span className="font-semibold">+12%</span>
            </div>
          </div>
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgCard
      leading={<div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">SG</div>}
      trailing={<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">${t(i18n, "showcase.component.card.labels.trailing")}</span>}
      title="${t(i18n, "showcase.component.card.labels.leadingTitle")}"
      description="${t(i18n, "showcase.component.card.labels.leadingDescription")}"
      actions={<SgButton appearance="ghost" size="sm">${t(i18n, "showcase.component.card.labels.action")}</SgButton>}
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${t(i18n, "showcase.component.card.labels.leadingFooterLeft")}</span>
          <span className="text-emerald-600">${t(i18n, "showcase.component.card.labels.leadingFooterRight")}</span>
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.leadingMetric1")}</span>
          <span className="font-semibold">R$ 128.400</span>
        </div>
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.leadingMetric2")}</span>
          <span className="font-semibold">+12%</span>
        </div>
      </div>
    </SgCard>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.card.sections.collapsible.title")}
        description={t(i18n, "showcase.component.card.sections.collapsible.description")}
      >
        <div className="grid gap-4">
          <SgCard
            title={t(i18n, "showcase.component.card.labels.collapsibleTitle")}
            description={t(i18n, "showcase.component.card.labels.collapsibleDescription")}
            collapsible
            defaultOpen={false}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm">{t(i18n, "showcase.component.card.labels.action")}</SgButton>
              </div>
            }
          >
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleContent")}</div>
          </SgCard>
          <SgCard
            title={t(i18n, "showcase.component.card.labels.collapsibleOpenTitle")}
            description={t(i18n, "showcase.component.card.labels.collapsibleOpenDescription")}
            collapsible
            defaultOpen
            footer={
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(i18n, "showcase.component.card.labels.collapsibleOpenFooterLeft")}</span>
                <span>{t(i18n, "showcase.component.card.labels.collapsibleOpenFooterRight")}</span>
              </div>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleOpenLine1")}</span>
                <span className="font-semibold">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleOpenLine2")}</span>
                <span className="font-semibold">R$ 9.820</span>
              </div>
            </div>
          </SgCard>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgCard
        title="${t(i18n, "showcase.component.card.labels.collapsibleTitle")}"
        description="${t(i18n, "showcase.component.card.labels.collapsibleDescription")}"
        collapsible
        defaultOpen={false}
        footer={<SgButton size="sm">${t(i18n, "showcase.component.card.labels.action")}</SgButton>}
      >
        <div>${t(i18n, "showcase.component.card.labels.collapsibleContent")}</div>
      </SgCard>

      <SgCard
        title="${t(i18n, "showcase.component.card.labels.collapsibleOpenTitle")}"
        description="${t(i18n, "showcase.component.card.labels.collapsibleOpenDescription")}"
        collapsible
        defaultOpen
        footer={
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenFooterLeft")}</span>
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenFooterRight")}</span>
          </div>
        }
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenLine1")}</span>
            <span className="font-semibold">128</span>
          </div>
          <div className="flex items-center justify-between">
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenLine2")}</span>
            <span className="font-semibold">R$ 9.820</span>
          </div>
        </div>
      </SgCard>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.card.sections.variants.title")}
        description={t(i18n, "showcase.component.card.sections.variants.description")}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <SgCard variant="default" title={t(i18n, "showcase.component.card.labels.variantDefault")} size="sm">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeSm")}</div>
          </SgCard>
          <SgCard variant="elevated" title={t(i18n, "showcase.component.card.labels.variantElevated")} size="sm">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeSm")}</div>
          </SgCard>
          <SgCard variant="outlined" title={t(i18n, "showcase.component.card.labels.variantOutlined")} size="lg">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeLg")}</div>
          </SgCard>
          <SgCard variant="flat" title={t(i18n, "showcase.component.card.labels.variantFlat")} size="lg">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeLg")}</div>
          </SgCard>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgCard } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgCard variant="default" title="${t(i18n, "showcase.component.card.labels.variantDefault")}" size="sm">
        <div>${t(i18n, "showcase.component.card.labels.sizeSm")}</div>
      </SgCard>

      <SgCard variant="elevated" title="${t(i18n, "showcase.component.card.labels.variantElevated")}" size="sm">
        <div>${t(i18n, "showcase.component.card.labels.sizeSm")}</div>
      </SgCard>

      <SgCard variant="outlined" title="${t(i18n, "showcase.component.card.labels.variantOutlined")}" size="lg">
        <div>${t(i18n, "showcase.component.card.labels.sizeLg")}</div>
      </SgCard>

      <SgCard variant="flat" title="${t(i18n, "showcase.component.card.labels.variantFlat")}" size="lg">
        <div>${t(i18n, "showcase.component.card.labels.sizeLg")}</div>
      </SgCard>
    </>
  );
}`}
        />
      </Section>
    </div>
  );
}
