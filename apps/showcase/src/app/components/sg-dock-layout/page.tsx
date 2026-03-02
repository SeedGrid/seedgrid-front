"use client";

import React from "react";
import {
  SgDockLayout,
  SgDockZone,
  SgPlayground,
  SgToolBar,
  SgToolbarIconButton
} from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";
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
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

export default function App() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
      <SgDockLayout id="dock-playground-v3">
        <SgDockZone zone="top" className="absolute left-0 right-0 top-0 h-20 items-start border-b border-white/20 px-4 pt-4">
          <SgToolBar id="tb-top-v3" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
            <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para inicio" />
            <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar registros" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="bottom" className="absolute bottom-0 left-0 right-0 h-20 items-end border-t border-white/20 px-4 pb-4">
          <SgToolBar id="tb-bottom-v3" dockZone="bottom" orientationDirection="horizontal-left" title="Base" draggable>
            <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
            <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="left" className="absolute bottom-20 left-0 top-20 w-44 items-start border-r border-white/20 px-4 pt-4">
          <SgToolBar id="tb-left-v3" dockZone="left" orientationDirection="vertical-down" title="Esquerda" collapsible draggable>
            <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
            <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="right" className="absolute bottom-20 right-0 top-20 w-44 items-start border-l border-white/20 px-4 pt-4">
          <SgToolBar id="tb-right-v3" dockZone="right" orientationDirection="vertical-down" title="Direita" collapsible draggable>
            <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
            <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
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

type DockLayoutPageTexts = {
  sectionBasicDescription: string;
  sectionPlaygroundTitle: string;
  sectionPlaygroundDescription: string;
  playgroundTitle: string;
  propsTitleLayout: string;
  propsTitleZone: string;
};

const DOCK_LAYOUT_PAGE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", DockLayoutPageTexts> = {
  "pt-BR": {
    sectionBasicDescription: "Quatro zonas (top/bottom/left/right) e seis toolbars arrastaveis.",
    sectionPlaygroundTitle: "2) Playground (SgPlayground)",
    sectionPlaygroundDescription: "Exemplo interativo com zonas de dock e toolbars.",
    playgroundTitle: "SgDockLayout Playground",
    propsTitleLayout: "Referencia de Props - SgDockLayout",
    propsTitleZone: "Referencia de Props - SgDockZone"
  },
  "pt-PT": {
    sectionBasicDescription: "Quatro zonas (top/bottom/left/right) e seis toolbars arrastaveis.",
    sectionPlaygroundTitle: "2) Playground (SgPlayground)",
    sectionPlaygroundDescription: "Exemplo interativo com zonas de dock e toolbars.",
    playgroundTitle: "SgDockLayout Playground",
    propsTitleLayout: "Referencia de Props - SgDockLayout",
    propsTitleZone: "Referencia de Props - SgDockZone"
  },
  "en-US": {
    sectionBasicDescription: "Four zones (top/bottom/left/right) and six draggable toolbars.",
    sectionPlaygroundTitle: "2) Playground (SgPlayground)",
    sectionPlaygroundDescription: "Interactive example with dock zones and toolbars.",
    playgroundTitle: "SgDockLayout Playground",
    propsTitleLayout: "Props Reference - SgDockLayout",
    propsTitleZone: "Props Reference - SgDockZone"
  },
  es: {
    sectionBasicDescription: "Cuatro zonas (top/bottom/left/right) y seis toolbars arrastrables.",
    sectionPlaygroundTitle: "2) Playground (SgPlayground)",
    sectionPlaygroundDescription: "Ejemplo interactivo con zonas de dock y toolbars.",
    playgroundTitle: "SgDockLayout Playground",
    propsTitleLayout: "Referencia de Props - SgDockLayout",
    propsTitleZone: "Referencia de Props - SgDockZone"
  }
};

