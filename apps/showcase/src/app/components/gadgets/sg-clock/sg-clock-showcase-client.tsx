"use client";

import * as React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgButton,
  SgPlayground,
  SgTimeProvider,
  registerThemes,
  sgClockThemesBuiltIn
} from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../../i18n";
import CodeBlockBase from "../../CodeBlockBase";
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
        code={`import React from "react";
import { SgClock, SgButton, SgTimeProvider } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState("12h");

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgButton onClick={() => setShowSeconds((v) => !v)}>
        {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
      </SgButton>
      <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
        {format === "24h" ? "24h" : "12h"}
      </SgButton>

      <SgClock
        variant="digital"
        digitalStyle="roller3d"
        size="lg"
        timezone="America/Sao_Paulo"
        format={format}
        showSeconds={showSeconds}
      />
    </SgTimeProvider>
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
        code={`import React from "react";
import { SgClock, SgButton, SgTimeProvider } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [format, setFormat] = React.useState("24h");

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgButton onClick={() => setShowSeconds((v) => !v)}>
        {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
      </SgButton>
      <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
        {format === "24h" ? "24h" : "12h"}
      </SgButton>

      <SgClock
        variant="digital"
        digitalStyle="flip"
        size="lg"
        timezone="America/Sao_Paulo"
        format={format}
        showSeconds={showSeconds}
      />
    </SgTimeProvider>
  );
}`}
      />
    </div>
  );
}

const CLOCK_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgButton, SgClock, SgClockThemeProvider, SgGrid, SgTimeProvider } from "@seedgrid/fe-components";

export default function App() {
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [digitalStyle, setDigitalStyle] = React.useState<"default" | "segment" | "roller3d" | "flip">("default");

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
            <SgButton size="sm" appearance="outline" onClick={() => setDigitalStyle((prev) => (prev === "default" ? "segment" : "default"))}>
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
  { prop: "variant", type: "\"analog\" | \"digital\"", defaultValue: "\"analog\"", description: "Seleciona o modo de renderizacao do relogio." },
  { prop: "size", type: "number | \"sm\" | \"md\" | \"lg\"", defaultValue: "260 / \"md\"", description: "Define o tamanho do relogio analogico ou digital." },
  { prop: "timezone", type: "string", defaultValue: "timezone local", description: "Fuso usado para calcular a hora exibida." },
  { prop: "format", type: "\"12h\" | \"24h\"", defaultValue: "\"24h\"", description: "Formato de hora para o modo digital." },
  { prop: "showSeconds", type: "boolean", defaultValue: "true", description: "Exibe ou oculta os segundos." },
  { prop: "digitalStyle", type: "\"default\" | \"segment\" | \"roller3d\" | \"flip\"", defaultValue: "\"default\"", description: "Estilo visual do relogio digital." },
  { prop: "secondHandMode", type: "\"step\" | \"smooth\"", defaultValue: "\"step\"", description: "Comportamento do ponteiro de segundos no analogico." },
  { prop: "themeId / theme", type: "string / SgClockTheme", defaultValue: "- / -", description: "Seleciona tema registrado ou tema inline para o analogico." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual adicional do container." }
];

export function SgClockShowcaseClient({ initialServerTime }: { initialServerTime: string }) {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [themeId, setThemeId] = React.useState("seedgrid");
  const [secondMode, setSecondMode] = React.useState<"step" | "smooth">("step");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState<"12h" | "24h">("24h");
  const [digitalStyle, setDigitalStyle] = React.useState<"default" | "segment" | "roller3d">("default");

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
                code={`"use client";
import React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgButton,
  SgTimeProvider,
  registerThemes,
  sgClockThemesBuiltIn
} from "@seedgrid/fe-components";

let themesRegistered = false;

export default function SgClockShowcaseClient({ initialServerTime }) {
  const [themeId, setThemeId] = React.useState("seedgrid");
  const [secondMode, setSecondMode] = React.useState("step");
  const [showSeconds, setShowSeconds] = React.useState(true);
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");

  if (!themesRegistered) {
    themesRegistered = true;
    registerThemes(sgClockThemesBuiltIn);
  }

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgClockThemeProvider value={{ mode: "fallback", fallbackThemeId: "classic" }}>
        <SgClockThemePicker value={themeId} onChange={setThemeId} label="Theme" />

        <SgButton onClick={() => setSecondMode((v) => (v === "step" ? "smooth" : "step"))}>
          {secondMode === "step" ? "Segundos: step" : "Segundos: smooth"}
        </SgButton>
        <SgButton onClick={() => setShowSeconds((v) => !v)}>
          {showSeconds ? "Segundos: ON" : "Segundos: OFF"}
        </SgButton>

        <SgClock
          variant="analog"
          size={320}
          themeId={themeId}
          showSeconds={showSeconds}
          secondHandMode={secondMode}
          timezone={timezone}
        />
      </SgClockThemeProvider>
    </SgTimeProvider>
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
                code={`import { SgClock, SgTimeProvider } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
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
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="47" />
              <text x="50" y="56" textAnchor="middle">SeedGrid</text>
            </>
          )
        }}
      />
    </SgTimeProvider>
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
              <SgButton onClick={() => setDigitalStyle((v) => (v === "default" ? "segment" : "default"))}>
                {digitalStyle === "default"
                  ? t(i18n, "showcase.component.clock.labels.segmentToggleOn")
                  : t(i18n, "showcase.component.clock.labels.segmentToggleOff")}
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
                code={`"use client";
import React from "react";
import { SgClock, SgTimeProvider, SgButton } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  const [digitalStyle, setDigitalStyle] = React.useState("default");
  const [format, setFormat] = React.useState("24h");
  const [format, setFormat] = React.useState("24h");

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgButton onClick={() => setDigitalStyle((v) => (v === "default" ? "segment" : "default"))}>
        {digitalStyle === "default" ? "Ativar segmentado" : "Desativar segmentado"}
      </SgButton>
      <SgButton onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
        {format === "24h" ? "24h" : "12h"}
      </SgButton>

      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <SgClock variant="digital" size="sm" timezone="America/Sao_Paulo" format={format} digitalStyle={digitalStyle} />
        <SgClock variant="digital" size="md" timezone="America/Sao_Paulo" format={format} digitalStyle={digitalStyle} />
        <SgClock variant="digital" size="lg" timezone="America/Sao_Paulo" format={format} digitalStyle={digitalStyle} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <SgClock variant="digital" digitalStyle="segment" size="md" timezone="America/Sao_Paulo" format={format} />
        <SgClock variant="digital" digitalStyle="segment" size="lg" timezone="America/Sao_Paulo" format={format} />
      </div>
    </SgTimeProvider>
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
                code={`"use client";
import React from "react";
import { SgClock, SgTimeProvider, SgButton } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState("24h");

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
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
        <SgClock variant="analog" size={220} themeId="seedgrid" timezone={timezone} showSeconds={false} />
      </div>
    </SgTimeProvider>
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
