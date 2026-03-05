"use client";

import * as React from "react";
import {
  SgButton,
  SgDiscardDigit,
  SgGrid,
  SgInputText,
  SgPlayground,
  SgSlider,
  type SgDiscardDigitHandle
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

type DiscardDigitTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section1NextButton: string;
  section1PreviousButton: string;
  section2Title: string;
  section2Description: string;
  section2DiscardButton: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  section5StartButton: string;
  section5StopButton: string;
  section6Title: string;
  section6Description: string;
  section6PageLabelPrefix: string;
  section6PageLabelConnector: string;
  section6PreviousButton: string;
  section6NextButton: string;
  section7Title: string;
  section7Description: string;
  propsReferenceTitle: string;
};

const DISCARD_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", DiscardDigitTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Bloco de folhas com animacao 3D de descarte: a folha do topo sai e revela a proxima.",
    section1Title: "1) Basico",
    section1Description: "Click Next to add one card and Previous to remove one card.",
    section1NextButton: "Next (+1 folha)",
    section1PreviousButton: "Previous (-1 folha)",
    section2Title: "2) Folhas sequenciais",
    section2Description: "Cada clique descarta uma folha e revela a seguinte.",
    section2DiscardButton: "Descartar folha",
    section3Title: "3) Variacoes de papel",
    section3Description: "Examples with different color + backgroundColor.",
    section4Title: "4) Fontes",
    section4Description: "Comparacao de fontes no mesmo efeito de pilha.",
    section5Title: "5) Auto descarte",
    section5Description: "Atualizacao continua para observar a direcao aleatoria da folha descartada.",
    section5StartButton: "Iniciar",
    section5StopButton: "Parar",
    section6Title: "6) Paginacao imperativa (ref)",
    section6Description:
      "totalNumberPages define o total de folhas. O ref expoe increasePage(), decreasePage() e page().",
    section6PageLabelPrefix: "Pagina",
    section6PageLabelConnector: "de",
    section6PreviousButton: "Previous",
    section6NextButton: "Proxima",
    section7Title: "7) Playground (SgPlayground)",
    section7Description: "Ajuste em tempo real de color, font, backgroundColor e animacao.",
    propsReferenceTitle: "Referência de Props"
  },
  "pt-PT": {
    headerSubtitle:
      "Bloco de folhas com animacao 3D de descarte: a folha no topo sai e revela a seguinte.",
    section1Title: "1) Basico",
    section1Description: "Click Next to add one card and Previous to remove one card.",
    section1NextButton: "Next (+1 folha)",
    section1PreviousButton: "Previous (-1 folha)",
    section2Title: "2) Folhas sequenciais",
    section2Description: "Cada clique descarta uma folha e revela a seguinte.",
    section2DiscardButton: "Descartar folha",
    section3Title: "3) Variacoes de papel",
    section3Description: "Examples with different color + backgroundColor.",
    section4Title: "4) Fontes",
    section4Description: "Comparacao de fontes no mesmo efeito de pilha.",
    section5Title: "5) Auto descarte",
    section5Description: "Atualizacao continua para observar a direcao aleatoria da folha descartada.",
    section5StartButton: "Iniciar",
    section5StopButton: "Parar",
    section6Title: "6) Paginacao imperativa (ref)",
    section6Description:
      "totalNumberPages define o total de folhas. O ref expoe increasePage(), decreasePage() e page().",
    section6PageLabelPrefix: "Pagina",
    section6PageLabelConnector: "de",
    section6PreviousButton: "Previous",
    section6NextButton: "Proxima",
    section7Title: "7) Playground (SgPlayground)",
    section7Description: "Ajuste em tempo real de color, font, backgroundColor e animacao.",
    propsReferenceTitle: "Referência de Props"
  },
  "en-US": {
    headerSubtitle:
      "Stacked paper-style digit with a 3D discard animation: the top sheet leaves and reveals the next one.",
    section1Title: "1) Basic",
    section1Description: "Click Next to add one sheet and Previous to remove one sheet.",
    section1NextButton: "Next (+1 sheet)",
    section1PreviousButton: "Previous (-1 sheet)",
    section2Title: "2) Sequential sheets",
    section2Description: "Each click discards one sheet and reveals the next.",
    section2DiscardButton: "Discard sheet",
    section3Title: "3) Paper variants",
    section3Description: "Examples with different color + backgroundColor combinations.",
    section4Title: "4) Fonts",
    section4Description: "Font comparison using the same stack effect.",
    section5Title: "5) Auto discard",
    section5Description: "Continuous updates to observe random discard direction.",
    section5StartButton: "Start",
    section5StopButton: "Stop",
    section6Title: "6) Imperative pagination (ref)",
    section6Description:
      "totalNumberPages defines the sheet count. The ref exposes increasePage(), decreasePage(), and page().",
    section6PageLabelPrefix: "Page",
    section6PageLabelConnector: "of",
    section6PreviousButton: "Previous",
    section6NextButton: "Next",
    section7Title: "7) Playground (SgPlayground)",
    section7Description: "Real-time tuning of color, font, backgroundColor, and animation.",
    propsReferenceTitle: "Props Reference"
  },
  es: {
    headerSubtitle:
      "Bloque de hojas con animacion 3D de descarte: la hoja superior sale y revela la siguiente.",
    section1Title: "1) Basico",
    section1Description: "Haz clic en Siguiente para agregar una hoja y en Previous para quitar una hoja.",
    section1NextButton: "Siguiente (+1 hoja)",
    section1PreviousButton: "Previous (-1 hoja)",
    section2Title: "2) Hojas secuenciales",
    section2Description: "Cada clic descarta una hoja y revela la siguiente.",
    section2DiscardButton: "Descartar hoja",
    section3Title: "3) Variaciones de papel",
    section3Description: "Ejemplos con distintas combinaciones de color + backgroundColor.",
    section4Title: "4) Fuentes",
    section4Description: "Comparacion de fuentes con el mismo efecto de pila.",
    section5Title: "5) Auto descarte",
    section5Description: "Actualizacion continua para observar la direccion aleatoria del descarte.",
    section5StartButton: "Iniciar",
    section5StopButton: "Detener",
    section6Title: "6) Paginacion imperativa (ref)",
    section6Description:
      "totalNumberPages define el total de hojas. El ref expone increasePage(), decreasePage() y page().",
    section6PageLabelPrefix: "Pagina",
    section6PageLabelConnector: "de",
    section6PreviousButton: "Previous",
    section6NextButton: "Siguiente",
    section7Title: "7) Playground (SgPlayground)",
    section7Description: "Ajuste en tiempo real de color, font, backgroundColor y animacion.",
    propsReferenceTitle: "Referencia de Props"
  }
};

