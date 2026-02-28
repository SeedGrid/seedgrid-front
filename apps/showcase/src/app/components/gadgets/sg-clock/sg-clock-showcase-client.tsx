"use client";

import * as React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgButton,
  SgGrid,
  SgPlayground,
  SgTimeProvider,
  SgDiscardDigit,
  registerThemes,
  sgClockThemesBuiltIn,
  type SgClockDigitalStyle,
  type SgDiscardDigitHandle
} from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../../i18n";
import CodeBlockBase from "../../CodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";

let themesRegistered = false;

const DIGITAL_STYLE_OPTIONS: SgClockDigitalStyle[] = [
  "default",
  "segment",
  "roller3d",
  "flip",
  "fade",
  "matrix",
  "neon",
  "discard"
];

function nextDigitalStyle(current: SgClockDigitalStyle): SgClockDigitalStyle {
  const idx = DIGITAL_STYLE_OPTIONS.indexOf(current);
  if (idx < 0) return DIGITAL_STYLE_OPTIONS[0] ?? "default";
  return DIGITAL_STYLE_OPTIONS[(idx + 1) % DIGITAL_STYLE_OPTIONS.length] ?? "default";
}

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

function RollerShowcase(props: { timezone: string }) {
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
          variant="digital"
          digitalStyle="roller3d"
          size="lg"
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
        />
      </div>

      <CodeBlockBase
        code={`import * as React from "react";
import { SgButton, SgClock } from "@seedgrid/fe-components";

export function RollerShowcase(props: { timezone: string }) {
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
          variant="digital"
          digitalStyle="roller3d"
          size="lg"
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
        />
      </div>
    </div>
  );
}`}
      />
    </div>
  );
}

function FlipShowcase(props: { timezone: string }) {
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
          variant="digital"
          digitalStyle="flip"
          size="lg"
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
        />
      </div>

      <CodeBlockBase
        code={`import * as React from "react";
import { SgButton, SgClock } from "@seedgrid/fe-components";

export function FlipShowcase(props: { timezone: string }) {
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
          variant="digital"
          digitalStyle="flip"
          size="lg"
          timezone={props.timezone}
          format={format}
          showSeconds={showSeconds}
        />
      </div>
    </div>
  );
}`}
      />
    </div>
  );
}

const DISCARD_TOTAL_PAGES = 10;

