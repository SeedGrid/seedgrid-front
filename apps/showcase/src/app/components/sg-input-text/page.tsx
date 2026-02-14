"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgInputText } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";
import { t, useShowcaseI18n, type ShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

const SHOW_INLINE_DEMOS = false;

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  const items = React.Children.toArray(props.children);
  const content = SHOW_INLINE_DEMOS ? items : items.slice(-1);

  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{content}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  const i18n = useShowcaseI18n();
  const hydrated = resolveSampleI18nTokens(props.code, i18n);
  const trimmed = hydrated.trimStart();
  const content = trimmed.startsWith("import ") ? hydrated : wrapFullExample(hydrated, i18n);
  return (
    <SgCodeBlockBase
      title="SgInputText Playground"
      code={content}
      interactive
      codeContract="appFile"
      dependencies={{ "react-hook-form": "^7.0.0" }}
    />
  );
}

export default function SgInputTextPage() {
  const i18n = useShowcaseI18n();
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const defaultValues = React.useMemo(
    () => ({
      nome: "",
      required: "",
      requiredCustom: "",
      counter: "",
      minlength: "",
      words: "",
      validation: "",
      controlled: t(i18n, "showcase.component.inputText.defaults.controlled"),
      suffix: t(i18n, "showcase.component.inputText.defaults.suffix"),
      prefix: t(i18n, "showcase.component.inputText.defaults.prefix"),
      both: t(i18n, "showcase.component.inputText.defaults.both"),
      iconbtns: "",
      noborder: "",
      filled: "",
      noclear: "",
      w200: "",
      w300: "",
      disabled: t(i18n, "showcase.component.inputText.defaults.disabled"),
      readonly: t(i18n, "showcase.component.inputText.defaults.readonly"),
      error: "",
      events: ""
    }),
    [i18n.locale]
  );
  const { register, control, handleSubmit, watch, setValue, reset } = useForm<FieldValues>({
    defaultValues: defaultValues as FieldValues
  });
  const basicValue = watch("nome");
  const controlledValue = watch("controlled");
  const suffixRaw = watch("suffix");
  const prefixRaw = watch("prefix");
  const bothRaw = watch("both");
  const iconBtnValue = watch("iconbtns");
  const standaloneNomeRef = React.useRef<HTMLInputElement | null>(null);
  const standaloneEmailRef = React.useRef<HTMLInputElement | null>(null);
  const standaloneCpfRef = React.useRef<HTMLInputElement | null>(null);

  const handleBasicSubmit = (data: FieldValues) => {
    setEventLog((prev) => [`[${t(i18n, "showcase.component.inputText.logs.submit")}] ${JSON.stringify(data)}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    reset(defaultValues as FieldValues);
    if (standaloneNomeRef.current) standaloneNomeRef.current.value = t(i18n, "showcase.component.inputText.defaults.name");
    if (standaloneEmailRef.current) standaloneEmailRef.current.value = t(i18n, "showcase.component.inputText.defaults.email");
    if (standaloneCpfRef.current) standaloneCpfRef.current.value = "12345678909";
  }, [defaultValues, i18n.locale, reset]);

  return (
    <div id="examples-top" className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputText.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputText.subtitle")}
        </p>
      </div>

      {/* â”€â”€ Basico â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.basic.title")}
        description={t(i18n, "showcase.component.inputText.sections.basic.description")}
      >
        <form onSubmit={handleSubmit(handleBasicSubmit)} className="w-80 space-y-2">
          <SgInputText
            id="demo-basic"
            label={t(i18n, "showcase.component.inputText.labels.fullName")}
            name="nome"
            register={register}
          />
          <button
            type="submit"
            className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5"
          >
            {t(i18n, "showcase.component.inputText.actions.submit")}
          </button>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </form>
        <CodeBlock code={loadSample("sg-input-text-example-01.src")} />
      </Section>

      {/* â”€â”€ Required â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.required.title")}
        description={t(i18n, "showcase.component.inputText.sections.required.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-required"
            label={t(i18n, "showcase.component.inputText.labels.requiredField")}
            required
            name="required"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputText
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputText.labels.customMessage")}
            required
            requiredMessage={t(i18n, "showcase.component.inputText.messages.requiredCustom")}
            name="requiredCustom"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-02.src")} />
      </Section>

      {/* â”€â”€ Controlled â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.controlled.title")}
        description={t(i18n, "showcase.component.inputText.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputText
            id="demo-controlled"
            label={t(i18n, "showcase.component.inputText.labels.customerName")}
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
              onClick={() => setValue("controlled", t(i18n, "showcase.component.inputText.values.apiSample"))}
            >
              {t(i18n, "showcase.component.inputText.actions.setApi")}
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setValue("controlled", t(i18n, "showcase.component.inputText.values.otherSample"))}
            >
              {t(i18n, "showcase.component.inputText.actions.setOther")}
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.inputText.actions.clear")}
            </button>
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">{t(i18n, "showcase.component.inputText.labels.howItWorks")}</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t(i18n, "showcase.component.inputText.bullets.controlled.1")}</li>
            <li>{t(i18n, "showcase.component.inputText.bullets.controlled.2")}</li>
            <li>{t(i18n, "showcase.component.inputText.bullets.controlled.3")}</li>
            <li>{t(i18n, "showcase.component.inputText.bullets.controlled.4")}</li>
          </ul>
          <CodeBlock code={loadSample("sg-input-text-example-03.src")} />
        </div>
      </Section>

      {/* â”€â”€ MaxLength + Counter â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.counter.title")}
        description={t(i18n, "showcase.component.inputText.sections.counter.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-counter"
            label={t(i18n, "showcase.component.inputText.labels.max20")}
            maxLength={20}
            showCharCounter
            name="counter"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-04.src")} />
      </Section>

      {/* â”€â”€ MinLength â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.minLength.title")}
        description={t(i18n, "showcase.component.inputText.sections.minLength.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-minlength"
            label={t(i18n, "showcase.component.inputText.labels.min5")}
            minLength={5}
            showCharCounter
            name="minlength"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-05.src")} />
      </Section>

      {/* â”€â”€ MinNumberOfWords â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.minWords.title")}
        description={t(i18n, "showcase.component.inputText.sections.minWords.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-words"
            label={t(i18n, "showcase.component.inputText.labels.min3Words")}
            minNumberOfWords={3}
            minNumberOfWordsMessage={t(i18n, "showcase.component.inputText.messages.min3Words")}
            name="words"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-06.src")} />
      </Section>

      {/* â”€â”€ Custom Validation â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.validation.title")}
        description={t(i18n, "showcase.component.inputText.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-validation"
            label={t(i18n, "showcase.component.inputText.labels.onlyLetters")}
            validation={(v) =>
              /[^\p{L}\s]/u.test(v)
                ? t(i18n, "showcase.component.inputText.messages.onlyLetters")
                : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
            name="validation"
            register={register}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}:{" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-17.src")} />
      </Section>

      {/* â”€â”€ Prefix Icon â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.prefixIcon.title")}
        description={t(i18n, "showcase.component.inputText.sections.prefixIcon.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-prefix"
            label={t(i18n, "showcase.component.inputText.labels.search")}
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            }
            name="prefixIcon"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-07.src")} />
      </Section>

      {/* â”€â”€ Icon Buttons â”€â”€ */}
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Prefixo / Sufixo Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.prefixSuffix.title")}
        description={t(i18n, "showcase.component.inputText.sections.prefixSuffix.description")}
      >
        <div className="w-80 space-y-2">
          <SgInputText
            id="demo-suffix"
            label={t(i18n, "showcase.component.inputText.labels.email")}
            suffixText="@gmail.com"
            name="suffix"
            control={control}
            onChange={(value) =>
              log(`${t(i18n, "showcase.component.inputText.labels.fullValue")}: ${value}`)
            }
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputText.labels.fullValue")}:{" "}
            <code className="rounded bg-muted px-1">{suffixRaw}</code>
          </p>
        </div>
        <div className="w-80 space-y-2">
          <SgInputText
            id="demo-prefix-text"
            label={t(i18n, "showcase.component.inputText.labels.website")}
            prefixText="www."
            name="prefix"
            control={control}
            onChange={(value) =>
              log(`${t(i18n, "showcase.component.inputText.labels.fullValue")}: ${value}`)
            }
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-2 py-1 text-xs hover:bg-muted"
              onClick={() => setValue("prefix", "www.test.com.br")}
            >
              {t(i18n, "showcase.component.inputText.actions.setExternalValue")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputText.labels.fullValue")}:{" "}
            <code className="rounded bg-muted px-1">{prefixRaw}</code>
          </p>
        </div>
        <div className="w-96 space-y-2">
          <SgInputText
            id="demo-both"
            label={t(i18n, "showcase.component.inputText.labels.domain")}
            prefixText="www."
            suffixText=".seedgrid.com.br"
            name="both"
            control={control}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputText.labels.fullValue")}:{" "}
            <code className="rounded bg-muted px-1">{bothRaw}</code>
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-08.src")} />
      </Section>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Icon Buttons Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.iconButtons.title")}
        description={t(i18n, "showcase.component.inputText.sections.iconButtons.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputText
            id="demo-iconbtns"
            label={t(i18n, "showcase.component.inputText.labels.copyText")}
            name="iconbtns"
            register={register}
            iconButtons={[
              <button
                key="copy"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title={t(i18n, "showcase.component.inputText.actions.copy")}
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue);
                  setIconBtnLog((prev) => [
                    `${t(i18n, "showcase.component.inputText.labels.copied")}: "${iconBtnValue}"`,
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
                title={t(i18n, "showcase.component.inputText.actions.showAlert")}
                onClick={() => {
                  setIconBtnLog((prev) => [
                    t(i18n, "showcase.component.inputText.labels.alertTriggered"),
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
                {t(i18n, "showcase.component.inputText.labels.iconButtonsHint")}
              </span>
            ) : (
              iconBtnLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">{t(i18n, "showcase.component.inputText.labels.howItWorks")}</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t(i18n, "showcase.component.inputText.bullets.iconButtons.1")}</li>
            <li>{t(i18n, "showcase.component.inputText.bullets.iconButtons.2")}</li>
            <li>{t(i18n, "showcase.component.inputText.bullets.iconButtons.3")}</li>
          </ul>
          <CodeBlock code={loadSample("sg-input-text-example-09.src")} />
        </div>
      </Section>

      {/* â”€â”€ Sem borda / Filled â”€â”€ */}
      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            withBorder={false}
            name="noborder"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputText
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            filled
            name="filled"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-10.src")} />
      </Section>

      {/* â”€â”€ Sem clear button â”€â”€ */}
      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            clearButton={false}
            name="noclear"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-11.src")} />
      </Section>

      {/* â”€â”€ Width / Border Radius â”€â”€ */}
      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputText
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            width={200}
            name="w200"
            register={register}
          />
          <SgInputText
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            width={300}
            borderRadius={20}
            name="w300"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-12.src")} />
      </Section>

      {/* â”€â”€ Disabled / ReadOnly â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.disabledReadonly.title")}
        description={t(i18n, "showcase.component.inputText.sections.disabledReadonly.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            enabled={false}
            name="disabled"
            register={register}
          />
        </div>
        <div className="w-80">
          <SgInputText
            id="demo-readonly"
            label={t(i18n, "showcase.component.inputText.labels.readonly")}
            readOnly
            name="readonly"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-13.src")} />
      </Section>

      {/* â”€â”€ Erro externo â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.externalError.title")}
        description={t(i18n, "showcase.component.inputText.sections.externalError.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-error"
            label={t(i18n, "showcase.component.inputText.labels.externalError")}
            error={t(i18n, "showcase.component.inputText.messages.externalError")}
            name="error"
            register={register}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-14.src")} />
      </Section>

      {/* ?? Standalone Form ?? */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.standalone.title")}
        description={t(i18n, "showcase.component.inputText.sections.standalone.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputText
            id="standalone-nome"
            label={t(i18n, "showcase.component.inputText.labels.name")}
            inputProps={{ ref: standaloneNomeRef }}
          />
          <SgInputText
            id="standalone-email"
            label={t(i18n, "showcase.component.inputText.labels.emailLabel")}
            inputProps={{ ref: standaloneEmailRef }}
          />
          <SgInputText
            id="standalone-cpf"
            label={t(i18n, "showcase.component.inputText.labels.cpf")}
            inputProps={{ ref: standaloneCpfRef }}
          />
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5"
            onClick={() => {
              const payload = {
                nome: standaloneNomeRef.current?.value ?? "",
                email: standaloneEmailRef.current?.value ?? "",
                cpf: standaloneCpfRef.current?.value ?? ""
              };
              setEventLog((prev) => [`[${t(i18n, "showcase.component.inputText.logs.save")}] ${JSON.stringify(payload)}`, ...prev].slice(0, 10));
            }}
          >
            {t(i18n, "showcase.component.inputText.actions.save")}
          </button>
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-15.src")} />
      </Section>

      {/* â”€â”€ Callbacks / Events â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.inputText.sections.events.title")}
        description={t(i18n, "showcase.component.inputText.sections.events.description")}
      >
        <div className="w-80">
          <SgInputText
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputText.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputText.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputText.logs.onClear"))}
            onValidation={(msg) =>
              log(
                `${t(i18n, "showcase.common.labels.onValidation")}: ${
                  msg ?? t(i18n, "showcase.common.labels.valid")
                }`
              )
            }
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.common.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={loadSample("sg-input-text-example-16.src")} />
      </Section>

      {/* â”€â”€ Props Reference â”€â”€ */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">{t(i18n, "showcase.component.inputText.props.title")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputText.props.headers.prop")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputText.props.headers.type")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputText.props.headers.default")}</th>
                <th className="pb-2 font-semibold">{t(i18n, "showcase.component.inputText.props.headers.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.label")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.labelText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.hintText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.prefixText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">suffixText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.suffixText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.error")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">type</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">&quot;text&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.type")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">placeholder</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">labelText</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.placeholder")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.inputProps")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.maxLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.minLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minNumberOfWords</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.minNumberOfWords")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.prefixIcon")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">iconButtons</td><td className="py-2 pr-4">ReactNode[]</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.iconButtons")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.clearButton")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;100%&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.width")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.borderRadius")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.filled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.withBorder")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.enabled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.readOnly")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">"{t(i18n, "showcase.component.inputText.defaults.requiredMessage")}"</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.requiredMessage")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCounter</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.showCharCounter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value: string) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.validation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateOnBlur</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.validateOnBlur")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg: string | null) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.onValidation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.onChange")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEnter</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.onEnter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.onExit")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClear</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.onClear")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <BackToTopFab targetId="examples-top" />
    </div>
  );
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function parseSampleTokenParams(raw?: string): Record<string, string | number> | undefined {
  if (!raw) return undefined;
  const params: Record<string, string | number> = {};

  for (const part of raw.split(",")) {
    const match = part.match(/^\s*(\w+)\s*:\s*(.+)\s*$/);
    if (!match) continue;
    const key = match[1];
    const expr = match[2];
    if (!key || !expr) continue;
    const value = expr.trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      params[key] = value.slice(1, -1);
      continue;
    }
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      params[key] = Number(value);
      continue;
    }
    params[key] = "...";
  }

  return Object.keys(params).length ? params : undefined;
}

function resolveSampleI18nTokens(source: string, i18n: ShowcaseI18n): string {
  return source.replace(
    /\$\{t\(i18n,\s*"([^"]+)"(?:,\s*\{([\s\S]*?)\})?\s*\)\}/g,
    (_full, key: string, rawParams?: string) => t(i18n, key, parseSampleTokenParams(rawParams))
  );
}

function wrapFullExample(body: string, i18n: ShowcaseI18n) {
  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      nome: "",
      required: "",
      requiredCustom: "",
      counter: "",
      minlength: "",
      words: "",
      validation: "",
      controlled: "${t(i18n, "showcase.component.inputText.defaults.controlled")}",
      suffix: "${t(i18n, "showcase.component.inputText.defaults.suffix")}",
      prefix: "${t(i18n, "showcase.component.inputText.defaults.prefix")}",
      both: "${t(i18n, "showcase.component.inputText.defaults.both")}",
      iconbtns: ""
    }
  });

  const controlledValue = watch("controlled");
  const iconBtnValue = watch("iconbtns");
  const log = (msg: string) => console.log(msg);
  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);`;

  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputText } from "@seedgrid/fe-components";`
  ].join("\n");

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



