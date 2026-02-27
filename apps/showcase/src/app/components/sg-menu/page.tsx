"use client";

import React from "react";
import { SgButton, SgMenu, SgPlayground, type SgMenuNode } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

const MENU: SgMenuNode[] = [
  { id: "dashboard", label: "Dashboard", url: "/dashboard", iconKey: "db" },
  {
    id: "customers",
    label: "Customers",
    iconKey: "cu",
    children: [
      {
        id: "customers-new",
        label: "New",
        iconKey: "nw",
        children: [
          { id: "customer-create", label: "Customer", url: "/customers/new/customer" },
          { id: "customer-duplicate", label: "Duplicate", url: "/customers/new/duplicate" }
        ]
      },
      {
        id: "customers-reports",
        label: "Reports",
        iconKey: "rp",
        children: [
          { id: "customers-cohort", label: "Cohort", url: "/customers/reports/cohort" },
          { id: "customers-churn", label: "Churn", url: "/customers/reports/churn" }
        ]
      }
    ]
  },
  {
    id: "orders",
    label: "Orders",
    iconKey: "or",
    children: [
      {
        id: "orders-sales",
        label: "Sales",
        iconKey: "sl",
        children: [
          { id: "orders-open", label: "Open Orders", url: "/orders/sales/open", badge: 4 },
          { id: "orders-closed", label: "Closed Orders", url: "/orders/sales/closed" }
        ]
      },
      { id: "orders-returns", label: "Returns", url: "/orders/returns", badge: 7 }
    ]
  },
  { id: "profile", label: "Profile", url: "/profile", iconKey: "pf" }
];

const MEGA_MENU: SgMenuNode[] = [
  {
    id: "fashion",
    label: "Fashion",
    iconKey: "fa",
    children: [
      {
        id: "fashion-woman",
        label: "Woman",
        children: [
          { id: "fashion-woman-1", label: "Woman Item", url: "/fashion/woman/1" },
          { id: "fashion-woman-2", label: "Woman Item", url: "/fashion/woman/2" }
        ]
      },
      {
        id: "fashion-men",
        label: "Men",
        children: [
          { id: "fashion-men-1", label: "Men Item", url: "/fashion/men/1" },
          { id: "fashion-men-2", label: "Men Item", url: "/fashion/men/2" }
        ]
      }
    ]
  },
  {
    id: "electronics",
    label: "Electronics",
    iconKey: "el",
    children: [
      {
        id: "electronics-computer",
        label: "Computer",
        children: [
          { id: "electronics-computer-1", label: "Computer Item", url: "/electronics/computer/1" },
          { id: "electronics-computer-2", label: "Computer Item", url: "/electronics/computer/2" }
        ]
      },
      {
        id: "electronics-tv",
        label: "TV",
        children: [
          { id: "electronics-tv-1", label: "TV Item", url: "/electronics/tv/1" },
          { id: "electronics-tv-2", label: "TV Item", url: "/electronics/tv/2" }
        ]
      }
    ]
  }
];

const USER_MENU: SgMenuNode[] = [
  { id: "perfil", label: "Meu perfil", onClick: () => {} },
  { id: "preferencias", label: "Preferencias", onClick: () => {} },
  { id: "logout", label: "Sair", onClick: () => {} }
];

const ICON_REGISTRY: Record<string, React.ReactNode> = {
  db: <Home className="size-4" />,
  cu: <Users className="size-4" />,
  nw: <LayoutGrid className="size-4" />,
  rp: <ClipboardList className="size-4" />,
  or: <LayoutGrid className="size-4" />,
  sl: <Search className="size-4" />,
  pf: <Settings className="size-4" />,
  fa: <Users className="size-4" />,
  el: <Settings className="size-4" />
};

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const EXAMPLE_SIDEBAR_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

