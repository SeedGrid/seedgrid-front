"use client";

import React from "react";
import { Box, Building2, FilePenLine, Layers3, Receipt, Settings } from "lucide-react";
import { SgBreadcrumb, SgButton, SgPlayground, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

const BASIC_ITEMS: SgBreadcrumbItem[] = [
  { id: "modulos", label: "Módulos", href: "/modulos", icon: <Layers3 className="size-4" /> },
  { id: "cadastros", label: "Cadastros", href: "/modulos/cadastros", icon: <Building2 className="size-4" /> },
  { id: "produtos", label: "Produtos", href: "/modulos/cadastros/produtos", icon: <Box className="size-4" /> },
  { id: "editar", label: "Editar", icon: <FilePenLine className="size-4" /> }
];

const ROUTES = {
  cadastro: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "cadastros", label: "Cadastros", href: "/erp/cadastros", icon: <Building2 className="size-4" /> },
    { id: "clientes", label: "Clientes", icon: <Receipt className="size-4" /> }
  ],
  financeiro: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "financeiro", label: "Financeiro", href: "/erp/financeiro", icon: <Receipt className="size-4" /> },
    { id: "contas", label: "Contas a pagar", icon: <FilePenLine className="size-4" /> }
  ],
  configuracao: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "config", label: "Configuração", href: "/erp/configuracao", icon: <Settings className="size-4" /> },
    { id: "usuarios", label: "Usuários", icon: <Building2 className="size-4" /> }
  ]
} satisfies Record<"cadastro" | "financeiro" | "configuracao", SgBreadcrumbItem[]>;

const LONG_ITEMS: SgBreadcrumbItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "admin", label: "Admin", href: "/admin" },
  { id: "tenant", label: "Multi Tenancy", href: "/admin/tenant" },
  { id: "billing", label: "Billing", href: "/admin/tenant/billing" },
  { id: "plans", label: "Subscription", href: "/admin/tenant/billing/subscription" },
  { id: "edit", label: "Edit plan" }
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

const EXAMPLE_BASIC_CODE = `import React from "react";
import { Box, Building2, FilePenLine, Layers3 } from "lucide-react";
import { SgBreadcrumb, type SgBreadcrumbItem } from "@seedgrid/fe-components";

const items: SgBreadcrumbItem[] = [
  { id: "modulos", label: "Módulos", href: "/modulos", icon: <Layers3 className="size-4" /> },
  { id: "cadastros", label: "Cadastros", href: "/modulos/cadastros", icon: <Building2 className="size-4" /> },
  { id: "produtos", label: "Produtos", href: "/modulos/cadastros/produtos", icon: <Box className="size-4" /> },
  { id: "editar", label: "Editar", icon: <FilePenLine className="size-4" /> }
];

export default function Example() {
  return <SgBreadcrumb items={items} separator="chevron" showHomeIcon />;
}`;

const EXAMPLE_EXTERNAL_CODE = `import React from "react";
import { SgBreadcrumb, SgButton } from "@seedgrid/fe-components";

export default function Example() {
  const [routeKey, setRouteKey] = React.useState<"cadastro" | "financeiro" | "configuracao">("cadastro");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const routeItems = ROUTES[routeKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("cadastro")}>Rota cadastro</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("financeiro")}>Rota financeiro</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("configuracao")}>Rota configuração</SgButton>
      </div>
      <SgBreadcrumb items={routeItems} separator="arrow" variant="subtle" onNavigate={(item) => setLastNavigate(item.id)} />
      <p>rota ativa: {routeKey} | último clique: {lastNavigate}</p>
    </div>
  );
}`;

const EXAMPLE_OVERFLOW_CODE = `import React from "react";
import { SgBreadcrumb } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="space-y-4">
      <SgBreadcrumb items={longItems} maxItems={4} overflowBehavior="collapse" separator="slash" />
      <div className="max-w-[360px] rounded-lg border border-border p-2">
        <SgBreadcrumb items={longItems} overflowBehavior="scroll" separator="dot" />
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { Layers3, Building2, Box, FilePenLine } from "lucide-react";
import { SgBreadcrumb, SgButton, type SgBreadcrumbSeparator } from "@seedgrid/fe-components";

const items = [
  { id: "modulos", label: "Módulos", href: "/modulos", icon: <Layers3 className="size-4" /> },
  { id: "cadastros", label: "Cadastros", href: "/modulos/cadastros", icon: <Building2 className="size-4" /> },
  { id: "produtos", label: "Produtos", href: "/modulos/cadastros/produtos", icon: <Box className="size-4" /> },
  { id: "editar", label: "Editar", icon: <FilePenLine className="size-4" /> }
];

export default function App() {
  const [separator, setSeparator] = React.useState<SgBreadcrumbSeparator>("chevron");
  const [variant, setVariant] = React.useState<"default" | "subtle" | "primary">("default");
  const [showHomeIcon, setShowHomeIcon] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("chevron")}>chevron</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("slash")}>slash</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeparator("dot")}>dot</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("default")}>default</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("subtle")}>subtle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("primary")}>primary</SgButton>
      </div>
      <SgButton size="sm" appearance="outline" onClick={() => setShowHomeIcon((v) => !v)}>toggle home icon</SgButton>

      <SgBreadcrumb items={items} separator={separator} variant={variant} showHomeIcon={showHomeIcon} />
    </div>
  );
}`;

