"use client";

import * as React from "react";
import {
  SgButton,
  SgDiscardDigit,
  SgGrid,
  SgInputText,
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

const PAGE_VALUES = ["001", "002", "003", "004", "005"] as const;

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgDiscardDigit
    value={digit}
    color="#0f172a"
    font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
    backgroundColor="#f8fafc"
  />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Proximo (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Anterior (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Aleatorio</SgButton>
  </div>
</div>`;

const PAGES_CODE = `const PAGE_VALUES = ["001", "002", "003", "004", "005"] as const;
const [pageIndex, setPageIndex] = React.useState(0);

const current = PAGE_VALUES[pageIndex] ?? PAGE_VALUES[0];
const nextPage = () => setPageIndex((prev) => (prev + 1) % PAGE_VALUES.length);

<div className="space-y-3">
  <SgDiscardDigit
    value={current}
    color="#111827"
    font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
    backgroundColor="#fffef7"
    fontSize={58}
  />
  <SgButton size="sm" onClick={nextPage}>Descartar folha</SgButton>
</div>`;

const THEMES_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Papel branco</p>
    <SgDiscardDigit
      value="7"
      color="#0f172a"
      font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
      backgroundColor="#f8fafc"
    />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Papel ambar</p>
    <SgDiscardDigit
      value="7"
      color="#4a2d13"
      font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
      backgroundColor="#fff4d6"
    />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Papel azul frio</p>
    <SgDiscardDigit
      value="7"
      color="#0b2f50"
      font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
      backgroundColor="#e7f5ff"
    />
  </div>
</SgGrid>`;

const FONT_CODE = `<SgGrid columns={{ base: 1, md: 2 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Sans</p>
    <SgDiscardDigit
      value="42"
      color="#0f172a"
      font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
      backgroundColor="#f8fafc"
      fontSize={60}
    />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Serif</p>
    <SgDiscardDigit
      value="42"
      color="#1f2937"
      font={"\\"Merriweather\\", \\"Times New Roman\\", serif"}
      backgroundColor="#fffef7"
      fontSize={60}
    />
  </div>
</SgGrid>`;

const AUTO_CODE = `const [running, setRunning] = React.useState(false);
const [counter, setCounter] = React.useState("00");

React.useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setCounter((prev) => String((Number(prev) + 1) % 100).padStart(2, "0"));
  }, 950);
  return () => window.clearInterval(id);
}, [running]);

<div className="space-y-3">
  <SgDiscardDigit
    value={counter}
    color="#0f172a"
    font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
    backgroundColor="#f8fafc"
    fontSize={62}
    transitionMs={700}
    stackDepth={15}
  />
  <SgButton size="sm" onClick={() => setRunning((prev) => !prev)}>
    {running ? "Parar" : "Iniciar"}
  </SgButton>
</div>`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgDiscardDigit, SgGrid, SgInputText, SgSlider } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState("42");
  const [color, setColor] = React.useState("#0f172a");
  const [backgroundColor, setBackgroundColor] = React.useState("#f8fafc");
  const [font, setFont] = React.useState("\\"Inter\\", \\"Segoe UI\\", sans-serif");
  const [fontSize, setFontSize] = React.useState(64);
  const [transitionMs, setTransitionMs] = React.useState(640);
  const [stackDepth, setStackDepth] = React.useState(15);
  const [animateOnChange, setAnimateOnChange] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText id="discard-value" label="Value" value={value} onChange={setValue} />
        <SgInputText id="discard-font" label="Font" value={font} onChange={setFont} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText id="discard-color" label="Color" value={color} onChange={setColor} />
        <SgInputText id="discard-bg" label="BackgroundColor" value={backgroundColor} onChange={setBackgroundColor} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">fontSize: {fontSize}</p>
          <SgSlider id="discard-font-size" minValue={28} maxValue={96} value={fontSize} onChange={setFontSize} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">transitionMs: {transitionMs}</p>
          <SgSlider id="discard-transition" minValue={180} maxValue={1300} value={transitionMs} onChange={setTransitionMs} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">stackDepth: {stackDepth}</p>
          <SgSlider id="discard-depth" minValue={2} maxValue={24} value={stackDepth} onChange={setStackDepth} />
        </div>
      </SgGrid>

      <SgButton size="sm" onClick={() => setAnimateOnChange((prev) => !prev)}>
        {animateOnChange ? "Animacao: ON" : "Animacao: OFF"}
      </SgButton>

      <div className="rounded border border-border p-4">
        <SgDiscardDigit
          value={value}
          color={color}
          font={font}
          backgroundColor={backgroundColor}
          fontSize={fontSize}
          transitionMs={transitionMs}
          stackDepth={stackDepth}
          animateOnChange={animateOnChange}
        />
      </div>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Texto/numero exibido na folha do topo." },
  { prop: "color", type: "string", defaultValue: "\"#0f172a\"", description: "Cor do texto principal." },
  { prop: "font", type: "string", defaultValue: "-", description: "Fonte (font-family) usada no texto." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#f8fafc\"", description: "Cor de fundo das folhas." },
  { prop: "fontSize", type: "number", defaultValue: "64", description: "Tamanho da fonte em px (escala geral do bloco)." },
  { prop: "fontWeight", type: "number | string", defaultValue: "700", description: "Peso da fonte." },
  { prop: "animateOnChange", type: "boolean", defaultValue: "true", description: "Ativa animacao de descarte quando o valor muda." },
  { prop: "transitionMs", type: "number", defaultValue: "640", description: "Duracao total da animacao em ms." },
  { prop: "stackDepth", type: "number", defaultValue: "15", description: "Quantidade de folhas visiveis na pilha (2 a 24)." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Estilo inline adicional." }
];

export default function SgDiscardDigitShowcase() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  const [digit, setDigit] = React.useState("0");
  const [pageIndex, setPageIndex] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [counter, setCounter] = React.useState("00");

  const currentPage = PAGE_VALUES[pageIndex] ?? PAGE_VALUES[0];

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);
  const nextPage = React.useCallback(() => setPageIndex((prev) => (prev + 1) % PAGE_VALUES.length), []);

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setCounter((prev) => String((Number(prev) + 1) % 100).padStart(2, "0"));
    }, 950);
    return () => window.clearInterval(id);
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
          title="SgDiscardDigit"
          subtitle="Bloco de folhas com animacao 3D de descarte: folha do topo sai para baixo e revela a proxima."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Basico" description="Troca de valor com efeito de descarte da folha superior.">
          <div className="flex items-center gap-4">
            <SgDiscardDigit
              value={digit}
              color="#0f172a"
              font={"\"Inter\", \"Segoe UI\", sans-serif"}
              backgroundColor="#f8fafc"
            />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Proximo (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Anterior (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Aleatorio</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title="2) Folhas sequenciais" description="Cada clique descarta uma folha e revela a seguinte.">
          <div className="space-y-3">
            <SgDiscardDigit
              value={currentPage}
              color="#111827"
              font={"\"Inter\", \"Segoe UI\", sans-serif"}
              backgroundColor="#fffef7"
              fontSize={58}
            />
            <SgButton size="sm" onClick={nextPage}>Descartar folha</SgButton>
          </div>
          <CodeBlockBase code={PAGES_CODE} />
        </Section>

        <Section title="3) Variacoes de papel" description="Exemplos com color + backgroundColor diferentes.">
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Papel branco</p>
              <SgDiscardDigit
                value="7"
                color="#0f172a"
                font={"\"Inter\", \"Segoe UI\", sans-serif"}
                backgroundColor="#f8fafc"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Papel ambar</p>
              <SgDiscardDigit
                value="7"
                color="#4a2d13"
                font={"\"Inter\", \"Segoe UI\", sans-serif"}
                backgroundColor="#fff4d6"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Papel azul frio</p>
              <SgDiscardDigit
                value="7"
                color="#0b2f50"
                font={"\"Inter\", \"Segoe UI\", sans-serif"}
                backgroundColor="#e7f5ff"
              />
            </div>
          </SgGrid>
          <CodeBlockBase code={THEMES_CODE} />
        </Section>

        <Section title="4) Fontes" description="Comparacao de fontes no mesmo efeito de pilha.">
          <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Sans</p>
              <SgDiscardDigit
                value="42"
                color="#0f172a"
                font={"\"Inter\", \"Segoe UI\", sans-serif"}
                backgroundColor="#f8fafc"
                fontSize={60}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Serif</p>
              <SgDiscardDigit
                value="42"
                color="#1f2937"
                font={"\"Merriweather\", \"Times New Roman\", serif"}
                backgroundColor="#fffef7"
                fontSize={60}
              />
            </div>
          </SgGrid>
          <CodeBlockBase code={FONT_CODE} />
        </Section>

        <Section title="5) Auto descarte" description="Atualizacao continua para observar direcao aleatoria da folha descartada.">
          <div className="space-y-3">
            <SgDiscardDigit
              value={counter}
              color="#0f172a"
              font={"\"Inter\", \"Segoe UI\", sans-serif"}
              backgroundColor="#f8fafc"
              fontSize={62}
              transitionMs={700}
              stackDepth={15}
            />
            <SgButton size="sm" onClick={() => setRunning((prev) => !prev)}>
              {running ? "Parar" : "Iniciar"}
            </SgButton>
          </div>
          <CodeBlockBase code={AUTO_CODE} />
        </Section>

        <Section title="6) Playground (SgPlayground)" description="Ajuste em tempo real de color, font, backgroundColor e animacao.">
          <SgPlayground
            title="SgDiscardDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
