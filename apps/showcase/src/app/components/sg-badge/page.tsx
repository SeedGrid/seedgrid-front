"use client";

import React from "react";
import Link from "next/link";
import { SgBadge, SgButton, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";

import { loadSample } from "./samples/loadSample";

function Section(props: Readonly<{ id?: string; title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section id={props.id} className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

function AutoRemoveExample() {
  const i18n = useShowcaseI18n();
  return (
    <SgBadge
      value={t(i18n, "showcase.component.badge.labels.removableAuto")}
      removable
      autoRemove
      onRemove={() => alert("onRemove")}
    />
  );
}

function ManualRemoveExample() {
  const i18n = useShowcaseI18n();
  const [visible, setVisible] = React.useState(true);
  return visible ? (
    <SgBadge
      value={t(i18n, "showcase.component.badge.labels.removableManual")}
      removable
      autoRemove={false}
      onRemove={() => {
        alert("onRemove");
        setVisible(false);
      }}
    />
  ) : null;
}

export default function SgBadgePage() {
  const i18n = useShowcaseI18n();

  const sectionLinks = [
    { href: "#section-basic", label: "1) Básico" },
    { href: "#section-variants", label: "2) Variantes" },
    { href: "#section-sizes", label: "3) Tamanhos" },
    { href: "#section-counter", label: "4) Contador" },
    { href: "#section-actions", label: "5) Ações" }
  ];

  return (
    <SgStack className="w-full max-w-4xl" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.badge.title")}</h1>
        <p className="text-muted-foreground">{t(i18n, "showcase.component.badge.subtitle")}</p>
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
        title={t(i18n, "showcase.component.badge.sections.basic.title")}
        description={t(i18n, "showcase.component.badge.sections.basic.description")}
      >
        <SgBadge value={t(i18n, "showcase.component.badge.labels.admin")} />
        <SgBadge value={t(i18n, "showcase.component.badge.labels.pending")} severity="warning" variant="soft" />
        <SgBadge value={t(i18n, "showcase.component.badge.labels.paid")} severity="success" variant="solid" />
        <CodeBlock
          code={loadSample("sg-badge-example-01.src")}
        />
      </Section>

      <Section
        id="section-variants"
        title={t(i18n, "showcase.component.badge.sections.variants.title")}
        description={t(i18n, "showcase.component.badge.sections.variants.description")}
      >
        <SgBadge value="Solid" variant="solid" />
        <SgBadge value="Soft" variant="soft" severity="secondary" />
        <SgBadge value="Outline" variant="outline" severity="info" />
        <SgBadge value="Ghost" variant="ghost" severity="neutral" />
        <CodeBlock
          code={loadSample("sg-badge-example-02.src")}
        />
      </Section>

      <Section
        id="section-sizes"
        title={t(i18n, "showcase.component.badge.sections.sizes.title")}
        description={t(i18n, "showcase.component.badge.sections.sizes.description")}
      >
        <SgBadge value="XS" size="xs" />
        <SgBadge value="SM" size="sm" />
        <SgBadge value="MD" size="md" />
        <SgBadge value="LG" size="lg" />
        <CodeBlock
          code={loadSample("sg-badge-example-03.src")}
        />
      </Section>

      <Section
        id="section-counter"
        title={t(i18n, "showcase.component.badge.sections.counter.title")}
        description={t(i18n, "showcase.component.badge.sections.counter.description")}
      >
        <SgBadge value={3} severity="danger" />
        <SgBadge value={120} max={99} severity="danger" />
        <SgBadge dot severity="success" />
        <SgBadge dot severity="success" pulse />
        <CodeBlock
          code={loadSample("sg-badge-example-04.src")}
        />
      </Section>

      <Section
        id="section-actions"
        title={t(i18n, "showcase.component.badge.sections.actions.title")}
        description={t(i18n, "showcase.component.badge.sections.actions.description")}
      >
        <AutoRemoveExample />
        <ManualRemoveExample />
        <CodeBlock
          code={loadSample("sg-badge-example-05.src")}
        />
      </Section>

      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}


