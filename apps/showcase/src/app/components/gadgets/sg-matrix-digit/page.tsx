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

const MESSAGES = ["SEEDGRID", "MATRIX 2026", "ABC-123"] as const;

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgMatrixDigit value={digit} color="#22d3ee" backgroundColor="#0b1220" />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Proximo (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Anterior (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Aleatorio</SgButton>
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
  <SgButton size="sm" onClick={nextMessage}>Trocar texto</SgButton>
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
    <p className="text-xs text-muted-foreground">Laranja</p>
    <SgMatrixDigit value="SG" color="#fb923c" backgroundColor="#101826" />
  </div>
</SgGrid>`;

const SIZE_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Pequeno</p>
    <SgMatrixDigit value="123" dotSize={6} gap={2} charGap={4} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medio</p>
    <SgMatrixDigit value="123" dotSize={9} gap={3} charGap={7} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Grande</p>
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
  { prop: "value", type: "string", defaultValue: "-", description: "Texto exibido em matriz de pontos." },
  { prop: "color", type: "string", defaultValue: "\"#22d3ee\"", description: "Cor dos pontos ativos." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#0b1220\"", description: "Cor de fundo do painel matricial." },
  { prop: "offColor", type: "string", defaultValue: "\"rgba(148, 163, 184, 0.22)\"", description: "Cor dos pontos inativos." },
  { prop: "dotSize", type: "number", defaultValue: "9", description: "Tamanho de cada ponto em pixels." },
  { prop: "gap", type: "number", defaultValue: "3", description: "Espacamento entre pontos em pixels." },
  { prop: "charGap", type: "number", defaultValue: "7", description: "Espacamento entre caracteres em pixels." },
  { prop: "padding", type: "number", defaultValue: "8", description: "Padding interno do painel em pixels." },
  { prop: "rounded", type: "number", defaultValue: "10", description: "Raio de borda do painel em pixels." },
  { prop: "glow", type: "boolean", defaultValue: "true", description: "Liga brilho nos pontos ativos." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS extras no container externo." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Estilo inline adicional no container externo." }
];

export default function SgMatrixDigitShowcase() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
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
          subtitle="Componente de caracteres matriciais em pontos, com suporte a color e backgroundColor."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Basico (0-9)" description="Troca de digitos com botoes de controle.">
          <div className="flex items-center gap-4">
            <SgMatrixDigit value={digit} color="#22d3ee" backgroundColor="#0b1220" />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Proximo (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Anterior (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Aleatorio</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title="2) Texto matricial" description="Exibicao de texto com letras, numeros e simbolos.">
          <div className="space-y-3">
            <SgMatrixDigit
              value={message}
              color="#a3e635"
              backgroundColor="#06090f"
              dotSize={8}
              gap={2}
              charGap={6}
            />
            <SgButton size="sm" onClick={nextMessage}>Trocar texto</SgButton>
          </div>
          <CodeBlockBase code={TEXT_CODE} />
        </Section>

        <Section title="3) Variacoes de color/backgroundColor" description="Exemplos de temas visuais.">
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
              <p className="text-xs text-muted-foreground">Laranja</p>
              <SgMatrixDigit value="SG" color="#fb923c" backgroundColor="#101826" />
            </div>
          </SgGrid>
          <CodeBlockBase code={COLOR_CODE} />
        </Section>

        <Section title="4) Escala da matriz" description="Ajuste de dotSize, gap e charGap.">
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Pequeno</p>
              <SgMatrixDigit value="123" dotSize={6} gap={2} charGap={4} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medio</p>
              <SgMatrixDigit value="123" dotSize={9} gap={3} charGap={7} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Grande</p>
              <SgMatrixDigit value="123" dotSize={13} gap={4} charGap={10} />
            </div>
          </SgGrid>
          <CodeBlockBase code={SIZE_CODE} />
        </Section>

        <Section title="5) Playground (SgPlayground)" description="Teste em tempo real as props principais.">
          <SgPlayground
            title="SgMatrixDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={MATRIX_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

