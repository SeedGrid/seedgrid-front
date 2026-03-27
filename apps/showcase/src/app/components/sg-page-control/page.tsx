"use client";

import React from "react";
import { FolderKanban, Receipt, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

const PAGE_IDS = ["registration", "fiscal", "access", "integrations"] as const;

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
  return <sgCodeBlockBase code={props.code} />;
}

const EXAMPLE_BASIC_CODE = `import React from "react";
import { Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgPageControl
      defaultActivePageId="registration"
      style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12 }}
    >
      <SgPageControlPage
        id="registration"
        title="Registration"
        icon={<UserRound className="size-4" />}
        style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
      >
        Registration content
      </SgPageControlPage>
      <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
        Fiscal content
      </SgPageControlPage>
      <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>
        Access content
      </SgPageControlPage>
    </SgPageControl>
  );
}`;

const EXAMPLE_CONTROLLED_CODE = `import React from "react";
import { FolderKanban, Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [activePageId, setActivePageId] = React.useState("registration");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("registration")}>Go to Registration</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("fiscal")}>Go to Fiscal</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("access")}>Go to Access</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("integrations")}>Go to Integrations</SgButton>
      </div>

      <SgPageControl activePageId={activePageId} onActivePageIdChange={(pageId) => setActivePageId(pageId)} pageControlStyle="pills">
        <SgPageControlPage id="registration" title="Registration" icon={<UserRound className="size-4" />}>Registration content</SgPageControlPage>
        <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>Fiscal content</SgPageControlPage>
        <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>Access content</SgPageControlPage>
        <SgPageControlPage id="integrations" title="Integrations" icon={<FolderKanban className="size-4" />}>Integrations content</SgPageControlPage>
      </SgPageControl>
    </div>
  );
}`;

const EXAMPLE_HIDDEN_CODE = `import React from "react";
import { Receipt, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [activePageId, setActivePageId] = React.useState("registration");
  const [hiddenPageIds, setHiddenPageIds] = React.useState<string[]>([]);

  return (
    <SgPageControl
      activePageId={activePageId}
      onActivePageIdChange={(pageId) => setActivePageId(pageId)}
      hiddenPageIds={hiddenPageIds}
      keepMounted
    >
      <SgPageControlPage id="registration" title="Registration" icon={<UserRound className="size-4" />}>Registration content</SgPageControlPage>
      <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>Fiscal content</SgPageControlPage>
      <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>Access content</SgPageControlPage>
      <SgPageControlPage id="integrations" title="Integrations" icon={<Wrench className="size-4" />}>Integrations content</SgPageControlPage>
    </SgPageControl>
  );
}`;

const EXAMPLE_HINT_CODE = `import React from "react";
import { Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgPageControl defaultActivePageId="registration">
      <SgPageControlPage
        id="registration"
        title="Registration"
        hint="Create and edit registration data."
        icon={<UserRound className="size-4" />}
      >
        Registration content
      </SgPageControlPage>
      <SgPageControlPage
        id="fiscal"
        title="Fiscal"
        hint="Review tax and fiscal settings."
        icon={<Receipt className="size-4" />}
      >
        Fiscal content
      </SgPageControlPage>
      <SgPageControlPage
        id="access"
        title="Access"
        hint="Manage users, roles and permissions."
        icon={<ShieldCheck className="size-4" />}
      >
        Access content
      </SgPageControlPage>
    </SgPageControl>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  Receipt,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  SgButton,
  SgPageControl,
  SgPageControlPage,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [pageControlStyle, setPageControlStyle] = React.useState<"underline" | "pills">("underline");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [fullWidthTabs, setFullWidthTabs] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setPageControlStyle("underline")}>underline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPageControlStyle("pills")}>pills</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setFullWidthTabs((v) => !v)}>toggle fullWidth</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
      </div>

      <SgPageControl pageControlStyle={pageControlStyle} size={size} fullWidthTabs={fullWidthTabs}>
        <SgPageControlPage id="registration" title="Registration" icon={<UserRound className="size-4" />}>Registration content</SgPageControlPage>
        <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>Fiscal content</SgPageControlPage>
        <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>Access content</SgPageControlPage>
      </SgPageControl>
    </div>
  );
}`;