const ICON_REGISTRY = {
  db: <Home className="size-4" />,
  cu: <Users className="size-4" />,
  nw: <LayoutGrid className="size-4" />,
  rp: <ClipboardList className="size-4" />,
  or: <LayoutGrid className="size-4" />,
  sl: <Search className="size-4" />,
  pf: <Settings className="size-4" />,
  fa: <Users className="size-4" />,
  el: <Settings className="size-4" />
};

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="h-[460px] overflow-hidden rounded-lg border border-border">
      <div className="flex h-full">
        <SgMenu
          menu={MENU}
          selection={{ activeId }}
          variant="sidebar"
          mode="accordion"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseButton
          search={{ enabled: true, placeholder: "Buscar modulo..." }}
          brand={{ title: "SeedGrid ERP" }}
          user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
          userMenu={USER_MENU}
          iconRegistry={ICON_REGISTRY}
          onNavigate={(node) => setActiveId(node.id)}
        />
        <div className="flex-1 space-y-3 p-4">
          <h3 className="text-base font-semibold">Conteudo principal</h3>
          <p className="text-sm text-muted-foreground">
            Item ativo: <span className="font-medium text-foreground">{activeId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const EXAMPLE_DRAWER_CODE = `import React from "react";
import { SgButton, SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

const ICON_REGISTRY = {
  db: <Home className="size-4" />,
  cu: <Users className="size-4" />,
  nw: <LayoutGrid className="size-4" />,
  rp: <ClipboardList className="size-4" />,
  or: <LayoutGrid className="size-4" />,
  sl: <Search className="size-4" />,
  pf: <Settings className="size-4" />,
  fa: <Users className="size-4" />,
  el: <Settings className="size-4" />
};

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton onClick={() => setDrawerOpen(true)}>Abrir menu mobile</SgButton>
        <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
          \${drawerPinned ? "Desafixar drawer" : "Fixar drawer"}
        </SgButton>
      </div>

      <SgMenu
        menu={MENU}
        selection={{ activeId }}
        variant="drawer"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        pinned={drawerPinned}
        onPinnedChange={setDrawerPinned}
        showPinButton
        closeOnNavigate
        search={{ enabled: true, placeholder: "Buscar..." }}
        brand={{ title: "SeedGrid ERP" }}
        iconRegistry={ICON_REGISTRY}
        onNavigate={(node) => setActiveId(node.id)}
      />
    </>
  );
}`;

const EXAMPLE_STYLES_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

const ICON_REGISTRY = {
  db: <Home className="size-4" />,
  cu: <Users className="size-4" />,
  nw: <LayoutGrid className="size-4" />,
  rp: <ClipboardList className="size-4" />,
  or: <LayoutGrid className="size-4" />,
  sl: <Search className="size-4" />,
  pf: <Settings className="size-4" />,
  fa: <Users className="size-4" />,
  el: <Settings className="size-4" />
};

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-sm font-semibold">PanelMenu</p>
        <div className="h-[320px] overflow-auto rounded-md border border-border">
          <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-sm font-semibold">Tiered</p>
        <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
          <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="Tiered" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
        <p className="text-sm font-semibold">MegaMenu Horizontal</p>
        <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuHorizontal" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
      </div>

      <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
        <p className="text-sm font-semibold">MegaMenu Vertical</p>
        <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuVertical" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

const ICON_REGISTRY = {
  db: <Home className="size-4" />,
  cu: <Users className="size-4" />,
  nw: <LayoutGrid className="size-4" />,
  rp: <ClipboardList className="size-4" />,
  or: <LayoutGrid className="size-4" />,
  sl: <Search className="size-4" />,
  pf: <Settings className="size-4" />,
  fa: <Users className="size-4" />,
  el: <Settings className="size-4" />
};

export default function App() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [variant, setVariant] = React.useState<"sidebar" | "drawer" | "inline" | "hybrid">("sidebar");
  const [menuStyle, setMenuStyle] = React.useState<"panel" | "tiered" | "mega-horizontal" | "mega-vertical">("panel");
  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("sidebar")}>sidebar</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("drawer")}>drawer</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("inline")}>inline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("hybrid")}>hybrid</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("panel")}>panel</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("tiered")}>tiered</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("mega-horizontal")}>mega-h</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("mega-vertical")}>mega-v</SgButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setCollapsed((v) => !v)}>toggle collapsed</SgButton>
        <SgButton size="sm" onClick={() => setOpen((v) => !v)}>toggle open</SgButton>
      </div>

      <div className="h-[420px] overflow-hidden rounded-lg border border-border">
        <SgMenu
          menu={MENU}
          selection={{ activeId }}
          variant={variant}
          menuStyle={menuStyle}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          open={open}
          onOpenChange={setOpen}
          showCollapseButton
          onNavigate={(node) => setActiveId(node.id)}
          search={{ enabled: true, placeholder: "Buscar..." }}
          iconRegistry={ICON_REGISTRY}
        />
      </div>
    </div>
  );
}`;

const MENU_PROPS: ShowcasePropRow[] = [
  { prop: "menu", type: "SgMenuNode[]", defaultValue: "-", description: "Arvore de navegacao exibida pelo menu." },
  { prop: "selection", type: "SgMenuSelection", defaultValue: "-", description: "Item ativo por id ou por url." },
  { prop: "brand", type: "SgMenuBrand", defaultValue: "-", description: "Bloco de marca no topo." },
  { prop: "user", type: "SgMenuUser", defaultValue: "-", description: "Bloco de usuario no topo/rodape do menu." },
  { prop: "userMenu", type: "SgMenuNode[]", defaultValue: "-", description: "Acoes exibidas no menu do usuario." },
  { prop: "variant", type: "\"sidebar\" | \"drawer\" | \"inline\" | \"hybrid\"", defaultValue: "sidebar", description: "Modo geral de apresentacao." },
  { prop: "menuStyle", type: "SgMenuStyle", defaultValue: "panel", description: "Estilo interno: panel, tiered, mega-horizontal ou mega-vertical." },
  { prop: "position", type: "\"left\" | \"right\"", defaultValue: "left", description: "Posicao horizontal do menu." },
  { prop: "density", type: "\"compact\" | \"comfortable\"", defaultValue: "comfortable", description: "Densidade visual das linhas e icones." },
  { prop: "indent", type: "number", defaultValue: "16", description: "Recuo por nivel de profundidade." },
  { prop: "collapsedWidth", type: "number | string", defaultValue: "72", description: "Largura quando colapsado." },
  { prop: "expandedWidth", type: "number | string", defaultValue: "280", description: "Largura quando expandido." },
  { prop: "overlaySize", type: "SgExpandablePanelSize", defaultValue: "-", description: "Tamanho do overlay nos modos drawer/hybrid." },
  { prop: "overlayBackdrop", type: "boolean", defaultValue: "-", description: "Controla backdrop no overlay." },
  { prop: "mode", type: "\"accordion\" | \"multiple\"", defaultValue: "multiple", description: "Estrategia de expansao dos grupos." },
  { prop: "expandedIds", type: "string[]", defaultValue: "-", description: "Controle externo dos grupos expandidos." },
  { prop: "defaultExpandedIds", type: "string[]", defaultValue: "[]", description: "Estado inicial dos grupos expandidos." },
  { prop: "onExpandedIdsChange", type: "(ids: string[]) => void", defaultValue: "-", description: "Callback ao alterar grupos expandidos." },
  { prop: "collapsed", type: "boolean", defaultValue: "-", description: "Controle externo do estado colapsado." },
  { prop: "defaultCollapsed", type: "boolean", defaultValue: "false", description: "Estado inicial colapsado." },
  { prop: "onCollapsedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback ao colapsar/expandir." },
  { prop: "showCollapseButton", type: "boolean", defaultValue: "false", description: "Exibe botao de colapso no cabecalho." },
  { prop: "open", type: "boolean", defaultValue: "-", description: "Controle externo de abertura no drawer/overlay." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Estado inicial de abertura no drawer/overlay." },
  { prop: "onOpenChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback ao abrir/fechar overlay." },
  { prop: "closeOnNavigate", type: "boolean", defaultValue: "-", description: "Fecha o drawer apos navegacao." },
  { prop: "pinned", type: "boolean", defaultValue: "-", description: "Controle externo do estado fixado." },
  { prop: "defaultPinned", type: "boolean", defaultValue: "false", description: "Estado inicial fixado." },
  { prop: "onPinnedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback ao fixar/desafixar." },
  { prop: "showPinButton", type: "boolean", defaultValue: "false", description: "Exibe botao de pin no cabecalho." },
  { prop: "onNavigate", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Disparado em itens de navegacao (url)." },
  { prop: "onAction", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Disparado em itens de acao." },
  { prop: "onItemClick", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Disparado em qualquer clique de item." },
  { prop: "ariaLabel", type: "string", defaultValue: "\"Menu\"", description: "Rotulo de acessibilidade do nav." },
  { prop: "keyboardNavigation", type: "boolean", defaultValue: "true", description: "Ativa navegacao por teclado." },
  { prop: "openSubmenuOnHover", type: "boolean", defaultValue: "false", description: "No estilo tiered, abre submenu no hover quando true; no default abre no clique." },
  { prop: "search", type: "{ enabled: boolean; placeholder?: string }", defaultValue: "{ enabled: false }", description: "Configuracao da busca integrada." },
  { prop: "elevation", type: "\"none\" | \"sm\" | \"md\"", defaultValue: "none", description: "Elevacao/sombra do container." },
  { prop: "border", type: "boolean", defaultValue: "true", description: "Exibe borda externa do menu." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais no root." },
  { prop: "style", type: "CSSProperties", defaultValue: "-", description: "Estilos inline no root." },
  { prop: "iconRegistry", type: "Record<string, ReactNode>", defaultValue: "-", description: "Mapeia iconKey para icone real." },
  { prop: "footer", type: "ReactNode", defaultValue: "-", description: "Conteudo de rodape do menu." }
];

const MENU_NODE_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador unico do item." },
  { prop: "label", type: "string", defaultValue: "-", description: "Texto exibido no item." },
  { prop: "url", type: "string", defaultValue: "-", description: "Rota de navegacao do item." },
  { prop: "children", type: "SgMenuNode[]", defaultValue: "-", description: "Subitens do no atual." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita interacao do item." },
  { prop: "icon", type: "ReactNode", defaultValue: "-", description: "Icone direto do item." },
  { prop: "iconKey", type: "string", defaultValue: "-", description: "Chave para resolver icone via iconRegistry." },
  { prop: "badge", type: "string | number", defaultValue: "-", description: "Badge auxiliar ao lado do label." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Acao local do item." }
];

const MENU_SELECTION_PROPS: ShowcasePropRow[] = [
  { prop: "activeId", type: "string", defaultValue: "-", description: "Id do item ativo." },
  { prop: "activeUrl", type: "string", defaultValue: "-", description: "URL ativa para selecao por rota." }
];

const MENU_BRAND_PROPS: ShowcasePropRow[] = [
  { prop: "title", type: "string", defaultValue: "-", description: "Titulo exibido no bloco de marca." },
  { prop: "imageSrc", type: "string", defaultValue: "-", description: "URL da imagem da marca." },
  { prop: "image", type: "ReactNode", defaultValue: "-", description: "Elemento customizado de imagem." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Acao ao clicar na marca." }
];

const MENU_USER_PROPS: ShowcasePropRow[] = [
  { prop: "name", type: "string", defaultValue: "-", description: "Nome exibido no bloco do usuario." },
  { prop: "subtitle", type: "string", defaultValue: "-", description: "Texto auxiliar do usuario." },
  { prop: "avatarSrc", type: "string", defaultValue: "-", description: "URL do avatar do usuario." },
  { prop: "avatar", type: "ReactNode", defaultValue: "-", description: "Avatar customizado." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Acao ao clicar no bloco do usuario." }
];

export default function SgMenuPage() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMenu"
          subtitle="Menu hierarquico para sidebar, drawer, inline e hibrido, com busca e multiplos estilos."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Sidebar Fixa" description="Menu lateral com grupos colapsaveis e botao de colapso.">
          <div className="h-[460px] overflow-hidden rounded-lg border border-border">
            <div className="flex h-full">
              <SgMenu
                menu={MENU}
                selection={{ activeId }}
                variant="sidebar"
                mode="accordion"
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                showCollapseButton
                search={{ enabled: true, placeholder: "Buscar modulo..." }}
                brand={{ title: "SeedGrid ERP" }}
                user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
                userMenu={USER_MENU}
                iconRegistry={ICON_REGISTRY}
                onNavigate={(node) => setActiveId(node.id)}
              />
              <div className="flex-1 space-y-3 p-4">
                <h3 className="text-base font-semibold">Conteudo principal</h3>
                <p className="text-sm text-muted-foreground">
                  Item ativo: <span className="font-medium text-foreground">{activeId}</span>
                </p>
              </div>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_SIDEBAR_CODE} />
        </Section>

        <Section title="2) Drawer Mobile" description="Abre em overlay e pode ser fixado por pin.">
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => setDrawerOpen(true)}>Abrir menu mobile</SgButton>
            <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
              {drawerPinned ? "Desafixar drawer" : "Fixar drawer"}
            </SgButton>
          </div>

          <SgMenu
            menu={MENU}
            selection={{ activeId }}
            variant="drawer"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            pinned={drawerPinned}
            onPinnedChange={setDrawerPinned}
            showPinButton
            closeOnNavigate
            search={{ enabled: true, placeholder: "Buscar..." }}
            brand={{ title: "SeedGrid ERP" }}
            iconRegistry={ICON_REGISTRY}
            onNavigate={(node) => setActiveId(node.id)}
          />
          <CodeBlock code={EXAMPLE_DRAWER_CODE} />
        </Section>

        <Section title="3) Menu Styles" description="Panel, Tiered e MegaMenu horizontal/vertical em modo inline.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">PanelMenu</p>
              <div className="h-[320px] overflow-auto rounded-md border border-border">
                <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">Tiered</p>
              <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
                <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="Tiered" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
              <p className="text-sm font-semibold">MegaMenu Horizontal</p>
              <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuHorizontal" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
              <p className="text-sm font-semibold">MegaMenu Vertical</p>
              <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuVertical" iconRegistry={ICON_REGISTRY} onNavigate={(node) => setActiveId(node.id)} />
            </div>
          </div>
          <CodeBlock code={EXAMPLE_STYLES_CODE} />
        </Section>

        <Section title="4) Playground" description="Teste variant, style, collapsed e open.">
          <SgPlayground
            title="SgMenu Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title="Referencia de Props - SgMenu" rows={MENU_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-node" title="Referencia de Props - SgMenuNode" rows={MENU_NODE_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-selection" title="Referencia de Props - SgMenuSelection" rows={MENU_SELECTION_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-brand" title="Referencia de Props - SgMenuBrand" rows={MENU_BRAND_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-user" title="Referencia de Props - SgMenuUser" rows={MENU_USER_PROPS} />

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
