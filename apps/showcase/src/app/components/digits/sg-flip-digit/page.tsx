"use client";

import * as React from "react";
import { SgButton, SgFlipDigit, SgGrid, SgPlayground } from "@seedgrid/fe-components";
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

type FlipDigitTexts = {
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
  section6Title: string;
  section6Description: string;
  propsReferenceTitle: string;
};

const FLIP_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", FlipDigitTexts> = {
  "pt-BR": {
    headerSubtitle: "Animated flip component for displaying digits and single characters.",
    section1Title: "Basico (0-9)",
    section1Description: "Increment, decrement, and random value.",
    section2Title: "Letras (A-Z)",
    section2Description: "Tambem aceita caracteres alfabeticos.",
    section3Title: "Variacoes de tamanho",
    section3Description: "Ajuste de width, height e fontSize.",
    section4Title: "Sequencia estilo relogio",
    section4Description: "Composition of multiple SgFlipDigit in a row.",
    section5Title: "Auto increment",
    section5Description: "Atualizacao automatica para validar transicao continua.",
    section6Title: "Playground",
    section6Description: "Teste as props principais em tempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
  "pt-PT": {
    headerSubtitle: "Animated flip component for displaying digits and single characters.",
    section1Title: "Basico (0-9)",
    section1Description: "Increment, decrement, and random value.",
    section2Title: "Letras (A-Z)",
    section2Description: "Tambem aceita caracteres alfabeticos.",
    section3Title: "Variacoes de tamanho",
    section3Description: "Ajuste de width, height e fontSize.",
    section4Title: "Sequencia estilo relogio",
    section4Description: "Composition of multiple SgFlipDigit in a row.",
    section5Title: "Auto increment",
    section5Description: "Atualizacao automatica para validar transicao continua.",
    section6Title: "Playground",
    section6Description: "Teste as props principais em tempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
  "en-US": {
    headerSubtitle: "Animated flip component for displaying digits and single characters.",
    section1Title: "Basic (0-9)",
    section1Description: "Increment, decrement, and random value.",
    section2Title: "Letters (A-Z)",
    section2Description: "Also accepts alphabetic characters.",
    section3Title: "Size variations",
    section3Description: "Adjust width, height, and fontSize.",
    section4Title: "Clock-style sequence",
    section4Description: "Compose multiple SgFlipDigit in a row.",
    section5Title: "Auto increment",
    section5Description: "Automatic updates to validate continuous transition.",
    section6Title: "Playground",
    section6Description: "Test the main props in real time.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Componente flip animado para mostrar digitos y caracteres unicos.",
    section1Title: "Basico (0-9)",
    section1Description: "Incremento, decremento y valor aleatorio.",
    section2Title: "Letras (A-Z)",
    section2Description: "Tambien acepta caracteres alfabeticos.",
    section3Title: "Variaciones de tamano",
    section3Description: "Ajuste de width, height y fontSize.",
    section4Title: "Secuencia estilo reloj",
    section4Description: "Composicion de varios SgFlipDigit en linea.",
    section5Title: "Auto incremento",
    section5Description: "Actualizacion automatica para validar transicion continua.",
    section6Title: "Playground",
    section6Description: "Prueba las props principales en tiempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedFlipLocale = keyof typeof FLIP_TEXTS;

function isSupportedFlipLocale(locale: ShowcaseLocale): locale is SupportedFlipLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getFlipTexts(locale: ShowcaseLocale): FlipDigitTexts {
  const normalized: SupportedFlipLocale = isSupportedFlipLocale(locale) ? locale : "en-US";
  return FLIP_TEXTS[normalized];
}

const BASIC_EXAMPLE_CODE = `const [digit, setDigit] = React.useState("0");

const nextDigit = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prevDigit = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const randomDigit = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgFlipDigit value={digit} />
  <div className="flex flex-col gap-2">
    <SgButton onClick={nextDigit} size="sm">Next (+1)</SgButton>
    <SgButton onClick={prevDigit} size="sm" severity="secondary">Previous (-1)</SgButton>
    <SgButton onClick={randomDigit} size="sm" severity="info">Random</SgButton>
  </div>
</div>`;

const LETTER_EXAMPLE_CODE = `const [letter, setLetter] = React.useState("A");

const nextLetter = () => {
  const current = letter.charCodeAt(0);
  const next = current >= 90 ? 65 : current + 1;
  setLetter(String.fromCharCode(next));
};

<div className="flex items-center gap-4">
  <SgFlipDigit value={letter} />
  <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
</div>`;

const SIZE_EXAMPLE_CODE = `<div className="flex items-center gap-6">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Small</p>
    <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medium</p>
    <SgFlipDigit value={digit} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Large</p>
    <SgFlipDigit value={digit} width={120} height={180} fontSize={120} />
  </div>
</div>`;

const SEQUENCE_EXAMPLE_CODE = `<div className="flex items-center gap-2">
  <SgFlipDigit value={digit} />
  <SgFlipDigit value={String((Number(digit) + 1) % 10)} />
  <span className="mx-2 text-4xl font-bold">:</span>
  <SgFlipDigit value={String((Number(digit) + 2) % 10)} />
  <SgFlipDigit value={String((Number(digit) + 3) % 10)} />
</div>`;

const AUTO_EXAMPLE_CODE = `const [running, setRunning] = React.useState(false);
const [autoDigit, setAutoDigit] = React.useState("0");

React.useEffect(() => {
  if (!running) return;
  const timer = window.setInterval(() => {
    setAutoDigit((prev) => String((Number(prev) + 1) % 10));
  }, 1300);
  return () => window.clearInterval(timer);
}, [running]);

<div className="flex items-center gap-4">
  <SgFlipDigit value={autoDigit} />
  <SgButton onClick={() => setRunning((prev) => !prev)}>{running ? "Parar" : "Iniciar"}</SgButton>
</div>`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgButton, SgFlipDigit, SgGrid } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState("5");
  const [width, setWidth] = React.useState(80);
  const [height, setHeight] = React.useState(120);
  const [fontSize, setFontSize] = React.useState(70);

  const next = () => setValue((prev) => String((Number(prev) + 1) % 10));
  const random = () => setValue(String(Math.floor(Math.random() * 10)));

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" onClick={next}>+1</SgButton>
        <SgButton size="sm" appearance="outline" onClick={random}>Random</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("A")}>A</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("Z")}>Z</SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
        <label className="text-xs">
          Width ({width})
          <input className="mt-1 w-full" type="range" min={40} max={160} step={2} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
        <label className="text-xs">
          Height ({height})
          <input className="mt-1 w-full" type="range" min={60} max={220} step={2} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </label>
        <label className="text-xs">
          Font ({fontSize})
          <input className="mt-1 w-full" type="range" min={30} max={150} step={2} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
        </label>
      </SgGrid>

      <div className="rounded border border-border p-4">
        <SgFlipDigit value={value} width={width} height={height} fontSize={fontSize} />
      </div>
    </div>
  );
}`;

const FLIP_DIGIT_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Caractere exibido no card flip (1 char recomendado)." },
  { prop: "width", type: "number", defaultValue: "80", description: "Largura do card em pixels." },
  { prop: "height", type: "number", defaultValue: "120", description: "Altura do card em pixels." },
  { prop: "fontSize", type: "number", defaultValue: "70", description: "Tamanho da fonte em pixels." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais no container." }
];

export default function SgFlipDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getFlipTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const [digit, setDigit] = React.useState("0");
  const [letter, setLetter] = React.useState("A");
  const [running, setRunning] = React.useState(false);
  const [autoDigit, setAutoDigit] = React.useState("0");

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);

  const nextLetter = React.useCallback(() => {
    const current = letter.charCodeAt(0);
    const next = current >= 90 ? 65 : current + 1;
    setLetter(String.fromCharCode(next));
  }, [letter]);

  React.useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setAutoDigit((prev) => String((Number(prev) + 1) % 10));
    }, 1300);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgFlipDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={texts.section1Title}
          description={texts.section1Description}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={digit} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">Next (+1)</SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">Previous (-1)</SgButton>
              <SgButton onClick={randomDigit} size="sm" severity="info">Random</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_EXAMPLE_CODE} />
        </Section>

        <Section
          title={texts.section2Title}
          description={texts.section2Description}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={letter} />
            <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
          </div>
          <CodeBlockBase code={LETTER_EXAMPLE_CODE} />
        </Section>

        <Section
          title={texts.section3Title}
          description={texts.section3Description}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Small</p>
              <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Medium</p>
              <SgFlipDigit value={digit} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Large</p>
              <SgFlipDigit value={digit} width={120} height={180} fontSize={120} />
            </div>
          </div>
          <CodeBlockBase code={SIZE_EXAMPLE_CODE} />
        </Section>

        <Section
          title={texts.section4Title}
          description={texts.section4Description}
        >
          <div className="flex items-center gap-2">
            <SgFlipDigit value={digit} />
            <SgFlipDigit value={String((Number(digit) + 1) % 10)} />
            <span className="mx-2 text-4xl font-bold">:</span>
            <SgFlipDigit value={String((Number(digit) + 2) % 10)} />
            <SgFlipDigit value={String((Number(digit) + 3) % 10)} />
          </div>
          <CodeBlockBase code={SEQUENCE_EXAMPLE_CODE} />
        </Section>

        <Section
          title={texts.section5Title}
          description={texts.section5Description}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={autoDigit} />
            <SgButton onClick={() => setRunning((prev) => !prev)}>
              {running ? "Parar" : "Iniciar"}
            </SgButton>
          </div>
          <CodeBlockBase code={AUTO_EXAMPLE_CODE} />
        </Section>

        <Section
          title={texts.section6Title}
          description={texts.section6Description}
        >
          <SgPlayground
            title="SgFlipDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_APP_FILE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={FLIP_DIGIT_PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

