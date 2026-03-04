"use client";

import React from "react";
import { SgLinearGauge, SgPlayground, type SgLinearGaugePointer } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";

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

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const EXAMPLE_DEFAULT_CODE = `import React from "react";
import { SgLinearGauge } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(64);

  return (
    <SgLinearGauge
      min={0}
      max={100}
      value={value}
      onValueChange={setValue}
      ranges={[
        { start: 0, end: 30, color: "#22c55e" },
        { start: 30, end: 70, color: "#f59e0b" },
        { start: 70, end: 100, color: "#ef4444" }
      ]}
      showTicks
      showLabels
      majorTickCount={5}
      barPointer
      primaryPointerDraggable
    />
  );
}`;

const EXAMPLE_VERTICAL_CODE = `import React from "react";
import { SgLinearGauge, type SgLinearGaugePointer } from "@seedgrid/fe-components";

export default function Example() {
  const [temperature, setTemperature] = React.useState(28);
  const [target, setTarget] = React.useState(72);

  const pointers = React.useMemo<SgLinearGaugePointer[]>(
    () => [
      { id: "target", value: target, color: "hsl(var(--secondary))", shape: "diamond", size: 11, draggable: true },
      { id: "temp", value: temperature, color: "hsl(var(--destructive))", shape: "circle", size: 10, draggable: true }
    ],
    [target, temperature]
  );

  return (
    <SgLinearGauge
      min={-10}
      max={50}
      value={temperature}
      onValueChange={setTemperature}
      orientation="vertical"
      width={140}
      height={360}
      pointers={pointers}
      onPointerValueChange={(pointerId, next) => {
        if (pointerId === "target") setTarget(next);
        if (pointerId === "temp") setTemperature(next);
      }}
      ranges={[
        { start: -10, end: 15, color: "#38bdf8" },
        { start: 15, end: 30, color: "#22c55e" },
        { start: 30, end: 50, color: "#ef4444" }
      ]}
      majorTickCount={6}
      minorTicksPerInterval={1}
      labelFormatter={(v) => \`\${Math.round(v)}°\`}
    />
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgLinearGauge } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState(55);
  const [orientation, setOrientation] = React.useState<"horizontal" | "vertical">("horizontal");
  const [showLabels, setShowLabels] = React.useState(true);
  const [showTicks, setShowTicks] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <SgButton size="sm" appearance="outline" onClick={() => setOrientation("horizontal")}>horizontal</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setOrientation("vertical")}>vertical</SgButton>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <SgButton size="sm" appearance="outline" onClick={() => setShowTicks((v) => !v)}>toggle ticks</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShowLabels((v) => !v)}>toggle labels</SgButton>
      </div>

      <SgLinearGauge
        min={0}
        max={100}
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        width={orientation === "horizontal" ? 360 : 140}
        height={orientation === "horizontal" ? 120 : 360}
        showTicks={showTicks}
        showLabels={showLabels}
        barPointer
        primaryPointerDraggable
        ranges={[
          { start: 0, end: 30, color: "#22c55e" },
          { start: 30, end: 70, color: "#f59e0b" },
          { start: 70, end: 100, color: "#ef4444" }
        ]}
      />
    </div>
  );
}`;

const LINEAR_GAUGE_PROPS: ShowcasePropRow[] = [
  { prop: "min / max", type: "number", defaultValue: "0 / 100", description: "Gauge value range." },
  { prop: "value / defaultValue / onValueChange", type: "number / number / callback", defaultValue: "usage-defined", description: "Primary pointer value and change event." },
  { prop: "pointers / onPointerValueChange", type: "SgLinearGaugePointer[] / callback", defaultValue: "[]", description: "Additional pointers and per-pointer callback." },
  { prop: "ranges", type: "SgLinearGaugeRange[]", defaultValue: "[]", description: "Colored scale ranges." },
  { prop: "orientation / isAxisInversed", type: "\"horizontal|vertical\" / boolean", defaultValue: "horizontal / false", description: "Axis orientation and direction." },
  { prop: "showPrimaryPointer / primaryPointer*", type: "boolean + props", defaultValue: "true", description: "Primary pointer settings (shape, color, size, draggable)." },
  { prop: "barPointer / barColor / barThickness", type: "boolean / string / number", defaultValue: "true / primary / 8", description: "Filled bar up to current value." },
  { prop: "showTicks / showLabels / majorTickCount / minorTicksPerInterval / labelFormatter", type: "tick/label props", defaultValue: "true / true / 5 / 1 / -", description: "Tick and label configuration." },
  { prop: "axisColor / axisThickness", type: "string / number", defaultValue: "border / 10", description: "Main axis style." },
  { prop: "width / height", type: "number", defaultValue: "360x120 (horizontal)", description: "SVG dimensions." },
  { prop: "animate / animationDuration", type: "boolean / number", defaultValue: "true / 350", description: "Transition animation settings." },
  { prop: "className / style / ariaLabel", type: "string / CSSProperties / string", defaultValue: "- / - / Linear gauge", description: "Styling and accessibility." },
  { prop: "SgLinearGaugeRange.start / end / color / thickness / opacity / label", type: "range props", defaultValue: "-", description: "Range configuration." },
  { prop: "SgLinearGaugePointer.id / value / color / size / shape / draggable / onValueChange / label", type: "pointer props", defaultValue: "-", description: "Pointer configuration." }
];

