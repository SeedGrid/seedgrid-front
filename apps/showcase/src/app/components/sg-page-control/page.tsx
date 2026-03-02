"use client";

import React from "react";
import { FolderKanban, Receipt, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

const PAGE_IDS = ["cadastro", "fiscal", "acesso", "integracoes"] as const;

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
import { Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgPageControl defaultActivePageId="cadastro">
      <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>
        ConteÃºdo cadastro
      </SgPageControlPage>
      <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
        ConteÃºdo fiscal
      </SgPageControlPage>
      <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>
        ConteÃºdo acesso
      </SgPageControlPage>
    </SgPageControl>
  );
}`;

const EXAMPLE_CONTROLLED_CODE = `import React from "react";
import { FolderKanban, Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";

export default function Example() {
  const [activePageId, setActivePageId] = React.useState("cadastro");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("cadastro")}>Cadastro</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("fiscal")}>Fiscal</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("acesso")}>Acesso</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("integracoes")}>IntegraÃ§Ãµes</SgButton>
      </div>

      <SgPageControl activePageId={activePageId} onActivePageIdChange={(pageId) => setActivePageId(pageId)} variant="pills">
        <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>ConteÃºdo cadastro</SgPageControlPage>
        <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>ConteÃºdo fiscal</SgPageControlPage>
        <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>ConteÃºdo acesso</SgPageControlPage>
        <SgPageControlPage id="integracoes" title="IntegraÃ§Ãµes" icon={<FolderKanban className="size-4" />}>ConteÃºdo integraÃ§Ãµes</SgPageControlPage>
      </SgPageControl>
    </div>
  );
}`;

const EXAMPLE_HIDDEN_CODE = `import React from "react";
import { Receipt, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";

export default function Example() {
  const [activePageId, setActivePageId] = React.useState("cadastro");
  const [hiddenPageIds, setHiddenPageIds] = React.useState<string[]>([]);

  return (
    <SgPageControl
      activePageId={activePageId}
      onActivePageIdChange={(pageId) => setActivePageId(pageId)}
      hiddenPageIds={hiddenPageIds}
      keepMounted
    >
      <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>ConteÃºdo cadastro</SgPageControlPage>
      <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>ConteÃºdo fiscal</SgPageControlPage>
      <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>ConteÃºdo acesso</SgPageControlPage>
      <SgPageControlPage id="integracoes" title="IntegraÃ§Ãµes" icon={<Wrench className="size-4" />}>ConteÃºdo integraÃ§Ãµes</SgPageControlPage>
    </SgPageControl>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { Receipt, ShieldCheck, UserRound } from "lucide-react";
import { SgButton, SgPageControl, SgPageControlPage } from "@seedgrid/fe-components";

export default function App() {
  const [variant, setVariant] = React.useState<"underline" | "pills">("underline");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [fullWidthTabs, setFullWidthTabs] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("underline")}>underline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setVariant("pills")}>pills</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setFullWidthTabs((v) => !v)}>toggle fullWidth</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
      </div>

      <SgPageControl variant={variant} size={size} fullWidthTabs={fullWidthTabs}>
        <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>ConteÃºdo cadastro</SgPageControlPage>
        <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>ConteÃºdo fiscal</SgPageControlPage>
        <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>ConteÃºdo acesso</SgPageControlPage>
      </SgPageControl>
    </div>
  );
}`;

const PAGE_CONTROL_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "SgPageControlPage", defaultValue: "-", description: "PÃ¡ginas declaradas como filhos." },
  { prop: "activePageId / activeIndex", type: "string / number", defaultValue: "-", description: "Controle externo da pÃ¡gina ativa." },
  { prop: "defaultActivePageId / defaultActiveIndex", type: "string / number", defaultValue: "primeira pÃ¡gina visÃ­vel", description: "Estado inicial quando nÃ£o controlado." },
  { prop: "onActivePageIdChange / onActiveIndexChange", type: "callbacks", defaultValue: "-", description: "Eventos de mudanÃ§a de pÃ¡gina." },
  { prop: "hiddenPageIds", type: "string[]", defaultValue: "[]", description: "Oculta pÃ¡ginas sem removÃª-las da declaraÃ§Ã£o." },
  { prop: "keepMounted", type: "boolean", defaultValue: "false", description: "MantÃ©m todos os painÃ©is montados." },
  { prop: "variant", type: "\"underline\" | \"pills\"", defaultValue: "underline", description: "Estilo visual das abas." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Tamanho das abas e painel." },
  { prop: "fullWidthTabs / keyboardNavigation", type: "boolean", defaultValue: "false / true", description: "Abas em largura total e navegaÃ§Ã£o por teclado." },
  { prop: "ariaLabel / emptyMessage", type: "string / ReactNode", defaultValue: "Page control / No visible pages.", description: "Acessibilidade e estado vazio." },
  { prop: "className / tabListClassName / tabClassName / panelClassName / style", type: "customizaÃ§Ã£o visual", defaultValue: "-", description: "Classes e estilo do container." },
  { prop: "SgPageControlPage.id / title / icon / hidden / disabled / keepMounted / className / tabClassName / children", type: "page props", defaultValue: "-", description: "Propriedades de cada aba/pÃ¡gina." }
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
      "4) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon e title no SgPageControlPage.",
      "Use activePageId + onActivePageIdChange para setar a aba ativa.",
      "hiddenPageIds permite esconder tabs sem apagar a declaracao.",
      "Teste variant, size e fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  "pt-PT": {
    subtitle: "TabView com controlo externo da pagina ativa e ocultacao dinamica de tabs.",
    sectionTitles: [
      "1) Basico",
      "2) Controlo Externo",
      "3) Ocultar Pagina Externamente",
      "4) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon e title no SgPageControlPage.",
      "Use activePageId + onActivePageIdChange para definir o tab ativo.",
      "hiddenPageIds permite esconder tabs sem remover a declaracao.",
      "Teste variant, size e fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  "en-US": {
    subtitle: "TabView with external active-page control and dynamic tab hiding.",
    sectionTitles: [
      "1) Basic",
      "2) External Control",
      "3) Hide Page Externally",
      "4) Playground"
    ],
    sectionDescriptions: [
      "Each page defines icon and title in SgPageControlPage.",
      "Use activePageId + onActivePageIdChange to set the active tab.",
      "hiddenPageIds hides tabs without removing declarations.",
      "Try variant, size and fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  },
  es: {
    subtitle: "TabView con control externo de pagina activa y ocultacion dinamica de tabs.",
    sectionTitles: [
      "1) Basico",
      "2) Control Externo",
      "3) Ocultar Pagina Externamente",
      "4) Playground"
    ],
    sectionDescriptions: [
      "Cada pagina define icon y title en SgPageControlPage.",
      "Usa activePageId + onActivePageIdChange para definir la tab activa.",
      "hiddenPageIds oculta tabs sin remover declaraciones.",
      "Prueba variant, size y fullWidthTabs."
    ],
    playgroundTitle: "SgPageControl Playground"
  }
};

function isSupportedPageControlLocale(locale: ShowcaseLocale): locale is keyof typeof PAGE_CONTROL_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}
export default function SgPageControlShowcasePage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof PAGE_CONTROL_TEXTS = isSupportedPageControlLocale(i18n.locale) ? i18n.locale : "pt-BR";
  const texts = PAGE_CONTROL_TEXTS[locale];
  const [activePageId, setActivePageId] = React.useState<string>("cadastro");
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
          <SgPageControl defaultActivePageId="cadastro">
            <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>
              ConteÃºdo cadastro
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              ConteÃºdo fiscal
            </SgPageControlPage>
            <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>
              ConteÃºdo acesso
            </SgPageControlPage>
          </SgPageControl>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("cadastro")}>Ir para Cadastro</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("fiscal")}>Ir para Fiscal</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("acesso")}>Ir para Acesso</SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setActivePageId("integracoes")}>Ir para IntegraÃ§Ãµes</SgButton>
          </div>

          <SgPageControl activePageId={activePageId} onActivePageIdChange={(pageId) => setActivePageId(pageId)} variant="pills">
            <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>
              ConteÃºdo cadastro
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              ConteÃºdo fiscal
            </SgPageControlPage>
            <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>
              ConteÃºdo acesso
            </SgPageControlPage>
            <SgPageControlPage id="integracoes" title="IntegraÃ§Ãµes" icon={<FolderKanban className="size-4" />}>
              ConteÃºdo integraÃ§Ãµes
            </SgPageControlPage>
          </SgPageControl>

          <p className="text-sm text-muted-foreground">
            PÃ¡gina ativa atual: <span className="font-semibold text-foreground">{activePageId}</span>
          </p>
          <CodeBlock code={EXAMPLE_CONTROLLED_CODE} />
        </Section>

        <Section title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <div className="flex flex-wrap gap-3">
            {PAGE_IDS.map((id) => (
              <label key={id} className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hiddenPageIds.includes(id)} onChange={() => toggleHidden(id)} />
                ocultar {id}
              </label>
            ))}
          </div>

          <SgPageControl
            activePageId={activePageId}
            onActivePageIdChange={(pageId) => setActivePageId(pageId)}
            hiddenPageIds={hiddenPageIds}
            keepMounted
          >
            <SgPageControlPage id="cadastro" title="Cadastro" icon={<UserRound className="size-4" />}>
              ConteÃºdo cadastro
            </SgPageControlPage>
            <SgPageControlPage id="fiscal" title="Fiscal" icon={<Receipt className="size-4" />}>
              ConteÃºdo fiscal
            </SgPageControlPage>
            <SgPageControlPage id="acesso" title="Acesso" icon={<ShieldCheck className="size-4" />}>
              ConteÃºdo acesso
            </SgPageControlPage>
            <SgPageControlPage id="integracoes" title="IntegraÃ§Ãµes" icon={<Wrench className="size-4" />}>
              ConteÃºdo integraÃ§Ãµes
            </SgPageControlPage>
          </SgPageControl>
          <CodeBlock code={EXAMPLE_HIDDEN_CODE} />
        </Section>

        <Section title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
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

