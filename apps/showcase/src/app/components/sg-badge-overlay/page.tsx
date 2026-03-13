"use client";

import React from "react";
import { SgBadge, SgBadgeOverlay, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const BADGE_OVERLAY_PLAYGROUND_CODE = `import * as React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";

export default function App() {
  const [placement, setPlacement] = React.useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right" | "top" | "bottom">("top-right");
  const [value, setValue] = React.useState(7);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("top-left")}>top-left</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("top-right")}>top-right</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("bottom-left")}>bottom-left</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("bottom-right")}>bottom-right</button>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setValue((prev) => prev + 1)}>+1</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setValue(0)}>reset</button>
      </div>

      <SgBadgeOverlay placement={placement} badge={<SgBadge value={value} severity="danger" size="xs" />}>
        <span className="inline-flex size-14 items-center justify-center rounded-lg border border-border bg-background text-sm">Item</span>
      </SgBadgeOverlay>
    </div>
  );
}`;

const BADGE_OVERLAY_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Elemento base que recebe o badge sobreposto." },
  { prop: "badge", type: "ReactNode", defaultValue: "-", description: "Conteudo do badge exibido na sobreposicao." },
  { prop: "placement", type: "SgBadgeOverlayPlacement", defaultValue: "top-right", description: "Posicionamento da sobreposicao." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes extras do wrapper." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style aplicado ao wrapper." }
];

export default function SgBadgeOverlayPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.badgeOverlay.title")}
          subtitle={t(i18n, "showcase.component.badgeOverlay.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={`1) ${t(i18n, "showcase.component.badgeOverlay.sections.basic.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.basic.description")}
        >
          <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />} style={{ borderRadius: 12, padding: 2 }}>
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">Bell</span>
          </SgBadgeOverlay>
          <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">Check</span>
          </SgBadgeOverlay>
          <CodeBlock
            code={`import React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />} style={{ borderRadius: 12, padding: 2 }}>
        <span className="inline-flex size-10 items-center justify-center rounded-lg border">Bell</span>
      </SgBadgeOverlay>
      <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
        <span className="inline-flex size-10 items-center justify-center rounded-lg border">Check</span>
      </SgBadgeOverlay>
    </>
  );
}`}
          />
        </Section>

        <Section
          title={`2) ${t(i18n, "showcase.component.badgeOverlay.sections.placements.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.placements.description")}
        >
          <SgBadgeOverlay placement="top-left" badge={<SgBadge value="TL" size="xs" badgeStyle="soft" />}>
            <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">TL</span>
          </SgBadgeOverlay>
          <SgBadgeOverlay placement="top-right" badge={<SgBadge value="TR" size="xs" badgeStyle="soft" />}>
            <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">TR</span>
          </SgBadgeOverlay>
          <SgBadgeOverlay placement="bottom-left" badge={<SgBadge value="BL" size="xs" badgeStyle="soft" />}>
            <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">BL</span>
          </SgBadgeOverlay>
          <SgBadgeOverlay placement="bottom-right" badge={<SgBadge value="BR" size="xs" badgeStyle="soft" />}>
            <span className="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-background text-xs">BR</span>
          </SgBadgeOverlay>
          <CodeBlock
            code={`import React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadgeOverlay placement="top-left" badge={<SgBadge value="TL" size="xs" badgeStyle="soft" />}><span>TL</span></SgBadgeOverlay>
      <SgBadgeOverlay placement="top-right" badge={<SgBadge value="TR" size="xs" badgeStyle="soft" />}><span>TR</span></SgBadgeOverlay>
      <SgBadgeOverlay placement="bottom-left" badge={<SgBadge value="BL" size="xs" badgeStyle="soft" />}><span>BL</span></SgBadgeOverlay>
      <SgBadgeOverlay placement="bottom-right" badge={<SgBadge value="BR" size="xs" badgeStyle="soft" />}><span>BR</span></SgBadgeOverlay>
    </>
  );
}`}
          />
        </Section>

        <Section title="3) Playground (SgPlayground)" description="Ajuste a posicao e o valor do badge sobreposto.">
          <SgPlayground
            title="SgBadgeOverlay Playground"
            interactive
            codeContract="appFile"
            code={BADGE_OVERLAY_PLAYGROUND_CODE}
            height={480}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BADGE_OVERLAY_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


