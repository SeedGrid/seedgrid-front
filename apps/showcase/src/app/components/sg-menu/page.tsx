"use client";

import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgPlayground,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption
} from "@seedgrid/fe-components";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, LayoutGrid, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

const MENU: SgMenuNode[] = [
  { id: "dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "customers",
    label: "Customers",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "customers-new",
        label: "New",
        icon: <LayoutGrid className="size-4" />,
        children: [
          { id: "customer-create", label: "Customer", url: "/customers/new/customer" },
          { id: "customer-duplicate", label: "Duplicate", url: "/customers/new/duplicate" }
        ]
      },
      {
        id: "customers-reports",
        label: "Reports",
        icon: <ClipboardList className="size-4" />,
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
    icon: <LayoutGrid className="size-4" />,
    children: [
      {
        id: "orders-sales",
        label: "Sales",
        icon: <Search className="size-4" />,
        children: [
          { id: "orders-open", label: "Open Orders", url: "/orders/sales/open", badge: 4 },
          { id: "orders-closed", label: "Closed Orders", url: "/orders/sales/closed" }
        ]
      },
      { id: "orders-returns", label: "Returns", url: "/orders/returns", badge: 7 }
    ]
  },
  { id: "profile", label: "Profile", url: "/profile", icon: <Settings className="size-4" /> }
];

const MEGA_MENU: SgMenuNode[] = [
  {
    id: "fashion",
    label: "Fashion",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "fashion-woman",
        label: "Woman",
        children: [
          { id: "fashion-woman-1", label: "Woman Casual", url: "/fashion/woman/1" },
          { id: "fashion-woman-2", label: "Woman Formal", url: "/fashion/woman/2" }
        ]
      },
      {
        id: "fashion-men",
        label: "Men",
        children: [
          { id: "fashion-men-1", label: "Men Casual", url: "/fashion/men/1" },
          { id: "fashion-men-2", label: "Men Formal", url: "/fashion/men/2" }
        ]
      }
    ]
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: <Settings className="size-4" />,
    children: [
      {
        id: "electronics-computer",
        label: "Computer",
        children: [
          { id: "electronics-computer-1", label: "Laptop", url: "/electronics/computer/1" },
          { id: "electronics-computer-2", label: "Desktop", url: "/electronics/computer/2" }
        ]
      },
      {
        id: "electronics-tv",
        label: "TV",
        children: [
          { id: "electronics-tv-1", label: "Smart TV", url: "/electronics/tv/1" },
          { id: "electronics-tv-2", label: "Home Theater", url: "/electronics/tv/2" }
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

const DOCKABLE_MENU: SgMenuNode[] = [
  { id: "dk-dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: "Financeiro",
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: "Contas a Pagar",
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: "Em Aberto", url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: "Vencidas", url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: "Contas a Receber",
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: "Em Aberto", url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: "Recebidas", url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: "Relatórios", icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: "Clientes",
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: "Cadastro", url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: "Relatórios",
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "dk-clientes-cohort", label: "Cohort", url: "/clientes/relatorios/cohort" },
          { id: "dk-clientes-churn", label: "Churn", url: "/clientes/relatorios/churn" }
        ]
      }
    ]
  },
  {
    id: "dk-pedidos",
    label: "Pedidos",
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: "Vendas",
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: "Em Aberto", url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: "Encerrados", url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: "Devoluções", url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: "Configurações",
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: "Usuários", url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: "Perfis de Acesso", url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: "Sistema", url: "/configuracoes/sistema" }
    ]
  }
];

const DOCKABLE_USER_MENU: SgMenuNode[] = [
  { id: "dk-meu-perfil", label: "Meu Perfil", onClick: () => {} },
  { id: "dk-preferencias", label: "Preferências", onClick: () => {} },
  { id: "dk-trocar-empresa", label: "Trocar Empresa", onClick: () => {} },
  { id: "dk-logout", label: "Sair", onClick: () => {} }
];

const DOCKABLE_SHELL_STYLE = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--background": "40 33% 97%",
  "--card": "40 33% 97%"
} as React.CSSProperties;