function DiscardShowcase() {
  const ref = React.useRef<SgDiscardDigitHandle>(null);
  const [page, setPage] = React.useState(1);

  const handleDecrease = () => {
    ref.current?.decreasePage();
    setPage((p) => Math.max(1, p - 1));
  };

  const handleIncrease = () => {
    ref.current?.increasePage();
    setPage((p) => Math.min(DISCARD_TOTAL_PAGES, p + 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-8">
        <SgDiscardDigit
          ref={ref}
          value={String(page)}
          totalNumberPages={DISCARD_TOTAL_PAGES}
          fontSize={64}
        />
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Pagina <span className="font-semibold text-foreground">{page}</span> de {DISCARD_TOTAL_PAGES}
          </div>
          <div className="flex gap-2">
            <SgButton onClick={handleDecrease} disabled={page <= 1}>-</SgButton>
            <SgButton onClick={handleIncrease} disabled={page >= DISCARD_TOTAL_PAGES}>+</SgButton>
          </div>
        </div>
      </div>

      <CodeBlockBase
        code={`import * as React from "react";
import { SgButton, SgDiscardDigit, type SgDiscardDigitHandle } from "@seedgrid/fe-components";

const DISCARD_TOTAL_PAGES = 10;

export function DiscardShowcase() {
  const ref = React.useRef<SgDiscardDigitHandle>(null);
  const [page, setPage] = React.useState(1);

  const handleDecrease = () => {
    ref.current?.decreasePage();
    setPage((p) => Math.max(1, p - 1));
  };

  const handleIncrease = () => {
    ref.current?.increasePage();
    setPage((p) => Math.min(DISCARD_TOTAL_PAGES, p + 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-8">
        <SgDiscardDigit
          ref={ref}
          value={String(page)}
          totalNumberPages={DISCARD_TOTAL_PAGES}
          fontSize={64}
        />
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Pagina <span className="font-semibold text-foreground">{page}</span> de {DISCARD_TOTAL_PAGES}
          </div>
          <div className="flex gap-2">
            <SgButton onClick={handleDecrease} disabled={page <= 1}>-</SgButton>
            <SgButton onClick={handleIncrease} disabled={page >= DISCARD_TOTAL_PAGES}>+</SgButton>
          </div>
        </div>
      </div>
    </div>
  );
}`}
      />
    </div>
  );
}
const DIGITAL_STYLE_GALLERY_OPTIONS: Array<{ label: string; style: SgClockDigitalStyle }> = [
  { label: "Default", style: "default" },
  { label: "Segment", style: "segment" },
  { label: "Fade", style: "fade" },
  { label: "Matrix", style: "matrix" },
  { label: "Neon", style: "neon" },
  { label: "Discard", style: "discard" }
];

function DigitalExtrasShowcase() {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const discardScale = showSeconds ? (format === "12h" ? 0.98 : 1.05) : format === "12h" ? 1.14 : 1.22;
  const matrixScale = showSeconds ? (format === "12h" ? 0.84 : 0.9) : 1;

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

      <SgGrid columns={{ base: 1, sm: 2, xl: 3 }} gap={12}>
        {DIGITAL_STYLE_GALLERY_OPTIONS.map((item) => (
          <div
            key={item.style}
            className={
              item.style === "discard"
                ? "space-y-4 rounded-xl border border-border bg-background p-6 sm:col-span-2 xl:col-span-3 min-h-[220px]"
                : "space-y-3 rounded-xl border border-border bg-background p-4"
            }
          >
            <div className="text-sm font-medium">{item.label}</div>
            <div
              className={
                item.style === "matrix"
                  ? "flex items-center justify-center overflow-hidden rounded-lg py-2"
                  : item.style === "discard"
                    ? "flex min-h-[150px] items-center justify-center overflow-visible py-2"
                  : "flex items-center justify-center"
              }
            >
              <div
                style={{
                  transform:
                    item.style === "discard"
                      ? "scale(" + discardScale + ")"
                      : item.style === "matrix"
                        ? "scale(" + matrixScale + ")"
                        : undefined,
                  transformOrigin: item.style === "discard" || item.style === "matrix" ? "center" : undefined
                }}
              >
                <SgClock
                  variant="digital"
                  digitalStyle={item.style}
                  size={item.style === "matrix" ? "sm" : item.style === "discard" ? "lg" : "md"}
                  timezone="America/Sao_Paulo"
                  format={format}
                  showSeconds={showSeconds}
                />
              </div>
            </div>
          </div>
        ))}
      </SgGrid>

      <CodeBlockBase
        code={`import * as React from "react";
import { SgButton, SgClock, SgGrid, type SgClockDigitalStyle } from "@seedgrid/fe-components";

const DIGITAL_STYLE_GALLERY_OPTIONS: Array<{ label: string; style: SgClockDigitalStyle }> = [
  { label: "Default", style: "default" },
  { label: "Segment", style: "segment" },
  { label: "Fade", style: "fade" },
  { label: "Matrix", style: "matrix" },
  { label: "Neon", style: "neon" },
  { label: "Discard", style: "discard" }
];

export function DigitalExtrasShowcase() {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const discardScale = showSeconds ? (format === "12h" ? 0.98 : 1.05) : format === "12h" ? 1.14 : 1.22;
  const matrixScale = showSeconds ? (format === "12h" ? 0.84 : 0.9) : 1;

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

      <SgGrid columns={{ base: 1, sm: 2, xl: 3 }} gap={12}>
        {DIGITAL_STYLE_GALLERY_OPTIONS.map((item) => (
          <div
            key={item.style}
            className={
              item.style === "discard"
                ? "space-y-4 rounded-xl border border-border bg-background p-6 sm:col-span-2 xl:col-span-3 min-h-[220px]"
                : "space-y-3 rounded-xl border border-border bg-background p-4"
            }
          >
            <div className="text-sm font-medium">{item.label}</div>
            <div
              className={
                item.style === "matrix"
                  ? "flex items-center justify-center overflow-hidden rounded-lg py-2"
                  : item.style === "discard"
                    ? "flex min-h-[150px] items-center justify-center overflow-visible py-2"
                  : "flex items-center justify-center"
              }
            >
              <div
                style={{
                  transform:
                    item.style === "discard"
                      ? "scale(" + discardScale + ")"
                      : item.style === "matrix"
                        ? "scale(" + matrixScale + ")"
                        : undefined,
                  transformOrigin: item.style === "discard" || item.style === "matrix" ? "center" : undefined
                }}
              >
                <SgClock
                  variant="digital"
                  digitalStyle={item.style}
                  size={item.style === "matrix" ? "sm" : item.style === "discard" ? "lg" : "md"}
                  timezone="America/Sao_Paulo"
                  format={format}
                  showSeconds={showSeconds}
                />
              </div>
            </div>
          </div>
        ))}
      </SgGrid>
    </div>
  );
}`}
      />
    </div>
  );
}
const CLOCK_PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgButton,
  SgClock,
  SgClockThemeProvider,
  SgGrid,
  SgTimeProvider,
  type SgClockDigitalStyle
} from "@seedgrid/fe-components";

