"use client";

import React from "react";
import {
  SgDockLayout,
  SgDockZone,
  SgToolBar,
  SgToolbarIconButton
} from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgDockLayoutPage() {
  const i18n = useShowcaseI18n();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.dockLayout.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.dockLayout.subtitle")}</p>
      </div>

      <Section
        title={t(i18n, "showcase.component.dockLayout.sections.basic.title")}
        description={t(i18n, "showcase.component.dockLayout.sections.basic.description")}
      >
        <div className="relative h-[420px] rounded-xl border border-border bg-muted/30">
          <SgDockLayout id="showcase-dock">
            <SgDockZone zone="top" className="absolute left-0 right-0 top-0">
              <SgToolBar id="tb-top" dockZone="top" orientation="horizontal" title={t(i18n, "showcase.component.dockLayout.labels.top")}>
                <SgToolbarIconButton icon="T1" hint="Top 1" />
                <SgToolbarIconButton icon="T2" hint="Top 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="bottom" className="absolute left-0 right-0 bottom-0">
              <SgToolBar id="tb-bottom" dockZone="bottom" orientation="horizontal" title={t(i18n, "showcase.component.dockLayout.labels.bottom")}>
                <SgToolbarIconButton icon="B1" hint="Bottom 1" />
                <SgToolbarIconButton icon="B2" hint="Bottom 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="left" className="absolute left-0 top-0 bottom-0">
              <SgToolBar
                id="tb-left"
                dockZone="left"
                orientation="vertical"
                title={t(i18n, "showcase.component.dockLayout.labels.left")}
                collapsible
                collapseDirection="left"
              >
                <SgToolbarIconButton icon="L1" hint="Left 1" />
                <SgToolbarIconButton icon="L2" hint="Left 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="right" className="absolute right-0 top-0 bottom-0">
              <SgToolBar
                id="tb-right"
                dockZone="right"
                orientation="vertical"
                title={t(i18n, "showcase.component.dockLayout.labels.right")}
                collapsible
                collapseDirection="right"
              >
                <SgToolbarIconButton icon="R1" hint="Right 1" />
                <SgToolbarIconButton icon="R2" hint="Right 2" />
              </SgToolBar>
            </SgDockZone>

            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {t(i18n, "showcase.component.dockLayout.labels.dragHint")}
            </div>
          </SgDockLayout>
        </div>
        <CodeBlock
          code={loadSample("sg-dock-layout-example-01.src")}
        />
      </Section>
    </div>
  );
}


