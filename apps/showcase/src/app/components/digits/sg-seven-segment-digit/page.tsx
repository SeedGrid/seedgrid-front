"use client";

import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSevenSegmentDigit,
  SgSlider,
  type SgSevenSegmentDigitPalette,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../../sgCodeBlockBase";
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

type SevenSegmentTexts = {
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

const TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", SevenSegmentTexts> = {
  "pt-BR": {
    headerSubtitle: "Display de sete segmentos para digitos e caracteres hexadecimais com cor, tamanho e glow customizaveis.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca manual de digitos com controles.",
    section2Title: "2) Hexadecimal (0-9 A-F)",
    section2Description: "Suporte a caracteres comuns de display 7 segmentos.",
    section3Title: "3) Temas de cor",
    section3Description: "Exemplos com paletas red, blue, yellow, green e white.",
    section4Title: "4) Tamanho e espessura",
    section4Description: "Escala do display via size e thickness.",
    section5Title: "5) Composicao estilo relogio",
    section5Description: "Composicao de varios digitos para HH:MM:SS.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Ajuste de valor, cores e dimensoes em tempo real.",
    propsReferenceTitle: "Referencia de Props"
  },
  "pt-PT": {
    headerSubtitle: "Display de sete segmentos para digitos e caracteres hexadecimais com cor, tamanho e glow customizaveis.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Troca manual de digitos com controlos.",
    section2Title: "2) Hexadecimal (0-9 A-F)",
    section2Description: "Suporte a caracteres comuns de display 7 segmentos.",
    section3Title: "3) Temas de cor",
    section3Description: "Exemplos com paletas red, blue, yellow, green e white.",
    section4Title: "4) Tamanho e espessura",
    section4Description: "Escala do display via size e thickness.",
    section5Title: "5) Composicao estilo relogio",
    section5Description: "Composicao de varios digitos para HH:MM:SS.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Ajuste de valor, cores e dimensoes em tempo real.",
    propsReferenceTitle: "Referencia de Props"
  },
  "en-US": {
    headerSubtitle: "Seven-segment display for digits and hex-style characters with customizable color, size, and glow.",
    section1Title: "1) Basic (0-9)",
    section1Description: "Manual digit switching with controls.",
    section2Title: "2) Hexadecimal (0-9 A-F)",
    section2Description: "Support for common seven-segment display characters.",
    section3Title: "3) Color themes",
    section3Description: "Examples using red, blue, yellow, green, and white palettes.",
    section4Title: "4) Size and thickness",
    section4Description: "Display scaling via size and thickness.",
    section5Title: "5) Clock-style composition",
    section5Description: "Composition with multiple digits for HH:MM:SS.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Adjust value, colors, and dimensions in real time.",
    propsReferenceTitle: "Props Reference"
  },
  es: {
    headerSubtitle: "Display de siete segmentos para digitos y caracteres hexadecimales con color, tamano y glow personalizables.",
    section1Title: "1) Basico (0-9)",
    section1Description: "Cambio manual de digitos con controles.",
    section2Title: "2) Hexadecimal (0-9 A-F)",
    section2Description: "Soporte para caracteres comunes de display de 7 segmentos.",
    section3Title: "3) Temas de color",
    section3Description: "Ejemplos con paletas red, blue, yellow, green y white.",
    section4Title: "4) Tamano y espesor",
    section4Description: "Escala del display via size y thickness.",
    section5Title: "5) Composicion estilo reloj",
    section5Description: "Composicion de varios digitos para HH:MM:SS.",
    section6Title: "6) Playground (SgPlayground)",
    section6Description: "Ajuste de valor, colores y dimensiones en tiempo real.",
    propsReferenceTitle: "Referencia de Props"
  }
};

type SupportedLocale = keyof typeof TEXTS;

function isSupportedLocale(locale: ShowcaseLocale): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getTexts(locale: ShowcaseLocale): SevenSegmentTexts {
  const normalized: SupportedLocale = isSupportedLocale(locale) ? locale : "en-US";
  return TEXTS[normalized];
}

function ColonDots() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1">
      <span className="size-2 rounded-full bg-red-500/80" />
      <span className="size-2 rounded-full bg-red-500/80" />
    </div>
  );
}

const HEX = Array.from("0123456789ABCDEF");
const COLOR_OPTIONS: Array<{ label: string; value: SgSevenSegmentDigitPalette }> = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "White", value: "white" }
];

