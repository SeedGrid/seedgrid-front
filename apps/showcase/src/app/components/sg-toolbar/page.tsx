"use client";

import React from "react";
import { SgPlayground, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Filter, Home, Pencil, RefreshCcw, Settings, Trash2, Users, Plus } from "lucide-react";
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

const TOOLBAR_PLAYGROUND_CODE = `import * as React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

export default function App() {
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("horizontal");
  const [collapsible, setCollapsible] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="flex gap-2">
        <button className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={() => setOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"))}>orientation: {orientation}</button>
        <label className="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} />
          collapsible
        </label>
      </div>

      <SgToolBar id="tb-playground" title="Actions" orientation={orientation} collapsible={collapsible}>
        <SgToolbarIconButton icon="A" label="Action A" hint="Open Action A details" severity="primary" />
        <SgToolbarIconButton icon="B" label="Action B" hint="Open Action B details" />
        <SgToolbarIconButton icon="C" label="Action C" hint="Open Action C details" severity="danger" />
      </SgToolBar>
    </div>
  );
}`;

const TOOLBAR_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador único da toolbar." },
  { prop: "title", type: "ReactNode", defaultValue: "-", description: "Título exibido no cabeçalho." },
  { prop: "orientation", type: "\"vertical\" | \"horizontal\"", defaultValue: "vertical", description: "Direção dos botões." },
  { prop: "size", type: "{ w?: number; h?: number }", defaultValue: "-", description: "Dimensões fixas da toolbar." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais." },
  { prop: "style", type: "CSSProperties", defaultValue: "-", description: "Estilo inline adicional." },
  { prop: "dockZone", type: "\"top\" | \"bottom\" | \"left\" | \"right\" | \"free\"", defaultValue: "free", description: "Zona inicial quando usada com dock." },
  { prop: "draggable", type: "boolean", defaultValue: "false", description: "Permite iniciar arraste." },
  { prop: "freeDrag", type: "boolean", defaultValue: "false", description: "Ativa arraste livre com posição x/y." },
  { prop: "defaultPosition", type: "{ x: number; y: number }", defaultValue: "-", description: "Posição inicial quando não existe estado salvo." },
  { prop: "collapsible", type: "boolean", defaultValue: "true", description: "Habilita botão de expandir/contrair." },
  { prop: "collapsed", type: "boolean", defaultValue: "controlado", description: "Controla o estado colapsado externamente." },
  { prop: "defaultCollapsed", type: "boolean", defaultValue: "false", description: "Estado inicial colapsado no modo não controlado." },
  { prop: "collapseDirection", type: "\"left\" | \"right\" | \"top\" | \"bottom\"", defaultValue: "left(horizontal) / top(vertical)", description: "Direção da seta de colapso." },
  { prop: "onCollapsedChange", type: "(collapsed: boolean) => void", defaultValue: "-", description: "Callback ao alternar colapso." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Itens internos, normalmente SgToolbarIconButton." }
];

const TOOLBAR_ICON_BUTTON_PROPS: ShowcasePropRow[] = [
  { prop: "icon", type: "ReactNode | string", defaultValue: "-", description: "Ícone ou texto exibido no botão." },
  { prop: "label", type: "string", defaultValue: "-", description: "Texto visível no botão." },
  { prop: "showLabel", type: "boolean", defaultValue: "true", description: "Controla a exibição do label." },
  { prop: "hint", type: "string", defaultValue: "-", description: "Texto de dica/tooltip (se diferente do label)." },
  { prop: "severity", type: "\"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"help\" | \"danger\" | \"plain\"", defaultValue: "plain", description: "Variação de cor do botão." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita interação." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Ação executada no clique." }
];

export default function SgToolBarPage() {
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
          title={t(i18n, "showcase.component.toolbar.title")}
          subtitle={t(i18n, "showcase.component.toolbar.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.toolbar.sections.basic.title")}`}
        description={t(i18n, "showcase.component.toolbar.sections.basic.description")}
      >
        <SgToolBar id="tb-basic" title={t(i18n, "showcase.component.toolbar.labels.navigation")} orientation="vertical">
          <SgToolbarIconButton icon={<Home className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.home")} hint={t(i18n, "showcase.component.toolbar.labels.home")} severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.users")} hint={t(i18n, "showcase.component.toolbar.labels.users")} />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.settings")} hint={t(i18n, "showcase.component.toolbar.labels.settings")} />
        </SgToolBar>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Home, Users, Settings } from "lucide-react";

export default function Example() {
  return (
    <SgToolBar id="tb-basic" title="${t(i18n, "showcase.component.toolbar.labels.navigation")}" orientation="vertical">
      <SgToolbarIconButton icon={<Home className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.home")}" hint="${t(i18n, "showcase.component.toolbar.labels.home")}" severity="primary" />
      <SgToolbarIconButton icon={<Users className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.users")}" hint="${t(i18n, "showcase.component.toolbar.labels.users")}" />
      <SgToolbarIconButton icon={<Settings className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.settings")}" hint="${t(i18n, "showcase.component.toolbar.labels.settings")}" />
    </SgToolBar>
  );
}`}
        />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.toolbar.sections.horizontal.title")}`}
        description={t(i18n, "showcase.component.toolbar.sections.horizontal.description")}
      >
        <SgToolBar
          id="tb-horizontal"
          title={t(i18n, "showcase.component.toolbar.labels.quickActions")}
          orientation="horizontal"
          collapsible
          collapseDirection="right"
        >
          <SgToolbarIconButton icon={<Plus className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.create")} hint={t(i18n, "showcase.component.toolbar.labels.create")} severity="success" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.edit")} hint={t(i18n, "showcase.component.toolbar.labels.edit")} severity="info" />
          <SgToolbarIconButton icon={<Trash2 className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.delete")} hint={t(i18n, "showcase.component.toolbar.labels.delete")} severity="danger" />
        </SgToolBar>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <SgToolBar
      id="tb-horizontal"
      title="${t(i18n, "showcase.component.toolbar.labels.quickActions")}"
      orientation="horizontal"
      collapsible
      collapseDirection="right"
    >
      <SgToolbarIconButton icon={<Plus className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.create")}" hint="${t(i18n, "showcase.component.toolbar.labels.create")}" severity="success" />
      <SgToolbarIconButton icon={<Pencil className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.edit")}" hint="${t(i18n, "showcase.component.toolbar.labels.edit")}" severity="info" />
      <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.delete")}" hint="${t(i18n, "showcase.component.toolbar.labels.delete")}" severity="danger" />
    </SgToolBar>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.toolbar.sections.freeDrag.title")}`}
        description={t(i18n, "showcase.component.toolbar.sections.freeDrag.description")}
      >
        <div className="h-56 w-full rounded-lg border border-dashed border-border p-3">
          <SgToolBar
            id="tb-free"
            title={t(i18n, "showcase.component.toolbar.labels.free")}
            orientation="vertical"
            draggable
            freeDrag
          >
            <SgToolbarIconButton icon={<Filter className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.filter")} hint={t(i18n, "showcase.component.toolbar.labels.filter")} />
            <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.refresh")} hint={t(i18n, "showcase.component.toolbar.labels.refresh")} />
          </SgToolBar>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Filter, RefreshCcw } from "lucide-react";

export default function Example() {
  return (
    <div className="h-56 w-full rounded-lg border border-dashed border-border p-3">
      <SgToolBar
        id="tb-free"
        title="${t(i18n, "showcase.component.toolbar.labels.free")}"
        orientation="vertical"
        draggable
        freeDrag
      >
        <SgToolbarIconButton icon={<Filter className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.filter")}" hint="${t(i18n, "showcase.component.toolbar.labels.filter")}" />
        <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.refresh")}" hint="${t(i18n, "showcase.component.toolbar.labels.refresh")}" />
      </SgToolBar>
    </div>
  );
}`}
        />
      </Section>

      <Section
        title="4) Drag preso no container"
        description="Neste exemplo o drag continua dentro da caixa porque a toolbar está em modo absolute."
      >
        <div className="relative h-56 w-full rounded-lg border border-dashed border-border">
          <SgToolBar
            id="tb-bounded"
            title="Drag preso"
            orientation="vertical"
            draggable
            freeDrag
            defaultPosition={{ x: 16, y: 16 }}
            className="absolute"
          >
            <SgToolbarIconButton icon={<Filter className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.filter")} hint={t(i18n, "showcase.component.toolbar.labels.filter")} />
            <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.refresh")} hint={t(i18n, "showcase.component.toolbar.labels.refresh")} />
          </SgToolBar>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Filter, RefreshCcw } from "lucide-react";

export default function Example() {
  return (
    <div className="relative h-56 w-full rounded-lg border border-dashed border-border">
      <SgToolBar
        id="tb-bounded"
        title="Drag preso"
        orientation="vertical"
        draggable
        freeDrag
        defaultPosition={{ x: 16, y: 16 }}
        className="absolute"
      >
        <SgToolbarIconButton icon={<Filter className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.filter")}" hint="${t(i18n, "showcase.component.toolbar.labels.filter")}" />
        <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.refresh")}" hint="${t(i18n, "showcase.component.toolbar.labels.refresh")}" />
      </SgToolBar>
    </div>
  );
}`}
        />
      </Section>

        <Section title="5) Playground (SgPlayground)" description="Ajuste as principais props do SgToolBar.">
          <SgPlayground
            title="SgToolBar Playground"
            interactive
            codeContract="appFile"
            code={TOOLBAR_PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference
          id="props-reference"
          title="Referência de Props - SgToolBar"
          rows={TOOLBAR_PROPS}
        />
        <ShowcasePropsReference
          id="props-reference-toolbar-icon-button"
          title="Referência de Props - SgToolbarIconButton"
          rows={TOOLBAR_ICON_BUTTON_PROPS}
        />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}