const DOCKABLE_MENU_STYLE_OPTIONS: SgRadioGroupOption[] = [
  { label: "PanelMenu", value: "PanelMenu" },
  { label: "Tiered Menu", value: "Tiered" }
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

const MENU_CODE_SNIPPET = `const MENU = [
  { id: "dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "customers",
    label: "Customers",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "customers-new",
        label: "New",
        icon: <LayoutGrid className="size-4" />,
        children: [
          { id: "customer-create", label: "Customer", url: "/customers/new/customer" },
          { id: "customer-duplicate", label: "Duplicate", url: "/customers/new/duplicate" }
        ]
      },
      {
        id: "customers-reports",
        label: "Reports",
        icon: <ClipboardList className="size-4" />,
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
    icon: <LayoutGrid className="size-4" />,
    children: [
      {
        id: "orders-sales",
        label: "Sales",
        icon: <Search className="size-4" />,
        children: [
          { id: "orders-open", label: "Open Orders", url: "/orders/sales/open", badge: 4 },
          { id: "orders-closed", label: "Closed Orders", url: "/orders/sales/closed" }
        ]
      },
      { id: "orders-returns", label: "Returns", url: "/orders/returns", badge: 7 }
    ]
  },
  { id: "profile", label: "Profile", url: "/profile", icon: <Settings className="size-4" /> }
];`;

const MEGA_MENU_CODE_SNIPPET = `const MEGA_MENU = [
  {
    id: "fashion",
    label: "Fashion",
    icon: <Users className="size-4" />,
    children: [
      {
        id: "fashion-woman",
        label: "Woman",
        children: [
          { id: "fashion-woman-1", label: "Woman Casual", url: "/fashion/woman/1" },
          { id: "fashion-woman-2", label: "Woman Formal", url: "/fashion/woman/2" }
        ]
      },
      {
        id: "fashion-men",
        label: "Men",
        children: [
          { id: "fashion-men-1", label: "Men Casual", url: "/fashion/men/1" },
          { id: "fashion-men-2", label: "Men Formal", url: "/fashion/men/2" }
        ]
      }
    ]
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: <Settings className="size-4" />,
    children: [
      {
        id: "electronics-computer",
        label: "Computer",
        children: [
          { id: "electronics-computer-1", label: "Laptop", url: "/electronics/computer/1" },
          { id: "electronics-computer-2", label: "Desktop", url: "/electronics/computer/2" }
        ]
      },
      {
        id: "electronics-tv",
        label: "TV",
        children: [
          { id: "electronics-tv-1", label: "Smart TV", url: "/electronics/tv/1" },
          { id: "electronics-tv-2", label: "Home Theater", url: "/electronics/tv/2" }
        ]
      }
    ]
  }
];`;

const USER_MENU_CODE_SNIPPET = `const USER_MENU = [
  { id: "perfil", label: "Meu perfil", onClick: () => {} },
  { id: "preferencias", label: "Preferencias", onClick: () => {} },
  { id: "logout", label: "Sair", onClick: () => {} }
];`;

const EXAMPLE_SIDEBAR_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

${USER_MENU_CODE_SNIPPET}

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

${MENU_CODE_SNIPPET}

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
        onNavigate={(node) => setActiveId(node.id)}
      />
    </>
  );
}`;

const EXAMPLE_PANEL_MENU_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-auto rounded-md border border-border">
        <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_TIERED_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
        <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_MEGA_HORIZONTAL_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        variant="inline"
        menuStyle="MegaMenuHorizontal"
      />
    </div>
  );
}`;

const EXAMPLE_MEGA_VERTICAL_CODE = `import React from "react";
import { SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        variant="inline"
        menuStyle="MegaMenuVertical"
      />
    </div>
  );
}`;