const BASIC_CODE = `const COLOR_OPTIONS = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "White", value: "white" }
];

const [digit, setDigit] = React.useState("0");
const [palette, setPalette] = React.useState("red");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgSevenSegmentDigit value={digit} palette={palette} />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
    <div className="flex flex-wrap gap-2 pt-1">
      {COLOR_OPTIONS.map((item) => (
        <SgButton
          key={item.value}
          size="sm"
          appearance={palette === item.value ? "solid" : "outline"}
          onClick={() => setPalette(item.value)}
        >
          {item.label}
        </SgButton>
      ))}
    </div>
  </div>
</div>`;

const HEX_CODE = `const HEX = Array.from("0123456789ABCDEF");
const [hexIndex, setHexIndex] = React.useState(10);
const hexValue = HEX[hexIndex] ?? "A";

const next = () => setHexIndex((prev) => (prev + 1) % HEX.length);

<div className="flex items-center gap-4">
  <SgSevenSegmentDigit value={hexValue} color="#f97316" backgroundColor="#180b05" offColor="rgba(124,45,18,0.24)" />
  <SgButton size="sm" onClick={next}>Next char</SgButton>
</div>`;

const THEMES_CODE = `<SgGrid columns={{ base: 1, md: 5 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">red</p>
    <SgSevenSegmentDigit value="8" palette="red" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">blue</p>
    <SgSevenSegmentDigit value="8" palette="blue" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">yellow</p>
    <SgSevenSegmentDigit value="8" palette="yellow" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">green</p>
    <SgSevenSegmentDigit value="8" palette="green" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">white</p>
    <SgSevenSegmentDigit value="8" palette="white" />
  </div>
</SgGrid>`;

const SIZE_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Small</p>
    <SgSevenSegmentDigit value="5" size={72} thickness={10} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medium</p>
    <SgSevenSegmentDigit value="5" size={108} thickness={14} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Large</p>
    <SgSevenSegmentDigit value="5" size={148} thickness={18} />
  </div>
</SgGrid>`;

const CLOCK_CODE = `function ColonDots() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1">
      <span className="size-2 rounded-full bg-red-500/80" />
      <span className="size-2 rounded-full bg-red-500/80" />
    </div>
  );
}

const [seconds, setSeconds] = React.useState(0);
const total = seconds % 86400;
const h = Math.floor(total / 3600);
const m = Math.floor((total % 3600) / 60);
const s = total % 60;
const pad = (n) => String(n).padStart(2, "0");
const hh = pad(h);
const mm = pad(m);
const ss = pad(s);