const BREADCRUMB_PROPS: ShowcasePropRow[] = [
  { prop: "items", type: "SgBreadcrumbItem[]", defaultValue: "-", description: "Lista de itens renderizados no breadcrumb." },
  { prop: "separator", type: "\"slash\" | \"chevron\" | \"dot\" | \"arrow\" | ReactNode", defaultValue: "chevron", description: "Separador visual entre itens." },
  { prop: "maxItems", type: "number", defaultValue: "-", description: "Quantidade máxima de itens antes do overflow." },
  { prop: "overflowBehavior", type: "\"collapse\" | \"scroll\"", defaultValue: "collapse", description: "Comportamento em trilhas longas." },
  { prop: "showHomeIcon / homeHref / homeLabel", type: "boolean / string / ReactNode", defaultValue: "false / / / Home", description: "Configuração do item Home automático." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Tamanho visual dos itens." },
  { prop: "variant", type: "\"default\" | \"subtle\" | \"primary\"", defaultValue: "default", description: "Estilo visual do breadcrumb." },
  { prop: "ariaLabel", type: "string", defaultValue: "Breadcrumb", description: "Rótulo de acessibilidade da navegação." },
  { prop: "overflowLabel", type: "string", defaultValue: "Mais caminhos", description: "Rótulo do botão de overflow." },
  { prop: "onNavigate", type: "(item, index) => void", defaultValue: "-", description: "Callback ao navegar em um item." },
  { prop: "className / itemClassName / style", type: "string / string / CSSProperties", defaultValue: "-", description: "Customização de layout e estilo." },
  { prop: "SgBreadcrumbItem.id / label / href / icon / disabled / hidden / onClick", type: "item props", defaultValue: "-", description: "Estrutura de cada item do breadcrumb." }
];

export default function SgBreadcrumbPage() {
  const [routeKey, setRouteKey] = React.useState<keyof typeof ROUTES>("cadastro");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const routeItems = ROUTES[routeKey];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgBreadcrumb"
          subtitle="Breadcrumb hierárquico com suporte a ícones, navegação e overflow."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Básico" description="Com ícones e item atual não clicável no final.">
          <SgBreadcrumb items={BASIC_ITEMS} separator="chevron" showHomeIcon />
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title="2) Caminho Externo" description="Troca do caminho renderizado por estado externo.">
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("cadastro")}>Rota cadastro</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("financeiro")}>Rota financeiro</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("configuracao")}>Rota configuração</SgButton>
          </div>

          <SgBreadcrumb
            items={routeItems}
            separator="arrow"
            variant="subtle"
            onNavigate={(item) => setLastNavigate(item.id)}
          />

          <p className="text-sm text-muted-foreground">
            rota ativa: <span className="font-semibold text-foreground">{routeKey}</span> | último clique:{" "}
            <span className="font-semibold text-foreground">{lastNavigate}</span>
          </p>
          <CodeBlock code={EXAMPLE_EXTERNAL_CODE} />
        </Section>

        <Section title="3) Overflow" description="Colapso com dropdown ou scroll horizontal em telas pequenas.">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Collapse com dropdown</p>
              <SgBreadcrumb items={LONG_ITEMS} maxItems={4} overflowBehavior="collapse" separator="slash" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Scroll horizontal</p>
              <div className="max-w-[360px] rounded-lg border border-border p-2">
                <SgBreadcrumb items={LONG_ITEMS} overflowBehavior="scroll" separator="dot" />
              </div>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_OVERFLOW_CODE} />
        </Section>

        <Section title="4) Playground" description="Troque separador, variant e item Home.">
          <SgPlayground
            title="SgBreadcrumb Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BREADCRUMB_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

