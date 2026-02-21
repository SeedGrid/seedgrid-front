"use client";

import React from "react";
import { SgBadge, SgPlayground } from "@seedgrid/fe-components";
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
      <div className="mt-4 flex flex-wrap items-center gap-3">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
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

const BADGE_PLAYGROUND_CODE = `import * as React from "react";
import { SgBadge, SgButton } from "@seedgrid/fe-components";

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral">("primary");
  const [variant, setVariant] = React.useState<"solid" | "soft" | "outline" | "ghost">("solid");
  const [dot, setDot] = React.useState(false);
  const [value, setValue] = React.useState("Novo");

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("warning")}>warning</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("solid")}>solid</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("soft")}>soft</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("outline")}>outline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("ghost")}>ghost</SgButton>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-sm" />
        <label className="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" checked={dot} onChange={(e) => setDot(e.target.checked)} />
          dot
        </label>
      </div>
      <SgBadge value={dot ? undefined : value} severity={severity} variant={variant} dot={dot} />
    </div>
  );
}`;

const BADGE_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "ReactNode", defaultValue: "-", description: "Conteúdo principal exibido no badge." },
  { prop: "severity", type: "token", defaultValue: "primary", description: "Tom visual (primary, success, danger etc.)." },
  { prop: "variant", type: "\"solid\" | \"soft\" | \"outline\" | \"ghost\"", defaultValue: "solid", description: "Variação visual do badge." },
  { prop: "size", type: "\"xs\" | \"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Tamanho do badge." },
  { prop: "rounded / dot / pulse", type: "boolean", defaultValue: "false", description: "Formato pílula, ponto e animação." },
  { prop: "max / showZero", type: "number / boolean", defaultValue: "99 / false", description: "Controle para badges numéricos." },
  { prop: "leftIcon / rightIcon", type: "ReactNode", defaultValue: "-", description: "Ícones opcionais." },
  { prop: "removable / autoRemove / onRemove", type: "boolean / boolean / callback", defaultValue: "false / true / -", description: "Comportamento de remoção." },
  { prop: "onClick / disabled / title / hint", type: "event / boolean / string / string", defaultValue: "- / false / - / -", description: "Interação e metadados." },
  { prop: "customColors / className / partsClassName", type: "objeto / string / objeto", defaultValue: "-", description: "Customização visual avançada." }
];

export default function SgBadgePage() {
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
          title={t(i18n, "showcase.component.badge.title")}
          subtitle={t(i18n, "showcase.component.badge.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.badge.sections.basic.title")}`}
        description={t(i18n, "showcase.component.badge.sections.basic.description")}
      >
        <SgBadge value={t(i18n, "showcase.component.badge.labels.admin")} />
        <SgBadge value={t(i18n, "showcase.component.badge.labels.pending")} severity="warning" variant="soft" />
        <SgBadge value={t(i18n, "showcase.component.badge.labels.paid")} severity="success" variant="solid" />
        <CodeBlock
          code={`import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadge value="${t(i18n, "showcase.component.badge.labels.admin")}" />
      <SgBadge value="${t(i18n, "showcase.component.badge.labels.pending")}" severity="warning" variant="soft" />
      <SgBadge value="${t(i18n, "showcase.component.badge.labels.paid")}" severity="success" variant="solid" />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.badge.sections.variants.title")}`}
        description={t(i18n, "showcase.component.badge.sections.variants.description")}
      >
        <SgBadge value="Solid" variant="solid" />
        <SgBadge value="Soft" variant="soft" severity="secondary" />
        <SgBadge value="Outline" variant="outline" severity="info" />
        <SgBadge value="Ghost" variant="ghost" severity="neutral" />
        <CodeBlock
          code={`import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadge value="Solid" variant="solid" />
      <SgBadge value="Soft" variant="soft" severity="secondary" />
      <SgBadge value="Outline" variant="outline" severity="info" />
      <SgBadge value="Ghost" variant="ghost" severity="neutral" />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.badge.sections.sizes.title")}`}
        description={t(i18n, "showcase.component.badge.sections.sizes.description")}
      >
        <SgBadge value="XS" size="xs" />
        <SgBadge value="SM" size="sm" />
        <SgBadge value="MD" size="md" />
        <SgBadge value="LG" size="lg" />
        <CodeBlock
          code={`import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadge value="XS" size="xs" />
      <SgBadge value="SM" size="sm" />
      <SgBadge value="MD" size="md" />
      <SgBadge value="LG" size="lg" />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.badge.sections.counter.title")}`}
        description={t(i18n, "showcase.component.badge.sections.counter.description")}
      >
        <SgBadge value={3} severity="danger" />
        <SgBadge value={120} max={99} severity="danger" />
        <SgBadge dot severity="success" />
        <SgBadge dot severity="success" pulse />
        <CodeBlock
          code={`import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <>
      <SgBadge value={3} severity="danger" />
      <SgBadge value={120} max={99} severity="danger" />
      <SgBadge dot severity="success" />
      <SgBadge dot severity="success" pulse />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`5) ${t(i18n, "showcase.component.badge.sections.actions.title")}`}
        description={t(i18n, "showcase.component.badge.sections.actions.description")}
      >
        <AutoRemoveExample />
        <ManualRemoveExample />
        <CodeBlock
          code={`import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

export default function Example() {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <SgBadge
        value="${t(i18n, "showcase.component.badge.labels.removableAuto")}"
        removable
        autoRemove
        onRemove={() => alert("onRemove")}
      />

      {visible ? (
        <SgBadge
          value="${t(i18n, "showcase.component.badge.labels.removableManual")}"
          removable
          autoRemove={false}
          onRemove={() => {
            alert("onRemove");
            setVisible(false);
          }}
        />
      ) : null}
    </>
  );
}`}
        />
      </Section>

        <Section title="6) Playground (SgPlayground)" description="Ajuste as props principais do SgBadge.">
          <SgPlayground
            title="SgBadge Playground"
            interactive
            codeContract="appFile"
            code={BADGE_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BADGE_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
