"use client";

import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgNeonDigit,
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

type NeonDigitTexts = {
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

const NEON_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", NeonDigitTexts> = {
  "pt-BR": {
    headerSubtitle: "Caracteres em neon com animacao de troca, color, font, backgroundColor e shadowColor.",
    section1Title: "1) Basico",
    section1Description: "Controle simples de digito em estilo neon.",
    section2Title: "2) Texto em neon",
    section2Description: "Troca de palavras com o mesmo componente.",
    section3Title: "3) Neon script (referencia visual)",
    section3Description: "Visual inspirado nas imagens azul e laranja.",
    section4Title: "4) Variacoes de color/background/shadow",
    section4Description: "Themes neon para contextos diferentes.",
    section5Title: "5) Escala e leitura",
    section5Description: "Variacao de tamanho para diferentes cenarios.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Teste as props principais em tempo real.",
    propsReferenceTitle: "Referência de Props",
  },
  "pt-PT": {
    headerSubtitle: "Caracteres em neon com animacao de troca, color, font, backgroundColor e shadowColor.",
    section1Title: "1) Basico",
    section1Description: "Controlo simples de digito em estilo neon.",
    section2Title: "2) Texto em neon",
    section2Description: "Troca de palavras com o mesmo componente.",
    section3Title: "3) Neon script (referencia visual)",
    section3Description: "Visual inspirado nas imagens azul e laranja.",
    section4Title: "4) Variacoes de color/background/shadow",
    section4Description: "Themes neon para contextos diferentes.",
    section5Title: "5) Escala e leitura",
    section5Description: "Variacao de tamanho para diferentes cenarios.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Teste as props principais em tempo real.",
    propsReferenceTitle: "Referência de Props",
  },
  "en-US": {
    headerSubtitle: "Neon character component with swap animation, color, font, backgroundColor, and shadowColor.",
    section1Title: "1) Basic",
    section1Description: "Simple neon-style digit control.",
    section2Title: "2) Neon text",
    section2Description: "Word switching with the same component.",
    section3Title: "3) Neon script (visual reference)",
    section3Description: "Look inspired by blue and orange reference images.",
    section4Title: "4) color/background/shadow variants",
    section4Description: "Neon themes for different contexts.",
    section5Title: "5) Scale and readability",
    section5Description: "Size variation for different scenarios.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Test the main props in real time.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Caracteres neon con animacion de cambio, color, font, backgroundColor y shadowColor.",
    section1Title: "1) Basico",
    section1Description: "Control simple de digito en estilo neon.",
    section2Title: "2) Texto neon",
    section2Description: "Cambio de palabras con el mismo componente.",
    section3Title: "3) Neon script (referencia visual)",
    section3Description: "Visual inspirado en las imagenes azul y naranja.",
    section4Title: "4) Variaciones de color/background/shadow",
    section4Description: "Temas neon para distintos contextos.",
    section5Title: "5) Escala y lectura",
    section5Description: "Variacion de tamano para diferentes escenarios.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Prueba las props principales en tiempo real.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedNeonLocale = keyof typeof NEON_TEXTS;

function isSupportedNeonLocale(locale: ShowcaseLocale): locale is SupportedNeonLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getNeonTexts(locale: ShowcaseLocale): NeonDigitTexts {
  const normalized: SupportedNeonLocale = isSupportedNeonLocale(locale) ? locale : "en-US";
  return NEON_TEXTS[normalized];
}

const WORDS = ["teste", "seedgrid", "your text"] as const;
const SCRIPT_FONT = "\"Brush Script MT\", \"Segoe Script\", \"Lucida Handwriting\", cursive";

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));

<div className="flex items-center gap-4">
  <SgNeonDigit value={digit} color="#f8fafc" backgroundColor="#120f2b" shadowColor="#8b5cf6" />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
  </div>
</div>`;

const WORDS_CODE = `const WORDS = ["teste", "seedgrid", "your text"] as const;
const [wordIndex, setWordIndex] = React.useState(0);
const word = WORDS[wordIndex];
const nextWord = () => setWordIndex((prev) => (prev + 1) % WORDS.length);

<div className="space-y-3">
  <SgNeonDigit value={word} color="#e2f6ff" backgroundColor="#101934" shadowColor="#47d1ff" />
  <SgButton size="sm" onClick={nextWord}>Change text</SgButton>
</div>`;

const SCRIPT_CODE = `const SCRIPT_FONT = "\\"Brush Script MT\\", \\"Segoe Script\\", \\"Lucida Handwriting\\", cursive";

