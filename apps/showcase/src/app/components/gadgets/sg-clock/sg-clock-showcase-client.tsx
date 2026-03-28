"use client";

import * as React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgButton,
  registerThemes,
  sgClockThemesBuiltIn,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { t, useShowcaseI18n } from "../../../../i18n";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";

let themesRegistered = false;

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function RollerShowcase(props: { timezone: string; initialServerTime: string }) {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState<"12h" | "24h">("12h");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SgButton onClick={() => setShowSeconds((v) => !v)}>
          {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
        </SgButton>
        <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
          {format === "24h" ? "24h" : "12h"}
        </SgButton>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <SgClock
          clockStyle="digital"
          digitalStyle="roller3d"
          size="lg"
          initialServerTime={props.initialServerTime}
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
          style={{ borderRadius: 12, padding: 12, backgroundColor: "rgba(15, 23, 42, 0.04)" }}
        />
      </div>

      <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/roller-3d.tsx.sample" />
    </div>
  );
}

function FlipShowcase(props: { timezone: string; initialServerTime: string }) {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SgButton onClick={() => setShowSeconds((v) => !v)}>
          {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
        </SgButton>
        <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
          {format === "24h" ? "24h" : "12h"}
        </SgButton>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <SgClock
          clockStyle="digital"
          digitalStyle="flip"
          size="lg"
          initialServerTime={props.initialServerTime}
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
        />
      </div>

      <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/flip.tsx.sample" />
    </div>
  );
}

type ExtraDigitalStyle = "segment" | "sevenSegment" | "fade" | "matrix" | "neon" | "discard";

const EXTRA_DIGITAL_STYLE_SECTIONS: Array<{ title: string; description: string; style: ExtraDigitalStyle }> = [
  { title: "Segment", description: "Estilo segmentado com leitura limpa.", style: "segment" },
  { title: "Seven Segment", description: "Digitos de sete segmentos com visual retro.", style: "sevenSegment" },
  { title: "Fade", description: "Transicao suave entre os digitos.", style: "fade" },
  { title: "Matrix", description: "Estilo matriz de pontos para alta densidade visual.", style: "matrix" },
  { title: "Neon", description: "Tema com brilho de painel neon.", style: "neon" },
  { title: "Discard", description: "Cartoes empilhados com virada de digito.", style: "discard" }
];

function getExtraStyleSize(style: ExtraDigitalStyle): "sm" | "md" | "lg" {
  if (style === "matrix" || style === "sevenSegment") return "sm";
  if (style === "discard") return "lg";
  return "md";
}

function getExtraStyleWrapperClassName(style: ExtraDigitalStyle): string {
  if (style === "matrix") return "flex items-center justify-center overflow-hidden rounded-lg py-2";
  if (style === "discard") return "flex min-h-[170px] items-center justify-center overflow-visible py-2";
  return "flex items-center justify-center";
}

function getExtraStyleScale(
  style: ExtraDigitalStyle,
  showSeconds: boolean,
  format: "12h" | "24h"
): number | undefined {
  if (style === "discard") return showSeconds ? (format === "12h" ? 0.98 : 1.05) : format === "12h" ? 1.14 : 1.22;
  if (style === "matrix") return showSeconds ? (format === "12h" ? 0.84 : 0.9) : 1;
  return undefined;
}

function getExtraStyleExampleName(style: ExtraDigitalStyle): string {
  if (style === "sevenSegment") return "SevenSegmentExample";
  return style.charAt(0).toUpperCase() + style.slice(1) + "Example";
}

function getExtraStyleSampleFile(style: ExtraDigitalStyle): string {
  if (style === "sevenSegment") {
    return "apps/showcase/src/app/components/gadgets/sg-clock/samples/seven-segment.tsx.sample";
  }

  return `apps/showcase/src/app/components/gadgets/sg-clock/samples/${style}.tsx.sample`;
}

