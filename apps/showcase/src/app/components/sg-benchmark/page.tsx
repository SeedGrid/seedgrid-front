"use client";

import React from "react";
import { SgInputText } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

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
    <section className="rounded-lg border border-border p-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">SgInputText (uncontrolled)</h2>
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
    <section className="rounded-lg border border-border p-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold">Native input (uncontrolled)</h2>
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

export default function BenchmarkPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Benchmark (Uncontrolled)</h1>
        <p className="mt-2 text-muted-foreground">
          Este teste compara o custo de updates em inputs uncontrolled do SgInputText vs input nativo.
          Use como comparativo aproximado.
        </p>
      </div>
      <UncontrolledSgBenchmark />
      <UncontrolledNativeBenchmark />
    </div>
  );
}
