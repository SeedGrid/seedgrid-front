"use client";

import React from "react";
import { SgButton, SgPlayground, SgSlider } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

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

const EXAMPLE_BASIC_CODE = `import React from "react";
import { SgSlider } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(50);

  return (
    <div className="max-w-sm space-y-2">
      <SgSlider
        id="slider-basic"
        minValue={0}
        maxValue={100}
        defaultValue={50}
        onChange={setValue}
      />
      <p className="text-sm text-muted-foreground">
        Valor atual: <span className="font-semibold text-foreground">{value}</span>
      </p>
    </div>
  );
}`;

const EXAMPLE_CONTROLLED_CODE = `import React from "react";
import { SgButton, SgSlider } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="max-w-sm space-y-3">
      <SgSlider
        id="slider-controlled"
        minValue={0}
        maxValue={100}
        value={value}
        onChange={setValue}
      />
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>Min</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(50)}>Meio</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(100)}>Max</SgButton>
      </div>
      <p className="text-sm text-muted-foreground">
        Valor controlado: <span className="font-semibold text-foreground">{value}</span>
      </p>
    </div>
  );
}`;

const EXAMPLE_STEP_WIDTH_CODE = `import React from "react";
import { SgSlider } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(25);

  return (
    <div className="space-y-3">
      <SgSlider
        id="slider-step-width-number"
        minValue={0}
        maxValue={60}
        step={5}
        width={320}
        value={value}
        onChange={setValue}
      />
      <SgSlider
        id="slider-step-width-string"
        minValue={-20}
        maxValue={20}
        step={2}
        width="18rem"
        defaultValue={4}
      />
      <p className="text-sm text-muted-foreground">
        Valor com step 5: <span className="font-semibold text-foreground">{value}</span>
      </p>
    </div>
  );
}`;

const EXAMPLE_ACCESSIBILITY_CODE = `import React from "react";
import { SgSlider } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(40);

  return (
    <div className="space-y-3">
      <SgSlider
        id="slider-aria-class"
        minValue={0}
        maxValue={100}
        value={value}
        width="20rem"
        ariaLabel="Nivel de prioridade"
        className="accent-[#c56a2d]"
        onChange={setValue}
      />
      <SgSlider
        id="slider-disabled"
        minValue={0}
        maxValue={100}
        value={65}
        disabled
        ariaLabel="Slider desabilitado"
        width="20rem"
      />
      <p className="text-sm text-muted-foreground">
        Nivel de prioridade: <span className="font-semibold text-foreground">{value}</span>
      </p>
    </div>
  );
}`;

const EXAMPLE_INPUT_PROPS_CODE = `import React from "react";
import { SgSlider } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(70);
  const [focusCount, setFocusCount] = React.useState(0);

  return (
    <div className="space-y-2">
      <p id="slider-input-props-help" className="text-sm text-muted-foreground">
        Use Tab para focar o slider.
      </p>
      <SgSlider
        id="slider-input-props"
        minValue={0}
        maxValue={100}
        value={value}
        ariaLabel="Volume de notificacoes"
        onChange={setValue}
        inputProps={{
          name: "notificationVolume",
          title: "Volume de notificacoes",
          "aria-describedby": "slider-input-props-help",
          onFocus: () => setFocusCount((prev) => prev + 1)
        }}
      />
      <p className="text-sm text-muted-foreground">
        Valor: <span className="font-semibold text-foreground">{value}</span> | Focos:{" "}
        <span className="font-semibold text-foreground">{focusCount}</span>
      </p>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgSlider } from "@seedgrid/fe-components";

export default function App() {
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(100);
  const [step, setStep] = React.useState(1);
  const [width, setWidth] = React.useState<number | string>(320);
  const [disabled, setDisabled] = React.useState(false);
  const [value, setValue] = React.useState(40);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-5">
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(0); setMax(100); setStep(1); }}>0-100</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(-50); setMax(50); setStep(5); }}>-50 a 50</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setWidth(320)}>Width 320</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setWidth("18rem")}>Width 18rem</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDisabled((prev) => !prev)}>{disabled ? "Habilitar" : "Desabilitar"}</SgButton>
      </div>

      <SgSlider
        id="playground-slider"
        minValue={min}
        maxValue={max}
        step={step}
        value={value}
        width={width}
        disabled={disabled}
        ariaLabel="Slider playground"
        className="accent-[#c56a2d]"
        onChange={setValue}
        inputProps={{
          name: "playgroundSlider",
          title: "Slider playground"
        }}
      />
      <div className="text-sm">Valor atual: {value}</div>
    </div>
  );
}`;

