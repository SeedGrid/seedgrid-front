"use client";

import React from "react";
import { Box, Building2, FilePenLine, Layers3, Receipt, Settings } from "lucide-react";
import { SgBreadcrumb, SgButton, SgPlayground, type SgBreadcrumbItem } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

const BASIC_ITEMS: SgBreadcrumbItem[] = [
  { id: "modules", label: "Modules", href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: "Registrations", href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: "Products", href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: "Edit", icon: <FilePenLine className="size-4" /> }
];

const ROUTES = {
  registration: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "registrations", label: "Registrations", href: "/erp/registrations", icon: <Building2 className="size-4" /> },
    { id: "customers", label: "Customers", icon: <Receipt className="size-4" /> }
  ],
  fiscal: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "fiscal", label: "Fiscal", href: "/erp/fiscal", icon: <Receipt className="size-4" /> },
    { id: "access", label: "Access", icon: <FilePenLine className="size-4" /> }
  ],
  integration: [
    { id: "erp", label: "ERP", href: "/erp", icon: <Layers3 className="size-4" /> },
    { id: "integration", label: "Integration", href: "/erp/integration", icon: <Settings className="size-4" /> },
    { id: "connectors", label: "Connectors", icon: <Building2 className="size-4" /> }
  ]
} satisfies Record<"registration" | "fiscal" | "integration", SgBreadcrumbItem[]>;

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

type BreadcrumbTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section2ActiveRouteLabel: string;
  section2LastClickLabel: string;
  section3Title: string;
  section3Description: string;
  section3CollapseLabel: string;
  section3ScrollLabel: string;
  section4Title: string;
  section4Description: string;
  propsReferenceTitle: string;
};

