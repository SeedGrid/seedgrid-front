"use client";

import React from "react";
import { SgDockLayout, SgDockZone, SgGrid, SgPlayground, SgToolBar, SgToolbarIconButton, toast } from "@seedgrid/fe-components";
import { Filter, Home, Pencil, Plus, RefreshCcw, Settings, Trash2, Users } from "lucide-react";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

function ToolbarInlineHost(props: { layoutId: string; children: React.ReactNode }) {
  return (
    <SgDockLayout id={props.layoutId} className="grid grid-cols-1 grid-rows-1">
      <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
        {props.children}
      </SgDockZone>
    </SgDockLayout>
  );
}

type ToolbarTexts = {
  subtitle: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  labels: {
    navigation: string;
    quickActions: string;
    home: string;
    users: string;
    settings: string;
    create: string;
    edit: string;
    delete: string;
    filter: string;
    refresh: string;
    panelBody: string;
    highlightedTitle: string;
  };
  hints: {
    goHome: string;
    openUsers: string;
    openSettings: string;
    createRecord: string;
    editRecord: string;
    deleteRecord: string;
    filterResults: string;
    refreshData: string;
  };
  toasts: {
    createDone: string;
    editDone: string;
    deleteDone: string;
  };
  playgroundTitle: string;
  propsTitle: string;
};