const PAGE_CONTROL_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "SgPageControlPage", defaultValue: "-", description: "Pages declared as children." },
  { prop: "activePageId / activeIndex", type: "string / number", defaultValue: "-", description: "External control of active page." },
  { prop: "defaultActivePageId / defaultActiveIndex", type: "string / number", defaultValue: "first visible page", description: "Initial state when uncontrolled." },
  { prop: "onActivePageIdChange / onActiveIndexChange", type: "callbacks", defaultValue: "-", description: "Events triggered on page change." },
  { prop: "hiddenPageIds", type: "string[]", defaultValue: "[]", description: "Hide pages without removing declarations." },
  { prop: "keepMounted", type: "boolean", defaultValue: "false", description: "Keep all panels mounted." },
  { prop: "pageControlStyle", type: "\"underline\" | \"pills\"", defaultValue: "underline", description: "Visual style of tabs." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Tab and panel size." },
  { prop: "fullWidthTabs / keyboardNavigation", type: "boolean", defaultValue: "false / true", description: "Full-width tabs and keyboard navigation." },
  { prop: "ariaLabel / emptyMessage", type: "string / ReactNode", defaultValue: "Page control / No visible pages.", description: "Accessibility and empty state." },
  { prop: "className / tabListClassName / tabClassName / panelClassName / style", type: "visual customization", defaultValue: "-", description: "Classes and styles for wrappers." },
  { prop: "SgPageControlPage.id / title / hint / icon / hidden / disabled / keepMounted / className / style / tabClassName / children", type: "page props", defaultValue: "-", description: "Props available for each tab/page." }
];


type PageControlTexts = {
  subtitle: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
};

