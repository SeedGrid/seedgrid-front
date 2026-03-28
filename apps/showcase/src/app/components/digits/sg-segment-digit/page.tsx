"use client";

import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSegmentDigit,
  SgSlider,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../../i18n";

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

type SegmentTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  propsReferenceTitle: string;
};

const TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", SegmentTexts> = {
  "pt-BR": {
    headerSubtitle: "Digito seven-segment em SVG no estilo classico do modo segment do SgClock.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca manual de digitos com controles.",
    section2Title: "2) Composicao estilo relogio",
    section2Description: "Composicao HH:MM:SS com separador ':' usando o proprio componente.",
    section3Title: "3) Tamanhos",
    section3Description: "Escala visual ajustando apenas a prop size.",
    section4Title: "4) Cores",
    section4Description: "Exemplos de color por digito.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Ajuste de value, size e color em tempo real.",
    propsReferenceTitle: "Referencia de Props"
  },
  "pt-PT": {
    headerSubtitle: "Digito seven-segment em SVG no estilo classico do modo segment do SgClock.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca manual de digitos com controlos.",
    section2Title: "2) Composicao estilo relogio",
    section2Description: "Composicao HH:MM:SS com separador ':' usando o proprio componente.",
    section3Title: "3) Tamanhos",
    section3Description: "Escala visual ajustando apenas a prop size.",
    section4Title: "4) Cores",
    section4Description: "Exemplos de color por digito.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Ajuste de value, size e color em tempo real.",
    propsReferenceTitle: "Referencia de Props"
  },
  "en-US": {
    headerSubtitle: "Classic SVG seven-segment digit used by the segment mode in SgClock.",
    section1Title: "1) Basic (0-9)",
    section1Description: "Manual digit switching with controls.",
    section2Title: "2) Clock-style composition",
    section2Description: "HH:MM:SS composition where ':' is rendered by the same component.",
    section3Title: "3) Sizes",
    section3Description: "Visual scale controlled only by the size prop.",
    section4Title: "4) Colors",
    section4Description: "Color examples per digit.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Tune value, size, and color in real time.",
    propsReferenceTitle: "Props Reference"
  },
  es: {
    headerSubtitle: "Digito seven-segment en SVG con estilo clasico del modo segment de SgClock.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Cambio manual de digitos con controles.",
    section2Title: "2) Composicion estilo reloj",
    section2Description: "Composicion HH:MM:SS donde ':' se renderiza con el mismo componente.",
    section3Title: "3) Tamanos",
    section3Description: "Escala visual ajustando solo la prop size.",
    section4Title: "4) Colores",
    section4Description: "Ejemplos de color por digito.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Ajuste de value, size y color en tiempo real.",
    propsReferenceTitle: "Referencia de Props"
  }
};

type SupportedLocale = keyof typeof TEXTS;

function isSupportedLocale(locale: ShowcaseLocale): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getTexts(locale: ShowcaseLocale): SegmentTexts {
  const normalized: SupportedLocale = isSupportedLocale(locale) ? locale : "en-US";
  return TEXTS[normalized];
}

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgSegmentDigit value={digit} size={64} />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
  </div>
</div>`;

const CLOCK_CODE = `const [seconds, setSeconds] = React.useState(0);
const total = seconds % 86400;
const h = Math.floor(total / 3600);
const m = Math.floor((total % 3600) / 60);
const s = total % 60;
const pad = (n) => String(n).padStart(2, "0");
const hh = pad(h);
const mm = pad(m);
const ss = pad(s);

<div className="space-y-4">
  <div className="flex items-end gap-1">
    <SgSegmentDigit value={hh[0] ?? "0"} size={36} />
    <SgSegmentDigit value={hh[1] ?? "0"} size={36} />
    <SgSegmentDigit value=":" size={36} />
    <SgSegmentDigit value={mm[0] ?? "0"} size={36} />
    <SgSegmentDigit value={mm[1] ?? "0"} size={36} />
    <SgSegmentDigit value=":" size={36} />
    <SgSegmentDigit value={ss[0] ?? "0"} size={36} />
    <SgSegmentDigit value={ss[1] ?? "0"} size={36} />
  </div>
  <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
