"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgInputPostalCode, type ViaCepResponse, type PostalCodeCountry } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { getShowcaseI18n, t, useShowcaseI18n } from "../../../i18n";

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
  const i18n = getShowcaseI18n();
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputPostalCode } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { cep: "", controlled: "01001-000" }
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

const COUNTRIES: PostalCodeCountry[] = ["BR", "PT", "US", "ES", "UY", "AR", "PY"];

const PLACEHOLDERS: Record<PostalCodeCountry, string> = {
  BR: "00000-000",
  PT: "0000-000",
  US: "00000",
  ES: "00000",
  UY: "00000",
  AR: "A0000AAA",
  PY: "000000"
};

export default function SgInputPostalCodePage() {
  const i18n = useShowcaseI18n();
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [viaCepResult, setViaCepResult] = React.useState<ViaCepResponse | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const [standaloneSaveResult, setStandaloneSaveResult] = React.useState<string | null>(null);

  const defaultValues = React.useMemo(
    () => ({
      cep: "",
      controlled: "01001-000",
      prefixIcon: "",
      prefix: "",
      suffix: "",
      iconbtns: "",
      noborder: "",
      filled: "",
      w200: "",
      w300: "",
      disabled: "01001-000",
      readonly: "01001-000"
    }),
    []
  );

  const { register, control, watch, setValue, reset } = useForm<FieldValues>({
    defaultValues: defaultValues as FieldValues
  });

  const basicValue = watch("cep");
  const controlledValue = watch("controlled");
  const iconBtnValue = watch("iconbtns");

  const standaloneARef = React.useRef<HTMLInputElement | null>(null);
  const standaloneBRef = React.useRef<HTMLInputElement | null>(null);
  const standaloneCRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    reset(defaultValues as FieldValues);
    if (standaloneARef.current) standaloneARef.current.value = "01001-000";
    if (standaloneBRef.current) standaloneBRef.current.value = "04538-132";
    if (standaloneCRef.current) standaloneCRef.current.value = "20040-020";
  }, [defaultValues, reset]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPostalCode.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputPostalCode.subtitle")}
        </p>
      </div>

      {/* ── Basico ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.basic.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-basic"
            label={t(i18n, "showcase.component.inputPostalCode.labels.BR")}
            hintText="00000-000"
            name="cep"
            register={register}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `"${basicValue}"` })}
          </p>
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="cep"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.BR")}"
  hintText="00000-000"
  name="cep"
  register={register}
/>`} />
      </Section>

      {/* ── Paises ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.countries.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.countries.description")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {COUNTRIES.map((country) => (
            <SgInputPostalCode
              key={country}
              id={`demo-${country}`}
              country={country}
              label={t(i18n, `showcase.component.inputPostalCode.labels.${country}`)}
              hintText={PLACEHOLDERS[country]}
            />
          ))}
        </div>
        <CodeBlock code={`import { SgInputPostalCode } from "@seedgrid/fe-components";

<SgInputPostalCode id="br" country="BR" label="CEP (Brasil)" hintText="00000-000" />
<SgInputPostalCode id="pt" country="PT" label="Codigo postal (Portugal)" hintText="0000-000" />
<SgInputPostalCode id="us" country="US" label="ZIP code (USA)" hintText="00000" />
<SgInputPostalCode id="es" country="ES" label="Codigo postal (Espanha)" hintText="00000" />
<SgInputPostalCode id="uy" country="UY" label="Codigo postal (Uruguai)" hintText="00000" />
<SgInputPostalCode id="ar" country="AR" label="Codigo postal (Argentina)" hintText="A0000AAA" />
<SgInputPostalCode id="py" country="PY" label="Codigo postal (Paraguai)" hintText="000000" />`} />
      </Section>

      {/* ── Required ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.required.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.required.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-required"
            label={t(i18n, "showcase.component.inputPostalCode.labels.required")}
            hintText={t(i18n, "showcase.component.inputPostalCode.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputPostalCode
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputPostalCode.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputPostalCode.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputPostalCode.messages.required")}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="postal"
  label="Codigo postal obrigatorio"
  required
  requiredMessage="Informe o codigo postal."
/>`} />
      </Section>

      {/* ── Controlado (setValue / clear) ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.controlled.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputPostalCode
            id="demo-controlled"
            label={t(i18n, "showcase.component.inputPostalCode.labels.controlled")}
            hintText="00000-000"
            name="controlled"
            control={control}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentState")}:{" "}
            <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setValue("controlled", "04538-132")}
            >
              {t(i18n, "showcase.component.inputPostalCode.actions.setApi")}
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setValue("controlled", "20040-020")}
            >
              {t(i18n, "showcase.component.inputPostalCode.actions.setOther")}
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.inputPostalCode.actions.clear")}
            </button>
          </div>
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="demo-controlled"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.controlled")}"
  hintText="00000-000"
  name="controlled"
  control={control}
/>

<button type="button" onClick={() => setValue("controlled", "04538-132")}>
  ${t(i18n, "showcase.component.inputPostalCode.actions.setApi")}
</button>

<button type="button" onClick={() => setValue("controlled", "20040-020")}>
  ${t(i18n, "showcase.component.inputPostalCode.actions.setOther")}
</button>

<button type="button" onClick={() => setValue("controlled", "")}>
  ${t(i18n, "showcase.component.inputPostalCode.actions.clear")}
</button>

<p>${t(i18n, "showcase.common.labels.currentState")}: "{controlledValue}"</p>`} />
      </Section>

      {/* ── Validacao customizada ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.validation.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-validation"
            label={t(i18n, "showcase.component.inputPostalCode.labels.BR")}
            hintText="00000-000"
            validation={(v) => (v.startsWith("00") ? t(i18n, "showcase.component.inputPostalCode.messages.cannotStart") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="cep"
  label="CEP (Brasil)"
  hintText="00000-000"
  validation={(v) => (v.startsWith("00") ? "CEP nao pode iniciar com 00." : null)}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      {/* ── ViaCEP (BR only) ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.viacep.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.viacep.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-viacep"
            label={t(i18n, "showcase.component.inputPostalCode.labels.BR")}
            hintText="00000-000"
            country="BR"
            validateWithViaCep
            viaCepErrorMessage={t(i18n, "showcase.component.inputPostalCode.messages.viacep")}
            onViaCepResult={(data) => setViaCepResult(data)}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="cep"
  label="CEP (Brasil)"
  hintText="00000-000"
  country="BR"
  validateWithViaCep
  viaCepErrorMessage="CEP invalido."
  onViaCepResult={(data) => console.log(data)}
/>`} />
        {viaCepResult ? (
          <div className="mt-3 w-full rounded border border-border bg-foreground/5 p-3 text-xs">
            <div className="mb-2 text-sm font-semibold">{t(i18n, "showcase.component.inputPostalCode.labels.viacepResult")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(viaCepResult, null, 2)}</pre>
          </div>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.inputPostalCode.notes.viacepUnavailable")}
        </p>
      </Section>

      {/* ── Icone prefixo ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.prefixIcon.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.prefixIcon.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-prefix-icon"
            label={t(i18n, "showcase.component.inputPostalCode.labels.search")}
            hintText="00000-000"
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            }
            name="prefixIcon"
            register={register}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="demo-prefix-icon"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.search")}"
  hintText="00000-000"
  prefixIcon={
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  }
  name="prefixIcon"
  register={register}
/>`} />
      </Section>

      {/* ── Prefixo e sufixo ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.prefixSuffix.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.prefixSuffix.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-prefix-text"
            label={t(i18n, "showcase.component.inputPostalCode.labels.prefixLabel")}
            hintText="00000-000"
            prefixText="CEP:"
            name="prefix"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputPostalCode
            id="demo-suffix-text"
            label={t(i18n, "showcase.component.inputPostalCode.labels.suffixLabel")}
            hintText="00000-000"
            suffixText="BR"
            name="suffix"
            register={register}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="demo-prefix-text"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.prefixLabel")}"
  hintText="00000-000"
  prefixText="CEP:"
  name="prefix"
  register={register}
/>

<SgInputPostalCode
  id="demo-suffix-text"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.suffixLabel")}"
  hintText="00000-000"
  suffixText="BR"
  name="suffix"
  register={register}
/>`} />
      </Section>

      {/* ── Botoes de icone ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.iconButtons.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.iconButtons.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputPostalCode
            id="demo-iconbtns"
            label={t(i18n, "showcase.component.inputPostalCode.labels.copyText")}
            hintText="00000-000"
            name="iconbtns"
            register={register}
            iconButtons={[
              <button
                key="copy"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title={t(i18n, "showcase.component.inputPostalCode.actions.copy")}
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue ?? "");
                  setIconBtnLog((prev) => [
                    `${t(i18n, "showcase.component.inputPostalCode.labels.copied")}: "${iconBtnValue}"`,
                    ...prev
                  ].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>,
              <button
                key="alert"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title={t(i18n, "showcase.component.inputPostalCode.actions.showAlert")}
                onClick={() => {
                  setIconBtnLog((prev) => [
                    t(i18n, "showcase.component.inputPostalCode.labels.alertTriggered"),
                    ...prev
                  ].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </button>
            ]}
          />
          <div className="h-24 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {iconBtnLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.inputPostalCode.labels.iconButtonsHint")}
              </span>
            ) : (
              iconBtnLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="demo-iconbtns"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.copyText")}"
  hintText="00000-000"
  name="iconbtns"
  register={register}
  iconButtons={[
    <button key="copy" type="button" onClick={() => navigator.clipboard.writeText(value)}>
      Copiar
    </button>,
    <button key="alert" type="button" onClick={() => alert("ok")}>
      Alerta
    </button>
  ]}
/>`} />
      </Section>

      {/* ── Variacoes visuais ── */}
      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText="00000-000"
            withBorder={false}
            name="noborder"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputPostalCode
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText="00000-000"
            filled
            name="filled"
            register={register}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="00000-000" withBorder={false} name="noborder" register={register} />
