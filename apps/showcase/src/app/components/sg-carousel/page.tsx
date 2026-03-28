"use client";

import * as React from "react";
import Link from "next/link";
import { SgCarousel, SgGrid } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function Section(props: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

// Sample items for the carousels (picsum.photos)
const sampleImages = [
  { id: 1, title: "Item 1", url: "https://picsum.photos/1200/700?random=101" },
  { id: 2, title: "Item 2", url: "https://picsum.photos/1200/700?random=102" },
  { id: 3, title: "Item 3", url: "https://picsum.photos/1200/700?random=103" },
  { id: 4, title: "Item 4", url: "https://picsum.photos/1200/700?random=104" },
  { id: 5, title: "Item 5", url: "https://picsum.photos/1200/700?random=105" },
  { id: 6, title: "Item 6", url: "https://picsum.photos/1200/700?random=106" }
];

const createCarouselItems = (items = sampleImages) =>
  items.map((item) => (
    <div
      key={item.id}
      className="relative h-full overflow-hidden rounded-lg text-white shadow-lg"
    >
      <img
        src={item.url}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <SgGrid columns={1} justify="center" align="center" className="absolute inset-0">
        <div className="text-center">
          <h3 className="text-3xl font-bold">{item.title}</h3>
          <p className="mt-2 text-sm opacity-90">Slide {item.id}</p>
        </div>
      </SgGrid>
    </div>
  ));

const CAROUSEL_EXAMPLE_SHARED_CODE = `const sampleImages = [
  { id: 1, title: "Item 1", url: "https://picsum.photos/1200/700?random=101" },
  { id: 2, title: "Item 2", url: "https://picsum.photos/1200/700?random=102" },
  { id: 3, title: "Item 3", url: "https://picsum.photos/1200/700?random=103" },
  { id: 4, title: "Item 4", url: "https://picsum.photos/1200/700?random=104" },
  { id: 5, title: "Item 5", url: "https://picsum.photos/1200/700?random=105" },
  { id: 6, title: "Item 6", url: "https://picsum.photos/1200/700?random=106" }
];

const createCarouselItems = (items = sampleImages) =>
  items.map((item) => (
    <div
      key={item.id}
      className="relative h-full overflow-hidden rounded-lg text-white shadow-lg"
    >
      <img
        src={item.url}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <SgGrid columns={1} justify="center" align="center" className="absolute inset-0">
        <div className="text-center">
          <h3 className="text-3xl font-bold">{item.title}</h3>
          <p className="mt-2 text-sm opacity-90">Slide {item.id}</p>
        </div>
      </SgGrid>
    </div>
  ));
`;

function buildCarouselExampleCode(args: {
  snippet: string;
  useGrid?: boolean;
  inFunctionCode?: string;
}) {
  const imports = 'import { SgCarousel, SgGrid } from "@seedgrid/fe-components";';

  const inFunctionCode = args.inFunctionCode ? `${args.inFunctionCode}\n\n` : "";

  return `import * as React from "react";
${imports}

${CAROUSEL_EXAMPLE_SHARED_CODE}

export default function Example() {
${inFunctionCode}  return (
${args.snippet}
  );
}
`;
}

const EXAMPLE_IDS = [
  "exemplo-1",
  "exemplo-2",
  "exemplo-3",
  "exemplo-4",
  "exemplo-5",
  "exemplo-6",
  "exemplo-7",
  "exemplo-8",
  "exemplo-9",
  "exemplo-10",
  "exemplo-11",
  "exemplo-12",
] as const;

type CarouselTexts = {
  headerSubtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  sectionTitles: string[];
  sectionDescriptions: string[];
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
};

const CAROUSEL_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", CarouselTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Um componente de carrossel responsivo com navegacao horizontal/vertical, autoplay e indicadores.",
    examplesLabel: "Examples",
    propsLinkLabel: "ReferÃªncia de Props",
    sectionTitles: [
      "1) Basico - Horizontal",
      "2) Multiplos Items Visiveis",
      "3) Auto Play",
      "4) Orientacao Vertical",
      "5) Vertical - Multiplos Items",
      "6) Sem Modo Circular",
      "7) Sem Indicadores",
      "8) Sem Navegadores",
      "9) Gap Customizado",
      "10) Com Callbacks",
      "11) Example Responsivo",
      "12) Playground Interativo",
    ],
    sectionDescriptions: [
      "Carrossel horizontal simples com um item visivel por vez",
      "Carrossel mostrando 3 items de uma vez",
      "Carrossel com navegacao automatica (a cada 2 segundos)",
      "Carrossel com navegacao vertical",
      "Carrossel vertical mostrando 3 items de uma vez",
      "Carrossel que para no final (sem loop infinito)",
      "Carrossel sem os indicadores (dots) na parte inferior",
      "Carrossel sem os botoes de navegacao (apenas indicadores)",
      "Carrossel com espacamento personalizado entre items (gap: 32px)",
      "Carrossel com evento de mudanca de indice",
      "Carrossel que se adapta ao tamanho da tela mostrando diferentes quantidades de items",
      "Brinque com as propriedades do carrossel e veja as mudancas em tempo real",
    ],
    propsTitle: "ReferÃªncia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  "pt-PT": {
    headerSubtitle:
      "Um componente de carrossel responsivo com navegacao horizontal/vertical, autoplay e indicadores.",
    examplesLabel: "Examples",
    propsLinkLabel: "ReferÃªncia de Props",
    sectionTitles: [
      "1) Basico - Horizontal",
      "2) Multiplos Items Visiveis",
      "3) Auto Play",
      "4) Orientacao Vertical",
      "5) Vertical - Multiplos Items",
      "6) Sem Modo Circular",
      "7) Sem Indicadores",
      "8) Sem Navegadores",
      "9) Gap Customizado",
      "10) Com Callbacks",
      "11) Example Responsivo",
      "12) Playground Interativo",
    ],
    sectionDescriptions: [
      "Carrossel horizontal simples com um item visivel de cada vez",
      "Carrossel a mostrar 3 items de uma vez",
      "Carrossel com navegacao automatica (a cada 2 segundos)",
      "Carrossel com navegacao vertical",
      "Carrossel vertical a mostrar 3 items de uma vez",
      "Carrossel que para no final (sem loop infinito)",
      "Carrossel sem os indicadores (dots) na parte inferior",
      "Carrossel sem os botoes de navegacao (apenas indicadores)",
      "Carrossel com espacamento personalizado entre items (gap: 32px)",
      "Carrossel com evento de mudanca de indice",
      "Carrossel que se adapta ao tamanho do ecra mostrando diferentes quantidades de items",
      "Brinque com as propriedades do carrossel e veja as mudancas em tempo real",
    ],
    propsTitle: "ReferÃªncia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  "en-US": {
    headerSubtitle:
      "A responsive carousel component with horizontal/vertical navigation, autoplay, and indicators.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    sectionTitles: [
      "1) Basic - Horizontal",
      "2) Multiple Visible Items",
      "3) Auto Play",
      "4) Vertical Orientation",
      "5) Vertical - Multiple Items",
      "6) Without Circular Mode",
      "7) Without Indicators",
      "8) Without Navigators",
      "9) Custom Gap",
      "10) With Callbacks",
      "11) Responsive Example",
      "12) Interactive Playground",
    ],
    sectionDescriptions: [
      "Simple horizontal carousel with one visible item at a time",
      "Carousel showing 3 items at once",
      "Carousel with automatic navigation (every 2 seconds)",
      "Carousel with vertical navigation",
      "Vertical carousel showing 3 items at once",
      "Carousel that stops at the end (no infinite loop)",
      "Carousel without bottom indicators (dots)",
      "Carousel without navigation buttons (indicators only)",
      "Carousel with custom spacing between items (gap: 32px)",
      "Carousel with index change callback event",
      "Carousel that adapts to screen size showing different item counts",
      "Play with carousel props and see changes in real time",
    ],
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
  },
  es: {
    headerSubtitle:
      "Un componente de carrusel responsivo con navegacion horizontal/vertical, autoplay e indicadores.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    sectionTitles: [
      "1) Basico - Horizontal",
      "2) Multiples Items Visibles",
      "3) Auto Play",
      "4) Orientacion Vertical",
      "5) Vertical - Multiples Items",
      "6) Sin Modo Circular",
      "7) Sin Indicadores",
      "8) Sin Navegadores",
      "9) Gap Personalizado",
      "10) Con Callbacks",
      "11) Ejemplo Responsivo",
      "12) Playground Interactivo",
    ],
    sectionDescriptions: [
      "Carrusel horizontal simple con un item visible por vez",
      "Carrusel mostrando 3 items al mismo tiempo",
      "Carrusel con navegacion automatica (cada 2 segundos)",
      "Carrusel con navegacion vertical",
      "Carrusel vertical mostrando 3 items al mismo tiempo",
      "Carrusel que se detiene al final (sin loop infinito)",
      "Carrusel sin indicadores (dots) en la parte inferior",
      "Carrusel sin botones de navegacion (solo indicadores)",
      "Carrusel con espaciado personalizado entre items (gap: 32px)",
      "Carrusel con evento de cambio de indice",
      "Carrusel que se adapta al tamano de pantalla mostrando distintas cantidades de items",
      "Juega con las props del carrusel y ve los cambios en tiempo real",
    ],
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
  },
};

