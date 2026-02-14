"use client";

import React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
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

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.badgeOverlay.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.badgeOverlay.subtitle")}</p>
      </div>

      <Section
        title={t(i18n, "showcase.component.badgeOverlay.sections.basic.title")}
        description={t(i18n, "showcase.component.badgeOverlay.sections.basic.description")}
      >
        <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />}>
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">
            ðŸ””
          </span>
        </SgBadgeOverlay>
        <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">
            âœ…
          </span>
        </SgBadgeOverlay>
        <CodeBlock
          code={`import React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />}>
        <span className="inline-flex size-10 items-center justify-center rounded-lg border">ðŸ””</span>
      </SgBadgeOverlay>

      <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
        <span className="inline-flex size-10 items-center justify-center rounded-lg border">âœ…</span>
      </SgBadgeOverlay>
    </>
  );
}`}
        />
      </Section>

      <Section
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
          code={`import React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadgeOverlay placement="top-left" badge={<SgBadge value="TL" size="xs" variant="soft" />}>
        <span className="inline-flex size-12 items-center justify-center rounded-lg border">TL</span>
      </SgBadgeOverlay>
      <SgBadgeOverlay placement="top-right" badge={<SgBadge value="TR" size="xs" variant="soft" />}>
        <span className="inline-flex size-12 items-center justify-center rounded-lg border">TR</span>
      </SgBadgeOverlay>
      <SgBadgeOverlay placement="bottom-left" badge={<SgBadge value="BL" size="xs" variant="soft" />}>
        <span className="inline-flex size-12 items-center justify-center rounded-lg border">BL</span>
      </SgBadgeOverlay>
      <SgBadgeOverlay placement="bottom-right" badge={<SgBadge value="BR" size="xs" variant="soft" />}>
        <span className="inline-flex size-12 items-center justify-center rounded-lg border">BR</span>
      </SgBadgeOverlay>
    </>
  );
}`}
        />
      </Section>
    </div>
  );
}


