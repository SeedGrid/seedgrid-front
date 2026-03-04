"use client";

import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgMatrixDigit,
  SgPlayground,
  SgSlider
} from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
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

type MatrixDigitTexts = {
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

const MATRIX_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", MatrixDigitTexts> = {
  "pt-BR": {
    headerSubtitle: "Componente de caracteres matriciais em pontos, com suporte a color e backgroundColor.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca de digitos com botoes de controle.",
    section2Title: "2) Texto matricial",
    section2Description: "Exibicao de texto com letras, numeros e simbolos.",
    section3Title: "3) Variacoes de color/backgroundColor",
    section3Description: "Visual theme examples.",
    section4Title: "4) Escala da matriz",
    section4Description: "Ajuste de dotSize, gap e charGap.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Teste em tempo real as props principais.",
    propsReferenceTitle: "Referencia de Props",
  },
  "pt-PT": {
    headerSubtitle: "Componente de caracteres matriciais em pontos, com suporte a color e backgroundColor.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca de digitos com botoes de controlo.",
    section2Title: "2) Texto matricial",
    section2Description: "Exibicao de texto com letras, numeros e simbolos.",
    section3Title: "3) Variacoes de color/backgroundColor",
    section3Description: "Visual theme examples.",
    section4Title: "4) Escala da matriz",
    section4Description: "Ajuste de dotSize, gap e charGap.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Teste em tempo real as props principais.",
    propsReferenceTitle: "Referencia de Props",
  },
  "en-US": {
    headerSubtitle: "Dot-matrix character component with support for color and backgroundColor.",
    section1Title: "1) Basic (0-9)",
    section1Description: "Digit switching with control buttons.",
    section2Title: "2) Matrix text",
    section2Description: "Text rendering with letters, numbers, and symbols.",
    section3Title: "3) color/backgroundColor variants",
    section3Description: "Visual theme examples.",
    section4Title: "4) Matrix scale",
    section4Description: "Adjust dotSize, gap, and charGap.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Test the main props in real time.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Componente de caracteres matriciales por puntos, con soporte para color y backgroundColor.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Cambio de digitos con botones de control.",
    section2Title: "2) Texto matricial",
    section2Description: "Visualizacion de texto con letras, numeros y simbolos.",
    section3Title: "3) Variaciones de color/backgroundColor",
    section3Description: "Ejemplos de temas visuales.",
    section4Title: "4) Escala de la matriz",
    section4Description: "Ajuste de dotSize, gap y charGap.",
    section5Title: "5) Playground (SgPlayground)",
    section5Description: "Prueba en tiempo real las props principales.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedMatrixLocale = keyof typeof MATRIX_TEXTS;

function isSupportedMatrixLocale(locale: ShowcaseLocale): locale is SupportedMatrixLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getMatrixTexts(locale: ShowcaseLocale): MatrixDigitTexts {
  const normalized: SupportedMatrixLocale = isSupportedMatrixLocale(locale) ? locale : "en-US";
  return MATRIX_TEXTS[normalized];
}

const MESSAGES = ["SEEDGRID", "MATRIX 2026", "ABC-123"] as const;

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgMatrixDigit value={digit} color="#22d3ee" backgroundColor="#0b1220" />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
  </div>
</div>`;

const TEXT_CODE = `const MESSAGES = ["SEEDGRID", "MATRIX 2026", "ABC-123"] as const;
const [messageIndex, setMessageIndex] = React.useState(0);
const message = MESSAGES[messageIndex];

const nextMessage = () => setMessageIndex((prev) => (prev + 1) % MESSAGES.length);

<div className="space-y-3">
  <SgMatrixDigit
    value={message}
    color="#a3e635"
    backgroundColor="#06090f"
    dotSize={8}
    gap={2}
    charGap={6}
  />
  <SgButton size="sm" onClick={nextMessage}>Change text</SgButton>
</div>`;

const COLOR_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Ciano</p>
    <SgMatrixDigit value="2026" color="#22d3ee" backgroundColor="#0b1220" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Lime</p>
    <SgMatrixDigit value="HELLO" color="#a3e635" backgroundColor="#05070b" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Orange</p>
    <SgMatrixDigit value="SG" color="#fb923c" backgroundColor="#101826" />
  </div>
</SgGrid>`;

const SIZE_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Small</p>
    <SgMatrixDigit value="123" dotSize={6} gap={2} charGap={4} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medium</p>
    <SgMatrixDigit value="123" dotSize={9} gap={3} charGap={7} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Large</p>
    <SgMatrixDigit value="123" dotSize={13} gap={4} charGap={10} />
  </div>
</SgGrid>`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgGrid, SgInputText, SgMatrixDigit, SgSlider } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState("SEEDGRID");
  const [color, setColor] = React.useState("#22d3ee");
  const [backgroundColor, setBackgroundColor] = React.useState("#0b1220");
  const [dotSize, setDotSize] = React.useState(9);
  const [gap, setGap] = React.useState(3);
  const [charGap, setCharGap] = React.useState(7);

  return (
    <div className="space-y-4 p-2">
      <SgInputText id="matrix-value" label="Texto" value={value} onChange={setValue} />

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText id="matrix-color" label="Color" value={color} onChange={setColor} />
        <SgInputText id="matrix-bg" label="BackgroundColor" value={backgroundColor} onChange={setBackgroundColor} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">dotSize: {dotSize}</p>
          <SgSlider id="dot-size" minValue={4} maxValue={16} value={dotSize} onChange={setDotSize} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">gap: {gap}</p>
          <SgSlider id="dot-gap" minValue={1} maxValue={8} value={gap} onChange={setGap} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">charGap: {charGap}</p>
          <SgSlider id="char-gap" minValue={2} maxValue={14} value={charGap} onChange={setCharGap} />
        </div>
      </SgGrid>

      <div className="rounded border border-border p-4">
        <SgMatrixDigit
          value={value}
          color={color}
          backgroundColor={backgroundColor}
          dotSize={dotSize}
          gap={gap}
          charGap={charGap}
        />
      </div>
    </div>
  );
}`;

const MATRIX_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Text displayed in dot matrix." },
  { prop: "color", type: "string", defaultValue: "\"#22d3ee\"", description: "Color of active dots." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#0b1220\"", description: "Dot matrix panel background color." },
  { prop: "offColor", type: "string", defaultValue: "\"rgba(148, 163, 184, 0.22)\"", description: "Color of inactive dots." },
  { prop: "dotSize", type: "number", defaultValue: "9", description: "Size of each dot in pixels." },
  { prop: "gap", type: "number", defaultValue: "3", description: "Spacing between dots in pixels." },
  { prop: "charGap", type: "number", defaultValue: "7", description: "Spacing between characters in pixels." },
  { prop: "padding", type: "number", defaultValue: "8", description: "Internal panel padding in pixels." },
  { prop: "rounded", type: "number", defaultValue: "10", description: "Panel border radius in pixels." },
  { prop: "glow", type: "boolean", defaultValue: "true", description: "Enables glow on active dots." },
  { prop: "className", type: "string", defaultValue: "-", description: "Extra CSS classes on external container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Additional inline style on external container." }
];

export default function SgMatrixDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getMatrixTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const [digit, setDigit] = React.useState("0");
  const [messageIndex, setMessageIndex] = React.useState(0);
  const message = MESSAGES[messageIndex] ?? MESSAGES[0];

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);
  const nextMessage = React.useCallback(
    () => setMessageIndex((prev) => (prev + 1) % MESSAGES.length),
    []
  );

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMatrixDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgMatrixDigit value={digit} color="#22d3ee" backgroundColor="#0b1220" />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Next (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Previous (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Random</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="space-y-3">
            <SgMatrixDigit
              value={message}
              color="#a3e635"
              backgroundColor="#06090f"
              dotSize={8}
              gap={2}
              charGap={6}
            />
            <SgButton size="sm" onClick={nextMessage}>Change text</SgButton>
          </div>
          <CodeBlockBase code={TEXT_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Ciano</p>
              <SgMatrixDigit value="2026" color="#22d3ee" backgroundColor="#0b1220" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Lime</p>
              <SgMatrixDigit value="HELLO" color="#a3e635" backgroundColor="#05070b" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Orange</p>
              <SgMatrixDigit value="SG" color="#fb923c" backgroundColor="#101826" />
            </div>
          </SgGrid>
          <CodeBlockBase code={COLOR_CODE} />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Small</p>
              <SgMatrixDigit value="123" dotSize={6} gap={2} charGap={4} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medium</p>
              <SgMatrixDigit value="123" dotSize={9} gap={3} charGap={7} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Large</p>
              <SgMatrixDigit value="123" dotSize={13} gap={4} charGap={10} />
            </div>
          </SgGrid>
          <CodeBlockBase code={SIZE_CODE} />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
          <SgPlayground
            title="SgMatrixDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={MATRIX_PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

