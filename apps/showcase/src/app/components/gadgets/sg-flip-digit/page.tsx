"use client";

import * as React from "react";
import { SgButton, SgFlipDigit, SgGrid, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";

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

const BASIC_EXAMPLE_CODE = `const [digit, setDigit] = React.useState("0");

const nextDigit = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prevDigit = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const randomDigit = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgFlipDigit value={digit} />
  <div className="flex flex-col gap-2">
    <SgButton onClick={nextDigit} size="sm">Proximo (+1)</SgButton>
    <SgButton onClick={prevDigit} size="sm" severity="secondary">Anterior (-1)</SgButton>
    <SgButton onClick={randomDigit} size="sm" severity="info">Aleatorio</SgButton>
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
    <p className="mb-2 text-xs text-muted-foreground">Pequeno</p>
    <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medio</p>
    <SgFlipDigit value={digit} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Grande</p>
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
        <SgButton size="sm" appearance="outline" onClick={random}>Aleatorio</SgButton>
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
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
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
          subtitle="Componente de flip animado para exibicao de digitos e caracteres unicos."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title="Basico (0-9)"
          description="Incremento, decremento e valor aleatorio."
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={digit} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">Proximo (+1)</SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">Anterior (-1)</SgButton>
              <SgButton onClick={randomDigit} size="sm" severity="info">Aleatorio</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_EXAMPLE_CODE} />
        </Section>

        <Section
          title="Letras (A-Z)"
          description="Tambem aceita caracteres alfabeticos."
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={letter} />
            <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
          </div>
          <CodeBlockBase code={LETTER_EXAMPLE_CODE} />
        </Section>

        <Section
          title="Variacoes de tamanho"
          description="Ajuste de width, height e fontSize."
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Pequeno</p>
              <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Medio</p>
              <SgFlipDigit value={digit} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Grande</p>
              <SgFlipDigit value={digit} width={120} height={180} fontSize={120} />
            </div>
          </div>
          <CodeBlockBase code={SIZE_EXAMPLE_CODE} />
        </Section>

        <Section
          title="Sequencia estilo relogio"
          description="Composicao de varios SgFlipDigit em linha."
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
          title="Auto increment"
          description="Atualizacao automatica para validar transicao continua."
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
          title="Playground"
          description="Teste as props principais em tempo real."
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

        <ShowcasePropsReference rows={FLIP_DIGIT_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
