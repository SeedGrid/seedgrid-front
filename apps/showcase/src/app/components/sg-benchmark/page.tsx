"use client";

import React from "react";
import { flushSync } from "react-dom";
import { SgInputText } from "@seedgrid/fe-components";

const FIELD_COUNT = 60;
const UPDATES = 200;

function ControlledBenchmark() {
  const [values, setValues] = React.useState<string[]>(
    () => Array.from({ length: FIELD_COUNT }, () => "")
  );
  const [lastMs, setLastMs] = React.useState<number | null>(null);

  const [isRunning, setIsRunning] = React.useState(false);

  const run = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const start = performance.now();
    for (let i = 0; i < UPDATES; i += 1) {
      const idx = i % FIELD_COUNT;
      flushSync(() => {
        setValues((prev) => {
          const next = [...prev];
          next[idx] = (next[idx] ?? "") + "a";
          return next;
        });
      });
      if (i % 10 === 0 && i > 0) {
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      }
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Controlled (state + onChange)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Atualiza estado a cada tecla (simulado). Mede tempo total para {UPDATES} updates.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {values.map((value, idx) => (
          <SgInputText
            key={idx}
            id={`controlled-${idx}`}
            label={`Campo ${idx + 1}`}
            inputProps={{
              value,
              onChange: (event) => {
                const next = event.currentTarget.value;
                setValues((prev) => {
                  const copy = [...prev];
                  copy[idx] = next;
                  return copy;
                });
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
    </section>
  );
}

function UncontrolledBenchmark() {
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
      if (input) input.value = input.value + "a";
    }
    const end = performance.now();
    setLastMs(end - start);
    setIsRunning(false);
  };

  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">Uncontrolled (DOM only)</h2>
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
    </section>
  );
}

export default function BenchmarkPage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Benchmark (Controlled vs Uncontrolled)</h1>
        <p className="mt-2 text-muted-foreground">
          Este teste mede o custo de updates em inputs controlados vs atualizacao direta no DOM.
          Use como comparativo aproximado.
        </p>
      </div>
      <ControlledBenchmark />
      <UncontrolledBenchmark />
    </div>
  );
}