const PAGE_CONTROL_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", PageControlTexts> = {
  "pt-BR": {
    subtitle: "TabView com controle externo de pagina ativa e ocultacao dinamica de tabs.",
    sectionTitles: [
      "1) Basico",
      "2) Controle Externo",
      "3) Ocultar Pagina Externamente",
      "4) Com Hint nas Abas",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon e title no SgPageControlPage.",
      "Use activePageId + onActivePageIdChange para setar a aba ativa.",
      "hiddenPageIds permite esconder tabs sem apagar a declaracao.",
      "Passe o mouse sobre a aba para ver o hint.",
      "Teste pageControlStyle, size e fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  "pt-PT": {
    subtitle: "TabView com controlo externo da pagina ativa e ocultacao dinamica de tabs.",
    sectionTitles: [
      "1) Basico",
      "2) Controlo Externo",
      "3) Ocultar Pagina Externamente",
      "4) Com Hint nos Tabs",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon e title no SgPageControlPage.",
      "Use activePageId + onActivePageIdChange para definir o tab ativo.",
      "hiddenPageIds permite esconder tabs sem remover a declaracao.",
      "Passe o rato no tab para ver o hint.",
      "Teste pageControlStyle, size e fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  "en-US": {
    subtitle: "TabView with external active-page control and dynamic tab hiding.",
    sectionTitles: [
      "1) Basic",
      "2) External Control",
      "3) Hide Page Externally",
      "4) With Tab Hints",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Each page defines icon and title in SgPageControlPage.",
      "Use activePageId + onActivePageIdChange to set the active tab.",
      "hiddenPageIds hides tabs without removing declarations.",
      "Hover each tab to display its hint.",
      "Try pageControlStyle, size and fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  es: {
    subtitle: "TabView con control externo de pagina activa y ocultacion dinamica de tabs.",
    sectionTitles: [
      "1) Basico",
      "2) Control Externo",
      "3) Ocultar Pagina Externamente",
      "4) Con Hint en Tabs",
      "5) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon y title en SgPageControlPage.",
      "Usa activePageId + onActivePageIdChange para definir la tab activa.",
      "hiddenPageIds oculta tabs sin remover declaraciones.",
      "Pasa el cursor por la tab para ver el hint.",
      "Prueba pageControlStyle, size y fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  }
};

function isSupportedPageControlLocale(locale: ShowcaseLocale): locale is keyof typeof PAGE_CONTROL_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
export default function SgPageControlShowcasePage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof PAGE_CONTROL_TEXTS = isSupportedPageControlLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = PAGE_CONTROL_TEXTS[locale];
  const [activePageId, setActivePageId] = React.useState<string>("registration");
  const [hiddenPageIds, setHiddenPageIds] = React.useState<string[]>([]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });

  const toggleHidden = (id: string) => {
    setHiddenPageIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPageControl"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <SgPageControl
            defaultActivePageId="registration"
            style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12 }}
          >
            <SgPageControlPage
              id="registration"
              title="Registration"
              icon={<UserRound className="size-4" />}
              style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
            >
              Registration content
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              Fiscal content
            </SgPageControlPage>
            <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>
              Access content
            </SgPageControlPage>
          </SgPageControl>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("registration")}>Go to Registration</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("fiscal")}>Go to Fiscal</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("access")}>Go to Access</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("integrations")}>Go to Integrations</SgButton>
          </div>

          <SgPageControl activePageId={activePageId} onActivePageIdChange={(pageId) => setActivePageId(pageId)} pageControlStyle="pills">
            <SgPageControlPage id="registration" title="Registration" icon={<UserRound className="size-4" />}>
              Registration content
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              Fiscal content
            </SgPageControlPage>
            <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>
              Access content
            </SgPageControlPage>
            <SgPageControlPage id="integrations" title="Integrations" icon={<FolderKanban className="size-4" />}>
              Integrations content
            </SgPageControlPage>
          </SgPageControl>

          <p className="text-sm text-muted-foreground">
            Current active page: <span className="font-semibold text-foreground">{activePageId}</span>
          </p>
          <CodeBlock code={EXAMPLE_CONTROLLED_CODE} />
        </Section>

        <Section title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <div className="flex flex-wrap gap-3">
            {PAGE_IDS.map((id) => (
              <label key={id} className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hiddenPageIds.includes(id)} onChange={() => toggleHidden(id)} />
                hide {id}
              </label>
            ))}
          </div>

          <SgPageControl
            activePageId={activePageId}
            onActivePageIdChange={(pageId) => setActivePageId(pageId)}
            hiddenPageIds={hiddenPageIds}
            keepMounted
          >
            <SgPageControlPage id="registration" title="Registration" icon={<UserRound className="size-4" />}>
              Registration content
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              Fiscal content
            </SgPageControlPage>
            <SgPageControlPage id="access" title="Access" icon={<ShieldCheck className="size-4" />}>
              Access content
            </SgPageControlPage>
            <SgPageControlPage id="integrations" title="Integrations" icon={<Wrench className="size-4" />}>
              Integrations content
            </SgPageControlPage>
          </SgPageControl>
          <CodeBlock code={EXAMPLE_HIDDEN_CODE} />
        </Section>

        <Section title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <SgPageControl defaultActivePageId="registration">
            <SgPageControlPage
              id="registration"
              title="Registration"
              hint="Create and edit registration data."
              icon={<UserRound className="size-4" />}
            >
              Registration content
            </SgPageControlPage>
            <SgPageControlPage
              id="fiscal"
              title="Fiscal"
              hint="Review tax and fiscal settings."
              icon={<Receipt className="size-4" />}
            >
              Fiscal content
            </SgPageControlPage>
            <SgPageControlPage
              id="access"
              title="Access"
              hint="Manage users, roles and permissions."
              icon={<ShieldCheck className="size-4" />}
            >
              Access content
            </SgPageControlPage>
          </SgPageControl>
          <CodeBlock code={EXAMPLE_HINT_CODE} />
        </Section>

        <Section title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PAGE_CONTROL_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