<SgInputPostalCode id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="00000-000" filled name="filled" register={register} />`} />
      </Section>

      {/* ── Largura e borda ── */}
      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputPostalCode
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText="00000-000"
            width={200}
            name="w200"
            register={register}
          />
          <SgInputPostalCode
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText="00000-000"
            width={300}
            borderRadius={20}
            name="w300"
            register={register}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="00000-000" width={200} name="w200" register={register} />
<SgInputPostalCode id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="00000-000" width={300} borderRadius={20} name="w300" register={register} />`} />
      </Section>

      {/* ── Desabilitado e somente leitura ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.disabledReadonly.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.disabledReadonly.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText="00000-000"
            enabled={false}
            name="disabled"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputPostalCode
            id="demo-readonly"
            label={t(i18n, "showcase.component.inputPostalCode.labels.readonly")}
            hintText="00000-000"
            readOnly
            name="readonly"
            register={register}
          />
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="demo-disabled"
  label="${t(i18n, "showcase.common.labels.disabled")}"
  hintText="00000-000"
  enabled={false}
  name="disabled"
  register={register}
/>

<SgInputPostalCode
  id="demo-readonly"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.readonly")}"
  hintText="00000-000"
  readOnly
  name="readonly"
  register={register}
/>`} />
      </Section>

      {/* ── Standalone Form ── */}
      <Section
        title={t(i18n, "showcase.component.inputPostalCode.sections.standalone.title")}
        description={t(i18n, "showcase.component.inputPostalCode.sections.standalone.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputPostalCode
            id="standalone-a"
            label={t(i18n, "showcase.component.inputPostalCode.labels.entry1")}
            hintText="00000-000"
            inputProps={{ ref: standaloneARef }}
          />
          <SgInputPostalCode
            id="standalone-b"
            label={t(i18n, "showcase.component.inputPostalCode.labels.entry2")}
            hintText="00000-000"
            inputProps={{ ref: standaloneBRef }}
          />
          <SgInputPostalCode
            id="standalone-c"
            label={t(i18n, "showcase.component.inputPostalCode.labels.entry3")}
            hintText="00000-000"
            inputProps={{ ref: standaloneCRef }}
          />
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5"
            onClick={() => {
              const payload = {
                entrega: standaloneARef.current?.value ?? "",
                cobranca: standaloneBRef.current?.value ?? "",
                comercial: standaloneCRef.current?.value ?? ""
              };
              setStandaloneSaveResult(JSON.stringify(payload));
            }}
          >
            {t(i18n, "showcase.component.inputPostalCode.actions.save")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputPostalCode.labels.result")}:{" "}
            {standaloneSaveResult ? <code className="rounded bg-muted px-1">{standaloneSaveResult}</code> : "-"}
          </p>
        </div>
        <CodeBlock code={`import React from "react";
import { SgInputPostalCode } from "@seedgrid/fe-components";

export default function Example() {
  const refA = React.useRef<HTMLInputElement | null>(null);
  const refB = React.useRef<HTMLInputElement | null>(null);
  const refC = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (refA.current) refA.current.value = "01001-000";
    if (refB.current) refB.current.value = "04538-132";
    if (refC.current) refC.current.value = "20040-020";
  }, []);

  const handleSave = () => {
    const payload = {
      entrega: refA.current?.value ?? "",
      cobranca: refB.current?.value ?? "",
      comercial: refC.current?.value ?? ""
    };
    console.log("Salvar:", payload);
  };

  return (
    <div className="space-y-3">
      <SgInputPostalCode id="a" label="${t(i18n, "showcase.component.inputPostalCode.labels.entry1")}" hintText="00000-000" inputProps={{ ref: refA }} />
      <SgInputPostalCode id="b" label="${t(i18n, "showcase.component.inputPostalCode.labels.entry2")}" hintText="00000-000" inputProps={{ ref: refB }} />
      <SgInputPostalCode id="c" label="${t(i18n, "showcase.component.inputPostalCode.labels.entry3")}" hintText="00000-000" inputProps={{ ref: refC }} />
      <button type="button" onClick={handleSave}>${t(i18n, "showcase.component.inputPostalCode.actions.save")}</button>
    </div>
  );
}`} />
      </Section>

      {/* ── Eventos standalone ── */}
      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputPostalCode
            id="demo-events"
            label={t(i18n, "showcase.component.inputPostalCode.labels.withEvents")}
            hintText="00000-000"
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputPostalCode.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputPostalCode.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputPostalCode.logs.onClear"))}
            onValidation={(msg) => log(`onValidation: ${msg ?? t(i18n, "showcase.common.labels.valid")}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">{t(i18n, "showcase.common.labels.interactHint")}</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputPostalCode
  id="eventos"
  label="${t(i18n, "showcase.component.inputPostalCode.labels.withEvents")}"
  hintText="00000-000"
  required
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>
    </div>
  );
}
