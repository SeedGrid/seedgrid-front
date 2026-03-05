"use client";

import * as React from "react";
import { SgButton, SgFadeDigit, SgPlayground } from "@seedgrid/fe-components";
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
      <h2 data-anchor-title="true" className="text-lg font-semibold">
        {props.title}
      </h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Colon helper â€” matches the flip/fade clock aesthetic
// ---------------------------------------------------------------------------
type FadeDigitTexts = {
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
  section7Title: string;
  section7Description: string;
  propsReferenceTitle: string;
};

const FADE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", FadeDigitTexts> = {
  "pt-BR": {
    headerSubtitle:
      'Card animado que "apaga" o digito atual e "acende" o novo - efeito de lampada ou tubo nixie. Sem bibliotecas externas; animacao 100% CSS + React.',
    section1Title: "Basico (0-9)",
    section1Description: "Troca manual entre digitos numericos.",
    section2Title: "Letras (A-Z)",
    section2Description: "Aceita qualquer caractere - letras, simbolos, espacos.",
    section3Title: "Cores customizadas",
    section3Description: "color e backgroundColor sao totalmente livres - qualquer paleta funciona.",
    section4Title: "Auto increment",
    section4Description: "Incremento automatico para validar transicoes continuas e rapidas.",
    section5Title: "Sequencia estilo relogio",
    section5Description:
      "Composicao de varios SgFadeDigit em linha - cada digito atualiza de forma independente.",
    section6Title: "Tamanhos",
    section6Description: "Scale adjustment via fontSize prop - card width and height are proportional.",
    section7Title: "Playground",
    section7Description: "Interactive clock with color palette and configurable fontSize.",
    propsReferenceTitle: "Referência de Props",
  },
  "pt-PT": {
    headerSubtitle:
      'Card animado que "apaga" o digito atual e "acende" o novo - efeito de lampada ou tubo nixie. Sem bibliotecas externas; animacao 100% CSS + React.',
    section1Title: "Basico (0-9)",
    section1Description: "Troca manual entre digitos numericos.",
    section2Title: "Letras (A-Z)",
    section2Description: "Aceita qualquer caractere - letras, simbolos, espacos.",
    section3Title: "Cores customizadas",
    section3Description: "color e backgroundColor sao totalmente livres - qualquer paleta funciona.",
    section4Title: "Auto increment",
    section4Description: "Incremento automatico para validar transicoes continuas e rapidas.",
    section5Title: "Sequencia estilo relogio",
    section5Description:
      "Composicao de varios SgFadeDigit em linha - cada digito atualiza de forma independente.",
    section6Title: "Tamanhos",
    section6Description: "Scale adjustment via fontSize prop - card width and height are proportional.",
    section7Title: "Playground",
    section7Description: "Interactive clock with color palette and configurable fontSize.",
    propsReferenceTitle: "Referência de Props",
  },
  "en-US": {
    headerSubtitle:
      'Animated card that "turns off" the current digit and "turns on" the new one - lamp or nixie-tube style effect. No external libraries; animation is 100% CSS + React.',
    section1Title: "Basic (0-9)",
    section1Description: "Manual switching between numeric digits.",
    section2Title: "Letters (A-Z)",
    section2Description: "Accepts any character - letters, symbols, and spaces.",
    section3Title: "Custom colors",
    section3Description: "color and backgroundColor are fully customizable - any palette works.",
    section4Title: "Auto increment",
    section4Description: "Automatic increment to validate fast and continuous transitions.",
    section5Title: "Clock-style sequence",
    section5Description:
      "Composition with multiple SgFadeDigit in a row - each digit updates independently.",
    section6Title: "Sizes",
    section6Description: "Scale control via fontSize prop - card width and height stay proportional.",
    section7Title: "Playground",
    section7Description: "Interactive clock with configurable color palette and fontSize.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle:
      'Tarjeta animada que "apaga" el digito actual y "enciende" el nuevo - efecto tipo lampara o tubo nixie. Sin librerias externas; animacion 100% CSS + React.',
    section1Title: "Basico (0-9)",
    section1Description: "Cambio manual entre digitos numericos.",
    section2Title: "Letras (A-Z)",
    section2Description: "Acepta cualquier caracter - letras, simbolos y espacios.",
    section3Title: "Colores personalizados",
    section3Description: "color y backgroundColor son totalmente libres - cualquier paleta funciona.",
    section4Title: "Auto incremento",
    section4Description: "Incremento automatico para validar transiciones continuas y rapidas.",
    section5Title: "Secuencia estilo reloj",
    section5Description:
      "Composicion de varios SgFadeDigit en linea - cada digito se actualiza de forma independiente.",
    section6Title: "Tamanos",
    section6Description:
      "Ajuste de escala mediante la prop fontSize - ancho y alto de la tarjeta proporcionales.",
    section7Title: "Playground",
    section7Description: "Reloj interactivo con paleta de colores y fontSize configurable.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedFadeLocale = keyof typeof FADE_TEXTS;

function isSupportedFadeLocale(locale: ShowcaseLocale): locale is SupportedFadeLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getFadeTexts(locale: ShowcaseLocale): FadeDigitTexts {
  const normalized: SupportedFadeLocale = isSupportedFadeLocale(locale) ? locale : "en-US";
  return FADE_TEXTS[normalized];
}

function Colon({ height }: { height: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      style={{ height }}
    >
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 1 â€” Basico (0-9)
// ---------------------------------------------------------------------------
const EX1_CODE = `const [digit, setDigit] = React.useState("0");

const next   = () => setDigit((p) => String((Number(p) + 1) % 10));
const prev   = () => setDigit((p) => String((Number(p) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgFadeDigit value={digit} />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
  </div>
</div>`;

function Ex1() {
  const [digit, setDigit] = React.useState("0");
  const next = () => setDigit((p) => String((Number(p) + 1) % 10));
  const prev = () => setDigit((p) => String((Number(p) - 1 + 10) % 10));
  const random = () => setDigit(String(Math.floor(Math.random() * 10)));
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={digit} />
      <div className="flex flex-col gap-2">
        <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
        <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
        <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 2 â€” Letras (A-Z)
// ---------------------------------------------------------------------------
const EX2_CODE = `const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const [letter, setLetter] = React.useState("A");

const nextLetter = () => {
  const i = ALPHA.indexOf(letter);
  const next = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
  setLetter(next);
};

<div className="flex items-center gap-4">
  <SgFadeDigit value={letter} />
  <SgButton size="sm" onClick={nextLetter}>Proxima letra</SgButton>
</div>`;

const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

function Ex2() {
  const [letter, setLetter] = React.useState("A");
  const nextLetter = () => {
    const i = ALPHA.indexOf(letter);
    const next = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
    setLetter(next);
  };
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={letter} />
      <SgButton size="sm" onClick={nextLetter}>Proxima letra</SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 3 â€” Cores customizadas
// ---------------------------------------------------------------------------
const EX3_CODE = `{/* Cada cartao usa color + backgroundColor independentes */}
<div className="flex flex-wrap items-center gap-4">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Padrao</p>
    <SgFadeDigit value="7" color="#edebeb" backgroundColor="#333232" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Verde</p>
    <SgFadeDigit value="7" color="#4ade80" backgroundColor="#052e16" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Azul</p>
    <SgFadeDigit value="7" color="#60a5fa" backgroundColor="#0f172a" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Rosa</p>
    <SgFadeDigit value="7" color="#f472b6" backgroundColor="#2d0a1e" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Ambar</p>
    <SgFadeDigit value="7" color="#fbbf24" backgroundColor="#1c1007" />
  </div>
</div>`;

function Ex3() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Padrao</p>
        <SgFadeDigit value="7" color="#edebeb" backgroundColor="#333232" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Verde</p>
        <SgFadeDigit value="7" color="#4ade80" backgroundColor="#052e16" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Azul</p>
        <SgFadeDigit value="7" color="#60a5fa" backgroundColor="#0f172a" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Rosa</p>
        <SgFadeDigit value="7" color="#f472b6" backgroundColor="#2d0a1e" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Ambar</p>
        <SgFadeDigit value="7" color="#fbbf24" backgroundColor="#1c1007" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 4 â€” Auto increment
// ---------------------------------------------------------------------------
const EX4_CODE = `const [running, setRunning] = React.useState(false);
const [counter, setCounter] = React.useState("0");

React.useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setCounter((p) => String((Number(p) + 1) % 10));
  }, 800);
  return () => window.clearInterval(id);
}, [running]);

<div className="flex items-center gap-4">
  <SgFadeDigit value={counter} />
  <SgButton onClick={() => setRunning((p) => !p)}>
    {running ? "Parar" : "Iniciar"}
  </SgButton>
</div>`;

function Ex4() {
  const [running, setRunning] = React.useState(false);
  const [counter, setCounter] = React.useState("0");
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setCounter((p) => String((Number(p) + 1) % 10));
    }, 800);
    return () => window.clearInterval(id);
  }, [running]);
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={counter} />
      <SgButton onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar"}
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 5 â€” Sequencia estilo relogio
// ---------------------------------------------------------------------------
const CARD_H_70 = Math.round(70 * 1.38); // matches default fontSize=70

const EX5_CODE = `const [running, setRunning] = React.useState(false);
const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });

React.useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setTime((prev) => {
      const s = (prev.s + 1) % 60;
      const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
      const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
      return { h, m, s };
    });
  }, 1000);
  return () => window.clearInterval(id);
}, [running]);

const pad = (n: number) => String(n).padStart(2, "0");
const CARD_H = Math.round(70 * 1.38); // card height at fontSize=70

const Colon = () => (
  <div className="flex flex-col items-center justify-center gap-2" style={{ height: CARD_H }}>
    <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
  </div>
);

<div className="flex flex-col gap-4">
  <div className="flex items-center gap-2">
    <SgFadeDigit value={pad(time.h).charAt(0)} />
    <SgFadeDigit value={pad(time.h).charAt(1)} />
    <Colon />
    <SgFadeDigit value={pad(time.m).charAt(0)} />
    <SgFadeDigit value={pad(time.m).charAt(1)} />
    <Colon />
    <SgFadeDigit value={pad(time.s).charAt(0)} />
    <SgFadeDigit value={pad(time.s).charAt(1)} />
  </div>
  <SgButton size="sm" onClick={() => setRunning((p) => !p)}>
    {running ? "Parar" : "Iniciar"}
  </SgButton>
</div>`;

function Ex5() {
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTime((prev) => {
        const s = (prev.s + 1) % 60;
        const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
        const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
        return { h, m, s };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SgFadeDigit value={pad(time.h).charAt(0)} />
        <SgFadeDigit value={pad(time.h).charAt(1)} />
        <Colon height={CARD_H_70} />
        <SgFadeDigit value={pad(time.m).charAt(0)} />
        <SgFadeDigit value={pad(time.m).charAt(1)} />
        <Colon height={CARD_H_70} />
        <SgFadeDigit value={pad(time.s).charAt(0)} />
        <SgFadeDigit value={pad(time.s).charAt(1)} />
      </div>
      <SgButton size="sm" onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar"}
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 6 â€” Tamanhos
// ---------------------------------------------------------------------------
const EX6_CODE = `<div className="flex items-end gap-6">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Small (40px)</p>
    <SgFadeDigit value="5" fontSize={40} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medium (70px)</p>
    <SgFadeDigit value="5" fontSize={70} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Large (110px)</p>
    <SgFadeDigit value="5" fontSize={110} />
  </div>
</div>`;

function Ex6() {
  return (
    <div className="flex items-end gap-6">
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Small (40px)</p>
        <SgFadeDigit value="5" fontSize={40} />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Medium (70px)</p>
        <SgFadeDigit value="5" fontSize={70} />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Large (110px)</p>
        <SgFadeDigit value="5" fontSize={110} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------
const PLAYGROUND_CODE = `import * as React from "react";
import { SgFadeDigit, SgButton } from "@seedgrid/fe-components";

const PALETTE = [
  { label: "Padrao",  color: "#edebeb", backgroundColor: "#333232" },
  { label: "Verde",   color: "#4ade80", backgroundColor: "#052e16" },
  { label: "Azul",    color: "#60a5fa", backgroundColor: "#0f172a" },
  { label: "Rosa",    color: "#f472b6", backgroundColor: "#2d0a1e" },
  { label: "Ambar",   color: "#fbbf24", backgroundColor: "#1c1007" },
];

const CARD_H = (fs) => Math.round(fs * 1.38);

function Colon({ fontSize }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2"
         style={{ height: CARD_H(fontSize) }}>
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    </div>
  );
}

export default function App() {
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });
  const [fontSize, setFontSize] = React.useState(60);
  const [paletteIdx, setPaletteIdx] = React.useState(0);
  const palette = PALETTE[paletteIdx];

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTime((prev) => {
        const s = (prev.s + 1) % 60;
        const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
        const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
        return { h, m, s };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p, i) => (
          <SgButton
            key={p.label}
            size="sm"
            severity={i === paletteIdx ? "primary" : "secondary"}
            onClick={() => setPaletteIdx(i)}
          >
            {p.label}
          </SgButton>
        ))}
      </div>

      <label className="block text-xs font-medium">
        fontSize ({fontSize}px)
        <input
          className="mt-1 w-full"
          type="range" min={30} max={120}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </label>

      <div className="flex items-center gap-2">
        <SgFadeDigit value={pad(time.h).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.h).charAt(1)} fontSize={fontSize} {...palette} />
        <Colon fontSize={fontSize} />
        <SgFadeDigit value={pad(time.m).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.m).charAt(1)} fontSize={fontSize} {...palette} />
        <Colon fontSize={fontSize} />
        <SgFadeDigit value={pad(time.s).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.s).charAt(1)} fontSize={fontSize} {...palette} />
      </div>

      <SgButton onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar relogio"}
      </SgButton>
    </div>
  );
}`;

// ---------------------------------------------------------------------------
// Props reference
// ---------------------------------------------------------------------------
const PROPS: ShowcasePropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "-",
    description:
      "Caractere exibido no card. Ao mudar, o digito atual apaga e o novo acende.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: '"#edebeb"',
    description: "Cor do texto e do brilho (glow). Tambem controla o halo de luz.",
  },
  {
    prop: "backgroundColor",
    type: "string",
    defaultValue: '"#333232"',
    description: "Cor de fundo do card.",
  },
  {
    prop: "font",
    type: "string",
    defaultValue: "-",
    description: "CSS font-family aplicado ao digito.",
  },
  {
    prop: "fontSize",
    type: "number",
    defaultValue: "70",
    description: "Tamanho da fonte em pixels. Controla a escala geral do card (largura, altura e raio).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "-",
    description: "Classes CSS adicionais no wrapper externo do card.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SgFadeDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getFadeTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={
          { ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties
        }
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgFadeDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section title={texts.section1Title} description={texts.section1Description}>
          <Ex1 />
          <CodeBlockBase code={EX1_CODE} />
        </Section>

        {/* 2 */}
        <Section title={texts.section2Title} description={texts.section2Description}>
          <Ex2 />
          <CodeBlockBase code={EX2_CODE} />
        </Section>

        {/* 3 */}
        <Section title={texts.section3Title} description={texts.section3Description}>
          <Ex3 />
          <CodeBlockBase code={EX3_CODE} />
        </Section>

        {/* 4 */}
        <Section title={texts.section4Title} description={texts.section4Description}>
          <Ex4 />
          <CodeBlockBase code={EX4_CODE} />
        </Section>

        {/* 5 */}
        <Section title={texts.section5Title} description={texts.section5Description}>
          <Ex5 />
          <CodeBlockBase code={EX5_CODE} />
        </Section>

        {/* 6 */}
        <Section title={texts.section6Title} description={texts.section6Description}>
          <Ex6 />
          <CodeBlockBase code={EX6_CODE} />
        </Section>

        {/* Playground */}
        <Section title={texts.section7Title} description={texts.section7Description}>
          <SgPlayground
            title="SgFadeDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{ height: `calc(${anchorOffset}px + 40vh)` }}
        />
      </div>
    </I18NReady>
  );
}