type SupportedCarouselLocale = keyof typeof CAROUSEL_TEXTS;

function isSupportedCarouselLocale(locale: ShowcaseLocale): locale is SupportedCarouselLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getCarouselTexts(locale: ShowcaseLocale): CarouselTexts {
  const normalized: SupportedCarouselLocale = isSupportedCarouselLocale(locale) ? locale : "en-US";
  return CAROUSEL_TEXTS[normalized];
}

const CAROUSEL_PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgCarousel,
  SgGrid,
  SgInputSelect,
  SgToggleSwitch,
  SgButton,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const images = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: "Item " + (index + 1),
  url: "https://picsum.photos/1200/700?random=" + (200 + index)
}));

const items = images.map((item) => (
  <div key={item.id} className="relative h-full overflow-hidden rounded-lg text-white shadow-lg">
    <img src={item.url} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
    <div className="pointer-events-none absolute inset-0 bg-black/35" />
    <SgGrid columns={1} justify="center" align="center" className="absolute inset-0">
      <div className="text-center">
        <h3 className="text-3xl font-bold">{item.title}</h3>
        <p className="mt-2 text-sm opacity-90">Slide {item.id}</p>
      </div>
    </SgGrid>
  </div>
));

export default function App() {
  const [numVisible, setNumVisible] = React.useState(1);
  const [numScroll, setNumScroll] = React.useState(1);
  const [orientation, setOrientation] = React.useState<"horizontal" | "vertical">("horizontal");
  const [circular, setCircular] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = React.useState(3000);
  const [showNavigators, setShowNavigators] = React.useState(true);
  const [showIndicators, setShowIndicators] = React.useState(true);
  const [gap, setGap] = React.useState(16);

  const isVertical = orientation === "vertical";
  const visibleOptions = [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: String(value) }));
  const scrollOptions = [1, 2, 3].map((value) => ({ value: String(value), label: String(value) }));
  const orientationOptions = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" }
  ];
  const autoPlayOptions = [1000, 2000, 3000, 5000, 8000, 10000].map((value) => ({
    value: String(value),
    label: value + " ms"
  }));
  const gapOptions = [0, 8, 16, 24, 32, 48, 64].map((value) => ({
    value: String(value),
    label: value + " px"
  }));

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={12}>
        <SgInputSelect
          id="pg-num-visible"
          label={"numVisible (" + numVisible + ")"}
          options={visibleOptions}
          selectProps={{
            value: String(numVisible),
            onChange: (event) => setNumVisible(Number(event.target.value))
          }}
        />

        <SgInputSelect
          id="pg-num-scroll"
          label={"numScroll (" + numScroll + ")"}
          options={scrollOptions}
          selectProps={{
            value: String(numScroll),
            onChange: (event) => setNumScroll(Number(event.target.value))
          }}
        />

        <SgInputSelect
          id="pg-orientation"
          label="orientation"
          options={orientationOptions}
          selectProps={{
            value: orientation,
            onChange: (event) => setOrientation(event.target.value as "horizontal" | "vertical")
          }}
        />

        <SgInputSelect
          id="pg-autoplay-interval"
          label={"autoPlayInterval (" + autoPlayInterval + " ms)"}
          options={autoPlayOptions}
          selectProps={{
            value: String(autoPlayInterval),
            onChange: (event) => setAutoPlayInterval(Number(event.target.value))
          }}
        />

        <SgInputSelect
          id="pg-gap"
          label={"gap (" + gap + " px)"}
          options={gapOptions}
          selectProps={{
            value: String(gap),
            onChange: (event) => setGap(Number(event.target.value))
          }}
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8}>
        <SgToggleSwitch id="pg-circular" label="circular" checked={circular} onChange={setCircular} />
        <SgToggleSwitch id="pg-autoplay" label="autoPlay" checked={autoPlay} onChange={setAutoPlay} />
        <SgToggleSwitch
          id="pg-show-navigators"
          label="showNavigators"
          checked={showNavigators}
          onChange={setShowNavigators}
        />
        <SgToggleSwitch
          id="pg-show-indicators"
          label="showIndicators"
          checked={showIndicators}
          onChange={setShowIndicators}
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={8}>
        <SgButton
          size="sm"
          appearance="outline"
          onClick={() => {
            setNumVisible(1);
            setNumScroll(1);
            setOrientation("horizontal");
            setCircular(true);
            setAutoPlay(false);
            setAutoPlayInterval(3000);
            setShowNavigators(true);
            setShowIndicators(true);
            setGap(16);
          }}
        >
          Resetar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOrientation("vertical")}>
          Vertical
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOrientation("horizontal")}>
          Horizontal
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAutoPlay((prev) => !prev)}>
          Toggle AutoPlay
        </SgButton>
      </SgGrid>

      <div className={isVertical ? "mx-auto h-96 w-80" : "h-64 w-full"}>
        <SgCarousel
          items={items}
          numVisible={numVisible}
          numScroll={numScroll}
          orientation={orientation}
          circular={circular}
          autoPlay={autoPlay}
          autoPlayInterval={autoPlayInterval}
          showNavigators={showNavigators}
          showIndicators={showIndicators}
          gap={gap}
          height="100%"
        />
      </div>
    </div>
  );
}
`;

const CAROUSEL_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador unico do carrossel." },
  {
    prop: "items",
    type: "ReactNode[]",
    defaultValue: "-",
    description: "Array de itens exibidos no carrossel (obrigatorio)."
  },
  { prop: "numVisible", type: "number", defaultValue: "1", description: "Numero de itens visiveis ao mesmo tempo." },
  { prop: "numScroll", type: "number", defaultValue: "1", description: "Numero de itens rolados por acao." },
  {
    prop: "orientation",
    type: "\"horizontal\" | \"vertical\"",
    defaultValue: "\"horizontal\"",
    description: "Orientacao do carrossel."
  },
  { prop: "circular", type: "boolean", defaultValue: "true", description: "Ativa loop infinito." },
  { prop: "autoPlay", type: "boolean", defaultValue: "false", description: "Ativa navegacao automatica." },
  {
    prop: "autoPlayInterval",
    type: "number",
    defaultValue: "3000",
    description: "Intervalo do autoplay em milissegundos."
  },
  { prop: "showNavigators", type: "boolean", defaultValue: "true", description: "Mostra botoes de navegacao." },
  { prop: "showIndicators", type: "boolean", defaultValue: "true", description: "Mostra indicadores (dots)." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe CSS customizada do container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style adicional do container." },
  { prop: "itemClassName", type: "string", defaultValue: "-", description: "Classe CSS customizada dos itens." },
  { prop: "width", type: "number | string", defaultValue: "\"100%\"", description: "Largura do container." },
  { prop: "height", type: "number | string", defaultValue: "-", description: "Altura do container." },
  { prop: "gap", type: "number", defaultValue: "16", description: "Espacamento entre itens em pixels." },
  {
    prop: "onIndexChange",
    type: "(index: number) => void",
    defaultValue: "-",
    description: "Callback chamado quando o indice ativo muda."
  },
  {
    prop: "customNavigators",
    type: "{ prev?: ReactNode; next?: ReactNode }",
    defaultValue: "-",
    description: "Botoes de navegacao customizados."
  }
];

export default function SgCarouselPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getCarouselTexts(i18n.locale), [i18n.locale]);
  const [activeIndex1, setActiveIndex1] = React.useState(0);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const sectionTitle = React.useCallback((index: number) => texts.sectionTitles[index - 1] ?? "", [texts]);
  const sectionDescription = React.useCallback(
    (index: number) => texts.sectionDescriptions[index - 1] ?? "",
    [texts]
  );

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, []);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl =
      (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        const next = Math.max(0, window.scrollY + delta);
        window.scrollTo({ top: next, behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      const next = Math.max(0, container.scrollTop + delta);
      container.scrollTo({ top: next, behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  return (
    <I18NReady>
      <div
        className="max-w-7xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgCarousel</h1>
            <p className="mt-2 text-muted-foreground">
              {texts.headerSubtitle}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {texts.examplesLabel}
            </p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {EXAMPLE_IDS.map((exampleId, index) => (
                <Link
                  key={exampleId}
                  href={`#${exampleId}`}
                  onClick={(event) => handleAnchorClick(event, exampleId)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {sectionTitle(index + 1)}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                {texts.propsLinkLabel}
              </Link>
            </SgGrid>
          </div>
        </div>

      {/* Basic Horizontal */}
      <Section
        id="exemplo-1"
        title={sectionTitle(1)}
        description={sectionDescription(1)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems()}
            numVisible={1}
            orientation="horizontal"
            height="100%"
            style={{ borderRadius: 12, overflow: "hidden" }}
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/basico-horizontal.tsx.sample" />
      </Section>

      {/* Multiple Items Visible */}
      <Section
        id="exemplo-2"
        title={sectionTitle(2)}
        description={sectionDescription(2)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems()}
            numVisible={3}
            numScroll={1}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/multiplos-items-visiveis.tsx.sample" />
      </Section>

      {/* Auto Play */}
      <Section
        id="exemplo-3"
        title={sectionTitle(3)}
        description={sectionDescription(3)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 6))}
            numVisible={1}
            autoPlay
            autoPlayInterval={2000}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/auto-play.tsx.sample" />
      </Section>

      {/* Vertical Orientation */}
      <Section
        id="exemplo-4"
        title={sectionTitle(4)}
        description={sectionDescription(4)}
      >
        <SgGrid columns={1} justify="center">
          <div className="h-96 w-80">
            <SgCarousel
              items={createCarouselItems(sampleImages.slice(0, 6))}
              numVisible={1}
              orientation="vertical"
              height="100%"
            />
          </div>
        </SgGrid>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/orientacao-vertical.tsx.sample" />
      </Section>

      {/* Vertical with Multiple Items */}
      <Section
        id="exemplo-5"
        title={sectionTitle(5)}
        description={sectionDescription(5)}
      >
        <SgGrid columns={1} justify="center">
          <div className="h-96 w-80">
            <SgCarousel
              items={createCarouselItems()}
              numVisible={3}
              numScroll={1}
              orientation="vertical"
              height="100%"
              gap={8}
            />
          </div>
        </SgGrid>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/vertical-multiplos-items.tsx.sample" />
      </Section>

      {/* Without Circular */}
      <Section
        id="exemplo-6"
        title={sectionTitle(6)}
        description={sectionDescription(6)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 6))}
            numVisible={1}
            circular={false}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/sem-modo-circular.tsx.sample" />
      </Section>

      {/* Without Indicators */}
      <Section
        id="exemplo-7"
        title={sectionTitle(7)}
        description={sectionDescription(7)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 6))}
            numVisible={1}
            showIndicators={false}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/sem-indicadores.tsx.sample" />
      </Section>

      {/* Without Navigators */}
      <Section
        id="exemplo-8"
        title={sectionTitle(8)}
        description={sectionDescription(8)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 6))}
            numVisible={1}
            showNavigators={false}
            autoPlay
            autoPlayInterval={2500}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/sem-navegadores.tsx.sample" />
      </Section>

      {/* Custom Gap */}
      <Section
        id="exemplo-9"
        title={sectionTitle(9)}
        description={sectionDescription(9)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems()}
            numVisible={3}
            numScroll={1}
            gap={32}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/gap-customizado.tsx.sample" />
      </Section>

      {/* With Callbacks */}
      <Section
        id="exemplo-10"
        title={sectionTitle(10)}
        description={sectionDescription(10)}
      >
        <div className="space-y-4">
          <div className="rounded bg-muted/40 p-3">
            <p className="text-sm">
              <span className="font-semibold">Ãndice Ativo:</span>{" "}
              <code className="rounded bg-background px-2 py-1">{activeIndex1}</code>
            </p>
          </div>
          <div className="h-64">
            <SgCarousel
              items={createCarouselItems()}
              numVisible={2}
              numScroll={1}
              orientation="horizontal"
              height="100%"
              onIndexChange={(index) => {
                setActiveIndex1(index);
                log(`Ãndice mudou para: ${index}`);
              }}
            />
          </div>
          <div className="h-32 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                Navegue pelo carrossel para ver os eventos...
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/com-callbacks.tsx.sample" />
      </Section>

      {/* Responsive Example */}
      <Section
        id="exemplo-11"
        title={sectionTitle(11)}
        description={sectionDescription(11)}
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems()}
            numVisible={4}
            numScroll={2}
            orientation="horizontal"
            height="100%"
            className="hidden lg:block"
          />
          <SgCarousel
            items={createCarouselItems()}
            numVisible={2}
            numScroll={1}
            orientation="horizontal"
            height="100%"
            className="hidden md:block lg:hidden"
          />
          <SgCarousel
            items={createCarouselItems()}
            numVisible={1}
            numScroll={1}
            orientation="horizontal"
            height="100%"
            className="block md:hidden"
          />
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-carousel/samples/exemplo-responsivo.tsx.sample" />
      </Section>

      {/* Playground */}
      <Section
        id="exemplo-12"
        title={sectionTitle(12)}
        description={sectionDescription(12)}
      >
        <SgPlayground
          title="SgCarousel Playground"
          interactive
          codeContract="appFile"
          code={CAROUSEL_PLAYGROUND_APP_FILE}
          height={650}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={CAROUSEL_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}