function isSupportedDockLayoutLocale(locale: string): locale is keyof typeof DOCK_LAYOUT_PAGE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgDockLayoutPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof DOCK_LAYOUT_PAGE_TEXTS = isSupportedDockLayoutLocale(i18n.locale) ? i18n.locale : "pt-BR";
  const texts = DOCK_LAYOUT_PAGE_TEXTS[locale];
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
        description={texts.sectionBasicDescription}
      >
        <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
          <SgDockLayout id="showcase-dock-basic-v9" className="grid h-full grid-cols-[8rem_1fr_8rem] grid-rows-[auto_1fr_auto]">
            <SgDockZone zone="top" className="col-span-3 row-start-1 items-start border-b border-white/20">
              <SgToolBar id="tb-main-basic-v9" dockZone="top" orientationDirection="horizontal-left" title={topLabel} draggable>
                <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para inicio" />
                <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar registros" />
              </SgToolBar>
              <SgToolBar id="tb-top-extra-basic-v9" dockZone="top" orientationDirection="horizontal-left" title="Acoes" draggable>
                <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
                <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-white/20">
              <SgToolBar id="tb-left-basic-v9" dockZone="left" orientationDirection="vertical-down" title="Navegacao" collapsible draggable>
                <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
                <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="right" className="col-start-3 row-start-2 items-start border-l border-white/20">
              <SgToolBar id="tb-right-basic-v9" dockZone="right" orientationDirection="vertical-down" title="Equipe" collapsible draggable>
                <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
                <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
              </SgToolBar>
            </SgDockZone>

            <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-white/20">
              <SgToolBar id="tb-bottom-a-basic-v9" dockZone="bottom" orientationDirection="horizontal-left" title="Rodape A" draggable>
                <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
                <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar no rodape" />
              </SgToolBar>
              <SgToolBar id="tb-bottom-b-basic-v9" dockZone="bottom" orientationDirection="horizontal-left" title="Rodape B" draggable>
                <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Tarefas" hint="Abrir tarefas" />
                <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Voltar ao inicio" />
              </SgToolBar>
            </SgDockZone>
          </SgDockLayout>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

export default function Example() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-border bg-black">
      <SgDockLayout id="showcase-dock-basic-v9" className="grid h-full grid-cols-[8rem_1fr_8rem] grid-rows-[auto_1fr_auto]">
        <SgDockZone zone="top" className="col-span-3 row-start-1 items-start border-b border-white/20">
          <SgToolBar id="tb-main-basic-v9" dockZone="top" orientationDirection="horizontal-left" title="${topLabel}" draggable>
            <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para inicio" />
            <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar registros" />
          </SgToolBar>
          <SgToolBar id="tb-top-extra-basic-v9" dockZone="top" orientationDirection="horizontal-left" title="Acoes" draggable>
            <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
            <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Relatorio" hint="Abrir relatorios" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-white/20">
          <SgToolBar id="tb-left-basic-v9" dockZone="left" orientationDirection="vertical-down" title="Navegacao" collapsible draggable>
            <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir clientes" />
            <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="right" className="col-start-3 row-start-2 items-start border-l border-white/20">
          <SgToolBar id="tb-right-basic-v9" dockZone="right" orientationDirection="vertical-down" title="Equipe" collapsible draggable>
            <SgToolbarIconButton icon={<Users className="size-4" />} label="Usuarios" hint="Gerenciar usuarios" />
            <SgToolbarIconButton icon={<Settings className="size-4" />} label="Ajustes" hint="Abrir ajustes" />
          </SgToolBar>
        </SgDockZone>

        <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-white/20">
          <SgToolBar id="tb-bottom-a-basic-v9" dockZone="bottom" orientationDirection="horizontal-left" title="Rodape A" draggable>
            <SgToolbarIconButton icon={<LayoutGrid className="size-4" />} label="Painel" hint="Abrir painel" />
            <SgToolbarIconButton icon={<Search className="size-4" />} label="Buscar" hint="Pesquisar no rodape" />
          </SgToolBar>
          <SgToolBar id="tb-bottom-b-basic-v9" dockZone="bottom" orientationDirection="horizontal-left" title="Rodape B" draggable>
            <SgToolbarIconButton icon={<ClipboardList className="size-4" />} label="Tarefas" hint="Abrir tarefas" />
            <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Voltar ao inicio" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}`}
        />
      </Section>

        <Section title={texts.sectionPlaygroundTitle} description={texts.sectionPlaygroundDescription}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={DOCK_LAYOUT_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference
          id="props-reference"
          title={texts.propsTitleLayout}
          rows={DOCK_LAYOUT_PROPS}
        />
        <ShowcasePropsReference
          id="props-reference-dock-zone"
          title={texts.propsTitleZone}
          rows={DOCK_ZONE_PROPS}
        />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