type SupportedDiscardLocale = keyof typeof DISCARD_TEXTS;

function isSupportedDiscardLocale(locale: ShowcaseLocale): locale is SupportedDiscardLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getDiscardTexts(locale: ShowcaseLocale): DiscardDigitTexts {
  const normalized: SupportedDiscardLocale = isSupportedDiscardLocale(locale) ? locale : "en-US";
  return DISCARD_TEXTS[normalized];
}

const PAGE_VALUES = ["001", "002", "003", "004", "005"] as const;

const BASIC_CODE = `const [sheetCount, setSheetCount] = React.useState(8);

const next = React.useCallback(() => {
  setSheetCount((prev) => Math.min(30, prev + 1));
}, []);

const prev = React.useCallback(() => {
  setSheetCount((prev) => Math.max(2, prev - 1));
}, []);

<div className="flex items-center gap-4">
  <SgDiscardDigit
    value="7"
    color="#0f172a"
    font={"\\"Inter\\", \\"Segoe UI\\", sans-serif"}
    backgroundColor="#f8fafc"
    stackDepth={sheetCount}
  />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>{texts.section1NextButton}</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>{texts.section1PreviousButton}</SgButton>
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
  <SgButton size="sm" onClick={nextPage}>{texts.section2DiscardButton}</SgButton>
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

const PAGINATION_CODE = `const TOTAL_PAGES = 10;
const ref = React.useRef<SgDiscardDigitHandle>(null);
const [pagina, setPagina] = React.useState(1);

const anterior = () => {
  ref.current?.decreasePage();
  setPagina((p) => Math.max(1, p - 1));
};

const proxima = () => {
  ref.current?.increasePage();
  setPagina((p) => Math.min(TOTAL_PAGES, p + 1));
};

<div className="flex flex-wrap items-end gap-8">
  <SgDiscardDigit
    ref={ref}
    value={String(pagina)}
    totalNumberPages={TOTAL_PAGES}
    fontSize={64}
  />
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground">
      {texts.section6PageLabelPrefix} <strong>{pagina}</strong> {texts.section6PageLabelConnector} {TOTAL_PAGES}
    </p>
    <div className="flex gap-2">
      <SgButton size="sm" onClick={anterior} disabled={pagina <= 1}>{texts.section6PreviousButton}</SgButton>
      <SgButton size="sm" onClick={proxima} disabled={pagina >= TOTAL_PAGES}>{texts.section6NextButton}</SgButton>
    </div>
  </div>
</div>`;

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
    {running ? texts.section5StopButton : texts.section5StartButton}
  </SgButton>
</div>`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgDiscardDigit, SgGrid, SgInputText, SgSlider, type SgDiscardDigitHandle } from "@seedgrid/fe-components";

