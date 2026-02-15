"use client";

import React from "react";
import Link from "next/link";
import { SgBadge, SgBadgeOverlay, SgButton, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";

import { loadSample } from "./samples/loadSample";

function Section(props: Readonly<{ id?: string; title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section id={props.id} className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgBadgeOverlayPage() {
  const i18n = useShowcaseI18n();

  const sectionLinks = [
    { href: "#section-basic", label: "1) Básico" },
    { href: "#section-placements", label: "2) Posicionamento" }
  ];

  return (
    <SgStack className="w-full max-w-4xl" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.badgeOverlay.title")}</h1>
        <p className="text-muted-foreground">{t(i18n, "showcase.component.badgeOverlay.subtitle")}</p>
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
        title={t(i18n, "showcase.component.badgeOverlay.sections.basic.title")}
        description={t(i18n, "showcase.component.badgeOverlay.sections.basic.description")}
      >
        <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />}>
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">
            ðŸ""
          </span>
        </SgBadgeOverlay>
        <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">
            âœ…
          </span>
        </SgBadgeOverlay>
        <CodeBlock
          code={loadSample("sg-badge-overlay-example-01.src")}
        />
      </Section>

      <Section
        id="section-placements"
        title={t(i18n, "showcase.component.badgeOverlay.sections.placements.title")}
        description={t(i18n, "showcase.component.badgeOverlay.sections.placements.description")}
      >
        <SgBadgeOverlay placement="top-left" badge={<SgBadge value="TL" size="xs" variant="soft" />}>
          <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">TL</span>
        </SgBadgeOverlay>
        <SgBadgeOverlay placement="top-right" badge={<SgBadge value="TR" size="xs" variant="soft" />}>
          <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">TR</span>
        </SgBadgeOverlay>
        <SgBadgeOverlay placement="bottom-left" badge={<SgBadge value="BL" size="xs" variant="soft" />}>
          <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">BL</span>
        </SgBadgeOverlay>
        <SgBadgeOverlay placement="bottom-right" badge={<SgBadge value="BR" size="xs" variant="soft" />}>
          <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">BR</span>
        </SgBadgeOverlay>
        <CodeBlock
          code={loadSample("sg-badge-overlay-example-02.src")}
        />
      </Section>

      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}


