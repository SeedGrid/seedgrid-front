"use client";

import React from "react";
import { SgPlayground, SgToolBar, SgToolbarIconButton, toast } from "@seedgrid/fe-components";
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
  const options = ["horizontal-left", "horizontal-right", "vertical-down", "vertical-up"] as const;
  type OrientationDirection = typeof options[number];
  const [orientationDirection, setOrientationDirection] = React.useState<OrientationDirection>("horizontal-left");
  const [collapsible, setCollapsible] = React.useState(true);
  const [buttonsPerDirection, setButtonsPerDirection] = React.useState<number | undefined>(undefined);

  return (
    <div className="space-y-4 p-2">
      <div className="flex gap-2">
        <select
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          value={orientationDirection}
          onChange={(e) => setOrientationDirection(e.target.value as OrientationDirection)}
        >
          {options.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} />
          collapsible
        </label>
        <select
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          value={buttonsPerDirection ?? ""}
          onChange={(e) => setButtonsPerDirection(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">buttonsPerDirection: auto</option>
          <option value="2">buttonsPerDirection: 2</option>
          <option value="3">buttonsPerDirection: 3</option>
        </select>
      </div>

      <SgToolBar
        id="tb-playground"
        title="Actions"
        orientationDirection={orientationDirection}
        collapsible={collapsible}
        buttonsPerDirection={buttonsPerDirection}
      >
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
  { prop: "orientationDirection", type: "\"vertical-up\" | \"vertical-down\" | \"horizontal-left\" | \"horizontal-right\"", defaultValue: "vertical-down", description: "Define orientação e direção de abertura em uma única prop." },
  { prop: "buttonsPerDirection", type: "number", defaultValue: "-", description: "Quantidade por direção principal: horizontal=por linha, vertical=por coluna." },
  { prop: "bgColorTitle", type: "string", defaultValue: "-", description: "Cor de fundo do cabecalho (area do titulo)." },
  { prop: "bgColor", type: "string", defaultValue: "-", description: "Cor de fundo da area principal da toolbar." },
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
        <SgToolBar id="tb-basic" title={t(i18n, "showcase.component.toolbar.labels.navigation")} orientationDirection="vertical-down">
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
    <SgToolBar id="tb-basic" title="${t(i18n, "showcase.component.toolbar.labels.navigation")}" orientationDirection="vertical-down">
      <SgToolbarIconButton icon={<Home className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.home")}" hint="${t(i18n, "showcase.component.toolbar.labels.home")}" severity="primary" />
      <SgToolbarIconButton icon={<Users className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.users")}" hint="${t(i18n, "showcase.component.toolbar.labels.users")}" />
      <SgToolbarIconButton icon={<Settings className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.settings")}" hint="${t(i18n, "showcase.component.toolbar.labels.settings")}" />
    </SgToolBar>
  );
}`}
        />
      </Section>

      <Section
        title="2) onClick com Toast"
        description="SgToolbarIconButton aceita onClick e aqui cada acao dispara um toast."
      >
        <SgToolBar id="tb-onclick-toast" title="Acoes" orientationDirection="horizontal-left" collapsible>
          <SgToolbarIconButton
            icon={<Plus className="size-4" />}
            label="Criar"
            hint="Criar novo registro"
            severity="success"
            onClick={() => toast.success("Acao Criar executada")}
          />
          <SgToolbarIconButton
            icon={<Pencil className="size-4" />}
            label="Editar"
            hint="Editar registro selecionado"
            severity="info"
            onClick={() => toast.info("Acao Editar executada")}
          />
          <SgToolbarIconButton
            icon={<Trash2 className="size-4" />}
            label="Excluir"
            hint="Excluir registro selecionado"
            severity="danger"
            onClick={() => toast.warning("Acao Excluir executada")}
          />
        </SgToolBar>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton, toast } from "@seedgrid/fe-components";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <SgToolBar id="tb-onclick-toast" title="Acoes" orientationDirection="horizontal-left" collapsible>
      <SgToolbarIconButton
        icon={<Plus className="size-4" />}
        label="Criar"
        hint="Criar novo registro"
        severity="success"
        onClick={() => toast.success("Acao Criar executada")}
      />
      <SgToolbarIconButton
        icon={<Pencil className="size-4" />}
        label="Editar"
        hint="Editar registro selecionado"
        severity="info"
        onClick={() => toast.info("Acao Editar executada")}
      />
      <SgToolbarIconButton
        icon={<Trash2 className="size-4" />}
        label="Excluir"
        hint="Excluir registro selecionado"
        severity="danger"
        onClick={() => toast.warning("Acao Excluir executada")}
      />
    </SgToolBar>
  );
}`}
        />
      </Section>

      <Section
        title="3) Horizontal: orientationDirection left/right"
        description="horizontal-left abre as opções para a direita. horizontal-right abre as opções para a esquerda."
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">orientationDirection = "horizontal-left"</p>
            <SgToolBar
              id="tb-horizontal-left"
              title={t(i18n, "showcase.component.toolbar.labels.quickActions")}
              orientationDirection="horizontal-left"
              collapsible
            >
              <SgToolbarIconButton icon={<Plus className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.create")} hint={t(i18n, "showcase.component.toolbar.labels.create")} severity="success" />
              <SgToolbarIconButton icon={<Pencil className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.edit")} hint={t(i18n, "showcase.component.toolbar.labels.edit")} severity="info" />
              <SgToolbarIconButton icon={<Trash2 className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.delete")} hint={t(i18n, "showcase.component.toolbar.labels.delete")} severity="danger" />
            </SgToolBar>
          </div>
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">orientationDirection = "horizontal-right"</p>
            <SgToolBar
              id="tb-horizontal-right"
              title={t(i18n, "showcase.component.toolbar.labels.quickActions")}
              orientationDirection="horizontal-right"
              collapsible
            >
              <SgToolbarIconButton icon={<Plus className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.create")} hint={t(i18n, "showcase.component.toolbar.labels.create")} severity="success" />
              <SgToolbarIconButton icon={<Pencil className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.edit")} hint={t(i18n, "showcase.component.toolbar.labels.edit")} severity="info" />
              <SgToolbarIconButton icon={<Trash2 className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.delete")} hint={t(i18n, "showcase.component.toolbar.labels.delete")} severity="danger" />
            </SgToolBar>
          </div>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">orientationDirection = "horizontal-left"</p>
        <SgToolBar
          id="tb-horizontal-left"
          title="${t(i18n, "showcase.component.toolbar.labels.quickActions")}"
          orientationDirection="horizontal-left"
          collapsible
        >
          <SgToolbarIconButton icon={<Plus className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.create")}" hint="${t(i18n, "showcase.component.toolbar.labels.create")}" severity="success" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.edit")}" hint="${t(i18n, "showcase.component.toolbar.labels.edit")}" severity="info" />
          <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.delete")}" hint="${t(i18n, "showcase.component.toolbar.labels.delete")}" severity="danger" />
        </SgToolBar>
      </div>
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">orientationDirection = "horizontal-right"</p>
        <SgToolBar
          id="tb-horizontal-right"
          title="${t(i18n, "showcase.component.toolbar.labels.quickActions")}"
          orientationDirection="horizontal-right"
          collapsible
        >
          <SgToolbarIconButton icon={<Plus className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.create")}" hint="${t(i18n, "showcase.component.toolbar.labels.create")}" severity="success" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.edit")}" hint="${t(i18n, "showcase.component.toolbar.labels.edit")}" severity="info" />
          <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.delete")}" hint="${t(i18n, "showcase.component.toolbar.labels.delete")}" severity="danger" />
        </SgToolBar>
      </div>
    </div>
  );
}`}
        />
      </Section>

      <Section
        title="4) Vertical: orientationDirection up/down"
        description="vertical-down abre as opções abaixo do título e vertical-up abre acima."
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="flex h-72 items-start rounded-lg border border-dashed border-border p-3">
            <SgToolBar
              id="tb-vertical-down"
              title={t(i18n, "showcase.component.toolbar.labels.navigation")}
              orientationDirection="vertical-down"
              collapsible
            >
              <SgToolbarIconButton icon={<Home className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.home")} hint={t(i18n, "showcase.component.toolbar.labels.home")} severity="primary" />
              <SgToolbarIconButton icon={<Users className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.users")} hint={t(i18n, "showcase.component.toolbar.labels.users")} />
              <SgToolbarIconButton icon={<Settings className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.settings")} hint={t(i18n, "showcase.component.toolbar.labels.settings")} />
            </SgToolBar>
          </div>
          <div className="flex h-72 items-end rounded-lg border border-dashed border-border p-3">
            <SgToolBar
              id="tb-vertical-up"
              title={t(i18n, "showcase.component.toolbar.labels.navigation")}
              orientationDirection="vertical-up"
              collapsible
            >
              <SgToolbarIconButton icon={<Home className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.home")} hint={t(i18n, "showcase.component.toolbar.labels.home")} severity="primary" />
              <SgToolbarIconButton icon={<Users className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.users")} hint={t(i18n, "showcase.component.toolbar.labels.users")} />
              <SgToolbarIconButton icon={<Settings className="size-4" />} label={t(i18n, "showcase.component.toolbar.labels.settings")} hint={t(i18n, "showcase.component.toolbar.labels.settings")} />
            </SgToolBar>
          </div>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Home, Users, Settings } from "lucide-react";

export default function Example() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="flex h-72 items-start rounded-lg border border-dashed border-border p-3">
        <SgToolBar
          id="tb-vertical-down"
          title="${t(i18n, "showcase.component.toolbar.labels.navigation")}"
          orientationDirection="vertical-down"
          collapsible
        >
          <SgToolbarIconButton icon={<Home className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.home")}" hint="${t(i18n, "showcase.component.toolbar.labels.home")}" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.users")}" hint="${t(i18n, "showcase.component.toolbar.labels.users")}" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.settings")}" hint="${t(i18n, "showcase.component.toolbar.labels.settings")}" />
        </SgToolBar>
      </div>
      <div className="flex h-72 items-end rounded-lg border border-dashed border-border p-3">
        <SgToolBar
          id="tb-vertical-up"
          title="${t(i18n, "showcase.component.toolbar.labels.navigation")}"
          orientationDirection="vertical-up"
          collapsible
        >
          <SgToolbarIconButton icon={<Home className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.home")}" hint="${t(i18n, "showcase.component.toolbar.labels.home")}" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.users")}" hint="${t(i18n, "showcase.component.toolbar.labels.users")}" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="${t(i18n, "showcase.component.toolbar.labels.settings")}" hint="${t(i18n, "showcase.component.toolbar.labels.settings")}" />
        </SgToolBar>
      </div>
    </div>
  );
}`}
        />
      </Section>

      <Section
        title="5) Quebra automática (buttonsPerDirection)"
        description="Exemplo horizontal e vertical usando buttonsPerDirection."
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">Horizontal: orientationDirection="horizontal-left" + buttonsPerDirection={3}</p>
            <SgToolBar
              id="tb-wrap-horizontal"
              title="Acoes horizontais"
              orientationDirection="horizontal-left"
              collapsible
              buttonsPerDirection={3}
            >
              <SgToolbarIconButton icon={<Plus className="size-4" />} label="Criar" hint="Criar novo registro" severity="success" />
              <SgToolbarIconButton icon={<Pencil className="size-4" />} label="Editar" hint="Editar registro selecionado" severity="info" />
              <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="Excluir" hint="Excluir registro selecionado" severity="danger" />
              <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
              <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
            </SgToolBar>
          </div>
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">Vertical: orientationDirection="vertical-down" + buttonsPerDirection={2}</p>
            <SgToolBar
              id="tb-wrap-vertical"
              title="Acoes verticais"
              orientationDirection="vertical-down"
              collapsible
              buttonsPerDirection={2}
            >
              <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para Inicio" severity="primary" />
              <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir lista de clientes" />
              <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
              <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
              <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
            </SgToolBar>
          </div>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Plus, Pencil, Trash2, Filter, RefreshCcw, Home, Users, Settings } from "lucide-react";

export default function Example() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">Horizontal: orientationDirection="horizontal-left" + buttonsPerDirection={3}</p>
        <SgToolBar
          id="tb-wrap-horizontal"
          title="Acoes horizontais"
          orientationDirection="horizontal-left"
          collapsible
          buttonsPerDirection={3}
        >
          <SgToolbarIconButton icon={<Plus className="size-4" />} label="Criar" hint="Criar novo registro" severity="success" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="Editar" hint="Editar registro selecionado" severity="info" />
          <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="Excluir" hint="Excluir registro selecionado" severity="danger" />
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
        </SgToolBar>
      </div>
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">Vertical: orientationDirection="vertical-down" + buttonsPerDirection={2}</p>
        <SgToolBar
          id="tb-wrap-vertical"
          title="Acoes verticais"
          orientationDirection="vertical-down"
          collapsible
          buttonsPerDirection={2}
        >
          <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para Inicio" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir lista de clientes" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
        </SgToolBar>
      </div>
    </div>
  );
}`}
        />
      </Section>

      <Section
        title="6) Cores de fundo (bgColor / bgColorTitle)"
        description="bgColor pinta a area principal. bgColorTitle pinta apenas o cabecalho."
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">Somente bgColor</p>
            <SgToolBar
              id="tb-bg-color"
              title="Cor no corpo"
              orientationDirection="vertical-down"
              collapsible
              bgColor="#ECFEFF"
            >
              <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para Inicio" severity="primary" />
              <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir lista de clientes" />
              <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
            </SgToolBar>
          </div>
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs text-muted-foreground">bgColor + bgColorTitle</p>
            <SgToolBar
              id="tb-bg-both"
              title="Titulo destacado"
              orientationDirection="vertical-down"
              collapsible
              bgColor="#DAD7D2"
              bgColorTitle="#C9712D"
            >
              <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
              <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
              <SgToolbarIconButton icon={<Pencil className="size-4" />} label="Editar" hint="Editar registro selecionado" severity="info" />
            </SgToolBar>
          </div>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Home, Users, Settings, Filter, RefreshCcw, Pencil } from "lucide-react";

export default function Example() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">Somente bgColor</p>
        <SgToolBar
          id="tb-bg-color"
          title="Cor no corpo"
          orientationDirection="vertical-down"
          collapsible
          bgColor="#ECFEFF"
        >
          <SgToolbarIconButton icon={<Home className="size-4" />} label="Inicio" hint="Ir para Inicio" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="Clientes" hint="Abrir lista de clientes" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="Config" hint="Abrir configuracoes" />
        </SgToolBar>
      </div>
      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">bgColor + bgColorTitle</p>
        <SgToolBar
          id="tb-bg-both"
          title="Titulo destacado"
          orientationDirection="vertical-down"
          collapsible
          bgColor="#DAD7D2"
          bgColorTitle="#C9712D"
        >
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="Filtro" hint="Filtrar resultados" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="Atualizar" hint="Atualizar dados da tela" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="Editar" hint="Editar registro selecionado" severity="info" />
        </SgToolBar>
      </div>
    </div>
  );
}`}
        />
      </Section>

      <Section
        title={`7) ${t(i18n, "showcase.component.toolbar.sections.freeDrag.title")}`}
        description={t(i18n, "showcase.component.toolbar.sections.freeDrag.description")}
      >
        <div className="h-56 w-full rounded-lg border border-dashed border-border p-3">
          <SgToolBar
            id="tb-free"
            title={t(i18n, "showcase.component.toolbar.labels.free")}
            orientationDirection="vertical-down"
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
        orientationDirection="vertical-down"
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
        title="8) Drag preso no container"
        description="Neste exemplo o drag continua dentro da caixa porque a toolbar está em modo absolute."
      >
        <div className="relative h-56 w-full rounded-lg border border-dashed border-border">
          <SgToolBar
            id="tb-bounded"
            title="Drag preso"
            orientationDirection="vertical-down"
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
        orientationDirection="vertical-down"
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

        <Section title="9) Playground (SgPlayground)" description="Ajuste as principais props do SgToolBar.">
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