function DigitalStyleShowcase(props: { initialServerTime: string; style: ExtraDigitalStyle }) {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const size = getExtraStyleSize(props.style);
  const wrapperClassName = getExtraStyleWrapperClassName(props.style);
  const scale = getExtraStyleScale(props.style, showSeconds, format);
  const clockNode = (
    <SgClock
      clockStyle="digital"
      digitalStyle={props.style}
      size={size}
      initialServerTime={props.initialServerTime}
      timezone="America/Sao_Paulo"
      format={format}
      showSeconds={showSeconds}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SgButton onClick={() => setShowSeconds((v) => !v)}>
          {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
        </SgButton>
        <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
          {format === "24h" ? "24h" : "12h"}
        </SgButton>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <div className={wrapperClassName}>
          {scale ? <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>{clockNode}</div> : clockNode}
        </div>
      </div>

      <CodeBlock sampleFile={getExtraStyleSampleFile(props.style)} />
    </div>
  );
}
const CLOCK_PROPS: ShowcasePropRow[] = [
  { prop: "clockStyle", type: '"analog" | "digital"', defaultValue: '"digital"', description: "Seleciona o modo de renderizacao do relogio." },
  { prop: "size", type: 'number | "sm" | "md" | "lg"', defaultValue: '"md" (digital) / 240 (analog)', description: "Define o tamanho do relogio analogico ou digital." },
  { prop: "initialServerTime", type: "string", defaultValue: "-", description: "Seed opcional de hora ISO para sincronizar o ponto inicial com o servidor." },
  { prop: "timezone", type: "string", defaultValue: "timezone local", description: "Fuso usado para calcular a hora exibida." },
  { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: "Locale usado para formatacao da hora." },
  { prop: "format", type: '"12h" | "24h"', defaultValue: '"24h"', description: "Formato de hora para o modo digital." },
  { prop: "showSeconds", type: "boolean", defaultValue: "true", description: "Exibe ou oculta os segundos." },
  { prop: "digitalStyle", type: '"default" | "segment" | "sevenSegment" | "roller3d" | "flip" | "fade" | "matrix" | "neon" | "discard"', defaultValue: '"default"', description: "Estilo visual do relogio digital." },
  { prop: "secondHandMode", type: '"step" | "smooth"', defaultValue: '"step"', description: "Comportamento do ponteiro de segundos no analogico." },
  { prop: "themeId", type: "string", defaultValue: '"classic"', description: "Seleciona tema registrado para o modo analogico." },
  { prop: "theme", type: "SgClockTheme", defaultValue: "-", description: "Tema inline para o modo analogico." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe extra no container do relogio." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style extra no container do relogio." },
  { prop: "centerOverlay", type: "ReactNode", defaultValue: "-", description: "Conteudo opcional sobreposto ao centro do relogio analogico." },
  { prop: "cardTitle", type: "ReactNode", defaultValue: '"Clock/RelÃ³gio"', description: "Titulo do SgCard usado pelo gadget." },
  { prop: "cardProps", type: 'Omit<SgCardProps, "children" | "title">', defaultValue: "-", description: "Sobrescreve configuracoes padrao do SgCard do gadget." }
];
export function SgClockShowcaseClient({ initialServerTime }: { initialServerTime: string }) {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [themeId, setThemeId] = React.useState("seedgrid");
  const [secondMode, setSecondMode] = React.useState<"step" | "smooth">("step");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");

  if (!themesRegistered) {
    themesRegistered = true;
    registerThemes(sgClockThemesBuiltIn);
  }

  return (
    <I18NReady>
      <SgClockThemeProvider
        value={{
          mode: "fallback",
          fallbackThemeId: "classic"
        }}
      >
          <div
            ref={pageRef}
            className="max-w-5xl space-y-8"
            style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
          >
            <ShowcaseStickyHeader
              stickyHeaderRef={stickyHeaderRef}
              title={t(i18n, "showcase.component.clock.title")}
              subtitle={t(i18n, "showcase.component.clock.subtitle")}
              exampleLinks={exampleLinks}
              onAnchorClick={handleAnchorClick}
            />

            <Section
              title={t(i18n, "showcase.component.clock.sections.analog.title")}
              description={t(i18n, "showcase.component.clock.sections.analog.description")}
            >
            <div className="grid gap-6 md:grid-cols-[260px_1fr]">
              <div className="space-y-3">
                <SgClockThemePicker
                  value={themeId}
                  onChange={setThemeId}
                  label={t(i18n, "showcase.component.clock.labels.theme")}
                />

                <div className="flex flex-wrap gap-2">
                  <SgButton onClick={() => setSecondMode((v) => (v === "step" ? "smooth" : "step"))}>
                    {secondMode === "step"
                      ? t(i18n, "showcase.component.clock.labels.secondStep")
                      : t(i18n, "showcase.component.clock.labels.secondSmooth")}
                  </SgButton>
                  <SgButton onClick={() => setShowSeconds((v) => !v)}>
                    {showSeconds
                      ? t(i18n, "showcase.component.clock.labels.secondsOn")
                      : t(i18n, "showcase.component.clock.labels.secondsOff")}
                  </SgButton>
                </div>
              </div>

              <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
                <SgClock
                  clockStyle="analog"
                  size={320}
                  initialServerTime={initialServerTime}
                  themeId={themeId}
                  showSeconds={showSeconds}
                  secondHandMode={secondMode}
                  timezone={timezone}
                />
              </div>
            </div>

            <div className="mt-6">
              <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/analogico.tsx.sample" />
            </div>

            </Section>

            <Section
              title={t(i18n, "showcase.component.clock.sections.inlineTheme.title")}
              description={t(i18n, "showcase.component.clock.sections.inlineTheme.description")}
            >
            <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
              <SgClock
                clockStyle="analog"
                size={260}
                initialServerTime={initialServerTime}
                showSeconds
                secondHandMode="smooth"
                theme={{
                  id: "inline-theme",
                  label: "Inline Theme",
                  render: () => (
                    <>
                      <circle cx="50" cy="50" r="48" className="fill-white dark:fill-neutral-950" />
                      <circle cx="50" cy="50" r="47" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" />
                      <circle cx="50" cy="50" r="38" className="fill-none stroke-neutral-200 dark:stroke-neutral-800" />
                      <circle cx="50" cy="50" r="6" className="fill-neutral-100 dark:fill-neutral-900" />
                      <text x="50" y="56" textAnchor="middle" className="fill-neutral-400 text-[8px] font-semibold">
                        SeedGrid
                      </text>
                    </>
                  )
                }}
              />
            </div>

            <div className="mt-6">
              <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/tema-inline-sem-provider.tsx.sample" />
            </div>
            </Section>

            <Section
              title={t(i18n, "showcase.component.clock.sections.digital.title")}
              description={t(i18n, "showcase.component.clock.sections.digital.description")}
            >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
                {format === "24h" ? "24h" : "12h"}
              </SgButton>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SgClock clockStyle="digital" size="sm" initialServerTime={initialServerTime} timezone={timezone} format={format} digitalStyle="default" />
              <SgClock clockStyle="digital" size="md" initialServerTime={initialServerTime} timezone={timezone} format={format} digitalStyle="default" />
              <SgClock clockStyle="digital" size="lg" initialServerTime={initialServerTime} timezone={timezone} format={format} digitalStyle="default" />
            </div>
            <div className="mt-6">
              <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/digital.tsx.sample" />
            </div>
            </Section>

            <Section title="Roller 3D" description="Rolos 3D com AM/PM opcional e segundos sob demanda.">
              <RollerShowcase timezone={timezone} initialServerTime={initialServerTime} />
            </Section>

            <Section title="Flip" description="Flip clock em duas folhas, com segundos e 12/24h.">
              <FlipShowcase timezone={timezone} initialServerTime={initialServerTime} />
            </Section>

            {EXTRA_DIGITAL_STYLE_SECTIONS.map((item) => (
              <Section key={item.style} title={item.title} description={item.description}>
                <DigitalStyleShowcase initialServerTime={initialServerTime} style={item.style} />
              </Section>
            ))}

            <Section
              title={t(i18n, "showcase.component.clock.sections.timezone.title")}
              description={t(i18n, "showcase.component.clock.sections.timezone.description")}
            >
            <div className="flex flex-wrap gap-2">
              <SgButton onClick={() => setTimezone("America/Sao_Paulo")}>Sao Paulo</SgButton>
              <SgButton onClick={() => setTimezone("Europe/Lisbon")}>Lisboa</SgButton>
              <SgButton onClick={() => setTimezone("America/New_York")}>New York</SgButton>
              <SgButton onClick={() => setTimezone("Asia/Tokyo")}>Tokyo</SgButton>
              <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
                {format === "24h" ? "24h" : "12h"}
              </SgButton>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SgClock clockStyle="digital" size="lg" initialServerTime={initialServerTime} timezone={timezone} format={format} showSeconds />
              <SgClock clockStyle="analog" size={220} initialServerTime={initialServerTime} themeId={themeId} timezone={timezone} showSeconds={false} />
            </div>
            <div className="mt-6">
              <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-clock/samples/timezone.tsx.sample" />
            </div>
            </Section>

            <Section
              title="Playground"
              description="Controle props principais do SgClock em tempo real."
            >
              <SgPlayground
                title="SgClock Playground"
                interactive
                codeContract="appFile"
                playgroundFile="apps/showcase/src/app/components/gadgets/sg-clock/sg-clock.tsx.playground"
                height={620}
                defaultOpen
              />
            </Section>

            <ShowcasePropsReference rows={CLOCK_PROPS} />
            <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
          </div>
      </SgClockThemeProvider>
    </I18NReady>
  );
}




