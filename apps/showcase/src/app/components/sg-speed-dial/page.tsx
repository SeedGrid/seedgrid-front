"use client";

import React from "react";
import { SgSpeedDial, type SgSpeedDialItem } from "@seedgrid/fe-components";
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

/* ── icons ── */
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

export default function SgSpeedDialPage() {
  const i18n = useShowcaseI18n();

  const items: SgSpeedDialItem[] = [
    { icon: <EditIcon />, label: t(i18n, "showcase.component.speedDial.labels.edit"), onClick: () => console.log("edit") },
    { icon: <RefreshIcon />, label: t(i18n, "showcase.component.speedDial.labels.refresh"), onClick: () => console.log("refresh") },
    { icon: <TrashIcon />, label: t(i18n, "showcase.component.speedDial.labels.delete"), onClick: () => console.log("delete") },
    { icon: <UploadIcon />, label: t(i18n, "showcase.component.speedDial.labels.upload"), onClick: () => console.log("upload") },
    { icon: <ShareIcon />, label: t(i18n, "showcase.component.speedDial.labels.share"), onClick: () => console.log("share") }
  ];

  const itemsNoLabel: SgSpeedDialItem[] = items.map(({ label: _, ...rest }) => rest);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.speedDial.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.speedDial.subtitle")}
        </p>
      </div>

      {/* ── Linear Up ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.linearUp.title")}
        description={t(i18n, "showcase.component.speedDial.sections.linearUp.description")}
      >
        <div className="relative h-80 w-full flex items-end justify-center">
          <SgSpeedDial items={itemsNoLabel} direction="up" />
        </div>
        <CodeBlock code={`import { SgSpeedDial } from "@seedgrid/fe-components";

const items = [
  { icon: <EditIcon />, onClick: () => console.log("edit") },
  { icon: <RefreshIcon />, onClick: () => console.log("refresh") },
  { icon: <TrashIcon />, onClick: () => console.log("delete") },
  { icon: <UploadIcon />, onClick: () => console.log("upload") },
  { icon: <ShareIcon />, onClick: () => console.log("share") }
];

<SgSpeedDial items={items} direction="up" />`} />
      </Section>

      {/* ── Linear Directions ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.linearDirections.title")}
        description={t(i18n, "showcase.component.speedDial.sections.linearDirections.description")}
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="relative h-72 flex items-end justify-center">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;up&quot;</p>
            <SgSpeedDial items={itemsNoLabel} direction="up" />
          </div>
          <div className="relative h-72 flex items-start justify-center">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;down&quot;</p>
            <SgSpeedDial items={itemsNoLabel} direction="down" />
          </div>
          <div className="relative h-20 flex items-center justify-end">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;left&quot;</p>
            <SgSpeedDial items={itemsNoLabel} direction="left" />
          </div>
          <div className="relative h-20 flex items-center justify-start">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;right&quot;</p>
            <SgSpeedDial items={itemsNoLabel} direction="right" />
          </div>
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} direction="up" />
<SgSpeedDial items={items} direction="down" />
<SgSpeedDial items={items} direction="left" />
<SgSpeedDial items={items} direction="right" />`} />
      </Section>

      {/* ── Circle ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.circle.title")}
        description={t(i18n, "showcase.component.speedDial.sections.circle.description")}
      >
        <div className="relative h-64 w-full flex items-center justify-center">
          <SgSpeedDial items={itemsNoLabel} type="circle" direction="up" />
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} type="circle" direction="up" />`} />
      </Section>

      {/* ── Semi-Circle ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.semiCircle.title")}
        description={t(i18n, "showcase.component.speedDial.sections.semiCircle.description")}
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="relative h-52 flex items-end justify-center">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;up&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="semi-circle" direction="up" />
          </div>
          <div className="relative h-52 flex items-start justify-center">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;down&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="semi-circle" direction="down" />
          </div>
          <div className="relative h-52 flex items-center justify-end">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;left&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="semi-circle" direction="left" />
          </div>
          <div className="relative h-52 flex items-center justify-start">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;right&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="semi-circle" direction="right" />
          </div>
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} type="semi-circle" direction="up" />
<SgSpeedDial items={items} type="semi-circle" direction="down" />
<SgSpeedDial items={items} type="semi-circle" direction="left" />
<SgSpeedDial items={items} type="semi-circle" direction="right" />`} />
      </Section>

      {/* ── Quarter-Circle ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.quarterCircle.title")}
        description={t(i18n, "showcase.component.speedDial.sections.quarterCircle.description")}
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="relative h-52 flex items-end justify-end">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;up&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="quarter-circle" direction="up" />
          </div>
          <div className="relative h-52 flex items-start justify-start">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;down&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="quarter-circle" direction="down" />
          </div>
          <div className="relative h-52 flex items-end justify-end">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;left&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="quarter-circle" direction="left" />
          </div>
          <div className="relative h-52 flex items-start justify-start">
            <p className="absolute top-0 left-0 text-xs text-muted-foreground font-medium">direction=&quot;right&quot;</p>
            <SgSpeedDial items={itemsNoLabel} type="quarter-circle" direction="right" />
          </div>
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} type="quarter-circle" direction="up" />
<SgSpeedDial items={items} type="quarter-circle" direction="down" />
<SgSpeedDial items={items} type="quarter-circle" direction="left" />
<SgSpeedDial items={items} type="quarter-circle" direction="right" />`} />
      </Section>

      {/* ── Mask ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.mask.title")}
        description={t(i18n, "showcase.component.speedDial.sections.mask.description")}
      >
        <div className="relative h-80 w-full flex items-end justify-center">
          <SgSpeedDial items={itemsNoLabel} direction="up" mask />
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} direction="up" mask />`} />
      </Section>

      {/* ── Severities ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.severity.title")}
        description={t(i18n, "showcase.component.speedDial.sections.severity.description")}
      >
        <div className="flex gap-6 items-end h-80">
          <div className="flex flex-col items-center gap-2">
            <SgSpeedDial items={itemsNoLabel} direction="up" severity="primary" />
            <span className="text-xs text-muted-foreground">primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgSpeedDial items={itemsNoLabel} direction="up" severity="success" />
            <span className="text-xs text-muted-foreground">success</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgSpeedDial items={itemsNoLabel} direction="up" severity="danger" />
            <span className="text-xs text-muted-foreground">danger</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgSpeedDial items={itemsNoLabel} direction="up" severity="warning" />
            <span className="text-xs text-muted-foreground">warning</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgSpeedDial items={itemsNoLabel} direction="up" severity="secondary" />
            <span className="text-xs text-muted-foreground">secondary</span>
          </div>
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} severity="primary" />
<SgSpeedDial items={items} severity="success" />
<SgSpeedDial items={items} severity="danger" />
<SgSpeedDial items={items} severity="warning" />
<SgSpeedDial items={items} severity="secondary" />`} />
      </Section>

      {/* ── Tooltips ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.tooltip.title")}
        description={t(i18n, "showcase.component.speedDial.sections.tooltip.description")}
      >
        <div className="relative h-80 w-full flex items-end justify-center">
          <SgSpeedDial items={items} direction="up" />
        </div>
        <CodeBlock code={`const items = [
  { icon: <EditIcon />, label: "Editar", onClick: () => {} },
  { icon: <RefreshIcon />, label: "Atualizar", onClick: () => {} },
  { icon: <TrashIcon />, label: "Excluir", onClick: () => {} },
  { icon: <UploadIcon />, label: "Upload", onClick: () => {} },
  { icon: <ShareIcon />, label: "Compartilhar", onClick: () => {} }
];

<SgSpeedDial items={items} direction="up" />`} />
      </Section>

      {/* ── Disabled ── */}
      <Section
        title={t(i18n, "showcase.component.speedDial.sections.disabled.title")}
        description={t(i18n, "showcase.component.speedDial.sections.disabled.description")}
      >
        <div className="flex items-center justify-center py-8">
          <SgSpeedDial items={itemsNoLabel} disabled />
        </div>
        <CodeBlock code={`<SgSpeedDial items={items} disabled />`} />
      </Section>
    </div>
  );
}
