"use client";

import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../sgCodeBlockBase";
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
      <div className="mt-4 grid gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

const CARD_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgCard,
  SgEnvironmentProvider,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [cardStyle, setCardStyle] = React.useState<"default" | "outlined" | "elevated" | "flat">("default");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [collapsible, setCollapsible] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setCardStyle(cardStyle === "default" ? "outlined" : cardStyle === "outlined" ? "elevated" : cardStyle === "elevated" ? "flat" : "default")}>
          cardStyle: {cardStyle}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize(size === "sm" ? "md" : size === "md" ? "lg" : "sm")}>
          size: {size}
        </SgButton>
        <SgButton size="sm" appearance={collapsible ? "solid" : "outline"} onClick={() => setCollapsible((prev) => !prev)}>
          collapsible: {String(collapsible)}
        </SgButton>
      </div>

      <SgCard
        cardStyle={cardStyle}
        size={size}
        collapsible={collapsible}
        title="Resumo financeiro"
        description="Visao rapida de indicadores"
        footer={<span className="text-xs text-muted-foreground">Atualizado agora</span>}
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Receita</span>
            <span className="font-semibold">R$ 25.400</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pedidos</span>
            <span className="font-semibold">183</span>
          </div>
        </div>
      </SgCard>
    </div>
  );
}`;

const CARD_PROPS: ShowcasePropRow[] = [
  { prop: "title / description", type: "string", defaultValue: "-", description: "Textos do cabecalho." },
  { prop: "cardStyle", type: "\"default\" | \"outlined\" | \"elevated\" | \"flat\"", defaultValue: "default", description: "Variacao visual do card." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "md", description: "Densidade e espacamento interno." },
  { prop: "bgColor / bgColorTitle / bgColorFooter", type: "string", defaultValue: "-", description: "Cor de fundo do card, titulo e footer." },
  { prop: "leading / trailing / trailer", type: "ReactNode", defaultValue: "-", description: "Elementos auxiliares no cabecalho." },
  { prop: "actions / header / footer", type: "ReactNode", defaultValue: "-", description: "Areas customizaveis do layout." },
  { prop: "collapsible / defaultOpen / open", type: "boolean", defaultValue: "false / true / controlado", description: "Controle de colapso do conteudo." },
  { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "-", description: "Callback de abertura/fechamento." },
  { prop: "collapseIcon / collapseIconSize / collapseToggleAlign", type: "ReactNode / number / \"left\" | \"right\"", defaultValue: "- / 18 / \"left\"", description: "Customizacao do botao de colapso e posicao do icone." },
  { prop: "draggable / defaultPosition", type: "boolean / { x: number; y: number }", defaultValue: "false / {x:0,y:0}", description: "Arrasta o card ao segurar o cabecalho." },
  { prop: "dragPersistKey / onPositionChange", type: "string / (position) => void", defaultValue: "- / -", description: "Persistencia de posicao via EnvironmentProvider ou localStorage fallback." },
  { prop: "clickable / disabled / onClick", type: "boolean / boolean / event", defaultValue: "false / false / -", description: "Modo clicavel e estado desabilitado." },
  { prop: "className / headerClassName / bodyClassName / footerClassName", type: "string", defaultValue: "-", description: "Customizacao de estilos por bloco." }
];

export default function SgCardPage() {
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
          title={t(i18n, "showcase.component.card.title")}
          subtitle={t(i18n, "showcase.component.card.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.card.sections.basic.title")}`}
        description={t(i18n, "showcase.component.card.sections.basic.description")}
      >
        <SgCard
          title={t(i18n, "showcase.component.card.labels.basicTitle")}
          description={t(i18n, "showcase.component.card.labels.basicDescription")}
          footer={
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t(i18n, "showcase.component.card.labels.basicFooterLeft")}</span>
              <span>{t(i18n, "showcase.component.card.labels.basicFooterRight")}</span>
            </div>
          }
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.basicLine1")}</span>
              <span className="font-semibold">R$ 12.400</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.basicLine2")}</span>
              <span className="font-semibold">83</span>
            </div>
          </div>
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgCard
      title="${t(i18n, "showcase.component.card.labels.basicTitle")}"
      description="${t(i18n, "showcase.component.card.labels.basicDescription")}"
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${t(i18n, "showcase.component.card.labels.basicFooterLeft")}</span>
          <span>${t(i18n, "showcase.component.card.labels.basicFooterRight")}</span>
        </div>
      }
    >
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.basicLine1")}</span>
          <span className="font-semibold">R$ 12.400</span>
        </div>
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.basicLine2")}</span>
          <span className="font-semibold">83</span>
        </div>
      </div>
    </SgCard>
  );
}`}
        />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.card.sections.leading.title")}`}
        description={t(i18n, "showcase.component.card.sections.leading.description")}
      >
        <SgCard
          leading={
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              SG
            </div>
          }
          trailing={
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {t(i18n, "showcase.component.card.labels.trailing")}
            </span>
          }
          title={t(i18n, "showcase.component.card.labels.leadingTitle")}
          description={t(i18n, "showcase.component.card.labels.leadingDescription")}
          actions={<SgButton appearance="ghost" size="sm">{t(i18n, "showcase.component.card.labels.action")}</SgButton>}
          footer={
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t(i18n, "showcase.component.card.labels.leadingFooterLeft")}</span>
              <span className="text-emerald-600">{t(i18n, "showcase.component.card.labels.leadingFooterRight")}</span>
            </div>
          }
        >
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.leadingMetric1")}</span>
              <span className="font-semibold">R$ 128.400</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.leadingMetric2")}</span>
              <span className="font-semibold">+12%</span>
            </div>
          </div>
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgCard
      leading={<div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">SG</div>}
      trailing={<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">${t(i18n, "showcase.component.card.labels.trailing")}</span>}
      title="${t(i18n, "showcase.component.card.labels.leadingTitle")}"
      description="${t(i18n, "showcase.component.card.labels.leadingDescription")}"
      actions={<SgButton appearance="ghost" size="sm">${t(i18n, "showcase.component.card.labels.action")}</SgButton>}
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${t(i18n, "showcase.component.card.labels.leadingFooterLeft")}</span>
          <span className="text-emerald-600">${t(i18n, "showcase.component.card.labels.leadingFooterRight")}</span>
        </div>
      }
    >
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.leadingMetric1")}</span>
          <span className="font-semibold">R$ 128.400</span>
        </div>
        <div className="flex items-center justify-between">
          <span>${t(i18n, "showcase.component.card.labels.leadingMetric2")}</span>
          <span className="font-semibold">+12%</span>
        </div>
      </div>
    </SgCard>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.card.sections.collapsible.title")}`}
        description={t(i18n, "showcase.component.card.sections.collapsible.description")}
      >
        <div className="grid gap-4">
          <SgCard
            title={t(i18n, "showcase.component.card.labels.collapsibleTitle")}
            description={t(i18n, "showcase.component.card.labels.collapsibleDescription")}
            collapsible
            defaultOpen={false}
            collapseToggleAlign="right"
            collapseIconSize={20}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm">{t(i18n, "showcase.component.card.labels.action")}</SgButton>
              </div>
            }
          >
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleContent")}</div>
          </SgCard>
          <SgCard
            title={t(i18n, "showcase.component.card.labels.collapsibleOpenTitle")}
            description={t(i18n, "showcase.component.card.labels.collapsibleOpenDescription")}
            collapsible
            defaultOpen
            collapseToggleAlign="right"
            collapseIconSize={20}
            footer={
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t(i18n, "showcase.component.card.labels.collapsibleOpenFooterLeft")}</span>
                <span>{t(i18n, "showcase.component.card.labels.collapsibleOpenFooterRight")}</span>
              </div>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleOpenLine1")}</span>
                <span className="font-semibold">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t(i18n, "showcase.component.card.labels.collapsibleOpenLine2")}</span>
                <span className="font-semibold">R$ 9.820</span>
              </div>
            </div>
          </SgCard>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <>
      <SgCard
        title="${t(i18n, "showcase.component.card.labels.collapsibleTitle")}"
        description="${t(i18n, "showcase.component.card.labels.collapsibleDescription")}"
        collapsible
        defaultOpen={false}
        collapseToggleAlign="right"
        collapseIconSize={20}
        footer={
          <div className="flex justify-end">
            <SgButton size="sm">${t(i18n, "showcase.component.card.labels.action")}</SgButton>
          </div>
        }
      >
        <div className="text-sm text-muted-foreground">${t(i18n, "showcase.component.card.labels.collapsibleContent")}</div>
      </SgCard>

      <SgCard
        title="${t(i18n, "showcase.component.card.labels.collapsibleOpenTitle")}"
        description="${t(i18n, "showcase.component.card.labels.collapsibleOpenDescription")}"
        collapsible
        defaultOpen
        collapseToggleAlign="right"
        collapseIconSize={20}
        footer={
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenFooterLeft")}</span>
            <span>${t(i18n, "showcase.component.card.labels.collapsibleOpenFooterRight")}</span>
          </div>
        }
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">${t(i18n, "showcase.component.card.labels.collapsibleOpenLine1")}</span>
            <span className="font-semibold">128</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">${t(i18n, "showcase.component.card.labels.collapsibleOpenLine2")}</span>
            <span className="font-semibold">R$ 9.820</span>
          </div>
        </div>
      </SgCard>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.card.sections.variants.title")}`}
        description={t(i18n, "showcase.component.card.sections.variants.description")}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <SgCard cardStyle="default" title={t(i18n, "showcase.component.card.labels.variantDefault")} size="sm">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeSm")}</div>
          </SgCard>
          <SgCard cardStyle="elevated" title={t(i18n, "showcase.component.card.labels.variantElevated")} size="sm">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeSm")}</div>
          </SgCard>
          <SgCard cardStyle="outlined" title={t(i18n, "showcase.component.card.labels.variantOutlined")} size="lg">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeLg")}</div>
          </SgCard>
          <SgCard cardStyle="flat" title={t(i18n, "showcase.component.card.labels.variantFlat")} size="lg">
            <div className="text-sm text-muted-foreground">{t(i18n, "showcase.component.card.labels.sizeLg")}</div>
          </SgCard>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <>
      <SgCard cardStyle="default" title="${t(i18n, "showcase.component.card.labels.variantDefault")}" size="sm">
        <div>${t(i18n, "showcase.component.card.labels.sizeSm")}</div>
      </SgCard>

      <SgCard cardStyle="elevated" title="${t(i18n, "showcase.component.card.labels.variantElevated")}" size="sm">
        <div>${t(i18n, "showcase.component.card.labels.sizeSm")}</div>
      </SgCard>

      <SgCard cardStyle="outlined" title="${t(i18n, "showcase.component.card.labels.variantOutlined")}" size="lg">
        <div>${t(i18n, "showcase.component.card.labels.sizeLg")}</div>
      </SgCard>

      <SgCard cardStyle="flat" title="${t(i18n, "showcase.component.card.labels.variantFlat")}" size="lg">
        <div>${t(i18n, "showcase.component.card.labels.sizeLg")}</div>
      </SgCard>
    </>
  );
}`}
        />
      </Section>

      <Section
        title="5) Surface colors"
        description="Use bgColor, bgColorTitle and bgColorFooter for custom surfaces."
      >
        <SgCard
          title="Custom background areas"
          description="Header and footer can have independent background colors."
          bgColor="#f8fafc"
          bgColorTitle="#dbeafe"
          bgColorFooter="#e2e8f0"
          footer={
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Updated now</span>
              <span>Footer area</span>
            </div>
          }
        >
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Revenue</span>
              <span className="font-semibold">R$ 24.980</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Orders</span>
              <span className="font-semibold">162</span>
            </div>
          </div>
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgCard
      title="Custom background areas"
      description="Header and footer can have independent background colors."
      bgColor="#f8fafc"
      bgColorTitle="#dbeafe"
      bgColorFooter="#e2e8f0"
      footer={
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Updated now</span>
          <span>Footer area</span>
        </div>
      }
    >
      <div className="space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Revenue</span>
          <span className="font-semibold">R$ 24.980</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Orders</span>
          <span className="font-semibold">162</span>
        </div>
      </div>
    </SgCard>
  );
}`}
        />
      </Section>

      <Section
        title="6) Draggable + persistence"
        description="Drag by the title bar. Position persists through SgEnvironmentProvider (or localStorage fallback)."
      >
        <SgEnvironmentProvider
          value={{
            namespaceProvider: { getNamespace: () => "showcase" },
            persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
          }}
        >
          <div className="relative h-[300px] overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/20 p-2">
            <SgCard
              id="sg-card-draggable-demo"
              draggable
              defaultPosition={{ x: 16, y: 16 }}
              dragPersistKey="sg-card-draggable-demo"
              title="Drag me by the title bar"
              description="Try moving and refreshing this page."
              collapsible
              collapseToggleAlign="right"
              collapseIconSize={20}
              bgColor="#ffffff"
              footer={<div className="text-xs text-muted-foreground">Persisted drag position.</div>}
            >
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-emerald-600">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-semibold">Sao Paulo</span>
                </div>
              </div>
            </SgCard>
          </div>
        </SgEnvironmentProvider>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <SgEnvironmentProvider
      value={{
        namespaceProvider: { getNamespace: () => "showcase" },
        persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
      }}
    >
      <div className="relative h-[300px] overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/20 p-2">
        <SgCard
          id="sg-card-draggable-demo"
          draggable
          defaultPosition={{ x: 16, y: 16 }}
          dragPersistKey="sg-card-draggable-demo"
          title="Drag me by the title bar"
          description="Try moving and refreshing this page."
          collapsible
          collapseToggleAlign="right"
          collapseIconSize={20}
          bgColor="#ffffff"
          footer={<div className="text-xs text-muted-foreground">Persisted drag position.</div>}
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold text-emerald-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Region</span>
              <span className="font-semibold">Sao Paulo</span>
            </div>
          </div>
        </SgCard>
      </div>
    </SgEnvironmentProvider>
  );
}`}
        />
      </Section>

        <Section title="7) Playground (SgPlayground)" description="Ajuste as principais props do SgCard.">
          <SgPlayground
            title="SgCard Playground"
            interactive
            codeContract="appFile"
            code={CARD_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={CARD_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

