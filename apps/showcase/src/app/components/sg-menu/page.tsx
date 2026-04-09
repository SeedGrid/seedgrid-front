"use client";

import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  toast,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, LayoutGrid, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

const TIERED_MENU: SgMenuNode[] = [
  { id: "dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" />, onClick: () => toast.message("Dashboard") },
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
          { id: "customer-create", label: "Customer", url: "/customers/new/customer", onClick: () => toast.message("Customer") },
          { id: "customer-duplicate", label: "Duplicate", url: "/customers/new/duplicate", onClick: () => toast.message("Duplicate") }
        ]
      },
      {
        id: "customers-reports",
        label: "Reports",
        icon: <ClipboardList className="size-4" />,
        children: [
          { id: "customers-cohort", label: "Cohort", url: "/customers/reports/cohort", onClick: () => toast.message("Cohort") },
          { id: "customers-churn", label: "Churn", url: "/customers/reports/churn", onClick: () => toast.message("Churn") }
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
          { id: "orders-open", label: "Open Orders", url: "/orders/sales/open", badge: 4, onClick: () => toast.message("Open Orders") },
          { id: "orders-closed", label: "Closed Orders", url: "/orders/sales/closed", onClick: () => toast.message("Closed Orders") }
        ]
      },
      { id: "orders-returns", label: "Returns", url: "/orders/returns", badge: 7, onClick: () => toast.message("Returns") }
    ]
  },
  { id: "profile", label: "Profile", url: "/profile", icon: <Settings className="size-4" />, onClick: () => toast.message("Profile") }
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
  { id: "perfil", label: "My profile", onClick: () => {} },
  { id: "preferencias", label: "Preferences", onClick: () => {} },
  { id: "logout", label: "Sign out", onClick: () => {} }
];

const DOCKABLE_MENU: SgMenuNode[] = [
  { id: "dk-dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: "Finance",
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: "Accounts Payable",
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: "Open", url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: "Overdue", url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: "Accounts Receivable",
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: "Open", url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: "Received", url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: "Reports", icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: "Customers",
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: "Register", url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: "Reports",
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
    label: "Orders",
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: "Sales",
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: "Open", url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: "Closed", url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: "Returns", url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: "Settings",
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: "Users", url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: "Access Profiles", url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: "System", url: "/configuracoes/sistema" }
    ]
  }
];

const DOCKABLE_USER_MENU: SgMenuNode[] = [
  { id: "dk-meu-perfil", label: "My Profile", onClick: () => {} },
  { id: "dk-preferencias", label: "Preferences", onClick: () => {} },
  { id: "dk-trocar-empresa", label: "Switch Company", onClick: () => {} },
  { id: "dk-logout", label: "Sign out", onClick: () => {} }
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
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
  { id: "perfil", label: "My profile", onClick: () => {} },
  { id: "preferencias", label: "Preferences", onClick: () => {} },
  { id: "logout", label: "Sign out", onClick: () => {} }
];`;

const EXAMPLE_SIDEBAR_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
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
          menuStyle="sidebar"
          mode="accordion"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseButton
          search={{ enabled: true, placeholder: "Search module..." }}
          brand={{ title: "SeedGrid ERP" }}
          user={{ name: "Lucia Souza", subtitle: "Finance" }}
          userMenu={USER_MENU}
          onNavigate={(node) => setActiveId(node.id)}
        />
        <div className="flex-1 space-y-3 p-4">
          <h3 className="text-base font-semibold">Main content</h3>
          <p className="text-sm text-muted-foreground">
            Active item: <span className="font-medium text-foreground">{activeId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const EXAMPLE_DRAWER_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton onClick={() => setDrawerOpen(true)}>Open mobile menu</SgButton>
        <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
          \${drawerPinned ? "Unpin drawer" : "Pin drawer"}
        </SgButton>
      </div>

      <SgMenu
        menu={MENU}
        selection={{ activeId }}
        menuStyle="drawer"
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        pinned={drawerPinned}
        onPinnedChange={setDrawerPinned}
        showPinButton
        closeOnNavigate
        search={{ enabled: true, placeholder: "Search..." }}
        brand={{ title: "SeedGrid ERP" }}
        onNavigate={(node) => setActiveId(node.id)}
      />
    </>
  );
}`;

const EXAMPLE_PANEL_MENU_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-auto rounded-md border border-border">
        <SgMenu menu={MENU} selection={{ activeId }} menuStyle="inline" menuVariantStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_TIERED_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MENU_CODE_SNIPPET}

