"use client";

import React from "react";
import { SgButton, SgExpandablePanel, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

const EXAMPLE_INLINE_CONTROLLED_CODE = `import React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function Example() {
  const [open, setOpen] = React.useState(true);
  const [size, setSize] = React.useState<number | string>(320);

  return (
    <div className="h-[360px] overflow-hidden rounded-lg border border-border">
      <div className="flex h-full">
        <div className="flex-1 space-y-3 p-4">
          <h3 className="text-base font-semibold">Area principal</h3>
          <p className="text-sm text-muted-foreground">Exemplo inline controlado com resize.</p>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" onClick={() => setOpen((v) => !v)}>
              {open ? "Fechar inspector" : "Abrir inspector"}
            </SgButton>
          </div>
          <p className="text-xs text-muted-foreground">Largura atual: {String(size)}px</p>
        </div>

        <SgExpandablePanel
          mode="inline"
          expandTo="left"
          open={open}
          onOpenChange={setOpen}
          size={{ default: 320, min: 240, max: 560 }}
          resizable
          onSizeChange={setSize}
          header={<div className="font-medium">Inspector</div>}
          footer={<div className="text-xs text-muted-foreground">Rodape inline</div>}
        >
          <div className="space-y-3 text-sm">
            <p>Conteudo do inspector.</p>
            <p>Props: open, onOpenChange, size, resizable, onSizeChange.</p>
          </div>
        </SgExpandablePanel>
      </div>
    </div>
  );
}`;

const EXAMPLE_OVERLAY_BEHAVIOR_CODE = `import React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton onClick={() => setOpen(true)}>Abrir drawer</SgButton>
      </div>

      <SgExpandablePanel
        mode="overlay"
        expandTo="left"
        placement="center"
        open={open}
        onOpenChange={setOpen}
        size={{ default: 360, min: 260, max: 640 }}
        resizable
        closeOnEsc
        closeOnOutsideClick
        trapFocus
        showBackdrop
        handle={<div className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/35" />}
        header={<div className="font-medium">Drawer com foco preso</div>}
        footer={
          <div className="flex justify-end">
            <SgButton size="sm" onClick={() => setOpen(false)}>Fechar</SgButton>
          </div>
        }
      >
        <div className="space-y-2 text-sm">
          <p>Props: placement, closeOnEsc, closeOnOutsideClick, trapFocus e showBackdrop.</p>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Somente ativos</span>
          </label>
        </div>
      </SgExpandablePanel>
    </>
  );
}`;

const EXAMPLE_DEFAULT_OPEN_STYLES_CODE = `import React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function Example() {
  const [panelKey, setPanelKey] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <SgButton
          size="sm"
          appearance="outline"
          onClick={() => {
            setIsOpen(true);
            setPanelKey((v) => v + 1);
          }}
        >
          Remontar defaultOpen
        </SgButton>
        <span className="text-xs text-muted-foreground">Estado reportado: {isOpen ? "aberto" : "fechado"}</span>
      </div>

      <SgExpandablePanel
        key={panelKey}
        mode="overlay"
        expandTo="right"
        placement="start"
        defaultOpen
        onOpenChange={setIsOpen}
        size={{ default: 340, min: 240, max: 520 }}
        animation={{ type: "slide", durationMs: 220 }}
        elevation="lg"
        border={false}
        rounded="xl"
        className="bg-slate-900 text-slate-100"
        contentClassName="ring-1 ring-white/20"
        headerClassName="border-b border-slate-700 bg-slate-800/80"
        bodyClassName="bg-slate-900/90"
        footerClassName="border-t border-slate-700 bg-slate-800/60"
        style={{ boxShadow: "0 20px 60px rgba(15, 23, 42, 0.5)" }}
        header={<div className="font-medium">Painel estilizado</div>}
        footer={<div className="text-xs text-slate-300">Feche com ESC ou clique fora.</div>}
      >
        <div className="space-y-2 text-sm text-slate-100">
          <p>Props visuais: elevation, border, rounded, classes e style.</p>
          <p>Prop de estado: defaultOpen.</p>
        </div>
      </SgExpandablePanel>
    </>
  );
}`;

const EXAMPLE_ACCESSIBILITY_FADE_CODE = `import React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton onClick={() => setOpen(true)}>Abrir painel com fade</SgButton>
      </div>

      <SgExpandablePanel
        mode="overlay"
        expandTo="top"
        placement="center"
        open={open}
        onOpenChange={setOpen}
        role="dialog"
        ariaLabel="Painel de notificacoes"
        overlayClassName="bg-black/70"
        animation={{ type: "fade", durationMs: 260 }}
        closeOnOutsideClick={false}
        trapFocus
        size={{ default: 280, min: 180, max: 420 }}
        header={<div className="font-medium">Notificacoes</div>}
        footer={
          <div className="flex justify-end">
            <SgButton size="sm" onClick={() => setOpen(false)}>Fechar</SgButton>
          </div>
        }
      >
        <div className="text-sm">Props: role, ariaLabel, overlayClassName, animation fade e closeOnOutsideClick=false.</div>
      </SgExpandablePanel>
    </>
  );
}`;

const EXAMPLE_NO_BACKDROP_CODE = `import React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <SgButton appearance="outline" onClick={() => setOpen(true)}>Abrir sem backdrop</SgButton>
      </div>

      <SgExpandablePanel
        mode="overlay"
        expandTo="bottom"
        open={open}
        onOpenChange={setOpen}
        showBackdrop={false}
        closeOnOutsideClick={false}
        closeOnEsc
        animation={{ type: "none", durationMs: 0 }}
        size={{ default: 220, min: 160, max: 360 }}
        header={<div className="font-medium">Sem backdrop</div>}
        footer={
          <div className="flex justify-end">
            <SgButton size="sm" onClick={() => setOpen(false)}>Fechar</SgButton>
          </div>
        }
      >
        <div className="text-sm">Props: showBackdrop=false e animation type none.</div>
      </SgExpandablePanel>
    </>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgExpandablePanel } from "@seedgrid/fe-components";

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"inline" | "overlay">("overlay");
  const [direction, setDirection] = React.useState<"left" | "right" | "top" | "bottom">("left");
  const [placement, setPlacement] = React.useState<"start" | "center" | "end">("start");
  const [animationType, setAnimationType] = React.useState<"slide" | "fade" | "none">("slide");
  const [resizable, setResizable] = React.useState(true);
  const [showBackdrop, setShowBackdrop] = React.useState(true);
  const [trapFocus, setTrapFocus] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setMode("overlay")}>overlay</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMode("inline")}>inline</SgButton>
        <SgButton size="sm" onClick={() => setOpen((v) => !v)}>{open ? "Fechar" : "Abrir"}</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("left")}>left</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("right")}>right</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("top")}>top</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("bottom")}>bottom</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("start")}>start</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("center")}>center</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("end")}>end</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setAnimationType("slide")}>slide</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAnimationType("fade")}>fade</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAnimationType("none")}>none</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setResizable((v) => !v)}>{resizable ? "resizable on" : "resizable off"}</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShowBackdrop((v) => !v)}>{showBackdrop ? "backdrop on" : "backdrop off"}</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setTrapFocus((v) => !v)}>{trapFocus ? "trapFocus on" : "trapFocus off"}</SgButton>
      </div>

      <div className="h-[320px] overflow-hidden rounded-lg border border-border">
        <div className="flex h-full">
          <div className="flex-1 p-4 text-sm">Area principal</div>
          <SgExpandablePanel
            mode={mode}
            expandTo={direction}
            placement={placement}
            open={open}
            onOpenChange={setOpen}
            size={{ default: 280, min: 180, max: 520 }}
            resizable={resizable}
            showBackdrop={showBackdrop}
            closeOnOutsideClick={mode === "overlay"}
            trapFocus={trapFocus}
            animation={{ type: animationType, durationMs: animationType === "none" ? 0 : 180 }}
            header={<div className="font-medium">Playground</div>}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm" onClick={() => setOpen(false)}>Fechar</SgButton>
              </div>
            }
          >
            <div className="text-sm">Conteudo do painel.</div>
          </SgExpandablePanel>
        </div>
      </div>
    </div>
  );
}`;

const EXPANDABLE_PANEL_PROPS: ShowcasePropRow[] = [
  { prop: "header", type: "ReactNode", defaultValue: "-", description: "Conteudo opcional do cabecalho." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Main panel content." },
  { prop: "footer", type: "ReactNode", defaultValue: "-", description: "Conteudo opcional do rodape." },
  { prop: "handle", type: "ReactNode", defaultValue: "-", description: "Elemento visual acima do header." },

  { prop: "open", type: "boolean", defaultValue: "-", description: "Estado controlado de abertura." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Estado inicial no modo nao controlado." },
  { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "-", description: "Callback quando abrir/fechar." },

  { prop: "expandTo", type: '"left" | "right" | "top" | "bottom"', defaultValue: "-", description: "Direcao de expansao/retracao." },
  { prop: "placement", type: '"start" | "center" | "end"', defaultValue: "start", description: "Posicao no eixo perpendicular." },
  { prop: "mode", type: '"inline" | "overlay"', defaultValue: "inline", description: "Painel no layout ou em overlay." },

  { prop: "size", type: "{ min?: number | string; max?: number | string; default?: number | string }", defaultValue: "x:320 / y:280", description: "Tamanho inicial e limites min/max." },
  { prop: "resizable", type: "boolean", defaultValue: "false", description: "Habilita resize por arraste." },
  { prop: "onSizeChange", type: "(size: number | string) => void", defaultValue: "-", description: "Callback durante resize." },

  { prop: "closeOnOutsideClick", type: "boolean", defaultValue: "mode === overlay", description: "Fecha ao clicar fora do painel." },
  { prop: "closeOnEsc", type: "boolean", defaultValue: "true", description: "Fecha ao pressionar ESC." },
  { prop: "trapFocus", type: "boolean", defaultValue: "mode === overlay", description: "Prende foco dentro do painel." },
  { prop: "showBackdrop", type: "boolean", defaultValue: "true", description: "Mostra camada de fundo no overlay." },

  { prop: "animation", type: '{ type?: "slide" | "fade" | "none"; durationMs?: number }', defaultValue: "slide / 180", description: "Animacao de entrada/saida." },

  { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: "md", description: "Sombra do painel." },
  { prop: "border", type: "boolean", defaultValue: "true", description: "Exibe borda do container." },
  { prop: "rounded", type: '"none" | "md" | "lg" | "xl"', defaultValue: "lg", description: "Raio dos cantos." },

  { prop: "ariaLabel", type: "string", defaultValue: "Expandable panel", description: "Rotulo acessivel do painel." },
  { prop: "role", type: '"dialog" | "region"', defaultValue: "overlay: dialog / inline: region", description: "Papel semantico aplicado ao painel." },

  { prop: "className", type: "string", defaultValue: "-", description: "Classe extra no container do painel." },
  { prop: "contentClassName", type: "string", defaultValue: "-", description: "Classe extra no wrapper de conteudo." },
  { prop: "headerClassName", type: "string", defaultValue: "-", description: "Classe extra da area de header." },
  { prop: "bodyClassName", type: "string", defaultValue: "-", description: "Classe extra da area de body." },
  { prop: "footerClassName", type: "string", defaultValue: "-", description: "Classe extra da area de footer." },
  { prop: "overlayClassName", type: "string", defaultValue: "-", description: "Classe extra da camada de overlay/backdrop." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Estilo inline do container do painel." }
];

type ExpandablePanelTexts = {
  subtitle: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  playgroundTitle: string;
  propsTitle: string;
};

const EXPANDABLE_PANEL_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ExpandablePanelTexts> = {
  "pt-BR": {
    subtitle: "More examples covering the main properties in inline and overlay modes.",
    sectionTitles: [
      "1) Inline Controlado + Resize",
      "2) Overlay + Comportamento",
      "3) defaultOpen + Estilizacao",
      "4) Acessibilidade + Fade",
      "5) Sem Backdrop + Animation none",
      "6) Playground"
    ],
    sectionDescriptions: [
      "Demonstra open/onOpenChange, size, resizable e onSizeChange.",
      "Demonstra placement, closeOnEsc, closeOnOutsideClick, trapFocus, showBackdrop e handle.",
      "Demonstra defaultOpen, elevation, border, rounded, classes por area e style.",
      "Demonstra role, ariaLabel, overlayClassName, animation fade e closeOnOutsideClick=false.",
      "Demonstra showBackdrop=false, closeOnOutsideClick=false, closeOnEsc e animation none.",
      "Teste modo, direcao, placement, animacao e controles de interacao."
    ],
    playgroundTitle: "SgExpandablePanel Playground",
    propsTitle: "Referencia de Props"
  },
  "pt-PT": {
    subtitle: "More examples covering the main properties in inline and overlay modes.",
    sectionTitles: [
      "1) Inline Controlado + Resize",
      "2) Overlay + Comportamento",
      "3) defaultOpen + Estilizacao",
      "4) Acessibilidade + Fade",
      "5) Sem Backdrop + Animation none",
      "6) Playground"
    ],
    sectionDescriptions: [
      "Demonstra open/onOpenChange, size, resizable e onSizeChange.",
      "Demonstra placement, closeOnEsc, closeOnOutsideClick, trapFocus, showBackdrop e handle.",
      "Demonstra defaultOpen, elevation, border, rounded, classes por area e style.",
      "Demonstra role, ariaLabel, overlayClassName, animation fade e closeOnOutsideClick=false.",
      "Demonstra showBackdrop=false, closeOnOutsideClick=false, closeOnEsc e animation none.",
      "Teste modo, direcao, placement, animacao e controles de interacao."
    ],
    playgroundTitle: "SgExpandablePanel Playground",
    propsTitle: "Referencia de Props"
  },
  "en-US": {
    subtitle: "More examples covering the main props in inline and overlay modes.",
    sectionTitles: [
      "1) Controlled Inline + Resize",
      "2) Overlay + Behavior",
      "3) defaultOpen + Styling",
      "4) Accessibility + Fade",
      "5) No Backdrop + Animation none",
      "6) Playground"
    ],
    sectionDescriptions: [
      "Demonstrates open/onOpenChange, size, resizable and onSizeChange.",
      "Demonstrates placement, closeOnEsc, closeOnOutsideClick, trapFocus, showBackdrop and handle.",
      "Demonstrates defaultOpen, elevation, border, rounded, per-area classes and style.",
      "Demonstrates role, ariaLabel, overlayClassName, fade animation and closeOnOutsideClick=false.",
      "Demonstrates showBackdrop=false, closeOnOutsideClick=false, closeOnEsc and animation none.",
      "Test mode, direction, placement, animation and interaction controls."
    ],
    playgroundTitle: "SgExpandablePanel Playground",
    propsTitle: "Props Reference"
  },
  es: {
    subtitle: "Mas ejemplos cubriendo las principales props en modo inline y overlay.",
    sectionTitles: [
      "1) Inline Controlado + Resize",
      "2) Overlay + Comportamiento",
      "3) defaultOpen + Estilos",
      "4) Accesibilidad + Fade",
      "5) Sin Backdrop + Animation none",
      "6) Playground"
    ],
    sectionDescriptions: [
      "Demuestra open/onOpenChange, size, resizable y onSizeChange.",
      "Demuestra placement, closeOnEsc, closeOnOutsideClick, trapFocus, showBackdrop y handle.",
      "Demuestra defaultOpen, elevation, border, rounded, clases por area y style.",
      "Demuestra role, ariaLabel, overlayClassName, animacion fade y closeOnOutsideClick=false.",
      "Demuestra showBackdrop=false, closeOnOutsideClick=false, closeOnEsc y animation none.",
      "Prueba modo, direccion, placement, animacion y controles de interaccion."
    ],
    playgroundTitle: "SgExpandablePanel Playground",
    propsTitle: "Referencia de Props"
  }
};

function isSupportedExpandableLocale(locale: ShowcaseLocale): locale is keyof typeof EXPANDABLE_PANEL_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgExpandablePanelPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof EXPANDABLE_PANEL_TEXTS = isSupportedExpandableLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = EXPANDABLE_PANEL_TEXTS[locale];
  const [inlineOpen, setInlineOpen] = React.useState(true);
  const [inlineSize, setInlineSize] = React.useState<number | string>(320);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [styledPanelKey, setStyledPanelKey] = React.useState(0);
  const [styledPanelOpen, setStyledPanelOpen] = React.useState(true);

  const [a11yOpen, setA11yOpen] = React.useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = React.useState(false);

  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgExpandablePanel"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <div className="h-[360px] overflow-hidden rounded-lg border border-border">
            <div className="flex h-full">
              <div className="flex-1 space-y-3 p-4">
                <h3 className="text-base font-semibold">Area principal</h3>
                <p className="text-sm text-muted-foreground">Example inline controlado com resize.</p>
                <div className="flex flex-wrap gap-2">
                  <SgButton size="sm" onClick={() => setInlineOpen((v) => !v)}>
                    {inlineOpen ? "Fechar inspector" : "Abrir inspector"}
                  </SgButton>
                </div>
                <p className="text-xs text-muted-foreground">Largura atual: {String(inlineSize)}px</p>
              </div>

              <SgExpandablePanel
                mode="inline"
                expandTo="left"
                open={inlineOpen}
                onOpenChange={setInlineOpen}
                size={{ default: 320, min: 240, max: 560 }}
                resizable
                onSizeChange={setInlineSize}
                header={<div className="font-medium">Inspector</div>}
                footer={<div className="text-xs text-muted-foreground">Rodape inline</div>}
              >
                <div className="space-y-3 text-sm">
                  <p>Conteudo do inspector.</p>
                  <p>Props: open, onOpenChange, size, resizable, onSizeChange.</p>
                </div>
              </SgExpandablePanel>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_INLINE_CONTROLLED_CODE} />
        </Section>

        <Section title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => setDrawerOpen(true)}>Abrir drawer</SgButton>
          </div>

          <SgExpandablePanel
            mode="overlay"
            expandTo="left"
            placement="center"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            size={{ default: 360, min: 260, max: 640 }}
            resizable
            closeOnEsc
            closeOnOutsideClick
            trapFocus
            showBackdrop
            handle={<div className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/35" />}
            header={<div className="font-medium">Drawer com foco preso</div>}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm" onClick={() => setDrawerOpen(false)}>Fechar</SgButton>
              </div>
            }
          >
            <div className="space-y-2 text-sm">
              <p>Props: placement, closeOnEsc, closeOnOutsideClick, trapFocus e showBackdrop.</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span>Somente ativos</span>
              </label>
            </div>
          </SgExpandablePanel>
          <CodeBlock code={EXAMPLE_OVERLAY_BEHAVIOR_CODE} />
        </Section>

        <Section title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <div className="flex flex-wrap items-center gap-2">
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => {
                setStyledPanelOpen(true);
                setStyledPanelKey((v) => v + 1);
              }}
            >
              Remontar defaultOpen
            </SgButton>
            <span className="text-xs text-muted-foreground">Estado reportado: {styledPanelOpen ? "aberto" : "fechado"}</span>
          </div>

          <SgExpandablePanel
            key={styledPanelKey}
            mode="overlay"
            expandTo="right"
            placement="start"
            defaultOpen
            onOpenChange={setStyledPanelOpen}
            size={{ default: 340, min: 240, max: 520 }}
            animation={{ type: "slide", durationMs: 220 }}
            elevation="lg"
            border={false}
            rounded="xl"
            className="bg-slate-900 text-slate-100"
            contentClassName="ring-1 ring-white/20"
            headerClassName="border-b border-slate-700 bg-slate-800/80"
            bodyClassName="bg-slate-900/90"
            footerClassName="border-t border-slate-700 bg-slate-800/60"
            style={{ boxShadow: "0 20px 60px rgba(15, 23, 42, 0.5)" }}
            header={<div className="font-medium">Painel estilizado</div>}
            footer={<div className="text-xs text-slate-300">Feche com ESC ou clique fora.</div>}
          >
            <div className="space-y-2 text-sm text-slate-100">
              <p>Props visuais: elevation, border, rounded, classes e style.</p>
              <p>Prop de estado: defaultOpen.</p>
            </div>
          </SgExpandablePanel>
          <CodeBlock code={EXAMPLE_DEFAULT_OPEN_STYLES_CODE} />
        </Section>

        <Section title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => setA11yOpen(true)}>Abrir painel com fade</SgButton>
          </div>

          <SgExpandablePanel
            mode="overlay"
            expandTo="top"
            placement="center"
            open={a11yOpen}
            onOpenChange={setA11yOpen}
            role="dialog"
            ariaLabel="Painel de notificacoes"
            overlayClassName="bg-black/70"
            animation={{ type: "fade", durationMs: 260 }}
            closeOnOutsideClick={false}
            trapFocus
            size={{ default: 280, min: 180, max: 420 }}
            header={<div className="font-medium">Notificacoes</div>}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm" onClick={() => setA11yOpen(false)}>Fechar</SgButton>
              </div>
            }
          >
            <div className="text-sm">Props: role, ariaLabel, overlayClassName, animation fade e closeOnOutsideClick=false.</div>
          </SgExpandablePanel>
          <CodeBlock code={EXAMPLE_ACCESSIBILITY_FADE_CODE} />
        </Section>

        <Section title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <div className="flex flex-wrap gap-2">
            <SgButton appearance="outline" onClick={() => setNoBackdropOpen(true)}>Abrir sem backdrop</SgButton>
          </div>

          <SgExpandablePanel
            mode="overlay"
            expandTo="bottom"
            open={noBackdropOpen}
            onOpenChange={setNoBackdropOpen}
            showBackdrop={false}
            closeOnOutsideClick={false}
            closeOnEsc
            animation={{ type: "none", durationMs: 0 }}
            size={{ default: 220, min: 160, max: 360 }}
            header={<div className="font-medium">Sem backdrop</div>}
            footer={
              <div className="flex justify-end">
                <SgButton size="sm" onClick={() => setNoBackdropOpen(false)}>Fechar</SgButton>
              </div>
            }
          >
            <div className="text-sm">Props: showBackdrop=false e animation type none.</div>
          </SgExpandablePanel>
          <CodeBlock code={EXAMPLE_NO_BACKDROP_CODE} />
        </Section>

        <Section title={texts.sectionTitles[5] ?? ""} description={texts.sectionDescriptions[5] ?? ""}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={EXPANDABLE_PANEL_PROPS} title={texts.propsTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