const DIGITAL_STYLE_OPTIONS: SgClockDigitalStyle[] = [
  "default",
  "segment",
  "roller3d",
  "flip",
  "fade",
  "matrix",
  "neon",
  "discard"
];

function nextDigitalStyle(current: SgClockDigitalStyle): SgClockDigitalStyle {
  const idx = DIGITAL_STYLE_OPTIONS.indexOf(current);
  if (idx < 0) return DIGITAL_STYLE_OPTIONS[0] ?? "default";
  return DIGITAL_STYLE_OPTIONS[(idx + 1) % DIGITAL_STYLE_OPTIONS.length] ?? "default";
}

export default function App() {
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [digitalStyle, setDigitalStyle] = React.useState<SgClockDigitalStyle>("default");

  return (
    <SgTimeProvider initialServerTime={new Date().toISOString()}>
      <SgClockThemeProvider value={{ mode: "fallback", fallbackThemeId: "classic" }}>
        <div className="space-y-4 p-2">
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton size="sm" appearance={showSeconds ? "solid" : "outline"} onClick={() => setShowSeconds((prev) => !prev)}>
              seconds
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setFormat((prev) => (prev === "24h" ? "12h" : "24h"))}>
              {format}
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setDigitalStyle((prev) => nextDigitalStyle(prev))}>
              {digitalStyle}
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setTimezone((prev) => (prev === "America/Sao_Paulo" ? "Europe/Lisbon" : "America/Sao_Paulo"))}>
              {timezone === "America/Sao_Paulo" ? "Sao Paulo" : "Lisbon"}
            </SgButton>
          </SgGrid>

          <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
            <div className="rounded border border-border bg-background p-4">
              <SgClock
                variant="digital"
                size="lg"
                timezone={timezone}
                format={format}
                showSeconds={showSeconds}
                digitalStyle={digitalStyle}
              />
            </div>
            <div className="rounded border border-border bg-background p-4">
              <SgClock
                variant="analog"
                size={220}
                showSeconds={showSeconds}
                secondHandMode="smooth"
                timezone={timezone}
              />
            </div>
          </SgGrid>
        </div>
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}`;
const CLOCK_PROPS: ShowcasePropRow[] = [
  { prop: "variant", type: '"analog" | "digital"', defaultValue: '"digital"', description: "Seleciona o modo de renderizacao do relogio." },
  { prop: "size", type: 'number | "sm" | "md" | "lg"', defaultValue: '"md" (digital) / 240 (analog)', description: "Define o tamanho do relogio analogico ou digital." },
  { prop: "timezone", type: "string", defaultValue: "timezone local", description: "Fuso usado para calcular a hora exibida." },
  { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: "Locale usado para formatacao da hora." },
  { prop: "format", type: '"12h" | "24h"', defaultValue: '"24h"', description: "Formato de hora para o modo digital." },
  { prop: "showSeconds", type: "boolean", defaultValue: "true", description: "Exibe ou oculta os segundos." },
  { prop: "digitalStyle", type: '"default" | "segment" | "roller3d" | "flip" | "fade" | "matrix" | "neon" | "discard"', defaultValue: '"default"', description: "Estilo visual do relogio digital." },
  { prop: "secondHandMode", type: '"step" | "smooth"', defaultValue: '"step"', description: "Comportamento do ponteiro de segundos no analogico." },
  { prop: "themeId", type: "string", defaultValue: '"classic"', description: "Seleciona tema registrado para o modo analogico." },
  { prop: "theme", type: "SgClockTheme", defaultValue: "-", description: "Tema inline para o modo analogico." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe extra no container do relogio." },
  { prop: "centerOverlay", type: "ReactNode", defaultValue: "-", description: "Conteudo opcional sobreposto ao centro do relogio analogico." }
];
export function SgClockShowcaseClient({ initialServerTime }: { initialServerTime: string }) {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [themeId, setThemeId] = React.useState("seedgrid");
  const [secondMode, setSecondMode] = React.useState<"step" | "smooth">("step");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const [digitalStyle, setDigitalStyle] = React.useState<SgClockDigitalStyle>("default");

  if (!themesRegistered) {
    themesRegistered = true;
    registerThemes(sgClockThemesBuiltIn);
  }

  return (
    <I18NReady>
      <SgTimeProvider initialServerTime={initialServerTime}>
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
                  variant="analog"
                  size={320}
                  themeId={themeId}
                  showSeconds={showSeconds}
                  secondHandMode={secondMode}
                  timezone={timezone}
                />
              </div>
            </div>

            <div className="mt-6">
              <CodeBlockBase
                code={`import * as React from "react";
