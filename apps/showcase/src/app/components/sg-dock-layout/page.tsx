"use client";

import React from "react";
import {
  SgDockLayout,
  SgDockZone,
  SgPlayground,
  SgToolBar,
  SgToolbarIconButton
} from "@seedgrid/fe-components";
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
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const DOCK_LAYOUT_PLAYGROUND_CODE = `import * as React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

export default function App() {
  return (
    <div className="relative h-[360px] rounded-xl border border-border bg-muted/30 p-2">
      <SgDockLayout id="dock-playground">
        <SgDockZone zone="top" className="absolute left-0 right-0 top-0">
          <SgToolBar id="tb-top" dockZone="top" orientationDirection="horizontal-left" title="Top">
            <SgToolbarIconButton icon="T1" hint="Top 1" />
            <SgToolbarIconButton icon="T2" hint="Top 2" />
          </SgToolBar>
        </SgDockZone>
        <SgDockZone zone="left" className="absolute left-0 top-0 bottom-0">
          <SgToolBar id="tb-left" dockZone="left" orientationDirection="vertical-down" title="Left" collapsible>
            <SgToolbarIconButton icon="L1" hint="Left 1" />
            <SgToolbarIconButton icon="L2" hint="Left 2" />
          </SgToolBar>
        </SgDockZone>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Arraste as barras</div>
      </SgDockLayout>
    </div>
  );
}`;

const DOCK_LAYOUT_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador da area de dock." },
  { prop: "defaultState", type: "SgDockLayoutState", defaultValue: "-", description: "Estado inicial das toolbars por zona." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Zonas e componentes internos do layout." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes adicionais do container." }
];

const DOCK_ZONE_PROPS: ShowcasePropRow[] = [
  { prop: "zone", type: "\"top\" | \"bottom\" | \"left\" | \"right\" | \"free\"", defaultValue: "-", description: "Identificador da zona de dock." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais da zona." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Conteudo renderizado dentro da zona." }
];

export default function SgDockLayoutPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.dockLayout.title")}
          subtitle={t(i18n, "showcase.component.dockLayout.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.dockLayout.sections.basic.title")}`}
        description={t(i18n, "showcase.component.dockLayout.sections.basic.description")}
      >
        <div className="relative h-[420px] rounded-xl border border-border bg-muted/30">
          <SgDockLayout id="showcase-dock">
            <SgDockZone zone="top" className="absolute left-0 right-0 top-0">
              <SgToolBar id="tb-top" dockZone="top" orientationDirection="horizontal-left" title={t(i18n, "showcase.component.dockLayout.labels.top")}>
                <SgToolbarIconButton icon="T1" hint="Top 1" />
                <SgToolbarIconButton icon="T2" hint="Top 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="bottom" className="absolute left-0 right-0 bottom-0">
              <SgToolBar id="tb-bottom" dockZone="bottom" orientationDirection="horizontal-left" title={t(i18n, "showcase.component.dockLayout.labels.bottom")}>
                <SgToolbarIconButton icon="B1" hint="Bottom 1" />
                <SgToolbarIconButton icon="B2" hint="Bottom 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="left" className="absolute left-0 top-0 bottom-0">
              <SgToolBar
                id="tb-left"
                dockZone="left"
                orientationDirection="vertical-down"
                title={t(i18n, "showcase.component.dockLayout.labels.left")}
                collapsible
              >
                <SgToolbarIconButton icon="L1" hint="Left 1" />
                <SgToolbarIconButton icon="L2" hint="Left 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="right" className="absolute right-0 top-0 bottom-0">
              <SgToolBar
                id="tb-right"
                dockZone="right"
                orientationDirection="vertical-down"
                title={t(i18n, "showcase.component.dockLayout.labels.right")}
                collapsible
              >
                <SgToolbarIconButton icon="R1" hint="Right 1" />
                <SgToolbarIconButton icon="R2" hint="Right 2" />
              </SgToolBar>
            </SgDockZone>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {t(i18n, "showcase.component.dockLayout.labels.dragHint")}
            </div>
          </SgDockLayout>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgDockLayout id="dock-main">
      <SgDockZone zone="top">
        <SgToolBar id="tb-top" dockZone="top" orientationDirection="horizontal-left" title="${t(i18n, "showcase.component.dockLayout.labels.top")}">
          <SgToolbarIconButton icon="T1" hint="Top 1" />
        </SgToolBar>
      </SgDockZone>

      <SgDockZone zone="left">
        <SgToolBar id="tb-left" dockZone="left" orientationDirection="vertical-down" title="${t(i18n, "showcase.component.dockLayout.labels.left")}" collapsible>
          <SgToolbarIconButton icon="L1" hint="Left 1" />
        </SgToolBar>
      </SgDockZone>
    </SgDockLayout>
  );
}`}
        />
      </Section>

        <Section title="2) Playground (SgPlayground)" description="Exemplo interativo com zonas de dock e toolbars.">
          <SgPlayground
            title="SgDockLayout Playground"
            interactive
            codeContract="appFile"
            code={DOCK_LAYOUT_PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference
          id="props-reference"
          title="Referencia de Props - SgDockLayout"
          rows={DOCK_LAYOUT_PROPS}
        />
        <ShowcasePropsReference
          id="props-reference-dock-zone"
          title="Referencia de Props - SgDockZone"
          rows={DOCK_ZONE_PROPS}
        />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