</div>`;

const SIZES_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Small</p>
    <SgSegmentDigit value="8" size={18} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medium</p>
    <SgSegmentDigit value="8" size={32} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Large</p>
    <SgSegmentDigit value="8" size={52} />
  </div>
</SgGrid>`;

const COLORS_CODE = `<SgGrid columns={{ base: 1, md: 5 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Default</p>
    <SgSegmentDigit value="8" size={42} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Blue</p>
    <SgSegmentDigit value="8" size={42} color="#3b82f6" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Yellow</p>
    <SgSegmentDigit value="8" size={42} color="#eab308" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Green</p>
    <SgSegmentDigit value="8" size={42} color="#22c55e" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">White</p>
    <div className="inline-block rounded bg-neutral-900 p-1">
      <SgSegmentDigit value="8" size={42} color="#f8fafc" />
    </div>
  </div>
</SgGrid>`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSegmentDigit,
  SgSlider,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [value, setValue] = React.useState("8");
  const [size, setSize] = React.useState(42);
  const [color, setColor] = React.useState("#111827");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText id="segment-value" label="Value" value={value} onChange={setValue} />
        <SgInputText id="segment-color" label="Color" value={color} onChange={setColor} />
      </SgGrid>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">size: {size}</p>
        <SgSlider id="segment-size" minValue={12} maxValue={84} value={size} onChange={setSize} />
      </div>

      <div className="rounded border border-border p-4">
        <SgSegmentDigit value={value} size={size} color={color} />
      </div>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Character rendered by the component (first character is used)." },
  { prop: "size", type: "number", defaultValue: "16", description: "Display height in pixels." },
  { prop: "color", type: "string", defaultValue: "-", description: "Color of active segments." },
  { prop: "className", type: "string", defaultValue: "-", description: "Extra CSS classes on outer wrapper." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Additional inline styles on outer wrapper." }
];

export default function SgSegmentDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [digit, setDigit] = React.useState("0");
  const [seconds, setSeconds] = React.useState(0);

  const total = seconds % 86400;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(h);
  const mm = pad(m);
  const ss = pad(s);

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSegmentDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgSegmentDigit value={digit} size={64} />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Next (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Previous (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Random</SgButton>
            </div>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-segment-digit/samples/basico-0-9.tsx.sample" />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="space-y-4">
            <div className="flex items-end gap-1">
              <SgSegmentDigit value={hh[0] ?? "0"} size={36} />
              <SgSegmentDigit value={hh[1] ?? "0"} size={36} />
              <SgSegmentDigit value=":" size={36} />
              <SgSegmentDigit value={mm[0] ?? "0"} size={36} />
              <SgSegmentDigit value={mm[1] ?? "0"} size={36} />
              <SgSegmentDigit value=":" size={36} />
              <SgSegmentDigit value={ss[0] ?? "0"} size={36} />
              <SgSegmentDigit value={ss[1] ?? "0"} size={36} />
            </div>
            <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-segment-digit/samples/composicao-estilo-relogio.tsx.sample" />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Small</p>
              <SgSegmentDigit value="8" size={18} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medium</p>
              <SgSegmentDigit value="8" size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Large</p>
              <SgSegmentDigit value="8" size={52} />
            </div>
          </SgGrid>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-segment-digit/samples/tamanhos.tsx.sample" />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgGrid columns={{ base: 1, md: 5 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Default</p>
              <SgSegmentDigit value="8" size={42} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Blue</p>
              <SgSegmentDigit value="8" size={42} color="#3b82f6" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Yellow</p>
              <SgSegmentDigit value="8" size={42} color="#eab308" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Green</p>
              <SgSegmentDigit value="8" size={42} color="#22c55e" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">White</p>
              <div className="inline-block rounded bg-neutral-900 p-1">
                <SgSegmentDigit value="8" size={42} color="#f8fafc" />
              </div>
            </div>
          </SgGrid>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-segment-digit/samples/cores.tsx.sample" />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
          <SgPlayground
            title="SgSegmentDigit Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/digits/sg-segment-digit/sg-segment-digit.tsx.playground"
            height={540}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


