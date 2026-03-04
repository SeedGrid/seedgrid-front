"use client";

import React from "react";
import { SgButton, SgPlayground, SgStepperInput } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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
import { SgStepperInput } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(12);

  return (
    <div className="space-y-2">
      <SgStepperInput
        id="stepper-basic"
        minValue={0}
        maxValue={40}
        step={2}
        defaultValue={12}
        width={210}
        onChange={setValue}
      />
      <p>Valor atual: {value}</p>
    </div>
  );
}`;

const EXAMPLE_CONTROLLED_CODE = `import React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";

export default function Example() {
  const [value, setValue] = React.useState(18);

  return (
    <div className="space-y-3">
      <SgStepperInput
        id="stepper-controlled"
        minValue={10}
        maxValue={30}
        step={1}
        value={value}
        width={210}
        onChange={setValue}
      />
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" appearance="outline" onClick={() => setValue(10)}>10</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(20)}>20</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(30)}>30</SgButton>
      </div>
      <p>Valor controlado: {value}</p>
    </div>
  );
}`;

const EXAMPLE_READONLY_CODE = `import React from "react";
import { SgStepperInput } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SgStepperInput id="stepper-readonly" minValue={0} maxValue={10} value={7} readOnly />
      <SgStepperInput id="stepper-disabled" minValue={0} maxValue={10} value={4} disabled />
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgStepperInput } from "@seedgrid/fe-components";

export default function App() {
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(40);
  const [step, setStep] = React.useState(2);
  const [value, setValue] = React.useState(12);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(0); setMax(40); setStep(2); }}>0-40 / 2</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(-10); setMax(10); setStep(1); }}>-10 a 10 / 1</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => { setMin(100); setMax(1000); setStep(50); }}>100-1000 / 50</SgButton>
      </div>
      <SgStepperInput id="playground-stepper" minValue={min} maxValue={max} step={step} value={value} onChange={setValue} width={220} />
      <div className="text-sm">Valor atual: {value}</div>
    </div>
  );
}`;

const STEPPER_PROPS: ShowcasePropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Identificador do input." },
  { prop: "minValue / maxValue", type: "number", defaultValue: "-", description: "Limites do valor permitido." },
  { prop: "step", type: "number", defaultValue: "1", description: "Incremento/decremento por clique." },
  { prop: "value / defaultValue", type: "number", defaultValue: "- / minValue", description: "Modo controlado ou valor inicial." },
  { prop: "disabled / readOnly", type: "boolean", defaultValue: "false", description: "Bloqueia edicao total ou parcial." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback com valor normalizado." },
  { prop: "ariaLabel", type: "string", defaultValue: "-", description: "Acessibilidade para o input." },
  { prop: "className / inputClassName", type: "string", defaultValue: "-", description: "Classes do container e do campo." },
  { prop: "width", type: "number | string", defaultValue: "auto", description: "Largura do componente." },
  { prop: "inputProps", type: "InputHTMLAttributes (parcial)", defaultValue: "-", description: "Props extras para o input numerico." }
];

type StepperTexts = {
  subtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  playgroundTitle: string;
};

const STEPPER_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", StepperTexts> = {
  "pt-BR": {
    subtitle: "Input numerico com setas de incremento/decremento, limites min/max e callback onChange.",
    section1Title: "1) Basico",
    section1Description: "Ajuste por setas com minValue, maxValue e step.",
    section2Title: "2) Controle Externo",
    section2Description: "Value controlled via value prop.",
    section3Title: "3) Read-only and disabled",
    section3Description: "Demonstra estados readOnly e disabled.",
    section4Title: "4) Playground",
    section4Description: "Teste faixas e passo em tempo real.",
    playgroundTitle: "SgStepperInput Playground"
  },
  "pt-PT": {
    subtitle: "Input numerico com setas de incremento/decremento, limites min/max e callback onChange.",
    section1Title: "1) Basico",
    section1Description: "Ajuste por setas com minValue, maxValue e step.",
    section2Title: "2) Controlo Externo",
    section2Description: "Value controlled via value prop.",
    section3Title: "3) Read-only and disabled",
    section3Description: "Demonstra estados readOnly e disabled.",
    section4Title: "4) Playground",
    section4Description: "Teste faixas e passo em tempo real.",
    playgroundTitle: "SgStepperInput Playground"
  },
  "en-US": {
    subtitle: "Numeric input with increment/decrement controls, min/max limits and onChange callback.",
    section1Title: "1) Basic",
    section1Description: "Arrow adjustment with minValue, maxValue and step.",
    section2Title: "2) External Control",
    section2Description: "Controlled value through the value prop.",
    section3Title: "3) Read-Only and Disabled",
    section3Description: "Demonstrates readOnly and disabled states.",
    section4Title: "4) Playground",
    section4Description: "Test ranges and step in real time.",
    playgroundTitle: "SgStepperInput Playground"
  },
  es: {
    subtitle: "Input numerico con flechas de incremento/decremento, limites min/max y callback onChange.",
    section1Title: "1) Basico",
    section1Description: "Ajuste por flechas con minValue, maxValue y step.",
    section2Title: "2) Control Externo",
    section2Description: "Valor controlado por la prop value.",
    section3Title: "3) Solo Lectura y Deshabilitado",
    section3Description: "Demuestra estados readOnly y disabled.",
    section4Title: "4) Playground",
    section4Description: "Prueba rangos y paso en tiempo real.",
    playgroundTitle: "SgStepperInput Playground"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof STEPPER_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function SgStepperInputPage() {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof STEPPER_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = STEPPER_TEXTS[locale];
  const [basicValue, setBasicValue] = React.useState(12);
  const [controlledValue, setControlledValue] = React.useState(18);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgStepperInput"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="space-y-2">
            <SgStepperInput
              id="stepper-basic"
              minValue={0}
              maxValue={40}
              step={2}
              defaultValue={12}
              width={210}
              onChange={setBasicValue}
            />
            <p className="text-sm text-muted-foreground">
              Valor atual: <span className="font-semibold text-foreground">{basicValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="space-y-3">
            <SgStepperInput
              id="stepper-controlled"
              minValue={10}
              maxValue={30}
              step={1}
              value={controlledValue}
              width={210}
              onChange={setControlledValue}
            />
            <div className="flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(10)}>10</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(20)}>20</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setControlledValue(30)}>30</SgButton>
            </div>
            <p className="text-sm text-muted-foreground">
              Valor controlado: <span className="font-semibold text-foreground">{controlledValue}</span>
            </p>
          </div>
          <CodeBlock code={EXAMPLE_CONTROLLED_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="flex flex-wrap items-center gap-4">
            <SgStepperInput id="stepper-readonly" minValue={0} maxValue={10} value={7} readOnly />
            <SgStepperInput id="stepper-disabled" minValue={0} maxValue={10} value={4} disabled />
          </div>
          <CodeBlock code={EXAMPLE_READONLY_CODE} />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={STEPPER_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