import { SgButton, SgClock, SgClockThemePicker } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../../i18n";

export function AnalogExample() {
  const i18n = useShowcaseI18n();
  const [themeId, setThemeId] = React.useState("seedgrid");
  const [secondMode, setSecondMode] = React.useState<"step" | "smooth">("step");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [timezone] = React.useState("America/Sao_Paulo");

  return (
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
          variant="analog"
          size={320}
          themeId={themeId}
          showSeconds={showSeconds}
          secondHandMode={secondMode}
          timezone={timezone}
        />
      </div>
    </div>
  );
}`}
              />
            </div>

            </Section>

            <Section
              title={t(i18n, "showcase.component.clock.sections.inlineTheme.title")}
              description={t(i18n, "showcase.component.clock.sections.inlineTheme.description")}
            >
            <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
              <SgClock
                variant="analog"
                size={260}
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
              <CodeBlockBase
                code={`import { SgClock } from "@seedgrid/fe-components";

export function InlineThemeExample() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
      <SgClock
        variant="analog"
        size={260}
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
  );
}`}
              />
            </div>
            </Section>

            <Section
              title={t(i18n, "showcase.component.clock.sections.digital.title")}
              description={t(i18n, "showcase.component.clock.sections.digital.description")}
            >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <SgButton onClick={() => setDigitalStyle((v) => nextDigitalStyle(v))}>
                {"Style: " + digitalStyle}
              </SgButton>
              <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
                {format === "24h" ? "24h" : "12h"}
              </SgButton>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SgClock variant="digital" size="sm" timezone={timezone} format={format} digitalStyle={digitalStyle} />
              <SgClock variant="digital" size="md" timezone={timezone} format={format} digitalStyle={digitalStyle} />
              <SgClock variant="digital" size="lg" timezone={timezone} format={format} digitalStyle={digitalStyle} />
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">{t(i18n, "showcase.component.clock.labels.segmentTitle")}</div>
              <div className="mt-2 flex flex-wrap items-center gap-6">
                <SgClock variant="digital" digitalStyle="segment" size="md" timezone={timezone} format={format} />
                <SgClock variant="digital" digitalStyle="segment" size="lg" timezone={timezone} format={format} />
              </div>
            </div>
            <div className="mt-6">
              <CodeBlockBase
                code={`import * as React from "react";