export default function SgLinearGaugePage() {
  const [value, setValue] = React.useState(64);
  const [temperature, setTemperature] = React.useState(28);
  const [target, setTarget] = React.useState(72);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  const pointers = React.useMemo<SgLinearGaugePointer[]>(
    () => [
      { id: "target", value: target, color: "hsl(var(--secondary))", shape: "diamond", size: 11, draggable: true },
      { id: "temp", value: temperature, color: "hsl(var(--destructive))", shape: "circle", size: 10, draggable: true }
    ],
    [target, temperature]
  );

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgLinearGauge"
          subtitle="Linear gauge with axis, ranges, bar pointer, marker pointers, and drag support."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Default (Horizontal)" description="Colored ranges with a controllable primary pointer.">
          <div className="space-y-4 rounded-lg border border-border p-4">
            <SgLinearGauge
              min={0}
              max={100}
              value={value}
              onValueChange={setValue}
              ranges={[
                { start: 0, end: 30, color: "#22c55e" },
                { start: 30, end: 70, color: "#f59e0b" },
                { start: 70, end: 100, color: "#ef4444" }
              ]}
              showTicks
              showLabels
              majorTickCount={5}
              barPointer
              primaryPointerDraggable
            />
            <label className="block text-sm text-muted-foreground">
              Valor: <span className="font-semibold text-foreground">{Math.round(value)}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>
          </div>
          <CodeBlock code={EXAMPLE_DEFAULT_CODE} />
        </Section>

        <Section title="2) Vertical + Multi Pointers" description="Vertical orientation with two draggable pointers.">
          <div className="flex flex-wrap items-start gap-6 rounded-lg border border-border p-4">
            <SgLinearGauge
              min={-10}
              max={50}
              value={temperature}
              onValueChange={setTemperature}
              orientation="vertical"
              width={140}
              height={360}
              primaryPointerColor="#2563eb"
              primaryPointerShape="triangle"
              primaryPointerSize={12}
              primaryPointerDraggable
              pointers={pointers}
              onPointerValueChange={(pointerId, next) => {
                if (pointerId === "target") setTarget(next);
                if (pointerId === "temp") setTemperature(next);
              }}
              ranges={[
                { start: -10, end: 15, color: "#38bdf8" },
                { start: 15, end: 30, color: "#22c55e" },
                { start: 30, end: 50, color: "#ef4444" }
              ]}
              majorTickCount={6}
              minorTicksPerInterval={1}
              labelFormatter={(v) => `${Math.round(v)}°`}
            />

            <div className="space-y-3 text-sm">
              <p>
                Current temperature: <span className="font-semibold">{Math.round(temperature)}°C</span>
              </p>
              <p>
                Target: <span className="font-semibold">{Math.round(target)}°C</span>
              </p>
              <label className="block">
                Current
                <input
                  type="range"
                  min={-10}
                  max={50}
                  value={temperature}
                  onChange={(event) => setTemperature(Number(event.target.value))}
                  className="mt-1 w-56"
                />
              </label>
              <label className="block">
                Target
                <input
                  type="range"
                  min={-10}
                  max={50}
                  value={target}
                  onChange={(event) => setTarget(Number(event.target.value))}
                  className="mt-1 w-56"
                />
              </label>
            </div>
          </div>
          <CodeBlock code={EXAMPLE_VERTICAL_CODE} />
        </Section>

        <Section title="3) Playground" description="Try orientation, ticks, and labels.">
          <SgPlayground
            title="SgLinearGauge Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={660}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={LINEAR_GAUGE_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
