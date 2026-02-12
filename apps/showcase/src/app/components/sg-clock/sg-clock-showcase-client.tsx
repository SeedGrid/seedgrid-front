"use client";

import * as React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgTimeProvider,
  registerThemes,
  sgClockThemesBuiltIn
} from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../i18n";
import CodeBlockBase from "../CodeBlockBase";

let themesRegistered = false;

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

export function SgClockShowcaseClient({ initialServerTime }: { initialServerTime: string }) {
  const i18n = useShowcaseI18n();
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
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgClockThemeProvider
        value={{
          mode: "fallback",
          fallbackThemeId: "classic"
        }}
      >
        <div className="max-w-5xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.clock.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.clock.subtitle")}</p>
          </div>

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
                  <button
                    type="button"
                    className="rounded-md border border-border px-3 py-2 text-sm"
                    onClick={() => setSecondMode((v) => (v === "step" ? "smooth" : "step"))}
                  >
                    {secondMode === "step"
                      ? t(i18n, "showcase.component.clock.labels.secondStep")
                      : t(i18n, "showcase.component.clock.labels.secondSmooth")}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-border px-3 py-2 text-sm"
                    onClick={() => setShowSeconds((v) => !v)}
                  >
                    {showSeconds
                      ? t(i18n, "showcase.component.clock.labels.secondsOn")
                      : t(i18n, "showcase.component.clock.labels.secondsOff")}
                  </button>
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
            <div className="grid gap-4 md:grid-cols-3">
              <SgClock variant="digital" size="sm" timezone={timezone} format={format} />
              <SgClock variant="digital" size="md" timezone={timezone} format={format} />
              <SgClock variant="digital" size="lg" timezone={timezone} format={format} />
            </div>
            <div className="mt-6">
              <CodeBlockBase
                code={`import { SgClock, SgTimeProvider } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <SgClock variant="digital" size="sm" timezone="America/Sao_Paulo" format="24h" />
      <SgClock variant="digital" size="md" timezone="America/Sao_Paulo" format="24h" />
      <SgClock variant="digital" size="lg" timezone="America/Sao_Paulo" format="24h" />
    </SgTimeProvider>
  );
}`}
              />
            </div>
          </Section>

          <Section
            title={t(i18n, "showcase.component.clock.sections.timezone.title")}
            description={t(i18n, "showcase.component.clock.sections.timezone.description")}
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => setTimezone("America/Sao_Paulo")}
              >
                Sao Paulo
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => setTimezone("Europe/Lisbon")}
              >
                Lisboa
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => setTimezone("America/New_York")}
              >
                New York
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => setTimezone("Asia/Tokyo")}
              >
                Tokyo
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}
              >
                {format === "24h" ? "24h" : "12h"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SgClock variant="digital" size="lg" timezone={timezone} format={format} showSeconds />
              <SgClock variant="analog" size={220} themeId={themeId} timezone={timezone} showSeconds={false} />
            </div>
            <div className="mt-6">
              <CodeBlockBase
                code={`"use client";
import React from "react";
import { SgClock, SgTimeProvider } from "@seedgrid/fe-components";

export default function Example({ initialServerTime }) {
  const [timezone, setTimezone] = React.useState("America/Sao_Paulo");
  const [format, setFormat] = React.useState("24h");

  return (
    <SgTimeProvider initialServerTime={initialServerTime}>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTimezone("America/Sao_Paulo")}>Sao Paulo</button>
        <button onClick={() => setTimezone("Europe/Lisbon")}>Lisboa</button>
        <button onClick={() => setTimezone("America/New_York")}>New York</button>
        <button onClick={() => setTimezone("Asia/Tokyo")}>Tokyo</button>
        <button onClick={() => setFormat((v) => (v === "24h" ? "12h" : "24h"))}>
          {format === "24h" ? "24h" : "12h"}
        </button>
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
        </div>
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}