export default function App() {
  const ref = React.useRef<SgDiscardDigitHandle>(null);
  const [value, setValue] = React.useState("42");
  const [color, setColor] = React.useState("#0f172a");
  const [backgroundColor, setBackgroundColor] = React.useState("#f8fafc");
  const [font, setFont] = React.useState("\\"Inter\\", \\"Segoe UI\\", sans-serif");
  const [fontSize, setFontSize] = React.useState(64);
  const [transitionMs, setTransitionMs] = React.useState(640);
  const [totalNumberPages, setTotalNumberPages] = React.useState(15);
  const [animateOnChange, setAnimateOnChange] = React.useState(true);
  const [pagina, setPagina] = React.useState(1);

  const anterior = () => {
    ref.current?.decreasePage();
    setPagina((p) => Math.max(1, p - 1));
  };

  const proxima = () => {
    ref.current?.increasePage();
    setPagina((p) => Math.min(totalNumberPages, p + 1));
  };

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
          <p className="text-xs text-muted-foreground">totalNumberPages: {totalNumberPages}</p>
          <SgSlider id="discard-pages" minValue={2} maxValue={30} value={totalNumberPages} onChange={(v) => { setTotalNumberPages(v); setPagina(1); }} />
        </div>
      </SgGrid>

      <SgButton size="sm" onClick={() => setAnimateOnChange((prev) => !prev)}>
        {animateOnChange ? "Animacao: ON" : "Animacao: OFF"}
      </SgButton>

      <div className="rounded border border-border p-4">
        <div className="flex flex-wrap items-end gap-8">
          <SgDiscardDigit
            ref={ref}
            value={value}
            color={color}
            font={font}
            backgroundColor={backgroundColor}
            fontSize={fontSize}
            transitionMs={transitionMs}
            totalNumberPages={totalNumberPages}
            animateOnChange={animateOnChange}
          />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Pagina {pagina} de {totalNumberPages}</p>
            <div className="flex gap-2">
              <SgButton size="sm" onClick={anterior} disabled={pagina <= 1}>Previous</SgButton>
              <SgButton size="sm" onClick={proxima} disabled={pagina >= totalNumberPages}>Proxima</SgButton>
            </div>
          </div>
        </div>
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
  { prop: "stackDepth", type: "number", defaultValue: "20", description: "Quantidade de folhas visiveis na pilha (2 a 30). Ignorado se totalNumberPages for definido." },
  { prop: "totalNumberPages", type: "number", defaultValue: "-", description: "Total de paginas do monte. A pilha visual encolhe a cada increasePage() via ref." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Estilo inline adicional." }
];

export default function SgDiscardDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getDiscardTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [sheetCount, setSheetCount] = React.useState(8);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [counter, setCounter] = React.useState("00");

  const TOTAL_PAGES = 10;
  const discardRef = React.useRef<SgDiscardDigitHandle>(null);
  const [paginaAtual, setPaginaAtual] = React.useState(1);

  const handlePrevious = React.useCallback(() => {
    discardRef.current?.decreasePage();
    setPaginaAtual((p) => Math.max(1, p - 1));
  }, []);

  const handleProxima = React.useCallback(() => {
    discardRef.current?.increasePage();
    setPaginaAtual((p) => Math.min(TOTAL_PAGES, p + 1));
  }, []);

  const currentPage = PAGE_VALUES[pageIndex] ?? PAGE_VALUES[0];

  const addSheet = React.useCallback(() => {
    setSheetCount((prev) => Math.min(30, prev + 1));
  }, []);
  const removeSheet = React.useCallback(() => {
    setSheetCount((prev) => Math.max(2, prev - 1));
  }, []);
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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgDiscardDigit
              value="7"
              color="#0f172a"
              font={"\"Inter\", \"Segoe UI\", sans-serif"}
              backgroundColor="#f8fafc"
              stackDepth={sheetCount}
            />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={addSheet}>{texts.section1NextButton}</SgButton>
              <SgButton size="sm" severity="secondary" onClick={removeSheet}>{texts.section1PreviousButton}</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="space-y-3">
            <SgDiscardDigit
              value={currentPage}
              color="#111827"
              font={"\"Inter\", \"Segoe UI\", sans-serif"}
              backgroundColor="#fffef7"
              fontSize={58}
            />
            <SgButton size="sm" onClick={nextPage}>{texts.section2DiscardButton}</SgButton>
          </div>
          <CodeBlockBase code={PAGES_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
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

        <Section title={texts.section4Title} description={texts.section4Description}>
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

        <Section title={texts.section5Title} description={texts.section5Description}>
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
              {running ? texts.section5StopButton : texts.section5StartButton}
            </SgButton>
          </div>
          <CodeBlockBase code={AUTO_CODE} />
        </Section>

        <Section title={texts.section6Title} description={texts.section6Description}>
          <div className="flex flex-wrap items-end gap-8">
            <SgDiscardDigit
              ref={discardRef}
              value={String(paginaAtual)}
              totalNumberPages={TOTAL_PAGES}
              fontSize={64}
            />
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {texts.section6PageLabelPrefix}{" "}
                <span className="font-semibold text-foreground">{paginaAtual}</span>{" "}
                {texts.section6PageLabelConnector} {TOTAL_PAGES}
              </p>
              <div className="flex gap-2">
                <SgButton size="sm" onClick={handlePrevious} disabled={paginaAtual <= 1}>
                  {texts.section6PreviousButton}
                </SgButton>
                <SgButton size="sm" onClick={handleProxima} disabled={paginaAtual >= TOTAL_PAGES}>
                  {texts.section6NextButton}
                </SgButton>
              </div>
            </div>
          </div>
          <CodeBlockBase code={PAGINATION_CODE} />
        </Section>

        <Section title={texts.section7Title} description={texts.section7Description}>
          <SgPlayground
            title="SgDiscardDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