const EXAMPLE_DOCKABLE_CODE = `import React from "react";
import { SgDockLayout, SgDockZone, SgMenu, SgRadioGroup, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";

const DOCKABLE_MENU = [
  { id: "dk-dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: "Financeiro",
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: "Contas a Pagar",
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: "Em Aberto", url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: "Vencidas", url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: "Contas a Receber",
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: "Em Aberto", url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: "Recebidas", url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: "Relatórios", icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: "Clientes",
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: "Cadastro", url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: "Relatórios",
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "dk-clientes-cohort", label: "Cohort", url: "/clientes/relatorios/cohort" },
          { id: "dk-clientes-churn", label: "Churn", url: "/clientes/relatorios/churn" }
        ]
      }
    ]
  },
  {
    id: "dk-pedidos",
    label: "Pedidos",
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: "Vendas",
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: "Em Aberto", url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: "Encerrados", url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: "Devoluções", url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: "Configurações",
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: "Usuários", url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: "Perfis de Acesso", url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: "Sistema", url: "/configuracoes/sistema" }
    ]
  }
];

const DOCKABLE_USER_MENU = [
  { id: "dk-meu-perfil", label: "Meu Perfil", onClick: () => {} },
  { id: "dk-preferencias", label: "Preferências", onClick: () => {} },
  { id: "dk-trocar-empresa", label: "Trocar Empresa", onClick: () => {} },
  { id: "dk-logout", label: "Sair", onClick: () => {} }
];

const DOCKABLE_MENU_STYLE_OPTIONS = [
  { label: "PanelMenu", value: "PanelMenu" },
  { label: "Tiered Menu", value: "Tiered" }
];

const SHELL_STYLE = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--background": "40 33% 97%",
  "--card": "40 33% 97%"
};

export default function Example() {
  const [activeId, setActiveId] = React.useState("dk-dashboard");
  const [dockMenuStyle, setDockMenuStyle] = React.useState<"PanelMenu" | "Tiered">("PanelMenu");

  return (
    <div className="space-y-3">
      <SgRadioGroup
        title="Menu Style"
        source={DOCKABLE_MENU_STYLE_OPTIONS}
        value={dockMenuStyle}
        orientation="horizontal"
        onChange={(value) => {
          if (value === "PanelMenu" || value === "Tiered") setDockMenuStyle(value);
        }}
      />

      <div
        className="relative h-[520px] overflow-hidden rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
        style={SHELL_STYLE}
      >
        <SgDockLayout
          id="showcase-menu-dock-v2"
          className="grid h-full grid-cols-[17.5rem_1fr_17.5rem] grid-rows-[3.5rem_1fr_4rem]"
        >
          <SgDockZone zone="top" className="col-span-3 row-start-1 items-center border-b border-[#e2cebc] bg-[#f7f3ee]" />
          <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-[#e2cebc]" />
          <SgDockZone zone="right" className="col-start-3 row-start-2 border-l border-[#e2cebc]" />
          <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-[#e2cebc]" />
          <SgDockZone zone="free" className="col-start-2 row-start-2 items-center justify-center">
            <div className="pointer-events-none text-sm text-[#7e5f46]">Área central livre</div>
          </SgDockZone>

          <SgMenu
            id="menu-dock-sidebar-v2"
            menu={DOCKABLE_MENU}
            selection={{ activeId }}
            variant="sidebar"
            menuStyle={dockMenuStyle}
            mode="accordion"
            dockable
            dockZone="left"
            draggable
            showCollapseButton
            search={{ enabled: true, placeholder: "Buscar módulo..." }}
            brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
            user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
            userMenu={DOCKABLE_USER_MENU}
            userSectionStyle={{ backgroundColor: "#ebe0d4" }}
            onNavigate={(node) => setActiveId(node.id)}
          />

          <SgToolBar
            id="toolbar-dock-v1"
            dockZone="top"
            orientationDirection="horizontal-left"
            title="Ferramentas"
            draggable
            collapsible={false}
          >
            <SgToolbarIconButton icon={<Plus className="size-4" />} hint="Novo registro" severity="primary" />
            <SgToolbarIconButton icon={<Save className="size-4" />} hint="Salvar" />
            <SgToolbarIconButton icon={<Printer className="size-4" />} hint="Imprimir" />
            <SgToolbarIconButton icon={<Download className="size-4" />} hint="Exportar" />
            <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint="Excluir" severity="danger" />
          </SgToolBar>
        </SgDockLayout>
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgMenu } from "@seedgrid/fe-components";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

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
        />
      </div>
    </div>
  );
}`;

const MENU_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador estavel do menu (recomendado para dockable com persistencia)." },
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
  { prop: "dockable", type: "boolean", defaultValue: "false", description: "Quando true e dentro de SgDockLayout, o menu pode ser dockado em zonas." },
  { prop: "dockZone", type: "\"top\" | \"bottom\" | \"left\" | \"right\" | \"free\"", defaultValue: "left", description: "Zona inicial no modo dockable (quando nao informado, pode ser inferida por orientationDirection)." },
  { prop: "draggable", type: "boolean", defaultValue: "false", description: "No modo dockable, exibe handle para arrastar entre dock zones." },
  { prop: "orientationDirection", type: "\"horizontal-left\" | \"horizontal-right\" | \"vertical-up\" | \"vertical-top\" | \"vertical-down\"", defaultValue: "-", description: "Direcao opcional usada como fallback para inferir a dockZone inicial." },
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
  { prop: "userSectionClassName", type: "string", defaultValue: "-", description: "Classes CSS adicionais na secao do usuario (area de footer do menu)." },
  { prop: "userSectionStyle", type: "CSSProperties", defaultValue: "-", description: "Estilos inline na secao do usuario, util para customizar cor de fundo." },
  { prop: "footer", type: "ReactNode", defaultValue: "-", description: "Conteudo de rodape do menu." }
];