<SgGrid columns={{ base: 1, md: 2 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Blue neon script</p>
    <SgNeonDigit
      value="Your Text"
      color="#e4fbff"
      backgroundColor="#090f22"
      shadowColor="#47d1ff"
      font={SCRIPT_FONT}
      fontWeight={500}
      fontSize={62}
      padding={18}
      shadowStrength={1.25}
    />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Warm neon script</p>
    <SgNeonDigit
      value="Your Text"
      color="#fff7e5"
      backgroundColor="#1c120b"
      shadowColor="#ffae1a"
      font={SCRIPT_FONT}
      fontWeight={500}
      fontSize={62}
      padding={18}
      shadowStrength={1.25}
    />
  </div>
</SgGrid>`;

const THEMES_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Blue glow</p>
    <SgNeonDigit value="teste" color="#e2f6ff" backgroundColor="#0b1130" shadowColor="#38bdf8" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Purple glow</p>
    <SgNeonDigit value="teste" color="#f5e9ff" backgroundColor="#170f2b" shadowColor="#a855f7" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Amber glow</p>
    <SgNeonDigit value="teste" color="#fff7e8" backgroundColor="#2a1a14" shadowColor="#fb923c" />
  </div>
</SgGrid>`;

const SIZE_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Small</p>
    <SgNeonDigit value="5" fontSize={24} padding={10} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medium</p>
    <SgNeonDigit value="5" fontSize={44} padding={14} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Large</p>
    <SgNeonDigit value="5" fontSize={72} padding={18} />
  </div>
</SgGrid>`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputText, SgNeonDigit, SgSlider } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState("Your Text");
  const [animateOnChange, setAnimateOnChange] = React.useState(true);
  const [transitionMs, setTransitionMs] = React.useState(320);
  const [color, setColor] = React.useState("#e4fbff");
  const [backgroundColor, setBackgroundColor] = React.useState("#090f22");
  const [shadowColor, setShadowColor] = React.useState("#47d1ff");
  const [font, setFont] = React.useState("\\"Brush Script MT\\", \\"Segoe Script\\", \\"Lucida Handwriting\\", cursive");
  const [fontSize, setFontSize] = React.useState(62);
  const [letterSpacing, setLetterSpacing] = React.useState(0);
  const [padding, setPadding] = React.useState(18);
  const [rounded, setRounded] = React.useState(12);
  const [shadowStrengthPct, setShadowStrengthPct] = React.useState(125);

  return (
    <div className="space-y-4 p-2">
      <SgInputText id="neon-value" label="Texto" value={value} onChange={setValue} />
      <SgInputText id="neon-font" label="Font" value={font} onChange={setFont} />
      <div className="flex items-center gap-2">
        <SgButton size="sm" onClick={() => setAnimateOnChange((prev) => !prev)}>
          {animateOnChange ? "Animacao: ON" : "Animacao: OFF"}
        </SgButton>
      </div>

      <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
        <SgInputText id="neon-color" label="Color" value={color} onChange={setColor} />
        <SgInputText id="neon-bg" label="BackgroundColor" value={backgroundColor} onChange={setBackgroundColor} />
        <SgInputText id="neon-shadow" label="ShadowColor" value={shadowColor} onChange={setShadowColor} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">fontSize: {fontSize}</p>
          <SgSlider id="neon-font-size" minValue={18} maxValue={120} value={fontSize} onChange={setFontSize} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">letterSpacing: {letterSpacing}</p>
          <SgSlider id="neon-letter-spacing" minValue={0} maxValue={16} value={letterSpacing} onChange={setLetterSpacing} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">padding: {padding}</p>
          <SgSlider id="neon-padding" minValue={4} maxValue={28} value={padding} onChange={setPadding} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">rounded: {rounded}</p>
          <SgSlider id="neon-rounded" minValue={0} maxValue={24} value={rounded} onChange={setRounded} />
        </div>
      </SgGrid>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">shadowStrength: {(shadowStrengthPct / 100).toFixed(2)}</p>
        <SgSlider id="neon-shadow-strength" minValue={20} maxValue={220} value={shadowStrengthPct} onChange={setShadowStrengthPct} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">transitionMs: {transitionMs}</p>
        <SgSlider id="neon-transition-ms" minValue={80} maxValue={1200} value={transitionMs} onChange={setTransitionMs} />
      </div>

      <div className="rounded border border-border p-4">
        <SgNeonDigit
          value={value}
          animateOnChange={animateOnChange}
          transitionMs={transitionMs}
          color={color}
          backgroundColor={backgroundColor}
          shadowColor={shadowColor}
          font={font}
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          padding={padding}
          rounded={rounded}
          shadowStrength={shadowStrengthPct / 100}
        />
      </div>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Texto ou caractere exibido em estilo neon." },
  { prop: "animateOnChange", type: "boolean", defaultValue: "true", description: "Liga a animacao de apagar/trocar/acender quando o valor muda." },
  { prop: "transitionMs", type: "number", defaultValue: "320", description: "Duracao total da animacao em milissegundos." },
  { prop: "color", type: "string", defaultValue: "\"#e2e8f0\"", description: "Cor principal do texto." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#120f2b\"", description: "Cor de fundo do componente." },
  { prop: "shadowColor", type: "string", defaultValue: "color", description: "Cor do brilho/sombra neon." },
  { prop: "shadowStrength", type: "number", defaultValue: "1", description: "Intensidade do brilho neon." },
  { prop: "fontSize", type: "number", defaultValue: "46", description: "Tamanho da fonte em pixels." },
  { prop: "fontWeight", type: "number | string", defaultValue: "600", description: "Peso da fonte." },
  { prop: "font", type: "string", defaultValue: "-", description: "Atalho para definir a fonte (font family)." },
  { prop: "fontFamily", type: "string", defaultValue: "-", description: "Fonte customizada do texto." },
  { prop: "letterSpacing", type: "number", defaultValue: "0", description: "Espacamento entre letras em pixels." },
  { prop: "padding", type: "number", defaultValue: "14", description: "Padding interno em pixels." },
  { prop: "rounded", type: "number", defaultValue: "12", description: "Raio de borda do container em pixels." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS extras no container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Estilo inline adicional no container." }
];

export default function SgNeonDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getNeonTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [digit, setDigit] = React.useState("0");
  const [wordIndex, setWordIndex] = React.useState(0);
  const word = WORDS[wordIndex] ?? WORDS[0];

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const nextWord = React.useCallback(() => setWordIndex((prev) => (prev + 1) % WORDS.length), []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgNeonDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgNeonDigit value={digit} color="#f8fafc" backgroundColor="#120f2b" shadowColor="#8b5cf6" />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Next (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Previous (-1)</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="space-y-3">
            <SgNeonDigit value={word} color="#e2f6ff" backgroundColor="#101934" shadowColor="#47d1ff" />
            <SgButton size="sm" onClick={nextWord}>Change text</SgButton>
          </div>
          <CodeBlockBase code={WORDS_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Blue neon script</p>
              <SgNeonDigit
                value="Your Text"
                color="#e4fbff"
                backgroundColor="#090f22"
                shadowColor="#47d1ff"
                font={SCRIPT_FONT}
                fontWeight={500}
                fontSize={62}
                padding={18}
                shadowStrength={1.25}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Warm neon script</p>
              <SgNeonDigit
                value="Your Text"
                color="#fff7e5"
                backgroundColor="#1c120b"
                shadowColor="#ffae1a"
                font={SCRIPT_FONT}
                fontWeight={500}
                fontSize={62}
                padding={18}
                shadowStrength={1.25}
              />
            </div>
          </SgGrid>
          <CodeBlockBase code={SCRIPT_CODE} />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Blue glow</p>
              <SgNeonDigit value="teste" color="#e2f6ff" backgroundColor="#0b1130" shadowColor="#38bdf8" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Purple glow</p>
              <SgNeonDigit value="teste" color="#f5e9ff" backgroundColor="#170f2b" shadowColor="#a855f7" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Amber glow</p>
              <SgNeonDigit value="teste" color="#fff7e8" backgroundColor="#2a1a14" shadowColor="#fb923c" />
            </div>
          </SgGrid>
          <CodeBlockBase code={THEMES_CODE} />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Small</p>
              <SgNeonDigit value="5" fontSize={24} padding={10} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medium</p>
              <SgNeonDigit value="5" fontSize={44} padding={14} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Large</p>
              <SgNeonDigit value="5" fontSize={72} padding={18} />
            </div>
          </SgGrid>
          <CodeBlockBase code={SIZE_CODE} />
        </Section>

        <Section title={texts.section6Title} description={texts.section6Description}>
          <SgPlayground
            title="SgNeonDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={780}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

