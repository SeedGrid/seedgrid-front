"use client";

import * as React from "react";
import {
  SgCarousel,
  SgGrid,
  SgPlayground
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
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

const CAROUSEL_PLAYGROUND_APP_FILE = `import * as React from "react";
import {
  SgButton,
  SgCarousel,
  SgGrid,
  SgInputSelect,
  SgToggleSwitch
} from "@seedgrid/fe-components";

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

export default function SgCarouselPage() {
  const [activeIndex1, setActiveIndex1] = React.useState(0);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <I18NReady>
      <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgCarousel</h1>
        <p className="mt-2 text-muted-foreground">
          Um componente de carrossel responsivo com navegação horizontal/vertical, autoplay e indicadores.
        </p>
      </div>

      {/* Basic Horizontal */}
      <Section
        title="Básico - Horizontal"
        description="Carrossel horizontal simples com um item visível por vez"
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems()}
            numVisible={1}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems()}
        numVisible={1}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Multiple Items Visible */}
      <Section
        title="Múltiplos Items Visíveis"
        description="Carrossel mostrando 3 items de uma vez"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems()}
        numVisible={3}
        numScroll={1}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Auto Play */}
      <Section
        title="Auto Play"
        description="Carrossel com navegação automática (a cada 2 segundos)"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems(sampleImages.slice(0, 6))}
        numVisible={1}
        autoPlay
        autoPlayInterval={2000}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Vertical Orientation */}
      <Section
        title="Orientação Vertical"
        description="Carrossel com navegação vertical"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            useGrid: true,
            snippet: `    <SgGrid columns={1} justify="center">
      <div className="h-96 w-80">
        <SgCarousel
          items={createCarouselItems(sampleImages.slice(0, 6))}
          numVisible={1}
          orientation="vertical"
          height="100%"
        />
      </div>
    </SgGrid>`
          })}
        />
      </Section>

      {/* Vertical with Multiple Items */}
      <Section
        title="Vertical - Múltiplos Items"
        description="Carrossel vertical mostrando 3 items de uma vez"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            useGrid: true,
            snippet: `    <SgGrid columns={1} justify="center">
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
    </SgGrid>`
          })}
        />
      </Section>

      {/* Without Circular */}
      <Section
        title="Sem Modo Circular"
        description="Carrossel que para no final (sem loop infinito)"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems(sampleImages.slice(0, 6))}
        numVisible={1}
        circular={false}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Without Indicators */}
      <Section
        title="Sem Indicadores"
        description="Carrossel sem os indicadores (dots) na parte inferior"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems(sampleImages.slice(0, 6))}
        numVisible={1}
        showIndicators={false}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Without Navigators */}
      <Section
        title="Sem Navegadores"
        description="Carrossel sem os botões de navegação (apenas indicadores)"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems(sampleImages.slice(0, 6))}
        numVisible={1}
        showNavigators={false}
        autoPlay
        autoPlayInterval={2500}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* Custom Gap */}
      <Section
        title="Gap Customizado"
        description="Carrossel com espaçamento personalizado entre items (gap: 32px)"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
      <SgCarousel
        items={createCarouselItems()}
        numVisible={3}
        numScroll={1}
        gap={32}
        orientation="horizontal"
        height="100%"
      />
    </div>`
          })}
        />
      </Section>

      {/* With Callbacks */}
      <Section
        title="Com Callbacks"
        description="Carrossel com evento de mudança de Índice"
      >
        <div className="space-y-4">
          <div className="rounded bg-muted/40 p-3">
            <p className="text-sm">
              <span className="font-semibold">Índice Ativo:</span>{" "}
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
                log(`Índice mudou para: ${index}`);
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
        <CodeBlock
          code={buildCarouselExampleCode({
            inFunctionCode: `  const [activeIndex, setActiveIndex] = React.useState(0);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (message: string) => {
    setEventLog((prev) => [\`[\${new Date().toLocaleTimeString()}] \${message}\`, ...prev].slice(0, 10));
  };`,
            snippet: `    <div className="space-y-4">
      <div className="rounded bg-muted/40 p-3">
        <p className="text-sm">
          <span className="font-semibold">Índice Ativo:</span>{" "}
          <code className="rounded bg-background px-2 py-1">{activeIndex}</code>
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
            setActiveIndex(index);
            log(\`Índice mudou para: \${index}\`);
          }}
        />
      </div>
      <div className="h-32 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {eventLog.length === 0 ? (
          <span className="text-muted-foreground">
            Navegue pelo carrossel para ver os eventos...
          </span>
        ) : (
          eventLog.map((entry, index) => <div key={index}>{entry}</div>)
        )}
      </div>
    </div>`
          })}
        />
      </Section>

      {/* Responsive Example */}
      <Section
        title="Exemplo Responsivo"
        description="Carrossel que se adapta ao tamanho da tela mostrando diferentes quantidades de items"
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
        <CodeBlock
          code={buildCarouselExampleCode({
            snippet: `    <div className="h-64">
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
    </div>`
          })}
        />
      </Section>

      {/* Playground */}
      <Section
        title="Playground Interativo"
        description="Brinque com as propriedades do carrossel e veja as mudanças em tempo real"
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

      {/* Props Reference */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Referência de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrão</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">id</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Identificador único do carrossel</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">items</td>
                <td className="py-2 pr-4">ReactNode[]</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Array de items a serem exibidos no carrossel (obrigatório)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">numVisible</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">1</td>
                <td className="py-2">Número de items visíveis ao mesmo tempo</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">numScroll</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">1</td>
                <td className="py-2">Número de items que rolam por vez</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">orientation</td>
                <td className="py-2 pr-4">&quot;horizontal&quot; | &quot;vertical&quot;</td>
                <td className="py-2 pr-4">&quot;horizontal&quot;</td>
                <td className="py-2">Orientação do carrossel</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">circular</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Ativa modo circular (loop infinito)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">autoPlay</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Ativa navegação automática</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">autoPlayInterval</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">3000</td>
                <td className="py-2">Intervalo de auto play em milissegundos</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">showNavigators</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Mostra botões de navegação</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">showIndicators</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Mostra indicadores (dots)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">className</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Classe CSS customizada para o container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">itemClassName</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Classe CSS customizada para os items</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">width</td>
                <td className="py-2 pr-4">number | string</td>
                <td className="py-2 pr-4">&quot;100%&quot;</td>
                <td className="py-2">Largura do container do carrossel</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">height</td>
                <td className="py-2 pr-4">number | string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Altura do container do carrossel</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">gap</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">16</td>
                <td className="py-2">Espaçamento entre items em pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onIndexChange</td>
                <td className="py-2 pr-4">(index: number) =&gt; void</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Callback chamado quando o Índice ativo muda</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">customNavigators</td>
                <td className="py-2 pr-4">{"{ prev?: ReactNode; next?: ReactNode }"}</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Botões de navegação customizados</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </I18NReady>
  );
}