const TOOLBAR_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ToolbarTexts> = {
  "pt-BR": {
    subtitle: "Toolbar reutilizavel com orientacao vertical/horizontal, acoes assincronas e customizacao visual.",
    sectionTitles: [
      "1) Basico",
      "2) onClick assincrono com toast",
      "3) Orientacao e quebra",
      "4) Cores de fundo",
      "5) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo vertical simples com botoes de navegacao.",
      "Quando onClick retorna Promise, o botao mostra loading ate concluir.",
      "Comparacao entre horizontal-left e vertical-down com buttonsPerDirection.",
      "Uso de bgColor e bgColorTitle para destacar a toolbar.",
      "Ajuste as principais props do SgToolBar em tempo real."
    ],
    labels: {
      navigation: "Navegacao",
      quickActions: "Acoes rapidas",
      home: "Inicio",
      users: "Usuarios",
      settings: "Configuracoes",
      create: "Criar",
      edit: "Editar",
      delete: "Excluir",
      filter: "Filtro",
      refresh: "Atualizar",
      panelBody: "Cor no corpo",
      highlightedTitle: "Titulo destacado"
    },
    hints: {
      goHome: "Ir para Inicio",
      openUsers: "Abrir lista de usuarios",
      openSettings: "Abrir configuracoes",
      createRecord: "Criar novo registro",
      editRecord: "Editar registro selecionado",
      deleteRecord: "Excluir registro selecionado",
      filterResults: "Filtrar resultados",
      refreshData: "Atualizar dados da tela"
    },
    toasts: {
      createDone: "Acao Criar concluida",
      editDone: "Acao Editar concluida",
      deleteDone: "Acao Excluir concluida"
    },
    playgroundTitle: "SgToolBar Playground",
    propsTitle: "Referencia de Props"
  },
  "pt-PT": {
    subtitle: "Toolbar reutilizavel com orientacao vertical/horizontal, acoes assincronas e customizacao visual.",
    sectionTitles: [
      "1) Basico",
      "2) onClick assincrono com toast",
      "3) Orientacao e quebra",
      "4) Cores de fundo",
      "5) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Exemplo vertical simples com botoes de navegacao.",
      "Quando onClick retorna Promise, o botao mostra loading ate concluir.",
      "Comparacao entre horizontal-left e vertical-down com buttonsPerDirection.",
      "Uso de bgColor e bgColorTitle para destacar a toolbar.",
      "Ajuste as principais props do SgToolBar em tempo real."
    ],
    labels: {
      navigation: "Navegacao",
      quickActions: "Acoes rapidas",
      home: "Inicio",
      users: "Utilizadores",
      settings: "Configuracoes",
      create: "Criar",
      edit: "Editar",
      delete: "Excluir",
      filter: "Filtro",
      refresh: "Atualizar",
      panelBody: "Cor no corpo",
      highlightedTitle: "Titulo destacado"
    },
    hints: {
      goHome: "Ir para Inicio",
      openUsers: "Abrir lista de utilizadores",
      openSettings: "Abrir configuracoes",
      createRecord: "Criar novo registo",
      editRecord: "Editar registo selecionado",
      deleteRecord: "Excluir registo selecionado",
      filterResults: "Filtrar resultados",
      refreshData: "Atualizar dados do ecra"
    },
    toasts: {
      createDone: "Acao Criar concluida",
      editDone: "Acao Editar concluida",
      deleteDone: "Acao Excluir concluida"
    },
    playgroundTitle: "SgToolBar Playground",
    propsTitle: "Referencia de Props"
  },
  "en-US": {
    subtitle: "Reusable toolbar with vertical/horizontal orientation, async actions, and visual customization.",
    sectionTitles: [
      "1) Basic",
      "2) Async onClick with toast",
      "3) Orientation and wrapping",
      "4) Background colors",
      "5) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Simple vertical example with navigation buttons.",
      "When onClick returns Promise, the button shows loading until complete.",
      "Comparison between horizontal-left and vertical-down with buttonsPerDirection.",
      "Use bgColor and bgColorTitle to style toolbar areas.",
      "Adjust the main SgToolBar props in real time."
    ],
    labels: {
      navigation: "Navigation",
      quickActions: "Quick actions",
      home: "Home",
      users: "Users",
      settings: "Settings",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      filter: "Filter",
      refresh: "Refresh",
      panelBody: "Body color",
      highlightedTitle: "Highlighted title"
    },
    hints: {
      goHome: "Go to Home",
      openUsers: "Open users list",
      openSettings: "Open settings",
      createRecord: "Create new record",
      editRecord: "Edit selected record",
      deleteRecord: "Delete selected record",
      filterResults: "Filter results",
      refreshData: "Refresh screen data"
    },
    toasts: {
      createDone: "Create action completed",
      editDone: "Edit action completed",
      deleteDone: "Delete action completed"
    },
    playgroundTitle: "SgToolBar Playground",
    propsTitle: "Props Reference"
  },
  es: {
    subtitle: "Toolbar reutilizable con orientacion vertical/horizontal, acciones asincronas y personalizacion visual.",
    sectionTitles: [
      "1) Basico",
      "2) onClick asincrono con toast",
      "3) Orientacion y ajuste",
      "4) Colores de fondo",
      "5) Playground (SgPlayground)"
    ],
    sectionDescriptions: [
      "Ejemplo vertical simple con botones de navegacion.",
      "Cuando onClick devuelve Promise, el boton muestra loading hasta completar.",
      "Comparacion entre horizontal-left y vertical-down con buttonsPerDirection.",
      "Uso de bgColor y bgColorTitle para destacar la toolbar.",
      "Ajusta las principales props de SgToolBar en tiempo real."
    ],
    labels: {
      navigation: "Navegacion",
      quickActions: "Acciones rapidas",
      home: "Inicio",
      users: "Usuarios",
      settings: "Configuraciones",
      create: "Crear",
      edit: "Editar",
      delete: "Eliminar",
      filter: "Filtro",
      refresh: "Actualizar",
      panelBody: "Color del cuerpo",
      highlightedTitle: "Titulo destacado"
    },
    hints: {
      goHome: "Ir a Inicio",
      openUsers: "Abrir lista de usuarios",
      openSettings: "Abrir configuraciones",
      createRecord: "Crear nuevo registro",
      editRecord: "Editar registro seleccionado",
      deleteRecord: "Eliminar registro seleccionado",
      filterResults: "Filtrar resultados",
      refreshData: "Actualizar datos de pantalla"
    },
    toasts: {
      createDone: "Accion Crear completada",
      editDone: "Accion Editar completada",
      deleteDone: "Accion Eliminar completada"
    },
    playgroundTitle: "SgToolBar Playground",
    propsTitle: "Referencia de Props"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof TOOLBAR_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

const TOOLBAR_PLAYGROUND_CODE = `import * as React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

export default function App() {
  const options = ["horizontal-left", "horizontal-right", "vertical-down", "vertical-up"] as const;
  type Direction = typeof options[number];
  const [orientationDirection, setOrientationDirection] = React.useState<Direction>("horizontal-left");
  const [collapsible, setCollapsible] = React.useState(true);
  const [buttonsPerDirection, setButtonsPerDirection] = React.useState<number | undefined>(undefined);

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs"
          value={orientationDirection}
          onChange={(e) => setOrientationDirection(e.target.value as Direction)}
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

      <SgDockLayout id="tb-playground-layout" className="grid grid-cols-1 grid-rows-1">
        <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
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
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}`;

const TOOLBAR_PROPS: ShowcasePropRow[] = [
  { prop: "SgToolBar.id", type: "string", defaultValue: "-", description: "Identificador unico da toolbar." },
  { prop: "SgToolBar.title", type: "ReactNode", defaultValue: "-", description: "Titulo exibido no cabecalho." },
  { prop: "SgToolBar.orientationDirection", type: '"vertical-up" | "vertical-down" | "horizontal-left" | "horizontal-right"', defaultValue: '"vertical-down"', description: "Define orientacao e direcao de abertura em uma unica prop." },
  { prop: "SgToolBar.buttonsPerDirection", type: "number", defaultValue: "-", description: "Quantidade por direcao principal: horizontal por linha, vertical por coluna." },
  { prop: "SgToolBar.bgColorTitle", type: "string", defaultValue: "-", description: "Cor de fundo do cabecalho." },
  { prop: "SgToolBar.bgColor", type: "string", defaultValue: "-", description: "Cor de fundo da area principal da toolbar." },
  { prop: "SgToolBar.size", type: "{ w?: number; h?: number }", defaultValue: "-", description: "Dimensoes fixas da toolbar." },
  { prop: "SgToolBar.className", type: "string", defaultValue: "-", description: "Classes CSS adicionais." },
  { prop: "SgToolBar.style", type: "CSSProperties", defaultValue: "-", description: "Estilo inline adicional." },
  { prop: "SgToolBar.dockZone", type: '"top" | "bottom" | "left" | "right" | "free"', defaultValue: '"free"', description: "Zona inicial quando usada com dock." },
  { prop: "SgToolBar.draggable", type: "boolean", defaultValue: "false", description: "Permite iniciar arraste." },
  { prop: "SgToolBar.freeDrag", type: "boolean", defaultValue: "false", description: "Ativa arraste livre com posicao x e y." },
  { prop: "SgToolBar.defaultPosition", type: "{ x: number; y: number }", defaultValue: "-", description: "Posicao inicial quando nao existe estado salvo." },
  { prop: "SgToolBar.collapsible", type: "boolean", defaultValue: "true", description: "Habilita botao de expandir e contrair." },
  { prop: "SgToolBar.collapsed", type: "boolean", defaultValue: "controlado", description: "Controla o estado colapsado externamente." },
  { prop: "SgToolBar.defaultCollapsed", type: "boolean", defaultValue: "false", description: "Estado inicial colapsado no modo nao controlado." },
  { prop: "SgToolBar.onCollapsedChange", type: "(collapsed: boolean) => void", defaultValue: "-", description: "Callback ao alternar colapso." },
  { prop: "SgToolBar.children", type: "ReactNode", defaultValue: "-", description: "Itens internos, normalmente SgToolbarIconButton." },
  { prop: "SgToolbarIconButton.icon", type: "ReactNode | string", defaultValue: "-", description: "Icone ou texto exibido no botao." },
  { prop: "SgToolbarIconButton.label", type: "string", defaultValue: "-", description: "Texto visivel no botao." },
  { prop: "SgToolbarIconButton.showLabel", type: "boolean", defaultValue: "true", description: "Controla exibicao do label." },
  { prop: "SgToolbarIconButton.hint", type: "string", defaultValue: "-", description: "Texto de dica/tooltip." },
  { prop: "SgToolbarIconButton.loading", type: "boolean", defaultValue: "false", description: "Forca estado de loading com spinner e bloqueia clique." },
  { prop: "SgToolbarIconButton.severity", type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger" | "plain"', defaultValue: '"plain"', description: "Variacao de cor do botao." },
  { prop: "SgToolbarIconButton.disabled", type: "boolean", defaultValue: "false", description: "Desabilita interacao." },
  { prop: "SgToolbarIconButton.onClick", type: "() => void | Promise<void>", defaultValue: "-", description: "Acao executada no clique." }
];

export default function SgToolBarPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof TOOLBAR_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = TOOLBAR_TEXTS[locale];
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
          title="SgToolBar"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <div className="w-full">
            <ToolbarInlineHost layoutId="tb-layout-basic">
              <SgToolBar id="tb-basic" title={texts.labels.navigation} orientationDirection="vertical-down">
                <SgToolbarIconButton icon={<Home className="size-4" />} label={texts.labels.home} hint={texts.hints.goHome} severity="primary" />
                <SgToolbarIconButton icon={<Users className="size-4" />} label={texts.labels.users} hint={texts.hints.openUsers} />
                <SgToolbarIconButton icon={<Settings className="size-4" />} label={texts.labels.settings} hint={texts.hints.openSettings} />
              </SgToolBar>
            </ToolbarInlineHost>
          </div>
          <CodeBlock
            code={`import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { Home, Users, Settings } from "lucide-react";

export default function Example() {
  return (
    <div className="w-full">
      <SgDockLayout id="tb-layout-basic" className="grid grid-cols-1 grid-rows-1">
        <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
          <SgToolBar id="tb-basic" title="${texts.labels.navigation}" orientationDirection="vertical-down">
            <SgToolbarIconButton icon={<Home className="size-4" />} label="${texts.labels.home}" hint="${texts.hints.goHome}" severity="primary" />
            <SgToolbarIconButton icon={<Users className="size-4" />} label="${texts.labels.users}" hint="${texts.hints.openUsers}" />
            <SgToolbarIconButton icon={<Settings className="size-4" />} label="${texts.labels.settings}" hint="${texts.hints.openSettings}" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}`}
          />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <div className="w-full">
            <ToolbarInlineHost layoutId="tb-layout-async">
              <SgToolBar id="tb-async" title={texts.labels.quickActions} orientationDirection="horizontal-left" collapsible>
                <SgToolbarIconButton
                  icon={<Plus className="size-4" />}
                  label={texts.labels.create}
                  hint={texts.hints.createRecord}
                  severity="success"
                  onClick={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    toast.success(texts.toasts.createDone);
                  }}
                />
                <SgToolbarIconButton
                  icon={<Pencil className="size-4" />}
                  label={texts.labels.edit}
                  hint={texts.hints.editRecord}
                  severity="info"
                  onClick={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    toast.info(texts.toasts.editDone);
                  }}
                />
                <SgToolbarIconButton
                  icon={<Trash2 className="size-4" />}
                  label={texts.labels.delete}
                  hint={texts.hints.deleteRecord}
                  severity="danger"
                  onClick={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    toast.warning(texts.toasts.deleteDone);
                  }}
                />
              </SgToolBar>
            </ToolbarInlineHost>
          </div>
          <CodeBlock
            code={`import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton, toast } from "@seedgrid/fe-components";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <div className="w-full">
      <SgDockLayout id="tb-layout-async" className="grid grid-cols-1 grid-rows-1">
        <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
          <SgToolBar id="tb-async" title="${texts.labels.quickActions}" orientationDirection="horizontal-left" collapsible>
            <SgToolbarIconButton
              icon={<Plus className="size-4" />}
              label="${texts.labels.create}"
              hint="${texts.hints.createRecord}"
              severity="success"
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.success("${texts.toasts.createDone}");
              }}
            />
            <SgToolbarIconButton
              icon={<Pencil className="size-4" />}
              label="${texts.labels.edit}"
              hint="${texts.hints.editRecord}"
              severity="info"
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.info("${texts.toasts.editDone}");
              }}
            />
            <SgToolbarIconButton
              icon={<Trash2 className="size-4" />}
              label="${texts.labels.delete}"
              hint="${texts.hints.deleteRecord}"
              severity="danger"
              onClick={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.warning("${texts.toasts.deleteDone}");
              }}
            />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}`}
          />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <div className="w-full">
            <SgGrid columns={{ base: 1, lg: 2 }} gap={12}>
              <div className="rounded-lg border border-dashed border-border p-3">
                <p className="mb-2 text-xs text-muted-foreground">orientationDirection="horizontal-left" + buttonsPerDirection=3</p>
                <ToolbarInlineHost layoutId="tb-layout-horizontal">
                  <SgToolBar id="tb-horizontal" title={texts.labels.quickActions} orientationDirection="horizontal-left" buttonsPerDirection={3} collapsible>
                    <SgToolbarIconButton icon={<Plus className="size-4" />} label={texts.labels.create} hint={texts.hints.createRecord} severity="success" />
                    <SgToolbarIconButton icon={<Pencil className="size-4" />} label={texts.labels.edit} hint={texts.hints.editRecord} severity="info" />
                    <SgToolbarIconButton icon={<Trash2 className="size-4" />} label={texts.labels.delete} hint={texts.hints.deleteRecord} severity="danger" />
                    <SgToolbarIconButton icon={<Filter className="size-4" />} label={texts.labels.filter} hint={texts.hints.filterResults} />
                    <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label={texts.labels.refresh} hint={texts.hints.refreshData} />
                  </SgToolBar>
                </ToolbarInlineHost>
              </div>
              <div className="rounded-lg border border-dashed border-border p-3">
                <p className="mb-2 text-xs text-muted-foreground">orientationDirection="vertical-down" + buttonsPerDirection=2</p>
                <ToolbarInlineHost layoutId="tb-layout-vertical">
                  <SgToolBar id="tb-vertical" title={texts.labels.navigation} orientationDirection="vertical-down" buttonsPerDirection={2} collapsible>
                    <SgToolbarIconButton icon={<Home className="size-4" />} label={texts.labels.home} hint={texts.hints.goHome} severity="primary" />
                    <SgToolbarIconButton icon={<Users className="size-4" />} label={texts.labels.users} hint={texts.hints.openUsers} />
                    <SgToolbarIconButton icon={<Settings className="size-4" />} label={texts.labels.settings} hint={texts.hints.openSettings} />
                    <SgToolbarIconButton icon={<Filter className="size-4" />} label={texts.labels.filter} hint={texts.hints.filterResults} />
                    <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label={texts.labels.refresh} hint={texts.hints.refreshData} />
                  </SgToolBar>
                </ToolbarInlineHost>
              </div>
            </SgGrid>
          </div>
          <CodeBlock
            code={`<SgGrid columns={{ base: 1, lg: 2 }} gap={12}>
  <div className="rounded-lg border border-dashed border-border p-3">
    <p className="mb-2 text-xs text-muted-foreground">orientationDirection="horizontal-left" + buttonsPerDirection=3</p>
    <SgDockLayout id="tb-layout-horizontal" className="grid grid-cols-1 grid-rows-1">
      <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
        <SgToolBar id="tb-horizontal" title="${texts.labels.quickActions}" orientationDirection="horizontal-left" buttonsPerDirection={3} collapsible>
          <SgToolbarIconButton icon={<Plus className="size-4" />} label="${texts.labels.create}" hint="${texts.hints.createRecord}" severity="success" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="${texts.labels.edit}" hint="${texts.hints.editRecord}" severity="info" />
          <SgToolbarIconButton icon={<Trash2 className="size-4" />} label="${texts.labels.delete}" hint="${texts.hints.deleteRecord}" severity="danger" />
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="${texts.labels.filter}" hint="${texts.hints.filterResults}" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="${texts.labels.refresh}" hint="${texts.hints.refreshData}" />
        </SgToolBar>
      </SgDockZone>
    </SgDockLayout>
  </div>

  <div className="rounded-lg border border-dashed border-border p-3">
    <p className="mb-2 text-xs text-muted-foreground">orientationDirection="vertical-down" + buttonsPerDirection=2</p>
    <SgDockLayout id="tb-layout-vertical" className="grid grid-cols-1 grid-rows-1">
      <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
        <SgToolBar id="tb-vertical" title="${texts.labels.navigation}" orientationDirection="vertical-down" buttonsPerDirection={2} collapsible>
          <SgToolbarIconButton icon={<Home className="size-4" />} label="${texts.labels.home}" hint="${texts.hints.goHome}" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="${texts.labels.users}" hint="${texts.hints.openUsers}" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="${texts.labels.settings}" hint="${texts.hints.openSettings}" />
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="${texts.labels.filter}" hint="${texts.hints.filterResults}" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="${texts.labels.refresh}" hint="${texts.hints.refreshData}" />
        </SgToolBar>
      </SgDockZone>
    </SgDockLayout>
  </div>
</SgGrid>`}
          />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <div className="w-full">
            <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
              <div className="rounded-lg border border-dashed border-border p-3">
                <p className="mb-2 text-xs text-muted-foreground">bgColor</p>
                <ToolbarInlineHost layoutId="tb-layout-style-a">
                  <SgToolBar id="tb-style-a" title={texts.labels.panelBody} orientationDirection="vertical-down" collapsible bgColor="#ECFEFF">
                    <SgToolbarIconButton icon={<Home className="size-4" />} label={texts.labels.home} hint={texts.hints.goHome} severity="primary" />
                    <SgToolbarIconButton icon={<Users className="size-4" />} label={texts.labels.users} hint={texts.hints.openUsers} />
                    <SgToolbarIconButton icon={<Settings className="size-4" />} label={texts.labels.settings} hint={texts.hints.openSettings} />
                  </SgToolBar>
                </ToolbarInlineHost>
              </div>
              <div className="rounded-lg border border-dashed border-border p-3">
                <p className="mb-2 text-xs text-muted-foreground">bgColor + bgColorTitle</p>
                <ToolbarInlineHost layoutId="tb-layout-style-b">
                  <SgToolBar id="tb-style-b" title={texts.labels.highlightedTitle} orientationDirection="vertical-down" collapsible bgColor="#DAD7D2" bgColorTitle="#C9712D">
                    <SgToolbarIconButton icon={<Filter className="size-4" />} label={texts.labels.filter} hint={texts.hints.filterResults} />
                    <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label={texts.labels.refresh} hint={texts.hints.refreshData} />
                    <SgToolbarIconButton icon={<Pencil className="size-4" />} label={texts.labels.edit} hint={texts.hints.editRecord} severity="info" />
                  </SgToolBar>
                </ToolbarInlineHost>
              </div>
            </SgGrid>
          </div>
          <CodeBlock
            code={`<SgGrid columns={{ base: 1, md: 2 }} gap={12}>
  <div className="rounded-lg border border-dashed border-border p-3">
    <p className="mb-2 text-xs text-muted-foreground">bgColor</p>
    <SgDockLayout id="tb-layout-style-a" className="grid grid-cols-1 grid-rows-1">
      <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
        <SgToolBar id="tb-style-a" title="${texts.labels.panelBody}" orientationDirection="vertical-down" collapsible bgColor="#ECFEFF">
          <SgToolbarIconButton icon={<Home className="size-4" />} label="${texts.labels.home}" hint="${texts.hints.goHome}" severity="primary" />
          <SgToolbarIconButton icon={<Users className="size-4" />} label="${texts.labels.users}" hint="${texts.hints.openUsers}" />
          <SgToolbarIconButton icon={<Settings className="size-4" />} label="${texts.labels.settings}" hint="${texts.hints.openSettings}" />
        </SgToolBar>
      </SgDockZone>
    </SgDockLayout>
  </div>

  <div className="rounded-lg border border-dashed border-border p-3">
    <p className="mb-2 text-xs text-muted-foreground">bgColor + bgColorTitle</p>
    <SgDockLayout id="tb-layout-style-b" className="grid grid-cols-1 grid-rows-1">
      <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
        <SgToolBar id="tb-style-b" title="${texts.labels.highlightedTitle}" orientationDirection="vertical-down" collapsible bgColor="#DAD7D2" bgColorTitle="#C9712D">
          <SgToolbarIconButton icon={<Filter className="size-4" />} label="${texts.labels.filter}" hint="${texts.hints.filterResults}" />
          <SgToolbarIconButton icon={<RefreshCcw className="size-4" />} label="${texts.labels.refresh}" hint="${texts.hints.refreshData}" />
          <SgToolbarIconButton icon={<Pencil className="size-4" />} label="${texts.labels.edit}" hint="${texts.hints.editRecord}" severity="info" />
        </SgToolBar>
      </SgDockZone>
    </SgDockLayout>
  </div>
</SgGrid>`}
          />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <div className="w-full">
            <SgPlayground
              title={texts.playgroundTitle}
              interactive
              codeContract="appFile"
              code={TOOLBAR_PLAYGROUND_CODE}
              height={520}
              defaultOpen
            />
          </div>
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={TOOLBAR_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
