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
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
      <SgDockLayout id="dock-playground-v3">
        <SgDockZone zone="top" className="absolute left-0 right-0 top-0 h-20 items-start border-b border-white/20 px-4 pt-4">
          <SgToolBar id="tb-top-v3" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
            <SgToolbarIconButton icon="T1" hint="Top 1" />
            <SgToolbarIconButton icon="T2" hint="Top 2" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="bottom" className="absolute bottom-0 left-0 right-0 h-20 items-end border-t border-white/20 px-4 pb-4">
          <SgToolBar id="tb-bottom-v3" dockZone="bottom" orientationDirection="horizontal-left" title="Base" draggable>
            <SgToolbarIconButton icon="B1" hint="Bottom 1" />
            <SgToolbarIconButton icon="B2" hint="Bottom 2" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="left" className="absolute bottom-20 left-0 top-20 w-44 items-start border-r border-white/20 px-4 pt-4">
          <SgToolBar id="tb-left-v3" dockZone="left" orientationDirection="vertical-down" title="Esquerda" collapsible draggable>
            <SgToolbarIconButton icon="L1" hint="Left 1" />
            <SgToolbarIconButton icon="L2" hint="Left 2" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="right" className="absolute bottom-20 right-0 top-20 w-44 items-start border-l border-white/20 px-4 pt-4">
          <SgToolBar id="tb-right-v3" dockZone="right" orientationDirection="vertical-down" title="Direita" collapsible draggable>
            <SgToolbarIconButton icon="R1" hint="Right 1" />
            <SgToolbarIconButton icon="R2" hint="Right 2" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="free" className="absolute bottom-20 left-44 right-44 top-20 items-center justify-center">
          <div className="pointer-events-none text-sm text-white/60">Zona livre (free)</div>
        </SgDockZone>
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
  const topLabel = t(i18n, "showcase.component.dockLayout.labels.top");
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
        description="Quatro zonas (top/bottom/left/right) e uma toolbar arrastavel."
      >
        <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
          <SgDockLayout id="showcase-dock-basic-v8" className="grid h-full grid-cols-[8rem_1fr_8rem] grid-rows-[auto_1fr_auto]">
            <SgDockZone zone="top" className="col-span-3 row-start-1 items-start border-b border-white/20">
              <SgToolBar id="tb-main-basic-v8" dockZone="top" orientationDirection="horizontal-left" title={topLabel} draggable>
                <SgToolbarIconButton icon="T1" hint="Top 1" />
                <SgToolbarIconButton icon="T2" hint="Top 2" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-white/20">
            </SgDockZone>

            <SgDockZone zone="right" className="col-start-3 row-start-2 items-start border-l border-white/20">
            </SgDockZone>

            <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-white/20">
            </SgDockZone>
          </SgDockLayout>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
      <SgDockLayout id="showcase-dock-basic-v8" className="grid h-full grid-cols-[8rem_1fr_8rem] grid-rows-[auto_1fr_auto]">
        <SgDockZone zone="top" className="col-span-3 row-start-1 items-start border-b border-white/20">
          <SgToolBar id="tb-main-basic-v8" dockZone="top" orientationDirection="horizontal-left" title="${topLabel}" draggable>
            <SgToolbarIconButton icon="T1" hint="Top 1" />
            <SgToolbarIconButton icon="T2" hint="Top 2" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-white/20">
        </SgDockZone>

        <SgDockZone zone="right" className="col-start-3 row-start-2 items-start border-l border-white/20">
        </SgDockZone>

        <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-white/20">
        </SgDockZone>
      </SgDockLayout>
    </div>
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
            height={560}
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

