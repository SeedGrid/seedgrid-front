"use client";

import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

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

export default function SgToolBarPage() {
  const i18n = useShowcaseI18n();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.toolbar.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.toolbar.subtitle")}</p>
      </div>

      <Section
        title={t(i18n, "showcase.component.toolbar.sections.basic.title")}
        description={t(i18n, "showcase.component.toolbar.sections.basic.description")}
      >
        <SgToolBar id="tb-basic" title={t(i18n, "showcase.component.toolbar.labels.navigation")} orientation="vertical">
          <SgToolbarIconButton icon="H" hint={t(i18n, "showcase.component.toolbar.labels.home")} severity="primary" />
          <SgToolbarIconButton icon="U" hint={t(i18n, "showcase.component.toolbar.labels.users")} />
          <SgToolbarIconButton icon="S" hint={t(i18n, "showcase.component.toolbar.labels.settings")} />
        </SgToolBar>
        <CodeBlock
          code={loadSample("sg-toolbar-example-01.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.toolbar.sections.horizontal.title")}
        description={t(i18n, "showcase.component.toolbar.sections.horizontal.description")}
      >
        <SgToolBar
          id="tb-horizontal"
          title={t(i18n, "showcase.component.toolbar.labels.quickActions")}
          orientation="horizontal"
          collapsible
          collapseDirection="right"
        >
          <SgToolbarIconButton icon="C" hint={t(i18n, "showcase.component.toolbar.labels.create")} severity="success" />
          <SgToolbarIconButton icon="E" hint={t(i18n, "showcase.component.toolbar.labels.edit")} severity="info" />
          <SgToolbarIconButton icon="D" hint={t(i18n, "showcase.component.toolbar.labels.delete")} severity="danger" />
        </SgToolBar>
        <CodeBlock
          code={loadSample("sg-toolbar-example-02.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.toolbar.sections.freeDrag.title")}
        description={t(i18n, "showcase.component.toolbar.sections.freeDrag.description")}
      >
        <div className="relative h-56 w-full rounded-lg border border-dashed border-border">
          <SgToolBar
            id="tb-free"
            title={t(i18n, "showcase.component.toolbar.labels.free")}
            orientation="vertical"
            draggable
            freeDrag
            defaultPosition={{ x: 16, y: 16 }}
            className="absolute"
          >
            <SgToolbarIconButton icon="F" hint={t(i18n, "showcase.component.toolbar.labels.filter")} />
            <SgToolbarIconButton icon="R" hint={t(i18n, "showcase.component.toolbar.labels.refresh")} />
          </SgToolBar>
        </div>
        <CodeBlock
          code={loadSample("sg-toolbar-example-03.src")}
        />
      </Section>
    </div>
  );
}


