"use client";

import React from "react";
import {
  SgClockThemeProvider,
  SgClockThemePicker,
  SgClock,
  SgTimeProvider,
  registerTheme,
  type SgClockTheme
} from "@seedgrid/fe-components";
import sgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../../i18n";

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

function ClockWithPicker() {
  const now = new Date().toISOString();
  const [themeId, setThemeId] = React.useState("classic");

  return (
    <SgTimeProvider initialServerTime={now}>
      <SgClockThemeProvider>
        <div className="flex flex-col items-center gap-4">
          <SgClock themeId={themeId} />
          <SgClockThemePicker value={themeId} onChange={setThemeId} />
        </div>
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}

const CLOCK_THEME_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "value.mode", type: '"fallback" | "strict"', defaultValue: '"fallback"', description: 'Em "fallback", temas nao encontrados usam o fallbackThemeId. Em "strict", retornam null.' },
  { prop: "value.fallbackThemeId", type: "string", defaultValue: '"classic"', description: "ID do tema usado quando o tema solicitado nao existe (apenas no modo fallback)." },
  { prop: "value.themes", type: "SgClockTheme[]", defaultValue: "[]", description: "Lista de temas locais disponibilizados para este provider. Complementam os temas globais registrados via registerTheme." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore que vai resolver temas via useSgClockThemeResolver." }
];

export default function SgClockThemeProviderPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.clockThemeProvider.title")}
          subtitle={t(i18n, "showcase.component.clockThemeProvider.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.clockThemeProvider.sections.basic.title")}
          description={t(i18n, "showcase.component.clockThemeProvider.sections.basic.description")}
        >
          <ClockWithPicker />
          <CodeBlock
            code={`import React from "react";
import {
  SgClockThemeProvider,
  SgClockThemePicker,
  SgClock,
  SgTimeProvider
} from "@seedgrid/fe-components";

export default function App() {
  const [themeId, setThemeId] = React.useState("classic");

  return (
    <SgTimeProvider initialServerTime={new Date().toISOString()}>
      <SgClockThemeProvider>
        <SgClock themeId={themeId} />
        <SgClockThemePicker value={themeId} onChange={setThemeId} />
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.component.clockThemeProvider.sections.custom.title")}
          description={t(i18n, "showcase.component.clockThemeProvider.sections.custom.description")}
        >
          <CodeBlock
            code={`import { SgClockThemeProvider, SgClock, SgTimeProvider } from "@seedgrid/fe-components";
import type { SgClockTheme } from "@seedgrid/fe-components";

const myTheme: SgClockTheme = {
  id: "neon-green",
  label: "Neon Green",
  order: 100,
  render: ({ now }) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());

    return (
      <div style={{
        fontFamily: "monospace",
        fontSize: 48,
        color: "#00ff41",
        textShadow: "0 0 10px #00ff41",
        background: "#000",
        padding: "16px 24px",
        borderRadius: 8
      }}>
        {h}:{m}:{s}
      </div>
    );
  }
};

export default function App() {
  return (
    <SgTimeProvider initialServerTime={new Date().toISOString()}>
      <SgClockThemeProvider value={{ themes: [myTheme] }}>
        <SgClock themeId="neon-green" />
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}`}
          />
        </Section>

        <Section
          title={t(i18n, "showcase.component.clockThemeProvider.sections.global.title")}
          description={t(i18n, "showcase.component.clockThemeProvider.sections.global.description")}
        >
          <CodeBlock
            code={`import { registerTheme } from "@seedgrid/fe-components";
import type { SgClockTheme } from "@seedgrid/fe-components";

// Registra globalmente — disponivel para todos os SgClockThemeProvider
const myTheme: SgClockTheme = {
  id: "my-theme",
  label: "My Theme",
  order: 50,
  render: ({ now }) => <div>{now.toLocaleTimeString()}</div>
};

registerTheme(myTheme);

// Depois use normalmente em qualquer SgClock sem precisar passar para o provider
// <SgClock themeId="my-theme" />`}
          />
        </Section>

        <ShowcasePropsReference rows={CLOCK_THEME_PROVIDER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
