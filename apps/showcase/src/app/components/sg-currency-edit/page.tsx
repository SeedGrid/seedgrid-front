"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgCurrencyEdit } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

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
  return <CodeBlockBase code={content} />;
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
    `import { SgCurrencyEdit } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      total: "0.00"
    }
  });`;

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

export default function SgCurrencyEditPage() {
  const i18n = useShowcaseI18n();
  const watchValueSnippet = `"{watch("total")}"`;
  const { register, control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      total: "0.00",
      required: "",
      requiredCustom: "",
      controlled: "1234.50",
      usd: "199.99",
      eur: "1250.00",
      noSymbol: "320.00",
      iconbtns: "9876.54",
      positivo: "25.00",
      inteiro: "1200",
      minmax: "55.00",
      vazio: "",
      noborder: "120.00",
      filled: "890.00",
      w200: "10.00",
      w300: "9999.00",
      standalone1: "",
      standalone2: "",
      standalone3: ""
    } as FieldValues
  });

  const basicValue = watch("total");
  const controlledValue = watch("controlled");
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
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.currencyEdit.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.currencyEdit.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.basic.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.basic.description")}
      >
        <form onSubmit={handleSubmit((data) => console.log(data))} className="w-80 space-y-2">
          <SgCurrencyEdit
            id="demo-basic"
            label={t(i18n, "showcase.component.currencyEdit.labels.value")}
            name="total"
            register={register}
            currency="BRL"
          />
          <button type="submit" className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5">
            {t(i18n, "showcase.component.currencyEdit.actions.submit")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.currencyEdit.labels.currentValue", { value: basicValue })}
          </p>
        </form>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-basic"
  label="${t(i18n, "showcase.component.currencyEdit.labels.value")}"
  name="total"
  register={register}
  currency="BRL"
/>

<button type="submit">${t(i18n, "showcase.component.currencyEdit.actions.submit")}</button>

<p>${t(i18n, "showcase.component.currencyEdit.labels.currentValue", { value: watchValueSnippet })}</p>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.required.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.required.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-required"
            label={t(i18n, "showcase.component.currencyEdit.labels.required")}
            required
            name="required"
            register={register}
            currency="BRL"
          />
        </div>
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-required-custom"
            label={t(i18n, "showcase.component.currencyEdit.labels.customMessage")}
            required
            requiredMessage={t(i18n, "showcase.component.currencyEdit.messages.requiredCustom")}
            name="requiredCustom"
            register={register}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-required"
  label="${t(i18n, "showcase.component.currencyEdit.labels.required")}"
  required
  name="required"
  register={register}
  currency="BRL"
/>

<SgCurrencyEdit
  id="demo-required-custom"
  label="${t(i18n, "showcase.component.currencyEdit.labels.customMessage")}"
  required
  requiredMessage="${t(i18n, "showcase.component.currencyEdit.messages.requiredCustom")}"
  name="requiredCustom"
  register={register}
  currency="BRL"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.controlled.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgCurrencyEdit
            id="demo-controlled"
            label={t(i18n, "showcase.component.currencyEdit.labels.controlled")}
            name="controlled"
            control={control}
            currency="BRL"
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.currencyEdit.labels.currentState")}:{" "}
            <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setValue("controlled", "12345.00")}
            >
              {t(i18n, "showcase.component.currencyEdit.actions.setApi")}
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setValue("controlled", "0.00")}
            >
              {t(i18n, "showcase.component.currencyEdit.actions.reset")}
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.currencyEdit.actions.clear")}
            </button>
          </div>
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-controlled"
  label="${t(i18n, "showcase.component.currencyEdit.labels.controlled")}"
  name="controlled"
  control={control}
  currency="BRL"
/>

<button type="button" onClick={() => setValue("controlled", "12345.00")}>
  ${t(i18n, "showcase.component.currencyEdit.actions.setApi")}
</button>

<button type="button" onClick={() => setValue("controlled", "0.00")}>
  ${t(i18n, "showcase.component.currencyEdit.actions.reset")}
</button>

<button type="button" onClick={() => setValue("controlled", "")}>
  ${t(i18n, "showcase.component.currencyEdit.actions.clear")}
</button>

