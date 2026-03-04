"use client";

import React from "react";
import { SgInputText, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

type BenchmarkTexts = {
  headerSubtitle: string;
  playgroundTitle: string;
  playgroundDescription: string;
  propsReferenceTitle: string;
};

const BENCHMARK_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", BenchmarkTexts> = {
  "pt-BR": {
    headerSubtitle: "Comparativo de custo de updates em inputs uncontrolled (SgInputText vs input nativo).",
    playgroundTitle: "Playground",
    playgroundDescription: "Versao reduzida para testar benchmark rapido dentro do Sandpack.",
    propsReferenceTitle: "Referencia de Props",
  },
  "pt-PT": {
    headerSubtitle: "Comparativo de custo de updates em inputs uncontrolled (SgInputText vs input nativo).",
    playgroundTitle: "Playground",
    playgroundDescription: "Versao reduzida para testar benchmark rapido dentro do Sandpack.",
    propsReferenceTitle: "Referencia de Props",
  },
  "en-US": {
    headerSubtitle: "Update-cost comparison for uncontrolled inputs (SgInputText vs native input).",
    playgroundTitle: "Playground",
    playgroundDescription: "Reduced version for quick benchmark testing inside Sandpack.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Comparativo de costo de updates en inputs uncontrolled (SgInputText vs input nativo).",
    playgroundTitle: "Playground",
    playgroundDescription: "Version reducida para probar benchmark rapido dentro de Sandpack.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedBenchmarkLocale = keyof typeof BENCHMARK_TEXTS;

function isSupportedBenchmarkLocale(locale: ShowcaseLocale): locale is SupportedBenchmarkLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getBenchmarkTexts(locale: ShowcaseLocale): BenchmarkTexts {
  const normalized: SupportedBenchmarkLocale = isSupportedBenchmarkLocale(locale) ? locale : "en-US";
  return BENCHMARK_TEXTS[normalized];
}

const FIELD_COUNT = 60;
const UPDATES = 200;
const nativeValueSetter =
  typeof window !== "undefined"
    ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    : undefined;

function setInputValue(input: HTMLInputElement, next: string) {
  if (nativeValueSetter) {
    nativeValueSetter.call(input, next);
  } else {
    input.value = next;
  }
}

function UncontrolledSgBenchmark() {
  const [lastMs, setLastMs] = React.useState<number | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const run = () => {
    if (isRunning) return;
    setIsRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      const input = inputsRef.current[idx];
      if (input) {
        setInputValue(input, input.value + "a");
        // dispara input para atualizar UI interna do componente (label/counter)
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (i % 10 === 0 && i > 0) {
        // sem rAF para medir custo puro
      }
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  const code = `const FIELD_COUNT = 60;
const UPDATES = 200;
const nativeValueSetter =
  typeof window !== "undefined"
    ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    : undefined;

const setInputValue = (input: HTMLInputElement, next: string) => {
  if (nativeValueSetter) nativeValueSetter.call(input, next);
  else input.value = next;
};

function UncontrolledSgBenchmark() {
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const run = () => {
    if (isRunning) return;
    setIsRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      const input = inputsRef.current[idx];
      if (input) {
        setInputValue(input, input.value + "a");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: FIELD_COUNT }).map((_, idx) => (
          <SgInputText
            key={idx}
            id={\`sg-\${idx}\`}
            label={\`Campo \${idx + 1}\`}
            inputProps={{ ref: (node) => (inputsRef.current[idx] = node) }}
          />
        ))}
      </div>
      <button type="button" onClick={run} disabled={isRunning}>
        {isRunning ? "Rodando..." : "Rodar benchmark"}
      </button>
      <span>Tempo: {lastMs ? \`\${lastMs.toFixed(1)}ms\` : "-"}</span>
    </section>
  );
}`;

  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 data-anchor-title="true" className="text-lg font-semibold">SgInputText (uncontrolled)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atualiza direto no DOM. Mede tempo total para {UPDATES} updates.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: FIELD_COUNT }).map((_, idx) => (
              <SgInputText
                key={idx}
                id={`sg-${idx}`}
                label={`Campo ${idx + 1}`}
                inputProps={{
                  ref: (node) => {
                    inputsRef.current[idx] = node;
                  }
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={run}
              disabled={isRunning}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-black/5"
            >
              {isRunning ? "Rodando..." : "Rodar benchmark"}
            </button>
            <span>Tempo: {lastMs ? `${lastMs.toFixed(1)}ms` : "-"}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-foreground/80">Fonte</div>
          <div className="mt-2">
            <CodeBlockBase code={code} />
          </div>
        </div>
      </div>
    </section>
  );
}

function UncontrolledNativeBenchmark() {
  const [lastMs, setLastMs] = React.useState<number | null>(null);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const run = () => {
    if (isRunning) return;
    setIsRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      const input = inputsRef.current[idx];
      if (input) {
        setInputValue(input, input.value + "a");
      }
      if (i % 10 === 0 && i > 0) {
        // sem rAF para medir custo puro
      }
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  const code = `const FIELD_COUNT = 60;
const UPDATES = 200;
const nativeValueSetter =
  typeof window !== "undefined"
    ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    : undefined;

const setInputValue = (input: HTMLInputElement, next: string) => {
  if (nativeValueSetter) nativeValueSetter.call(input, next);
  else input.value = next;
};

function UncontrolledNativeBenchmark() {
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const run = () => {
    if (isRunning) return;
    setIsRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      const input = inputsRef.current[idx];
      if (input) {
        setInputValue(input, input.value + "a");
      }
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: FIELD_COUNT }).map((_, idx) => (
          <input
            key={idx}
            ref={(node) => (inputsRef.current[idx] = node)}
          />
        ))}
      </div>
      <button type="button" onClick={run} disabled={isRunning}>
        {isRunning ? "Rodando..." : "Rodar benchmark"}
      </button>
      <span>Tempo: {lastMs ? \`\${lastMs.toFixed(1)}ms\` : "-"}</span>
    </section>
  );
}`;

  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 data-anchor-title="true" className="text-lg font-semibold">Native input (uncontrolled)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atualiza direto no DOM (sem setState). Mede tempo total para {UPDATES} updates.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: FIELD_COUNT }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-xs text-foreground/70">Campo {idx + 1}</label>
                <input
                  ref={(node) => {
                    inputsRef.current[idx] = node;
                  }}
                  className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={run}
              disabled={isRunning}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-black/5"
            >
              {isRunning ? "Rodando..." : "Rodar benchmark"}
            </button>
            <span>Tempo: {lastMs ? `${lastMs.toFixed(1)}ms` : "-"}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-foreground/80">Fonte</div>
          <div className="mt-2">
            <CodeBlockBase code={code} />
          </div>
        </div>
      </div>
    </section>
  );
}

const BENCHMARK_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgButton, SgInputText } from "@seedgrid/fe-components";

const FIELD_COUNT = 20;
const UPDATES = 80;

const nativeValueSetter =
  typeof window !== "undefined"
    ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
    : undefined;

const setInputValue = (input: HTMLInputElement, next: string) => {
  if (nativeValueSetter) nativeValueSetter.call(input, next);
  else input.value = next;
};

export default function App() {
  const [lastMs, setLastMs] = React.useState<number | null>(null);
  const [running, setRunning] = React.useState(false);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const run = () => {
    if (running) return;
    setRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      const input = refs.current[idx];
      if (input) {
        setInputValue(input, input.value + "a");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    setLastMs(performance.now() - start);
    setRunning(false);
  };

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: FIELD_COUNT }).map((_, idx) => (
          <SgInputText
            key={idx}
            id={\`play-\${idx}\`}
            label={\`Campo \${idx + 1}\`}
            inputProps={{ ref: (node) => (refs.current[idx] = node) }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <SgButton onClick={run} disabled={running}>{running ? "Rodando..." : "Rodar benchmark"}</SgButton>
        <span className="text-xs">Tempo: {lastMs ? \`\${lastMs.toFixed(1)}ms\` : "-"}</span>
      </div>
    </div>
  );
}`;

const BENCHMARK_PROPS: ShowcasePropRow[] = [
  { prop: "FIELD_COUNT", type: "number", defaultValue: "60", description: "Quantidade de campos renderizados em cada cenario." },
  { prop: "UPDATES", type: "number", defaultValue: "200", description: "Numero de atualizacoes executadas por rodada." },
  { prop: "setInputValue", type: "(input, value) => void", defaultValue: "native setter", description: "Atualiza o valor do input sem re-render global." }
];

export default function BenchmarkPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getBenchmarkTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgBenchmark"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <UncontrolledSgBenchmark />
        <UncontrolledNativeBenchmark />

        <section
          data-showcase-example="true"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{texts.playgroundTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {texts.playgroundDescription}
          </p>
          <div className="mt-4">
            <SgPlayground
              title="SgBenchmark Playground"
              interactive
              codeContract="appFile"
              code={BENCHMARK_PLAYGROUND_APP_FILE}
              height={620}
              defaultOpen
            />
          </div>
        </section>

        <ShowcasePropsReference rows={BENCHMARK_PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
