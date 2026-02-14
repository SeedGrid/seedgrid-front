"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgInputNumber } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  const trimmed = props.code.trimStart();
  const content = trimmed.startsWith("import ") ? props.code : wrapFullExample(props.code);
  return <SgCodeBlockBase code={content} />;
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function wrapFullExample(body: string) {
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputNumber } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      valor: "0.00"
    }
  });

  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}

export default function Example() {
  ${indentCode(setup, 2)}

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
${bodyIndented}
    </form>
  );
}`;
}

export default function SgInputNumberPage() {
  const i18n = useShowcaseI18n();
  const watchValueSnippet = `"{watch("valor")}"`;
  const { register, control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      valor: "0.00",
      required: "",
      requiredCustom: "",
      controlled: "1234.00",
      prefix: "1500.00",
      suffix: "42.00",
      both: "3500.00",
      iconbtns: "9876.54",
      negativo: "-1234.00",
      minimo: "5.00",
      vazio: "",
      noborder: "120.00",
      filled: "890.00",
      w200: "10.00",
      w300: "9999.00",
      disabled: "450.00",
      standalone1: "",
      standalone2: "",
      standalone3: ""
    } as FieldValues
  });

  const basicValue = watch("valor");
  const controlledValue = watch("controlled");
  const prefixValue = watch("prefix");
  const suffixValue = watch("suffix");
  const bothValue = watch("both");
  const iconBtnValue = watch("iconbtns");
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [standaloneSaveResult, setStandaloneSaveResult] = React.useState<string | null>(null);
  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const standaloneARef = React.useRef<HTMLInputElement | null>(null);
  const standaloneBRef = React.useRef<HTMLInputElement | null>(null);
  const standaloneCRef = React.useRef<HTMLInputElement | null>(null);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    if (standaloneARef.current) standaloneARef.current.value = "1200.00";
    if (standaloneBRef.current) standaloneBRef.current.value = "55.90";
    if (standaloneCRef.current) standaloneCRef.current.value = "980.00";
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputNumber.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputNumber.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.basic.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.basic.description")}
      >
        <form onSubmit={handleSubmit((data) => console.log(data))} className="w-80 space-y-2">
          <SgInputNumber
            id="demo-basic"
            label={t(i18n, "showcase.component.inputNumber.labels.value")}
            name="valor"
            register={register}
            decimals={2}
          />
          <button type="submit" className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5">
            {t(i18n, "showcase.component.inputNumber.actions.submit")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.currentValue", { value: basicValue })}
          </p>
        </form>
        <CodeBlock code={loadSample("sg-input-number-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.required.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.required.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-required"
            label={t(i18n, "showcase.component.inputNumber.labels.required")}
            required
            name="required"
            register={register}
            decimals={2}
          />
        </div>
        <div className="w-80">
          <SgInputNumber
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputNumber.labels.customMessage")}
            required
            requiredMessage={t(i18n, "showcase.component.inputNumber.messages.requiredCustom")}
            name="requiredCustom"
            register={register}
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-02.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.controlled.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputNumber
            id="demo-controlled"
            label={t(i18n, "showcase.component.inputNumber.labels.controlled")}
            name="controlled"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.currentState")}:{" "}
            <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setValue("controlled", "12345.00")}
            >
              {t(i18n, "showcase.component.inputNumber.actions.setApi")}
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setValue("controlled", "0.00")}
            >
              {t(i18n, "showcase.component.inputNumber.actions.reset")}
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.inputNumber.actions.clear")}
            </button>
          </div>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-03.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.validation.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-validation"
            label={t(i18n, "showcase.component.inputNumber.labels.evenOnly")}
            name="validation"
            register={register}
            decimals={0}
            validation={(v) => {
              const n = Number(v);
              return Number.isFinite(n) && n % 2 === 0
                ? null
                : t(i18n, "showcase.component.inputNumber.messages.evenOnly");
            }}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.onValidation")}:{" "}
            {validationMsg === null ? t(i18n, "showcase.component.inputNumber.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-04.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.prefixIcon.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.prefixIcon.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-prefix-icon"
            label={t(i18n, "showcase.component.inputNumber.labels.search")}
            name="prefixIcon"
            register={register}
            decimals={2}
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            }
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-05.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.prefixSuffix.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.prefixSuffix.description")}
      >
        <div className="w-80 space-y-2">
          <SgInputNumber
            id="demo-prefix-text"
            label={t(i18n, "showcase.component.inputNumber.labels.price")}
            prefixText="R$"
            name="prefix"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.valueLabel")}:{" "}
            <code className="rounded bg-muted px-1">{prefixValue}</code>
          </p>
        </div>
        <div className="w-80 space-y-2">
          <SgInputNumber
            id="demo-suffix-text"
            label={t(i18n, "showcase.component.inputNumber.labels.weight")}
            suffixText="kg"
            name="suffix"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.valueLabel")}:{" "}
            <code className="rounded bg-muted px-1">{suffixValue}</code>
          </p>
        </div>
        <div className="w-96 space-y-2">
          <SgInputNumber
            id="demo-both"
            label={t(i18n, "showcase.component.inputNumber.labels.total")}
            prefixText="R$"
            suffixText="m"
            name="both"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.valueLabel")}:{" "}
            <code className="rounded bg-muted px-1">{bothValue}</code>
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-06.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.iconButtons.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.iconButtons.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputNumber
            id="demo-iconbtns"
            label={t(i18n, "showcase.component.inputNumber.labels.copyNumber")}
            name="iconbtns"
            register={register}
            decimals={2}
            iconButtons={[
              <button
                key="copy"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title="Copiar valor"
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue ?? "");
                  setIconBtnLog((prev) => [`Copiado: "${iconBtnValue}"`, ...prev].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>,
              <button
                key="alert"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title="Exibir alerta"
                onClick={() => {
                  setIconBtnLog((prev) => ["Alerta disparado!", ...prev].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </button>
            ]}
          />
          <div className="h-24 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {iconBtnLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.inputNumber.labels.iconButtonsHint")}
              </span>
            ) : (
              iconBtnLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-07.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.noNegative.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.noNegative.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-no-negative"
            label={t(i18n, "showcase.component.inputNumber.labels.positiveOnly")}
            name="positivo"
            register={register}
            allowNegative={false}
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-08.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.noDecimals.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.noDecimals.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-no-decimals"
            label={t(i18n, "showcase.component.inputNumber.labels.quantity")}
            name="inteiro"
            register={register}
            decimals={0}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-09.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.minMax.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.minMax.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-minmax"
            label={t(i18n, "showcase.component.inputNumber.labels.minMax")}
            name="minmax"
            register={register}
            minValue={10}
            maxValue={100}
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-10.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.emptyValue.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.emptyValue.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-empty"
            label={t(i18n, "showcase.component.inputNumber.labels.canBeEmpty")}
            name="vazio"
            register={register}
            emptyValue="null"
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-11.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.visual.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-noborder"
            label={t(i18n, "showcase.component.inputNumber.labels.noBorder")}
            withBorder={false}
            name="noborder"
            register={register}
            decimals={2}
          />
        </div>
        <div className="w-80">
          <SgInputNumber
            id="demo-filled"
            label={t(i18n, "showcase.component.inputNumber.labels.filled")}
            filled
            name="filled"
            register={register}
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-12.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.standalone.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.standalone.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputNumber
            id="standalone-a"
            label={t(i18n, "showcase.component.inputNumber.labels.entry1")}
            decimals={2}
            inputProps={{ ref: standaloneARef }}
          />
          <SgInputNumber
            id="standalone-b"
            label={t(i18n, "showcase.component.inputNumber.labels.entry2")}
            decimals={2}
            inputProps={{ ref: standaloneBRef }}
          />
          <SgInputNumber
            id="standalone-c"
            label={t(i18n, "showcase.component.inputNumber.labels.entry3")}
            decimals={2}
            inputProps={{ ref: standaloneCRef }}
          />
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5"
            onClick={() => {
              const payload = {
                a: standaloneARef.current?.value ?? "",
                b: standaloneBRef.current?.value ?? "",
                c: standaloneCRef.current?.value ?? ""
              };
              setStandaloneSaveResult(JSON.stringify(payload));
            }}
          >
            {t(i18n, "showcase.component.inputNumber.actions.save")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.result")}:{" "}
            {standaloneSaveResult ? <code className="rounded bg-muted px-1">{standaloneSaveResult}</code> : "-"}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-13.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.events.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.events.description")}
      >
        <div className="w-80">
          <SgInputNumber
            id="demo-events"
            label={t(i18n, "showcase.component.inputNumber.labels.typeAndLog")}
            required
            decimals={2}
            onChange={(v) => log(`onChange: ${v}`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.inputNumber.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-14.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputNumber.sections.sizeBorder.title")}
        description={t(i18n, "showcase.component.inputNumber.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputNumber
            id="demo-w200"
            label={t(i18n, "showcase.component.inputNumber.labels.width200")}
            width={200}
            name="w200"
            register={register}
            decimals={2}
          />
          <SgInputNumber
            id="demo-w300"
            label={t(i18n, "showcase.component.inputNumber.labels.width300Rounded")}
            width={300}
            borderRadius={20}
            name="w300"
            register={register}
            decimals={2}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-number-example-15.src")} />
      </Section>
    </div>
  );
}