const BREADCRUMB_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", BreadcrumbTexts> = {
  "pt-BR": {
    headerSubtitle: "Breadcrumb hierarquico com suporte a icones, navegacao e overflow.",
    section1Title: "1) Basico",
    section1Description: "Com icones e item atual nao clicavel no final.",
    section2Title: "2) Caminho Externo",
    section2Description: "Troca do caminho renderizado por estado externo.",
    section2ActiveRouteLabel: "rota ativa",
    section2LastClickLabel: "ultimo clique",
    section3Title: "3) Overflow",
    section3Description: "Colapso com dropdown ou scroll horizontal em telas pequenas.",
    section3CollapseLabel: "Collapse com dropdown",
    section3ScrollLabel: "Scroll horizontal",
    section4Title: "4) Playground",
    section4Description: "Troque separador, variant e item Home.",
    propsReferenceTitle: "Referencia de Props",
  },
  "pt-PT": {
    headerSubtitle: "Breadcrumb hierarquico com suporte a icones, navegacao e overflow.",
    section1Title: "1) Basico",
    section1Description: "Com icones e item atual nao clicavel no final.",
    section2Title: "2) Caminho Externo",
    section2Description: "Troca do caminho renderizado por estado externo.",
    section2ActiveRouteLabel: "rota ativa",
    section2LastClickLabel: "ultimo clique",
    section3Title: "3) Overflow",
    section3Description: "Colapso com dropdown ou scroll horizontal em telas pequenas.",
    section3CollapseLabel: "Collapse com dropdown",
    section3ScrollLabel: "Scroll horizontal",
    section4Title: "4) Playground",
    section4Description: "Troque separador, variant e item Home.",
    propsReferenceTitle: "Referencia de Props",
  },
  "en-US": {
    headerSubtitle: "Hierarchical breadcrumb with support for icons, navigation, and overflow.",
    section1Title: "1) Basic",
    section1Description: "With icons and a non-clickable current item at the end.",
    section2Title: "2) External Path",
    section2Description: "Switch rendered route using external state.",
    section2ActiveRouteLabel: "active route",
    section2LastClickLabel: "last click",
    section3Title: "3) Overflow",
    section3Description: "Collapse with dropdown or horizontal scroll on small screens.",
    section3CollapseLabel: "Collapse with dropdown",
    section3ScrollLabel: "Horizontal scroll",
    section4Title: "4) Playground",
    section4Description: "Switch separator, variant, and Home item.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Breadcrumb jerarquico con soporte para iconos, navegacion y overflow.",
    section1Title: "1) Basico",
    section1Description: "Con iconos y elemento actual no clickeable al final.",
    section2Title: "2) Ruta Externa",
    section2Description: "Cambia la ruta renderizada por estado externo.",
    section2ActiveRouteLabel: "ruta activa",
    section2LastClickLabel: "ultimo clic",
    section3Title: "3) Overflow",
    section3Description: "Colapso con dropdown o scroll horizontal en pantallas pequenas.",
    section3CollapseLabel: "Collapse con dropdown",
    section3ScrollLabel: "Scroll horizontal",
    section4Title: "4) Playground",
    section4Description: "Cambia separador, variant y item Home.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedBreadcrumbLocale = keyof typeof BREADCRUMB_TEXTS;

function isSupportedBreadcrumbLocale(locale: ShowcaseLocale): locale is SupportedBreadcrumbLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getBreadcrumbTexts(locale: ShowcaseLocale): BreadcrumbTexts {
  const normalized: SupportedBreadcrumbLocale = isSupportedBreadcrumbLocale(locale) ? locale : "en-US";
  return BREADCRUMB_TEXTS[normalized];
}

const EXAMPLE_BASIC_CODE = `import React from "react";
import { Box, Building2, FilePenLine, Layers3 } from "lucide-react";
import { SgBreadcrumb, type SgBreadcrumbItem } from "@seedgrid/fe-components";

const items: SgBreadcrumbItem[] = [
  { id: "modules", label: "Modules", href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: "Registrations", href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: "Products", href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: "Edit", icon: <FilePenLine className="size-4" /> }
];

export default function Example() {
  return <SgBreadcrumb items={items} separator="chevron" showHomeIcon />;
}`;

const EXAMPLE_EXTERNAL_CODE = `import React from "react";
import { SgBreadcrumb, SgButton } from "@seedgrid/fe-components";

export default function Example() {
  const [routeKey, setRouteKey] = React.useState<"registration" | "fiscal" | "integration">("registration");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const routeItems = ROUTES[routeKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("registration")}>Go to Registration</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("fiscal")}>Go to Fiscal</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("integration")}>Go to Integration</SgButton>
      </div>
      <SgBreadcrumb items={routeItems} separator="arrow" variant="subtle" onNavigate={(item) => setLastNavigate(item.id)} />
      <p>active route: {routeKey} | last click: {lastNavigate}</p>
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
  { id: "modules", label: "Modules", href: "/modules", icon: <Layers3 className="size-4" /> },
  { id: "registrations", label: "Registrations", href: "/modules/registrations", icon: <Building2 className="size-4" /> },
  { id: "products", label: "Products", href: "/modules/registrations/products", icon: <Box className="size-4" /> },
  { id: "edit", label: "Edit", icon: <FilePenLine className="size-4" /> }
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
  { prop: "items", type: "SgBreadcrumbItem[]", defaultValue: "-", description: "List of rendered breadcrumb items." },
  { prop: "separator", type: "\"slash\" | \"chevron\" | \"dot\" | \"arrow\" | ReactNode", defaultValue: "chevron", description: "Visual separator between items." },
  { prop: "maxItems", type: "number", defaultValue: "-", description: "Maximum item count before overflow." },
  { prop: "overflowBehavior", type: "\"collapse\" | \"scroll\"", defaultValue: "collapse", description: "Overflow behavior for long trails." },
  { prop: "showHomeIcon / homeHref / homeLabel", type: "boolean / string / ReactNode", defaultValue: "false / / / Home", description: "Automatic Home item configuration." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Visual size of items." },
  { prop: "variant", type: "\"default\" | \"subtle\" | \"primary\"", defaultValue: "default", description: "Visual style variant." },
  { prop: "ariaLabel", type: "string", defaultValue: "Breadcrumb", description: "Accessible label for navigation." },
  { prop: "overflowLabel", type: "string", defaultValue: "More paths", description: "Label for the overflow button." },
  { prop: "onNavigate", type: "(item, index) => void", defaultValue: "-", description: "Callback fired when navigating to an item." },
  { prop: "className / itemClassName / style", type: "string / string / CSSProperties", defaultValue: "-", description: "Layout and style customization." },
  { prop: "SgBreadcrumbItem.id / label / href / icon / disabled / hidden / onClick", type: "item props", defaultValue: "-", description: "Structure of each breadcrumb item." }
];

export default function SgBreadcrumbPage() {
  const [routeKey, setRouteKey] = React.useState<keyof typeof ROUTES>("registration");
  const [lastNavigate, setLastNavigate] = React.useState("-");
  const routeItems = ROUTES[routeKey];
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getBreadcrumbTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <SgBreadcrumb items={BASIC_ITEMS} separator="chevron" showHomeIcon />
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("registration")}>Go to Registration</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("fiscal")}>Go to Fiscal</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setRouteKey("integration")}>Go to Integration</SgButton>
          </div>

          <SgBreadcrumb
            items={routeItems}
            separator="arrow"
            variant="subtle"
            onNavigate={(item) => setLastNavigate(item.id)}
          />

          <p className="text-sm text-muted-foreground">
            {texts.section2ActiveRouteLabel}: <span className="font-semibold text-foreground">{routeKey}</span> | {texts.section2LastClickLabel}:{" "}
            <span className="font-semibold text-foreground">{lastNavigate}</span>
          </p>
          <CodeBlock code={EXAMPLE_EXTERNAL_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">{texts.section3CollapseLabel}</p>
              <SgBreadcrumb items={LONG_ITEMS} maxItems={4} overflowBehavior="collapse" separator="slash" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">{texts.section3ScrollLabel}</p>
              <div className="max-w-[360px] rounded-lg border border-border p-2">
                <SgBreadcrumb items={LONG_ITEMS} overflowBehavior="scroll" separator="dot" />
              </div>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_OVERFLOW_CODE} />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgPlayground
            title="SgBreadcrumb Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BREADCRUMB_PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