const MENU_NODE_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador unico do item." },
  { prop: "label", type: "string", defaultValue: "-", description: "Texto exibido no item." },
  { prop: "url", type: "string", defaultValue: "-", description: "Rota de navegacao do item." },
  { prop: "children", type: "SgMenuNode[]", defaultValue: "-", description: "Subitens do no atual." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita interacao do item." },
  { prop: "icon", type: "ReactNode", defaultValue: "-", description: "Icone direto do item." },
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
  const [dockActiveId, setDockActiveId] = React.useState("dashboard");
  const [dockMenuStyle, setDockMenuStyle] = React.useState<"PanelMenu" | "Tiered">("PanelMenu");
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
            onNavigate={(node) => setActiveId(node.id)}
          />
          <CodeBlock code={EXAMPLE_DRAWER_CODE} />
        </Section>

        <Section title="3) PanelMenu" description="Exemplo isolado para visualizar apenas o estilo panel.">
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-auto rounded-md border border-border">
              <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
            </div>
          </div>
          <CodeBlock code={EXAMPLE_PANEL_MENU_CODE} />
        </Section>

        <Section title="4) Tiered" description="Exemplo isolado para visualizar apenas o estilo tiered.">
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
              <SgMenu menu={MENU} selection={{ activeId }} variant="inline" menuStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
            </div>
          </div>
          <CodeBlock code={EXAMPLE_TIERED_CODE} />
        </Section>

        <Section title="5) MegaMenu Horizontal" description="Exemplo isolado para visualizar apenas o mega menu horizontal.">
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={MEGA_MENU}
              selection={{ activeId: "fashion" }}
              variant="inline"
              menuStyle="MegaMenuHorizontal"
            />
          </div>
          <CodeBlock code={EXAMPLE_MEGA_HORIZONTAL_CODE} />
        </Section>

        <Section title="6) MegaMenu Vertical" description="Exemplo isolado para visualizar apenas o mega menu vertical.">
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={MEGA_MENU}
              selection={{ activeId: "fashion" }}
              variant="inline"
              menuStyle="MegaMenuVertical"
            />
          </div>
          <CodeBlock code={EXAMPLE_MEGA_VERTICAL_CODE} />
        </Section>

        <Section title="7) Sidebar Dockable" description="SgMenu dockable com menu completo, brand, userMenu, SgToolBar integrada e identidade visual do showcase.">
          <div className="space-y-3">
            <SgRadioGroup
              title="Menu Style"
              source={DOCKABLE_MENU_STYLE_OPTIONS}
              value={dockMenuStyle}
              orientation="horizontal"
              onChange={(value) => {
                if (value === "PanelMenu" || value === "Tiered") setDockMenuStyle(value);
              }}
            />

            <div
              className="relative h-[520px] overflow-hidden rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
              style={DOCKABLE_SHELL_STYLE}
            >
              <SgDockLayout
                id="showcase-menu-dock-v2"
                className="grid h-full grid-cols-[17.5rem_1fr_17.5rem] grid-rows-[3.5rem_1fr_4rem]"
              >
                <SgDockZone zone="top" className="col-span-3 row-start-1 items-center border-b border-[#e2cebc] bg-[#f7f3ee]" />
                <SgDockZone zone="left" className="col-start-1 row-start-2 items-start border-r border-[#e2cebc]" />
                <SgDockZone zone="right" className="col-start-3 row-start-2 border-l border-[#e2cebc]" />
                <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end border-t border-[#e2cebc]" />
                <SgDockZone zone="free" className="col-start-2 row-start-2 items-center justify-center">
                  <div className="pointer-events-none text-sm text-[#7e5f46]">Área central livre</div>
                </SgDockZone>

                <SgMenu
                  id="menu-dock-sidebar-v2"
                  menu={DOCKABLE_MENU}
                  selection={{ activeId: dockActiveId }}
                  variant="sidebar"
                  menuStyle={dockMenuStyle}
                  mode="accordion"
                  dockable
                  dockZone="left"
                  draggable
                  showCollapseButton
                  search={{ enabled: true, placeholder: "Buscar módulo..." }}
                  brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
                  user={{ name: "Lucia Souza", subtitle: "Financeiro" }}
                  userMenu={DOCKABLE_USER_MENU}
                  userSectionStyle={{ backgroundColor: "#ebe0d4" }}
                  onNavigate={(node) => setDockActiveId(node.id)}
                />

                <SgToolBar
                  id="toolbar-dock-v1"
                  dockZone="top"
                  orientationDirection="horizontal-left"
                  title="Ferramentas"
                  draggable
                  collapsible={false}
                >
                  <SgToolbarIconButton icon={<Plus className="size-4" />} hint="Novo registro" severity="primary" />
                  <SgToolbarIconButton icon={<Save className="size-4" />} hint="Salvar" />
                  <SgToolbarIconButton icon={<Printer className="size-4" />} hint="Imprimir" />
                  <SgToolbarIconButton icon={<Download className="size-4" />} hint="Exportar" />
                  <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint="Excluir" severity="danger" />
                </SgToolBar>
              </SgDockLayout>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_DOCKABLE_CODE} />
        </Section>

        <Section title="8) Playground" description="Teste variant, style, collapsed e open.">
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