const SLIDER_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador do input." },
  { prop: "minValue", type: "number", defaultValue: "-", description: "Limite minimo do range." },
  { prop: "maxValue", type: "number", defaultValue: "-", description: "Limite maximo do range." },
  { prop: "value", type: "number", defaultValue: "-", description: "Valor atual no modo controlado." },
  { prop: "defaultValue", type: "number", defaultValue: "minValue", description: "Valor inicial no modo nao controlado." },
  { prop: "step", type: "number", defaultValue: "1", description: "Incremento entre posicoes." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Desabilita interacao do slider." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback ao alterar o valor." },
  { prop: "ariaLabel", type: "string", defaultValue: "-", description: "Rotulo de acessibilidade para leitores de tela." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe CSS extra aplicada ao input range." },
  { prop: "width", type: "number | string", defaultValue: "100%", description: "Largura do input (ex.: 320 ou 18rem)." },
  {
    prop: "inputProps",
    type: "InputHTMLAttributes<HTMLInputElement> (parcial)",
    defaultValue: "-",
    description: "Props extras do input nativo, exceto type/id/min/max/step/value/defaultValue/onChange/disabled/aria-label."
  }
];

export default function SgSliderPage() {
  const [basicValue, setBasicValue] = React.useState(50);
  const [controlledValue, setControlledValue] = React.useState(35);
  const [stepWidthValue, setStepWidthValue] = React.useState(25);
  const [accessibilityValue, setAccessibilityValue] = React.useState(40);
  const [inputPropsValue, setInputPropsValue] = React.useState(70);
  const [inputFocusCount, setInputFocusCount] = React.useState(0);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSlider"
          subtitle="Exemplos completos cobrindo todas as props publicas do SgSlider."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="1) Basico" description="Define minValue e maxValue com valor inicial usando defaultValue.">
          <div className="max-w-sm space-y-2">
            <SgSlider
              id="slider-basic"
              minValue={0}
              maxValue={100}
              defaultValue={50}
              onChange={setBasicValue}
            />
            <p className="text-sm text-muted-foreground">
              Valor atual: <span className="font-semibold text-foreground">{basicValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title="2) Controle Externo" description="O valor pode ser setado externamente pela prop value.">
          <div className="max-w-sm space-y-3">
            <SgSlider
              id="slider-controlled"
              minValue={0}
              maxValue={100}
              value={controlledValue}
              onChange={setControlledValue}
            />
            <div className="flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(0)}>Min</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(50)}>Meio</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(100)}>Max</SgButton>
            </div>
            <p className="text-sm text-muted-foreground">
              Valor controlado: <span className="font-semibold text-foreground">{controlledValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_CONTROLLED_CODE} />
        </Section>

        <Section title="3) Step e Width" description="Demonstra step com width numerico e width em string CSS.">
          <div className="space-y-3">
            <SgSlider
              id="slider-step-width-number"
              minValue={0}
              maxValue={60}
              step={5}
              width={320}
              value={stepWidthValue}
              onChange={setStepWidthValue}
            />
            <SgSlider
              id="slider-step-width-string"
              minValue={-20}
              maxValue={20}
              step={2}
              width="18rem"
              defaultValue={4}
            />
            <p className="text-sm text-muted-foreground">
              Valor com step 5: <span className="font-semibold text-foreground">{stepWidthValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_STEP_WIDTH_CODE} />
        </Section>

        <Section title="4) className, ariaLabel e disabled" description="Exibe personalizacao visual, acessibilidade e estado desabilitado.">
          <div className="space-y-3">
            <SgSlider
              id="slider-aria-class"
              minValue={0}
              maxValue={100}
              value={accessibilityValue}
              width="20rem"
              ariaLabel="Nivel de prioridade"
              className="accent-[#c56a2d]"
              onChange={setAccessibilityValue}
            />
            <SgSlider
              id="slider-disabled"
              minValue={0}
              maxValue={100}
              value={65}
              disabled
              ariaLabel="Slider desabilitado"
              width="20rem"
            />
            <p className="text-sm text-muted-foreground">
              Nivel de prioridade: <span className="font-semibold text-foreground">{accessibilityValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_ACCESSIBILITY_CODE} />
        </Section>

        <Section title="5) inputProps" description="Passa atributos nativos do input e eventos adicionais via inputProps.">
          <div className="space-y-2">
            <p id="slider-input-props-help" className="text-sm text-muted-foreground">
              Use Tab para focar o slider.
            </p>
            <SgSlider
              id="slider-input-props"
              minValue={0}
              maxValue={100}
              value={inputPropsValue}
              ariaLabel="Volume de notificacoes"
              onChange={setInputPropsValue}
              inputProps={{
                name: "notificationVolume",
                title: "Volume de notificacoes",
                "aria-describedby": "slider-input-props-help",
                onFocus: () => setInputFocusCount((prev) => prev + 1)
              }}
            />
            <p className="text-sm text-muted-foreground">
              Valor: <span className="font-semibold text-foreground">{inputPropsValue}</span> | Focos:{" "}
              <span className="font-semibold text-foreground">{inputFocusCount}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_INPUT_PROPS_CODE} />
        </Section>

        <Section title="6) Playground" description="Teste min/max, step, width, disabled e inputProps em tempo real.">
          <SgPlayground
            title="SgSlider Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={SLIDER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
