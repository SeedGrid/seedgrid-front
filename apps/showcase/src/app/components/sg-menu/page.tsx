"use client";

import React from "react";
import { SgButton, SgMenu, SgPlayground, type SgMenuNode } from "@seedgrid/fe-components";
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
  { id: "preferencias", label: "Preferências", onClick: () => {} },
  { id: "logout", label: "Sair", onClick: () => {} }
];

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

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SgMenu
      menu={menu}
      selection={{ activeId }}
      variant="sidebar"
      mode="accordion"
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      showCollapseButton
      search={{ enabled: true, placeholder: "Buscar..." }}
      brand={{ title: "SeedGrid ERP" }}
      user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
      userMenu={userMenu}
      onNavigate={(node) => setActiveId(node.id)}
    />
  );
}`;

const EXAMPLE_DRAWER_CODE = `import React from "react";
import { SgButton, SgMenu } from "@seedgrid/fe-components";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <>
      <SgButton onClick={() => setOpen(true)}>Abrir menu mobile</SgButton>
      <SgMenu
        menu={menu}
        selection={{ activeId }}
        variant="drawer"
        open={open}
        onOpenChange={setOpen}
        pinned={pinned}
        onPinnedChange={setPinned}
        showPinButton
        closeOnNavigate
        onNavigate={(node) => setActiveId(node.id)}
      />
    </>
  );
}`;

const EXAMPLE_STYLES_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <>
      <SgMenu menu={menu} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
      <SgMenu menu={menu} selection={{ activeId }} variant="inline" menuStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
      <SgMenu menu={megaMenu} selection={{ activeId }} variant="inline" menuStyle="MegaMenuHorizontal" onNavigate={(node) => setActiveId(node.id)} />
      <SgMenu menu={megaMenu} selection={{ activeId }} variant="inline" menuStyle="MegaMenuVertical" onNavigate={(node) => setActiveId(node.id)} />
    </>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgMenu } from "@seedgrid/fe-components";

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
          menu={menu}
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
        />
      </div>
    </div>
  );
}`;

const MENU_PROPS: ShowcasePropRow[] = [
  { prop: "menu / selection", type: "SgMenuNode[] / { activeId?, activeUrl? }", defaultValue: "-", description: "Dados de navegação e item ativo." },
  { prop: "brand / user / userMenu / footer", type: "objetos + ReactNode", defaultValue: "-", description: "Áreas opcionais do cabeçalho, usuário e rodapé." },
  { prop: "variant", type: "\"sidebar\" | \"drawer\" | \"inline\" | \"hybrid\"", defaultValue: "sidebar", description: "Modo geral de apresentação." },
  { prop: "menuStyle", type: "\"panel\" | \"tiered\" | \"mega-horizontal\" | \"mega-vertical\" (+ aliases)", defaultValue: "panel", description: "Estilo de navegação interna." },
  { prop: "position / density / indent", type: "\"left|right\" / \"compact|comfortable\" / number", defaultValue: "left / comfortable / 16", description: "Ajustes de layout e espaçamento." },
  { prop: "collapsedWidth / expandedWidth / overlaySize / overlayBackdrop", type: "size props", defaultValue: "72 / 280 / auto / depende do variant", description: "Dimensões de sidebar/drawer." },
  { prop: "mode / expandedIds / defaultExpandedIds / onExpandedIdsChange", type: "estado de expansão", defaultValue: "multiple / []", description: "Controle de submenus." },
  { prop: "collapsed / defaultCollapsed / onCollapsedChange / showCollapseButton", type: "estado colapsado", defaultValue: "false / false / - / false", description: "Controle do colapso do menu." },
  { prop: "open / defaultOpen / onOpenChange / closeOnNavigate", type: "estado drawer", defaultValue: "false / false / - / true", description: "Abertura em modos overlay." },
  { prop: "pinned / defaultPinned / onPinnedChange / showPinButton", type: "estado pin", defaultValue: "false / false / - / false", description: "Fixação no modo híbrido/drawer." },
  { prop: "onNavigate / onAction / onItemClick", type: "callbacks", defaultValue: "-", description: "Eventos de navegação e ação." },
  { prop: "ariaLabel / keyboardNavigation", type: "string / boolean", defaultValue: "Menu / true", description: "Acessibilidade e teclado." },
  { prop: "search", type: "{ enabled: boolean; placeholder?: string }", defaultValue: "{ enabled: false }", description: "Busca integrada com autocomplete." },
  { prop: "elevation / border / className / style", type: "visual props", defaultValue: "none / true / - / -", description: "Customização visual do container." },
  { prop: "iconRegistry", type: "Record<string, ReactNode>", defaultValue: "-", description: "Registro para resolver ícones por chave." },
  { prop: "SgMenuNode.id / label / url / children / disabled / icon / iconKey / badge / onClick", type: "node props", defaultValue: "-", description: "Estrutura de cada item do menu." }
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
          subtitle="Menu hierárquico para sidebar, drawer, inline e híbrido, com busca e múltiplos estilos."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Sidebar Fixa" description="Menu lateral com grupos colapsáveis e botão de colapso.">
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
                search={{ enabled: true, placeholder: "Buscar módulo..." }}
                brand={{ title: "SeedGrid ERP" }}
                user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
                userMenu={USER_MENU}
                onNavigate={(node) => setActiveId(node.id)}
              />
              <div className="flex-1 space-y-3 p-4">
                <h3 className="text-base font-semibold">Conteúdo principal</h3>
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
            onNavigate={(node) => setActiveId(node.id)}
          />
          <CodeBlock code={EXAMPLE_DRAWER_CODE} />
        </Section>

        <Section title="3) Menu Styles" description="Panel, Tiered e MegaMenu horizontal/vertical em modo inline.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">PanelMenu</p>
              <div className="h-[320px] overflow-auto rounded-md border border-border">
                <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">Tiered</p>
              <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
                <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
              <p className="text-sm font-semibold">MegaMenu Horizontal</p>
              <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuHorizontal" onNavigate={(node) => setActiveId(node.id)} />
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3 lg:col-span-2">
              <p className="text-sm font-semibold">MegaMenu Vertical</p>
              <SgMenu menu={MEGA_MENU} selection={{ activeId }} variant="inline" menuStyle="MegaMenuVertical" onNavigate={(node) => setActiveId(node.id)} />
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

        <ShowcasePropsReference rows={MENU_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