<div className="space-y-4">
  <div className="flex items-center gap-1">
    <SgSevenSegmentDigit value={hh[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={hh[1] ?? "0"} size={86} />
    <ColonDots />
    <SgSevenSegmentDigit value={mm[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={mm[1] ?? "0"} size={86} />
    <ColonDots />
    <SgSevenSegmentDigit value={ss[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={ss[1] ?? "0"} size={86} />
  </div>
  <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
</div>`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSevenSegmentDigit,
  SgSlider,
  type SgSevenSegmentDigitPalette,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [value, setValue] = React.useState("8");
  const [color, setColor] = React.useState("#ef4444");
  const [backgroundColor, setBackgroundColor] = React.useState("#120909");
  const [offColor, setOffColor] = React.useState("rgba(127, 29, 29, 0.28)");
  const [size, setSize] = React.useState(108);
  const [thickness, setThickness] = React.useState(14);

  return (
    <div className="space-y-4 p-2">
      <SgInputText id="seven-value" label="Value" value={value} onChange={setValue} />

      <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
        <SgInputText id="seven-color" label="Color" value={color} onChange={setColor} />
        <SgInputText id="seven-bg" label="BackgroundColor" value={backgroundColor} onChange={setBackgroundColor} />
        <SgInputText id="seven-off" label="OffColor" value={offColor} onChange={setOffColor} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">size: {size}</p>
          <SgSlider id="seven-size" minValue={64} maxValue={180} value={size} onChange={setSize} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">thickness: {thickness}</p>
          <SgSlider id="seven-thickness" minValue={6} maxValue={24} value={thickness} onChange={setThickness} />
        </div>
      </SgGrid>

      <div className="rounded border border-border p-4">
        <SgSevenSegmentDigit
          value={value}
          color={color}
          backgroundColor={backgroundColor}
          offColor={offColor}
          size={size}
          thickness={thickness}
        />
      </div>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Character rendered by the component (first character is used)." },
  { prop: "palette", type: "\"red\" | \"blue\" | \"yellow\" | \"green\" | \"white\"", defaultValue: "\"red\"", description: "Preset visual palette for active, inactive and background colors." },
  { prop: "color", type: "string", defaultValue: "\"#ef4444\"", description: "Color of active segments." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#120909\"", description: "Background color of the panel." },
  { prop: "offColor", type: "string", defaultValue: "\"rgba(127, 29, 29, 0.28)\"", description: "Color of inactive segments." },
  { prop: "size", type: "number", defaultValue: "108", description: "Component height in pixels." },
  { prop: "width", type: "number", defaultValue: "size * 0.62", description: "Component width in pixels." },
  { prop: "thickness", type: "number", defaultValue: "14", description: "Segment thickness in pixels." },
  { prop: "padding", type: "number", defaultValue: "10", description: "Internal panel padding in pixels." },
  { prop: "rounded", type: "number", defaultValue: "12", description: "Panel border radius in pixels." },
  { prop: "skew", type: "number", defaultValue: "-8", description: "Skew angle used to mimic classic LED displays." },
  { prop: "glow", type: "boolean", defaultValue: "true", description: "Enables glow effect for active segments." },
  { prop: "transitionMs", type: "number", defaultValue: "180", description: "Transition duration for segment state changes." },
  { prop: "className", type: "string", defaultValue: "-", description: "Extra CSS classes on outer wrapper." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Additional inline styles on outer wrapper." }
];

export default function SgSevenSegmentDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [digit, setDigit] = React.useState("0");
  const [palette, setPalette] = React.useState<SgSevenSegmentDigitPalette>("red");
  const [hexIndex, setHexIndex] = React.useState(10);
  const [seconds, setSeconds] = React.useState(0);

  const hexValue = HEX[hexIndex] ?? "A";
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
  const nextHex = React.useCallback(() => setHexIndex((prev) => (prev + 1) % HEX.length), []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSevenSegmentDigit"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgSevenSegmentDigit value={digit} palette={palette} />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Next (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Previous (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Random</SgButton>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_OPTIONS.map((item) => (
                  <SgButton
                    key={item.value}
                    size="sm"
                    appearance={palette === item.value ? "solid" : "outline"}
                    onClick={() => setPalette(item.value)}
                  >
                    {item.label}
                  </SgButton>
                ))}
              </div>
            </div>
          </div>
          <sgCodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="flex items-center gap-4">
            <SgSevenSegmentDigit
              value={hexValue}
              color="#f97316"
              backgroundColor="#180b05"
              offColor="rgba(124,45,18,0.24)"
            />
            <SgButton size="sm" onClick={nextHex}>Next char</SgButton>
          </div>
          <sgCodeBlockBase code={HEX_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <SgGrid columns={{ base: 1, md: 5 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">red</p>
              <SgSevenSegmentDigit value="8" palette="red" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">blue</p>
              <SgSevenSegmentDigit value="8" palette="blue" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">yellow</p>
              <SgSevenSegmentDigit value="8" palette="yellow" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">green</p>
              <SgSevenSegmentDigit value="8" palette="green" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">white</p>
              <SgSevenSegmentDigit value="8" palette="white" />
            </div>
          </SgGrid>
          <sgCodeBlockBase code={THEMES_CODE} />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Small</p>
              <SgSevenSegmentDigit value="5" size={72} thickness={10} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medium</p>
              <SgSevenSegmentDigit value="5" size={108} thickness={14} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Large</p>
              <SgSevenSegmentDigit value="5" size={148} thickness={18} />
            </div>
          </SgGrid>
          <sgCodeBlockBase code={SIZE_CODE} />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <SgSevenSegmentDigit value={hh[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={hh[1] ?? "0"} size={86} />
              <ColonDots />
              <SgSevenSegmentDigit value={mm[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={mm[1] ?? "0"} size={86} />
              <ColonDots />
              <SgSevenSegmentDigit value={ss[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={ss[1] ?? "0"} size={86} />
            </div>
            <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
          </div>
          <sgCodeBlockBase code={CLOCK_CODE} />
        </Section>

        <Section title={texts.section6Title} description={texts.section6Description}>
          <SgPlayground
            title="SgSevenSegmentDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={700}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