import { SgButton, SgClock, type SgClockDigitalStyle } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../../i18n";

const DIGITAL_STYLE_OPTIONS: SgClockDigitalStyle[] = [
  "default",
  "segment",
  "roller3d",
  "flip",
  "fade",
  "matrix",
  "neon",
  "discard"
];

function nextDigitalStyle(current: SgClockDigitalStyle): SgClockDigitalStyle {
  const idx = DIGITAL_STYLE_OPTIONS.indexOf(current);
  if (idx < 0) return DIGITAL_STYLE_OPTIONS[0] ?? "default";
  return DIGITAL_STYLE_OPTIONS[(idx + 1) % DIGITAL_STYLE_OPTIONS.length] ?? "default";
}

export function DigitalExample() {
  const i18n = useShowcaseI18n();
  const [timezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const [digitalStyle, setDigitalStyle] = React.useState<SgClockDigitalStyle>("default");

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SgButton onClick={() => setDigitalStyle((v) => nextDigitalStyle(v))}>
          {"Style: " + digitalStyle}
        </SgButton>
        <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
          {format === "24h" ? "24h" : "12h"}
        </SgButton>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SgClock variant="digital" size="sm" timezone={timezone} format={format} digitalStyle={digitalStyle} />
        <SgClock variant="digital" size="md" timezone={timezone} format={format} digitalStyle={digitalStyle} />
        <SgClock variant="digital" size="lg" timezone={timezone} format={format} digitalStyle={digitalStyle} />
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium">{t(i18n, "showcase.component.clock.labels.segmentTitle")}</div>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <SgClock variant="digital" digitalStyle="segment" size="md" timezone={timezone} format={format} />
          <SgClock variant="digital" digitalStyle="segment" size="lg" timezone={timezone} format={format} />
        </div>
      </div>
    </>
  );
}`}
              />
            </div>
            </Section>

            <Section title="Roller 3D" description="Rolos 3D com AM/PM opcional e segundos sob demanda.">
              <RollerShowcase timezone={timezone} />
            </Section>

            <Section title="Flip" description="Flip clock em duas folhas, com segundos e 12/24h.">
              <FlipShowcase timezone={timezone} />
            </Section>

            <Section title="Discard Digit" description="Pilha de folhas com paginacao imperativa via ref: totalNumberPages, increasePage(), decreasePage(), page().">
              <DiscardShowcase />
            </Section>

            <Section
              title="Outros digitalStyle"
              description="Galeria dedicada para estilos matrix, neon, discard e variacoes relacionadas."
            >
              <DigitalExtrasShowcase />
            </Section>

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
              <SgClock variant="digital" size="lg" timezone={timezone} format={format} showSeconds />
              <SgClock variant="analog" size={220} themeId={themeId} timezone={timezone} showSeconds={false} />
            </div>
            <div className="mt-6">
              <CodeBlockBase
                code={`import * as React from "react";
import { SgButton, SgClock } from "@seedgrid/fe-components";

export function TimezoneExample() {
  const [themeId] = React.useState("seedgrid");
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");

  return (
    <>
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
        <SgClock variant="digital" size="lg" timezone={timezone} format={format} showSeconds />
        <SgClock variant="analog" size={220} themeId={themeId} timezone={timezone} showSeconds={false} />
      </div>
    </>
  );
}`}
              />
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
                code={CLOCK_PLAYGROUND_APP_FILE}
                height={620}
                defaultOpen
              />
            </Section>

            <ShowcasePropsReference rows={CLOCK_PROPS} />
            <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
          </div>
        </SgClockThemeProvider>
      </SgTimeProvider>
    </I18NReady>
  );
}
