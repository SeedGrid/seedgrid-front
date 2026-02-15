"use client";

import React from "react";
import Link from "next/link";
import { SgButton, SgCard, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";

import { loadSample } from "./samples/loadSample";

function Section(props: Readonly<{ id?: string; title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section id={props.id} className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 grid gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgCardPage() {
  const i18n = useShowcaseI18n();

  const sectionLinks = [
    { href: "#section-basic", label: "1) Básico" },
    { href: "#section-leading", label: "2) Leading/Trailing" },
    { href: "#section-collapsible", label: "3) Collapsible" },
    { href: "#section-variants", label: "4) Variantes" }
  ];

  return (
    <SgStack className="w-full max-w-4xl" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.card.title")}</h1>
        <p className="text-muted-foreground">
          {t(i18n, "showcase.component.card.subtitle")}
        </p>
        <SgStack direction="row" gap={8} wrap>
          {sectionLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <SgButton appearance="outline" size="sm">
                {item.label}
              </SgButton>
            </Link>
          ))}
        </SgStack>
      </SgStack>

      <Section
        id="section-basic"
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
          code={loadSample("sg-card-example-01.src")}
        />
      </Section>

      <Section
        id="section-leading"
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
          code={loadSample("sg-card-example-02.src")}
        />
      </Section>

      <Section
        id="section-collapsible"
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
          code={loadSample("sg-card-example-03.src")}
        />
      </Section>

      <Section
        id="section-variants"
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
          code={loadSample("sg-card-example-04.src")}
        />
      </Section>

      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}