export default function Example() {
  const [activeId, setActiveId] = React.useState("dashboard");

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
        <SgMenu menu={MENU} selection={{ activeId }} menuStyle="inline" menuVariantStyle="Tiered" onNavigate={(node) => setActiveId(node.id)} />
      </div>
    </div>
  );
}`;

const EXAMPLE_MEGA_HORIZONTAL_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        menuStyle="inline"
        menuVariantStyle="MegaMenuHorizontal"
      />
    </div>
  );
}`;

const EXAMPLE_MEGA_VERTICAL_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { ClipboardList, Home, LayoutGrid, Search, Settings, Users } from "lucide-react";

${MEGA_MENU_CODE_SNIPPET}

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-3">
      <SgMenu
        menu={MEGA_MENU}
        selection={{ activeId: "fashion" }}
        menuStyle="inline"
        menuVariantStyle="MegaMenuVertical"
      />
    </div>
  );
}`;

const EXAMPLE_DOCKABLE_CODE = `import React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { BarChart2, ClipboardList, CreditCard, DollarSign, Download, Home, Plus, Printer, Save, Search, Settings, ShoppingCart, Trash2, Users, Wallet } from "lucide-react";

const DOCKABLE_MENU = [
  { id: "dk-dashboard", label: "Dashboard", url: "/dashboard", icon: <Home className="size-4" /> },
  {
    id: "dk-financeiro",
    label: "Finance",
    icon: <DollarSign className="size-4" />,
    children: [
      {
        id: "dk-contas-pagar",
        label: "Accounts Payable",
        icon: <CreditCard className="size-4" />,
        children: [
          { id: "dk-pagar-aberto", label: "Open", url: "/financeiro/pagar/aberto", badge: 12 },
          { id: "dk-pagar-vencidas", label: "Overdue", url: "/financeiro/pagar/vencidas", badge: 3 }
        ]
      },
      {
        id: "dk-contas-receber",
        label: "Accounts Receivable",
        icon: <Wallet className="size-4" />,
        children: [
          { id: "dk-receber-aberto", label: "Open", url: "/financeiro/receber/aberto", badge: 8 },
          { id: "dk-receber-recebidas", label: "Received", url: "/financeiro/receber/recebidas" }
        ]
      },
      { id: "dk-financeiro-rel", label: "Reports", icon: <BarChart2 className="size-4" />, url: "/financeiro/relatorios" }
    ]
  },
  {
    id: "dk-clientes",
    label: "Customers",
    icon: <Users className="size-4" />,
    children: [
      { id: "dk-clientes-cadastro", label: "Register", url: "/clientes/cadastro" },
      {
        id: "dk-clientes-relatorios",
        label: "Reports",
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
    label: "Orders",
    icon: <ShoppingCart className="size-4" />,
    children: [
      {
        id: "dk-pedidos-vendas",
        label: "Sales",
        icon: <Search className="size-4" />,
        children: [
          { id: "dk-pedidos-abertos", label: "Open", url: "/pedidos/vendas/aberto", badge: 4 },
          { id: "dk-pedidos-fechados", label: "Closed", url: "/pedidos/vendas/encerrados" }
        ]
      },
      { id: "dk-pedidos-devolucoes", label: "Returns", url: "/pedidos/devolucoes", badge: 7 }
    ]
  },
  {
    id: "dk-configuracoes",
    label: "Settings",
    icon: <Settings className="size-4" />,
    children: [
      { id: "dk-config-usuarios", label: "Users", url: "/configuracoes/usuarios" },
      { id: "dk-config-perfis", label: "Access Profiles", url: "/configuracoes/perfis" },
      { id: "dk-config-sistema", label: "System", url: "/configuracoes/sistema" }
    ]
  }
];

const DOCKABLE_USER_MENU = [
  { id: "dk-meu-perfil", label: "My Profile", onClick: () => {} },
  { id: "dk-preferencias", label: "Preferences", onClick: () => {} },
  { id: "dk-trocar-empresa", label: "Switch Company", onClick: () => {} },
  { id: "dk-logout", label: "Sign out", onClick: () => {} }
];

const DOCKABLE_MENU_STYLE_OPTIONS = [
  { label: "PanelMenu", value: "PanelMenu" },
  { label: "Tiered Menu", value: "Tiered" }
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
};

export default function Example() {
  const [dockActiveId, setDockActiveId] = React.useState("dk-dashboard");
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
        className="relative min-h-[520px] overflow-visible rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
        style={DOCKABLE_SHELL_STYLE}
      >
        <SgDockLayout
          id="showcase-menu-dock-v2"
          className="grid min-h-[520px] grid-cols-[auto_1fr_auto] grid-rows-[3.5rem_1fr_auto]"
        >
          <SgDockZone zone="top" />
          <SgDockZone zone="left" />
          <SgDockZone zone="right" />
          <SgDockZone zone="bottom" />
          <SgDockZone zone="free">
            <div className="pointer-events-none text-sm text-[#7e5f46]">Free center area</div>
          </SgDockZone>

          <SgMenu
            id="menu-dock-sidebar-v2"
            menu={DOCKABLE_MENU}
            selection={{ activeId: dockActiveId }}
            menuStyle="sidebar"
            menuVariantStyle={dockMenuStyle}
            mode="accordion"
            dockable
            dockZone="left"
            draggable
            showCollapseButton
            search={{ enabled: true, placeholder: "Search module..." }}
            brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
            user={{ name: "Lucia Souza", subtitle: "Finance" }}
            userMenu={DOCKABLE_USER_MENU}
            userSectionStyle={{ backgroundColor: "#ebe0d4" }}
            onNavigate={(node) => setDockActiveId(node.id)}
          />

          <SgToolBar
            id="toolbar-dock-v1"
            dockZone="top"
            orientationDirection="horizontal-left"
            title="Tools"
            draggable
            collapsible={false}
          >
            <SgToolbarIconButton icon={<Plus className="size-4" />} hint="New record" severity="primary" />
            <SgToolbarIconButton icon={<Save className="size-4" />} hint="Salvar" />
            <SgToolbarIconButton icon={<Printer className="size-4" />} hint="Print" />
            <SgToolbarIconButton icon={<Download className="size-4" />} hint="Export" />
            <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint="Excluir" severity="danger" />
          </SgToolBar>
        </SgDockLayout>
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgDockLayout,
  SgDockZone,
  SgMenu,
  SgRadioGroup,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode,
  type SgRadioGroupOption,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import {
  ClipboardList,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Users,
} from "lucide-react";

${MENU_CODE_SNIPPET}

export default function App() {
  const [activeId, setActiveId] = React.useState("dashboard");
  const [menuStyle, setMenuStyle] = React.useState<"sidebar" | "drawer" | "inline" | "hybrid">("sidebar");
  const [menuVariantStyle, setMenuVariantStyle] = React.useState<"panel" | "tiered" | "mega-horizontal" | "mega-vertical">("panel");
  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("sidebar")}>sidebar</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("drawer")}>drawer</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("inline")}>inline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuStyle("hybrid")}>hybrid</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("panel")}>panel</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("tiered")}>tiered</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("mega-horizontal")}>mega-h</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMenuVariantStyle("mega-vertical")}>mega-v</SgButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setCollapsed((v) => !v)}>toggle collapsed</SgButton>
        <SgButton size="sm" onClick={() => setOpen((v) => !v)}>toggle open</SgButton>
      </div>

      <div className="h-[420px] overflow-hidden rounded-lg border border-border">
        <SgMenu
          menu={MENU}
          selection={{ activeId }}
          menuStyle={menuStyle}
          menuVariantStyle={menuVariantStyle}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          open={open}
          onOpenChange={setOpen}
          showCollapseButton
          onNavigate={(node) => setActiveId(node.id)}
          search={{ enabled: true, placeholder: "Search..." }}
        />
      </div>
    </div>
  );
}`;

const MENU_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Stable menu identifier (recommended for dockable persistence)." },
  { prop: "menu", type: "SgMenuNode[]", defaultValue: "-", description: "Navigation tree rendered by the menu." },
  { prop: "selection", type: "SgMenuSelection", defaultValue: "-", description: "Active item by id or URL." },
  { prop: "brand", type: "SgMenuBrand", defaultValue: "-", description: "Brand block at the top." },
  { prop: "user", type: "SgMenuUser", defaultValue: "-", description: "User block at the top/footer of the menu." },
  { prop: "userMenu", type: "SgMenuNode[]", defaultValue: "-", description: "Actions shown in the user menu." },
  { prop: "menuStyle", type: "\"sidebar\" | \"drawer\" | \"inline\" | \"hybrid\"", defaultValue: "sidebar", description: "General presentation mode." },
  { prop: "menuVariantStyle", type: "SgMenuStyle", defaultValue: "panel", description: "Internal style: panel, tiered, mega-horizontal, or mega-vertical." },
  { prop: "position", type: "\"left\" | \"right\"", defaultValue: "left", description: "Horizontal menu position." },
  { prop: "density", type: "\"compact\" | \"comfortable\"", defaultValue: "comfortable", description: "Visual density of rows and icons." },
  { prop: "indent", type: "number", defaultValue: "16", description: "Indent per depth level." },
  { prop: "collapsedWidth", type: "number | string", defaultValue: "72", description: "Width when collapsed." },
  { prop: "expandedWidth", type: "number | string", defaultValue: "280", description: "Width when expanded." },
  { prop: "overlaySize", type: "SgExpandablePanelSize", defaultValue: "-", description: "Overlay size in drawer/hybrid modes." },
  { prop: "overlayBackdrop", type: "boolean", defaultValue: "-", description: "Controls overlay backdrop." },
  { prop: "dockable", type: "boolean", defaultValue: "false", description: "When true and inside SgDockLayout, the menu can be docked in zones." },
  { prop: "dockZone", type: "\"top\" | \"bottom\" | \"left\" | \"right\" | \"free\"", defaultValue: "left", description: "Initial zone in dockable mode (if omitted, can be inferred from orientationDirection)." },
  { prop: "draggable", type: "boolean", defaultValue: "false", description: "In dockable mode, shows drag handle between dock zones." },
  { prop: "orientationDirection", type: "\"horizontal-left\" | \"horizontal-right\" | \"vertical-up\" | \"vertical-top\" | \"vertical-down\"", defaultValue: "-", description: "Optional direction used as fallback to infer initial dockZone." },
  { prop: "mode", type: "\"accordion\" | \"multiple\"", defaultValue: "multiple", description: "Group expansion strategy." },
  { prop: "expandedIds", type: "string[]", defaultValue: "-", description: "External control of expanded groups." },
  { prop: "defaultExpandedIds", type: "string[]", defaultValue: "[]", description: "Initial state of expanded groups." },
  { prop: "onExpandedIdsChange", type: "(ids: string[]) => void", defaultValue: "-", description: "Callback when expanded groups change." },
  { prop: "collapsed", type: "boolean", defaultValue: "-", description: "External control of collapsed state." },
  { prop: "defaultCollapsed", type: "boolean", defaultValue: "false", description: "Initial collapsed state." },
  { prop: "onCollapsedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when collapsing/expanding." },
  { prop: "showCollapseButton", type: "boolean", defaultValue: "false", description: "Shows collapse button in the header." },
  { prop: "open", type: "boolean", defaultValue: "-", description: "External control of drawer/overlay open state." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state in drawer/overlay." },
  { prop: "onOpenChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when opening/closing overlay." },
  { prop: "closeOnNavigate", type: "boolean", defaultValue: "-", description: "Closes drawer after navigation." },
  { prop: "pinned", type: "boolean", defaultValue: "-", description: "External control of pinned state." },
  { prop: "defaultPinned", type: "boolean", defaultValue: "false", description: "Initial pinned state." },
  { prop: "onPinnedChange", type: "(value: boolean) => void", defaultValue: "-", description: "Callback when pinning/unpinning." },
  { prop: "showPinButton", type: "boolean", defaultValue: "false", description: "Shows pin button in the header." },
  { prop: "onNavigate", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired for navigation items (URL)." },
  { prop: "onAction", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired for action items." },
  { prop: "onItemClick", type: "(node: SgMenuNode) => void", defaultValue: "-", description: "Fired on any item click." },
  { prop: "ariaLabel", type: "string", defaultValue: "\"Menu\"", description: "Accessibility label for nav." },
  { prop: "keyboardNavigation", type: "boolean", defaultValue: "true", description: "Enables keyboard navigation." },
  { prop: "openSubmenuOnHover", type: "boolean", defaultValue: "false", description: "In tiered style, opens submenu on hover when true; default opens on click." },
  { prop: "search", type: "{ enabled: boolean; placeholder?: string }", defaultValue: "{ enabled: false }", description: "Integrated search configuration." },
  { prop: "elevation", type: "\"none\" | \"sm\" | \"md\"", defaultValue: "none", description: "Container elevation/shadow." },
  { prop: "border", type: "boolean", defaultValue: "true", description: "Shows external menu border." },
  { prop: "className", type: "string", defaultValue: "-", description: "Additional CSS classes on root." },
  { prop: "style", type: "CSSProperties", defaultValue: "-", description: "Inline styles on root." },
  { prop: "userSectionClassName", type: "string", defaultValue: "-", description: "Additional CSS classes in the user section (menu footer area)." },
  { prop: "userSectionStyle", type: "CSSProperties", defaultValue: "-", description: "Inline styles in the user section, useful to customize background color." },
  { prop: "footer", type: "ReactNode", defaultValue: "-", description: "Menu footer content." }
];

const MENU_NODE_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Unique item identifier." },
  { prop: "label", type: "string", defaultValue: "-", description: "Text displayed on the item." },
  { prop: "url", type: "string", defaultValue: "-", description: "Navigation route for the item." },
  { prop: "children", type: "SgMenuNode[]", defaultValue: "-", description: "Child items of the current node." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables item interaction." },
  { prop: "icon", type: "ReactNode", defaultValue: "-", description: "Direct item icon." },
  { prop: "badge", type: "string | number", defaultValue: "-", description: "Auxiliary badge next to the label." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Local item action." }
];

const MENU_SELECTION_PROPS: ShowcasePropRow[] = [
  { prop: "activeId", type: "string", defaultValue: "-", description: "Active item id." },
  { prop: "activeUrl", type: "string", defaultValue: "-", description: "Active URL for route-based selection." }
];

const MENU_BRAND_PROPS: ShowcasePropRow[] = [
  { prop: "title", type: "string", defaultValue: "-", description: "Title displayed in the brand block." },
  { prop: "imageSrc", type: "string", defaultValue: "-", description: "Brand image URL." },
  { prop: "image", type: "ReactNode", defaultValue: "-", description: "Custom image element." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Action when clicking the brand." }
];

const MENU_USER_PROPS: ShowcasePropRow[] = [
  { prop: "name", type: "string", defaultValue: "-", description: "Name displayed in the user block." },
  { prop: "subtitle", type: "string", defaultValue: "-", description: "User helper text." },
  { prop: "avatarSrc", type: "string", defaultValue: "-", description: "User avatar URL." },
  { prop: "avatar", type: "ReactNode", defaultValue: "-", description: "Custom avatar." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Action when clicking the user block." }
];

type MenuShowcaseTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  section6Title: string;
  section6Description: string;
  section7Title: string;
  section7Description: string;
  section8Title: string;
  section8Description: string;
  sidebarSearchPlaceholder: string;
  sidebarUserSubtitle: string;
  mainContentTitle: string;
  activeItemLabel: string;
  drawerOpenButton: string;
  drawerPinButton: string;
  drawerUnpinButton: string;
  drawerSearchPlaceholder: string;
  dockMenuStyleTitle: string;
  dockFreeAreaLabel: string;
  dockSearchPlaceholder: string;
  dockUserSubtitle: string;
  toolbarTitle: string;
  toolbarHintNew: string;
  toolbarHintSave: string;
  toolbarHintPrint: string;
  toolbarHintExport: string;
  toolbarHintDelete: string;
  playgroundTitle: string;
  propsMenuTitle: string;
  propsNodeTitle: string;
  propsSelectionTitle: string;
  propsBrandTitle: string;
  propsUserTitle: string;
};

const MENU_SHOWCASE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", MenuShowcaseTexts> = {
  "pt-BR": {
    headerSubtitle: "Menu hierarquico para sidebar, drawer, inline e hibrido, com busca e multiplos estilos.",
    section1Title: "1) Sidebar Fixa",
    section1Description: "Menu lateral com grupos colapsaveis e botao de colapso.",
    section2Title: "2) Drawer Mobile",
    section2Description: "Abre em overlay e pode ser fixado por pin.",
    section3Title: "3) PanelMenu",
    section3Description: "Isolated example to preview only the panel style.",
    section4Title: "4) Tiered",
    section4Description: "Isolated example to preview only the tiered style.",
    section5Title: "5) MegaMenu Horizontal",
    section5Description: "Isolated example to preview only the horizontal mega menu.",
    section6Title: "6) MegaMenu Vertical",
    section6Description: "Isolated example to preview only the vertical mega menu.",
    section7Title: "7) Sidebar Dockable",
    section7Description:
      "SgMenu dockable com menu completo, brand, userMenu, SgToolBar integrada e identidade visual do showcase.",
    section8Title: "8) Playground",
    section8Description: "Teste menuStyle, menuVariantStyle, collapsed e open.",
    sidebarSearchPlaceholder: "Search module...",
    sidebarUserSubtitle: "Finance",
    mainContentTitle: "Main content",
    activeItemLabel: "Active item",
    drawerOpenButton: "Open mobile menu",
    drawerPinButton: "Pin drawer",
    drawerUnpinButton: "Unpin drawer",
    drawerSearchPlaceholder: "Search...",
    dockMenuStyleTitle: "Menu Style",
    dockFreeAreaLabel: "Area central livre",
    dockSearchPlaceholder: "Search module...",
    dockUserSubtitle: "Finance",
    toolbarTitle: "Tools",
    toolbarHintNew: "New record",
    toolbarHintSave: "Save",
    toolbarHintPrint: "Print",
    toolbarHintExport: "Export",
    toolbarHintDelete: "Delete",
    playgroundTitle: "SgMenu Playground",
    propsMenuTitle: "Referencia de Props - SgMenu",
    propsNodeTitle: "Referencia de Props - SgMenuNode",
    propsSelectionTitle: "Referencia de Props - SgMenuSelection",
    propsBrandTitle: "Referencia de Props - SgMenuBrand",
    propsUserTitle: "Referencia de Props - SgMenuUser"
  },
  "pt-PT": {
    headerSubtitle: "Menu hierarquico para sidebar, drawer, inline e hibrido, com busca e multiplos estilos.",
    section1Title: "1) Sidebar Fixa",
    section1Description: "Menu lateral com grupos colapsaveis e botao de colapso.",
    section2Title: "2) Drawer Mobile",
    section2Description: "Abre em overlay e pode ser fixado por pin.",
    section3Title: "3) PanelMenu",
    section3Description: "Isolated example to preview only the panel style.",
    section4Title: "4) Tiered",
    section4Description: "Isolated example to preview only the tiered style.",
    section5Title: "5) MegaMenu Horizontal",
    section5Description: "Isolated example to preview only the horizontal mega menu.",
    section6Title: "6) MegaMenu Vertical",
    section6Description: "Isolated example to preview only the vertical mega menu.",
    section7Title: "7) Sidebar Dockable",
    section7Description:
      "SgMenu dockable com menu completo, brand, userMenu, SgToolBar integrada e identidade visual do showcase.",
    section8Title: "8) Playground",
    section8Description: "Teste menuStyle, menuVariantStyle, collapsed e open.",
    sidebarSearchPlaceholder: "Search module...",
    sidebarUserSubtitle: "Finance",
    mainContentTitle: "Main content",
    activeItemLabel: "Active item",
    drawerOpenButton: "Open mobile menu",
    drawerPinButton: "Pin drawer",
    drawerUnpinButton: "Unpin drawer",
    drawerSearchPlaceholder: "Search...",
    dockMenuStyleTitle: "Menu Style",
    dockFreeAreaLabel: "Area central livre",
    dockSearchPlaceholder: "Search module...",
    dockUserSubtitle: "Finance",
    toolbarTitle: "Tools",
    toolbarHintNew: "New record",
    toolbarHintSave: "Save",
    toolbarHintPrint: "Print",
    toolbarHintExport: "Export",
    toolbarHintDelete: "Delete",
    playgroundTitle: "SgMenu Playground",
    propsMenuTitle: "Referencia de Props - SgMenu",
    propsNodeTitle: "Referencia de Props - SgMenuNode",
    propsSelectionTitle: "Referencia de Props - SgMenuSelection",
    propsBrandTitle: "Referencia de Props - SgMenuBrand",
    propsUserTitle: "Referencia de Props - SgMenuUser"
  },
  "en-US": {
    headerSubtitle: "Hierarchical menu for sidebar, drawer, inline, and hybrid layouts, with search and multiple styles.",
    section1Title: "1) Fixed Sidebar",
    section1Description: "Side menu with collapsible groups and collapse button.",
    section2Title: "2) Mobile Drawer",
    section2Description: "Opens as overlay and can be pinned.",
    section3Title: "3) PanelMenu",
    section3Description: "Isolated example to preview only panel style.",
    section4Title: "4) Tiered",
    section4Description: "Isolated example to preview only tiered style.",
    section5Title: "5) MegaMenu Horizontal",
    section5Description: "Isolated example to preview only horizontal mega menu.",
    section6Title: "6) MegaMenu Vertical",
    section6Description: "Isolated example to preview only vertical mega menu.",
    section7Title: "7) Dockable Sidebar",
    section7Description:
      "Dockable SgMenu with full menu, brand, userMenu, integrated SgToolBar, and showcase visual identity.",
    section8Title: "8) Playground",
    section8Description: "Test menuStyle, menuVariantStyle, collapsed, and open.",
    sidebarSearchPlaceholder: "Search module...",
    sidebarUserSubtitle: "Finance",
    mainContentTitle: "Main content",
    activeItemLabel: "Active item",
    drawerOpenButton: "Open mobile menu",
    drawerPinButton: "Pin drawer",
    drawerUnpinButton: "Unpin drawer",
    drawerSearchPlaceholder: "Search...",
    dockMenuStyleTitle: "Menu Style",
    dockFreeAreaLabel: "Free center area",
    dockSearchPlaceholder: "Search module...",
    dockUserSubtitle: "Finance",
    toolbarTitle: "Tools",
    toolbarHintNew: "New record",
    toolbarHintSave: "Save",
    toolbarHintPrint: "Print",
    toolbarHintExport: "Export",
    toolbarHintDelete: "Delete",
    playgroundTitle: "SgMenu Playground",
    propsMenuTitle: "Props Reference - SgMenu",
    propsNodeTitle: "Props Reference - SgMenuNode",
    propsSelectionTitle: "Props Reference - SgMenuSelection",
    propsBrandTitle: "Props Reference - SgMenuBrand",
    propsUserTitle: "Props Reference - SgMenuUser"
  },
  es: {
    headerSubtitle: "Menu jerarquico para sidebar, drawer, inline e hibrido, con busqueda y multiples estilos.",
    section1Title: "1) Sidebar Fija",
    section1Description: "Menu lateral con grupos colapsables y boton de colapso.",
    section2Title: "2) Drawer Mobile",
    section2Description: "Se abre en overlay y puede fijarse con pin.",
    section3Title: "3) PanelMenu",
    section3Description: "Ejemplo aislado para ver solo el estilo panel.",
    section4Title: "4) Tiered",
    section4Description: "Ejemplo aislado para ver solo el estilo tiered.",
    section5Title: "5) MegaMenu Horizontal",
    section5Description: "Ejemplo aislado para ver solo el mega menu horizontal.",
    section6Title: "6) MegaMenu Vertical",
    section6Description: "Ejemplo aislado para ver solo el mega menu vertical.",
    section7Title: "7) Sidebar Dockable",
    section7Description:
      "SgMenu dockable con menu completo, brand, userMenu, SgToolBar integrada e identidad visual del showcase.",
    section8Title: "8) Playground",
    section8Description: "Prueba menuStyle, menuVariantStyle, collapsed y open.",
    sidebarSearchPlaceholder: "Search module...",
    sidebarUserSubtitle: "Finanzas",
    mainContentTitle: "Contenido principal",
    activeItemLabel: "Item activo",
    drawerOpenButton: "Open mobile menu",
    drawerPinButton: "Fijar drawer",
    drawerUnpinButton: "Desfijar drawer",
    drawerSearchPlaceholder: "Search...",
    dockMenuStyleTitle: "Estilo del Menu",
    dockFreeAreaLabel: "Area central libre",
    dockSearchPlaceholder: "Search module...",
    dockUserSubtitle: "Finanzas",
    toolbarTitle: "Herramientas",
    toolbarHintNew: "Nuevo registro",
    toolbarHintSave: "Guardar",
    toolbarHintPrint: "Print",
    toolbarHintExport: "Export",
    toolbarHintDelete: "Eliminar",
    playgroundTitle: "SgMenu Playground",
    propsMenuTitle: "Referencia de Props - SgMenu",
    propsNodeTitle: "Referencia de Props - SgMenuNode",
    propsSelectionTitle: "Referencia de Props - SgMenuSelection",
    propsBrandTitle: "Referencia de Props - SgMenuBrand",
    propsUserTitle: "Referencia de Props - SgMenuUser"
  }
};

type SupportedMenuShowcaseLocale = keyof typeof MENU_SHOWCASE_TEXTS;

function isSupportedMenuShowcaseLocale(locale: ShowcaseLocale): locale is SupportedMenuShowcaseLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getMenuShowcaseTexts(locale: ShowcaseLocale): MenuShowcaseTexts {
  const normalized: SupportedMenuShowcaseLocale = isSupportedMenuShowcaseLocale(locale) ? locale : "en-US";
  return MENU_SHOWCASE_TEXTS[normalized];
}

export default function SgMenuPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getMenuShowcaseTexts(i18n.locale), [i18n.locale]);
  const [activeId, setActiveId] = React.useState("dashboard");
  const [dockActiveId, setDockActiveId] = React.useState("dashboard");
  const [dockMenuStyle, setDockMenuStyle] = React.useState<"PanelMenu" | "Tiered">("PanelMenu");
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPinned, setDrawerPinned] = React.useState(false);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="h-[460px] overflow-hidden rounded-lg border border-border">
            <div className="flex h-full">
              <SgMenu
                menu={MENU}
                selection={{ activeId }}
                menuStyle="sidebar"
                mode="accordion"
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                showCollapseButton
                search={{ enabled: true, placeholder: texts.sidebarSearchPlaceholder }}
                brand={{ title: "SeedGrid ERP" }}
                user={{ name: "Lucia Souza", subtitle: texts.sidebarUserSubtitle }}
                userMenu={USER_MENU}
                onNavigate={(node) => setActiveId(node.id)}
              />
              <div className="flex-1 space-y-3 p-4">
                <h3 className="text-base font-semibold">{texts.mainContentTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {texts.activeItemLabel}: <span className="font-medium text-foreground">{activeId}</span>
                </p>
              </div>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/sidebar-fixa.tsx.sample" />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => setDrawerOpen(true)}>{texts.drawerOpenButton}</SgButton>
            <SgButton appearance="outline" onClick={() => setDrawerPinned((v) => !v)}>
              {drawerPinned ? texts.drawerUnpinButton : texts.drawerPinButton}
            </SgButton>
          </div>

          <SgMenu
            menu={MENU}
            selection={{ activeId }}
            menuStyle="drawer"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            pinned={drawerPinned}
            onPinnedChange={setDrawerPinned}
            showPinButton
            closeOnNavigate
            search={{ enabled: true, placeholder: texts.drawerSearchPlaceholder }}
            brand={{ title: "SeedGrid ERP" }}
            onNavigate={(node) => setActiveId(node.id)}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/drawer-mobile.tsx.sample" />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-auto rounded-md border border-border">
              <SgMenu menu={MENU} selection={{ activeId }} menuStyle="inline" menuVariantStyle="PanelMenu" onNavigate={(node) => setActiveId(node.id)} />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/panel-menu.tsx.sample" />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <div className="rounded-lg border border-border p-3">
            <div className="h-[320px] overflow-visible rounded-md border border-border p-2">
              <SgMenu
                menu={TIERED_MENU}
                selection={{ activeId }}
                menuStyle="inline"
                menuVariantStyle="Tiered"
                onNavigate={(node) => setActiveId(node.id)}
                onItemClick={(node) => setActiveId(node.id)}
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/tiered.tsx.sample" />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={MEGA_MENU}
              selection={{ activeId: "fashion" }}
              menuStyle="inline"
              menuVariantStyle="MegaMenuHorizontal"
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/mega-menu-horizontal.tsx.sample" />
        </Section>

        <Section title={texts.section6Title} description={texts.section6Description}>
          <div className="rounded-lg border border-border p-3">
            <SgMenu
              menu={MEGA_MENU}
              selection={{ activeId: "fashion" }}
              menuStyle="inline"
              menuVariantStyle="MegaMenuVertical"
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/mega-menu-vertical.tsx.sample" />
        </Section>

        <Section title={texts.section7Title} description={texts.section7Description}>
          <div className="space-y-3">
            <SgRadioGroup
              title={texts.dockMenuStyleTitle}
              source={DOCKABLE_MENU_STYLE_OPTIONS}
              value={dockMenuStyle}
              orientation="horizontal"
              onChange={(value) => {
                if (value === "PanelMenu" || value === "Tiered") setDockMenuStyle(value);
              }}
            />

            <div
              className="relative min-h-[520px] overflow-visible rounded-lg border border-[#e2cebc] bg-[#f0ebe4]"
              style={DOCKABLE_SHELL_STYLE}
            >
              <SgDockLayout
                id="showcase-menu-dock-v2"
                className="grid min-h-[520px] grid-cols-[auto_1fr_auto] grid-rows-[3.5rem_1fr_auto]"
              >
                <SgDockZone zone="top" />
                <SgDockZone zone="left" />
                <SgDockZone zone="right" />
                <SgDockZone zone="bottom" />
                <SgDockZone zone="free">
                  <div className="pointer-events-none text-sm text-[#7e5f46]">{texts.dockFreeAreaLabel}</div>
                </SgDockZone>

                <SgMenu
                  id="menu-dock-sidebar-v2"
                  menu={DOCKABLE_MENU}
                  selection={{ activeId: dockActiveId }}
                  menuStyle="sidebar"
                  menuVariantStyle={dockMenuStyle}
                  mode="accordion"
                  dockable
                  dockZone="left"
                  draggable
                  showCollapseButton
                  search={{ enabled: true, placeholder: texts.dockSearchPlaceholder }}
                  brand={{ title: "SeedGrid ERP", imageSrc: "/logo-seedgrid.svg" }}
                  user={{ name: "Lucia Souza", subtitle: texts.dockUserSubtitle }}
                  userMenu={DOCKABLE_USER_MENU}
                  userSectionStyle={{ backgroundColor: "#ebe0d4" }}
                  onNavigate={(node) => setDockActiveId(node.id)}
                />

                <SgToolBar
                  id="toolbar-dock-v1"
                  dockZone="top"
                  orientationDirection="horizontal-left"
                  title={texts.toolbarTitle}
                  draggable
                  collapsible={false}
                >
                  <SgToolbarIconButton icon={<Plus className="size-4" />} hint={texts.toolbarHintNew} severity="primary" />
                  <SgToolbarIconButton icon={<Save className="size-4" />} hint={texts.toolbarHintSave} />
                  <SgToolbarIconButton icon={<Printer className="size-4" />} hint={texts.toolbarHintPrint} />
                  <SgToolbarIconButton icon={<Download className="size-4" />} hint={texts.toolbarHintExport} />
                  <SgToolbarIconButton icon={<Trash2 className="size-4" />} hint={texts.toolbarHintDelete} severity="danger" />
                </SgToolBar>
              </SgDockLayout>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-menu/samples/sidebar-dockable.tsx.sample" />
        </Section>

        <Section title={texts.section8Title} description={texts.section8Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-menu/sg-menu.tsx.playground"
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.propsMenuTitle} rows={MENU_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-node" title={texts.propsNodeTitle} rows={MENU_NODE_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-selection" title={texts.propsSelectionTitle} rows={MENU_SELECTION_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-brand" title={texts.propsBrandTitle} rows={MENU_BRAND_PROPS} />
        <ShowcasePropsReference id="props-reference-menu-user" title={texts.propsUserTitle} rows={MENU_USER_PROPS} />

        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}





