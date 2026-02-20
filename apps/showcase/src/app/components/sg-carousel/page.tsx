"use client";

import React from "react";
import { SgCarousel, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

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

// Sample items for the carousels
const sampleImages = [
  { id: 1, color: "bg-gradient-to-br from-blue-400 to-blue-600", title: "Item 1" },
  { id: 2, color: "bg-gradient-to-br from-purple-400 to-purple-600", title: "Item 2" },
  { id: 3, color: "bg-gradient-to-br from-pink-400 to-pink-600", title: "Item 3" },
  { id: 4, color: "bg-gradient-to-br from-orange-400 to-orange-600", title: "Item 4" },
  { id: 5, color: "bg-gradient-to-br from-green-400 to-green-600", title: "Item 5" },
  { id: 6, color: "bg-gradient-to-br from-red-400 to-red-600", title: "Item 6" },
  { id: 7, color: "bg-gradient-to-br from-indigo-400 to-indigo-600", title: "Item 7" },
  { id: 8, color: "bg-gradient-to-br from-teal-400 to-teal-600", title: "Item 8" }
];

const createCarouselItems = (items = sampleImages) =>
  items.map((item) => (
    <div
      key={item.id}
      className={`${item.color} flex h-full items-center justify-center rounded-lg text-white shadow-lg`}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold">{item.title}</h3>
        <p className="mt-2 text-sm opacity-90">Slide {item.id}</p>
      </div>
    </div>
  ));

const CAROUSEL_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgCarousel } from "@seedgrid/fe-components";

const palette = [
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-teal-400 to-teal-600"
];

const items = palette.map((color, index) => (
  <div key={index} className={color + " flex h-full items-center justify-center rounded-lg text-white shadow-lg"}>
    <div className="text-center">
      <h3 className="text-3xl font-bold">Item {index + 1}</h3>
      <p className="mt-2 text-sm opacity-90">Slide {index + 1}</p>
    </div>
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

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          <span className="mb-1 block font-medium">numVisible: {numVisible}</span>
          <input type="range" min={1} max={5} value={numVisible} onChange={(e) => setNumVisible(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">numScroll: {numScroll}</span>
          <input type="range" min={1} max={3} value={numScroll} onChange={(e) => setNumScroll(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">orientation</span>
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as "horizontal" | "vertical")} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">autoPlayInterval: {autoPlayInterval}ms</span>
          <input type="range" min={1000} max={10000} step={500} value={autoPlayInterval} onChange={(e) => setAutoPlayInterval(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">gap: {gap}px</span>
          <input type="range" min={0} max={64} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full" />
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={circular} onChange={(e) => setCircular(e.target.checked)} />
          circular
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />
          autoPlay
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={showNavigators} onChange={(e) => setShowNavigators(e.target.checked)} />
          showNavigators
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={showIndicators} onChange={(e) => setShowIndicators(e.target.checked)} />
          showIndicators
        </label>
      </div>

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
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  orientation="horizontal"
  height="256px"
/>`}
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
          code={`<SgCarousel
  items={carouselItems}
  numVisible={3}
  numScroll={1}
  orientation="horizontal"
  height="256px"
/>`}
        />
      </Section>

      {/* Auto Play */}
      <Section
        title="Auto Play"
        description="Carrossel com navegação automática (a cada 2 segundos)"
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 5))}
            numVisible={1}
            autoPlay
            autoPlayInterval={2000}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  autoPlay
  autoPlayInterval={2000}
  orientation="horizontal"
  height="256px"
/>`}
        />
      </Section>

      {/* Vertical Orientation */}
      <Section
        title="Orientação Vertical"
        description="Carrossel com navegação vertical"
      >
        <div className="flex justify-center">
          <div className="h-96 w-80">
            <SgCarousel
              items={createCarouselItems(sampleImages.slice(0, 5))}
              numVisible={1}
              orientation="vertical"
              height="100%"
            />
          </div>
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  orientation="vertical"
  height="384px"
/>`}
        />
      </Section>

      {/* Vertical with Multiple Items */}
      <Section
        title="Vertical - Múltiplos Items"
        description="Carrossel vertical mostrando 3 items de uma vez"
      >
        <div className="flex justify-center">
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
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={3}
  numScroll={1}
  orientation="vertical"
  height="384px"
  gap={8}
/>`}
        />
      </Section>

      {/* Without Circular */}
      <Section
        title="Sem Modo Circular"
        description="Carrossel que para no final (sem loop infinito)"
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 5))}
            numVisible={1}
            circular={false}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  circular={false}
  orientation="horizontal"
  height="256px"
/>`}
        />
      </Section>

      {/* Without Indicators */}
      <Section
        title="Sem Indicadores"
        description="Carrossel sem os indicadores (dots) na parte inferior"
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 5))}
            numVisible={1}
            showIndicators={false}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  showIndicators={false}
  orientation="horizontal"
  height="256px"
/>`}
        />
      </Section>

      {/* Without Navigators */}
      <Section
        title="Sem Navegadores"
        description="Carrossel sem os botões de navegação (apenas indicadores)"
      >
        <div className="h-64">
          <SgCarousel
            items={createCarouselItems(sampleImages.slice(0, 5))}
            numVisible={1}
            showNavigators={false}
            autoPlay
            autoPlayInterval={2500}
            orientation="horizontal"
            height="100%"
          />
        </div>
        <CodeBlock
          code={`<SgCarousel
  items={carouselItems}
  numVisible={1}
  showNavigators={false}
  autoPlay
  autoPlayInterval={2500}
  orientation="horizontal"
  height="256px"
/>`}
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
          code={`<SgCarousel
  items={carouselItems}
  numVisible={3}
  numScroll={1}
  gap={32}
  orientation="horizontal"
  height="256px"
/>`}
        />
      </Section>

      {/* With Callbacks */}
      <Section
        title="Com Callbacks"
        description="Carrossel com evento de mudança de índice"
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
          code={`const [activeIndex, setActiveIndex] = React.useState(0);

<SgCarousel
  items={carouselItems}
  numVisible={2}
  numScroll={1}
  orientation="horizontal"
  height="256px"
  onIndexChange={(index) => {
    setActiveIndex(index);
    console.log('Índice mudou para:', index);
  }}
/>

<p>Índice Ativo: {activeIndex}</p>`}
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
          code={`{/* Desktop: 4 items */}
<SgCarousel
  items={carouselItems}
  numVisible={4}
  numScroll={2}
  className="hidden lg:block"
/>

{/* Tablet: 2 items */}
<SgCarousel
  items={carouselItems}
  numVisible={2}
  numScroll={1}
  className="hidden md:block lg:hidden"
/>

{/* Mobile: 1 item */}
<SgCarousel
  items={carouselItems}
  numVisible={1}
  numScroll={1}
  className="block md:hidden"
/>`}
        />
      </Section>

      {/* Playground */}
      <Section
        title="🎮 Playground Interativo"
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
                <td className="py-2">Callback chamado quando o índice ativo muda</td>
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
  );
}