<p>${t(i18n, "showcase.component.currencyEdit.labels.currentState")}: "{controlledValue}"</p>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.validation.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.validation.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-validation"
            label={t(i18n, "showcase.component.currencyEdit.labels.minimum")}
            name="validation"
            register={register}
            currency="BRL"
            validation={(v) => {
              const n = Number(v);
              return Number.isFinite(n) && n >= 1000
                ? null
                : t(i18n, "showcase.component.currencyEdit.messages.min1000");
            }}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.component.currencyEdit.labels.onValidation")}:{" "}
            {validationMsg === null ? t(i18n, "showcase.component.currencyEdit.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-validation"
  label="${t(i18n, "showcase.component.currencyEdit.labels.minimum")}"
  name="validation"
  register={register}
  currency="BRL"
  validation={(v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1000 ? null : "${t(i18n, "showcase.component.currencyEdit.messages.min1000")}";
  }}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.currency.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.currency.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-brl"
            label={t(i18n, "showcase.component.currencyEdit.labels.brl")}
            name="total"
            register={register}
            currency="BRL"
            locale="pt-BR"
          />
        </div>
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-usd"
            label={t(i18n, "showcase.component.currencyEdit.labels.usd")}
            name="usd"
            register={register}
            currency="USD"
            locale="en-US"
          />
        </div>
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-eur"
            label={t(i18n, "showcase.component.currencyEdit.labels.eur")}
            name="eur"
            register={register}
            currency="EUR"
            locale="pt-PT"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-brl"
  label="${t(i18n, "showcase.component.currencyEdit.labels.brl")}"
  name="total"
  register={register}
  currency="BRL"
  locale="pt-BR"
/>

<SgCurrencyEdit
  id="demo-usd"
  label="${t(i18n, "showcase.component.currencyEdit.labels.usd")}"
  name="usd"
  register={register}
  currency="USD"
  locale="en-US"
/>

<SgCurrencyEdit
  id="demo-eur"
  label="${t(i18n, "showcase.component.currencyEdit.labels.eur")}"
  name="eur"
  register={register}
  currency="EUR"
  locale="pt-PT"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.symbol.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.symbol.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-no-symbol"
            label={t(i18n, "showcase.component.currencyEdit.labels.noSymbol")}
            name="noSymbol"
            register={register}
            currency="BRL"
            showCurrencySymbol={false}
          />
        </div>
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-code"
            label={t(i18n, "showcase.component.currencyEdit.labels.codeSuffix")}
            name="codeSuffix"
            register={register}
            currency="USD"
            currencyDisplay="code"
            currencySymbolPlacement="suffix"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-no-symbol"
  label="${t(i18n, "showcase.component.currencyEdit.labels.noSymbol")}"
  name="noSymbol"
  register={register}
  currency="BRL"
  showCurrencySymbol={false}
/>

<SgCurrencyEdit
  id="demo-code"
  label="${t(i18n, "showcase.component.currencyEdit.labels.codeSuffix")}"
  name="codeSuffix"
  register={register}
  currency="USD"
  currencyDisplay="code"
  currencySymbolPlacement="suffix"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.iconButtons.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.iconButtons.description")}
      >
        <div className="w-96 space-y-3">
          <SgCurrencyEdit
            id="demo-iconbtns"
            label={t(i18n, "showcase.component.currencyEdit.labels.copyValue")}
            name="iconbtns"
            register={register}
            currency="BRL"
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
                {t(i18n, "showcase.component.currencyEdit.labels.iconButtonsHint")}
              </span>
            ) : (
              iconBtnLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-iconbtns"
  label="${t(i18n, "showcase.component.currencyEdit.labels.copyValue")}"
  name="iconbtns"
  register={register}
  currency="BRL"
  iconButtons={[
    <button key="copy" type="button" onClick={() => navigator.clipboard.writeText(iconBtnValue ?? "")}>
      Copiar
    </button>,
    <button key="alert" type="button" onClick={() => alert("ok")}>
      Alerta
    </button>
  ]}
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.noNegative.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.noNegative.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-no-negative"
            label={t(i18n, "showcase.component.currencyEdit.labels.positiveOnly")}
            name="positivo"
            register={register}
            allowNegative={false}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-no-negative"
  label="${t(i18n, "showcase.component.currencyEdit.labels.positiveOnly")}"
  name="positivo"
  register={register}
  allowNegative={false}
  currency="BRL"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.noDecimals.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.noDecimals.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-no-decimals"
            label={t(i18n, "showcase.component.currencyEdit.labels.quantity")}
            name="inteiro"
            register={register}
            decimals={0}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-no-decimals"
  label="${t(i18n, "showcase.component.currencyEdit.labels.quantity")}"
  name="inteiro"
  register={register}
  decimals={0}
  currency="BRL"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.minMax.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.minMax.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-minmax"
            label={t(i18n, "showcase.component.currencyEdit.labels.minMax")}
            name="minmax"
            register={register}
            minValue={10}
            maxValue={100}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-minmax"
  label="${t(i18n, "showcase.component.currencyEdit.labels.minMax")}"
  name="minmax"
  register={register}
  minValue={10}
  maxValue={100}
  currency="BRL"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.emptyValue.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.emptyValue.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-empty"
            label={t(i18n, "showcase.component.currencyEdit.labels.canBeEmpty")}
            name="vazio"
            register={register}
            emptyValue="null"
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-empty"
  label="${t(i18n, "showcase.component.currencyEdit.labels.canBeEmpty")}"
  name="vazio"
  register={register}
  emptyValue="null"
  currency="BRL"
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.visual.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.visual.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-noborder"
            label={t(i18n, "showcase.component.currencyEdit.labels.noBorder")}
            withBorder={false}
            name="noborder"
            register={register}
            currency="BRL"
          />
        </div>
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-filled"
            label={t(i18n, "showcase.component.currencyEdit.labels.filled")}
            filled
            name="filled"
            register={register}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit id="demo-noborder" label="${t(i18n, "showcase.component.currencyEdit.labels.noBorder")}" withBorder={false} name="noborder" register={register} currency="BRL" />
<SgCurrencyEdit id="demo-filled" label="${t(i18n, "showcase.component.currencyEdit.labels.filled")}" filled name="filled" register={register} currency="BRL" />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.standalone.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.standalone.description")}
      >
        <div className="w-96 space-y-3">
          <SgCurrencyEdit
            id="standalone-a"
            label={t(i18n, "showcase.component.currencyEdit.labels.entry1")}
            currency="BRL"
            inputProps={{ ref: standaloneARef }}
          />
          <SgCurrencyEdit
            id="standalone-b"
            label={t(i18n, "showcase.component.currencyEdit.labels.entry2")}
            currency="BRL"
            inputProps={{ ref: standaloneBRef }}
          />
          <SgCurrencyEdit
            id="standalone-c"
            label={t(i18n, "showcase.component.currencyEdit.labels.entry3")}
            currency="BRL"
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
            {t(i18n, "showcase.component.currencyEdit.actions.save")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.currencyEdit.labels.result")}:{" "}
            {standaloneSaveResult ? <code className="rounded bg-muted px-1">{standaloneSaveResult}</code> : "-"}
          </p>
        </div>
        <CodeBlock code={`import React from "react";
import { SgCurrencyEdit } from "@seedgrid/fe-components";

export default function Example() {
  const refA = React.useRef<HTMLInputElement | null>(null);
  const refB = React.useRef<HTMLInputElement | null>(null);
  const refC = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (refA.current) refA.current.value = "1200.00";
    if (refB.current) refB.current.value = "55.90";
    if (refC.current) refC.current.value = "980.00";
  }, []);

  const handleSave = () => {
    const payload = {
      a: refA.current?.value ?? "",
      b: refB.current?.value ?? "",
      c: refC.current?.value ?? ""
    };
    console.log("Salvar:", payload);
  };

  return (
    <div className="space-y-3">
      <SgCurrencyEdit id="a" label="${t(i18n, "showcase.component.currencyEdit.labels.entry1")}" currency="BRL" inputProps={{ ref: refA }} />
      <SgCurrencyEdit id="b" label="${t(i18n, "showcase.component.currencyEdit.labels.entry2")}" currency="BRL" inputProps={{ ref: refB }} />
      <SgCurrencyEdit id="c" label="${t(i18n, "showcase.component.currencyEdit.labels.entry3")}" currency="BRL" inputProps={{ ref: refC }} />
      <button type="button" onClick={handleSave}>${t(i18n, "showcase.component.currencyEdit.actions.save")}</button>
    </div>
  );
}`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.events.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.events.description")}
      >
        <div className="w-80">
          <SgCurrencyEdit
            id="demo-events"
            label={t(i18n, "showcase.component.currencyEdit.labels.typeAndLog")}
            required
            currency="BRL"
            onChange={(v) => log(`onChange: ${v}`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.currencyEdit.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-events"
  label="${t(i18n, "showcase.component.currencyEdit.labels.typeAndLog")}"
  required
  currency="BRL"
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.currencyEdit.sections.sizeBorder.title")}
        description={t(i18n, "showcase.component.currencyEdit.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgCurrencyEdit
            id="demo-w200"
            label={t(i18n, "showcase.component.currencyEdit.labels.width200")}
            width={200}
            name="w200"
            register={register}
            currency="BRL"
          />
          <SgCurrencyEdit
            id="demo-w300"
            label={t(i18n, "showcase.component.currencyEdit.labels.width300Rounded")}
            width={300}
            borderRadius={20}
            name="w300"
            register={register}
            currency="BRL"
          />
        </div>
        <CodeBlock code={`<SgCurrencyEdit id="demo-w200" label="${t(i18n, "showcase.component.currencyEdit.labels.width200")}" width={200} name="w200" register={register} currency="BRL" />
<SgCurrencyEdit id="demo-w300" label="${t(i18n, "showcase.component.currencyEdit.labels.width300Rounded")}" width={300} borderRadius={20} name="w300" register={register} currency="BRL" />`} />
      </Section>
    </div>
  );
}
