"use client";

import React from "react";
import Link from "next/link";
import { useForm, type FieldValues } from "react-hook-form";
import {
  SgGrid,
  SgInputText,
  SgPlayground
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code.trimStart()} />;
}

const INPUT_TEXT_PLAYGROUND_CODE = `import * as React from "react";
import { useForm } from "react-hook-form";
import { SgButton, SgGrid, SgInputText } from "@seedgrid/fe-components";

export default function App() {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      value: "SeedGrid"
    }
  });

  const value = watch("value") ?? "";
  const [required, setRequired] = React.useState(false);
  const [showCharCounter, setShowCharCounter] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={showCharCounter ? "solid" : "outline"} onClick={() => setShowCharCounter((prev) => !prev)}>
          showCharCounter
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance={withBorder ? "solid" : "outline"} onClick={() => setWithBorder((prev) => !prev)}>
          withBorder
        </SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("value", "Valor de API")}>
          Set API
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("value", "Outro valor")}>
          Set Outro
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("value", "")}>
          Limpar
        </SgButton>
      </SgGrid>

      <div className="rounded-md border border-border p-4">
        <SgInputText
          id="playground-input-text"
          name="value"
          label="SgInputText Playground"
          control={control}
          required={required}
          showCharCounter={showCharCounter}
          filled={filled}
          withBorder={withBorder}
          maxLength={40}
        />
      </div>

      <div className="rounded-md border border-border p-4">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputText id="label-float" label="Float" hintText="Floating label" labelPosition="float" />
          <SgInputText id="label-top" label="Top" hintText="Label on top" labelPosition="top" />
          <SgInputText
            id="label-left"
            label="Left"
            hintText="Label on left"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
        Valor atual: <strong>{value || "-"}</strong>
      </div>
    </div>
  );
}`;

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
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);
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

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, [i18n.locale]);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;

    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const isScrollable = overflowY === "auto" || overflowY === "scroll";
      if (isScrollable && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }

    return window;
  }, []);

  const navigateToAnchor = React.useCallback(
    (anchorId: string, behavior: ScrollBehavior = "smooth") => {
      const target = document.getElementById(anchorId);
      if (!target) return;

      const scrollContainer = findScrollContainer(target);
      const extraTopGap = 12;
      const stickyBottom = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTop = stickyBottom + extraTopGap;
      const titleEl =
        (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

      const correctIfNeeded = () => {
        const currentTop = titleEl.getBoundingClientRect().top;
        const delta = currentTop - desiredTop;
        if (Math.abs(delta) <= 1) return;

        if (scrollContainer === window) {
          const next = Math.max(0, window.scrollY + delta);
          window.scrollTo({ top: next, behavior: "auto" });
          return;
        }

        const container = scrollContainer as HTMLElement;
        const next = Math.max(0, container.scrollTop + delta);
        container.scrollTo({ top: next, behavior: "auto" });
      };

      if (scrollContainer === window) {
        const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
        const destination = Math.max(0, titleTop - desiredTop);
        window.scrollTo({ top: destination, behavior });
      } else {
        const container = scrollContainer as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const desiredTopInContainer = desiredTop - containerRect.top;
        const titleRect = titleEl.getBoundingClientRect();
        const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
        const destination = Math.max(0, titleTopInContainer - desiredTopInContainer);
        container.scrollTo({ top: destination, behavior });
      }

      window.history.replaceState(null, "", `#${anchorId}`);
      requestAnimationFrame(() => {
        correctIfNeeded();
        requestAnimationFrame(correctIfNeeded);
      });
      window.setTimeout(correctIfNeeded, 120);
      window.setTimeout(correctIfNeeded, 260);
    },
    [findScrollContainer]
  );

  const handleAnchorClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      navigateToAnchor(anchorId);
    },
    [navigateToAnchor]
  );

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const timer = window.setTimeout(() => navigateToAnchor(hash, "auto"), 0);
    return () => window.clearTimeout(timer);
  }, [navigateToAnchor]);

  const exampleLinks = React.useMemo(
    () => [
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputText.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputText.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputText.sections.controlled.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputText.sections.counter.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputText.sections.minLength.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputText.sections.minWords.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputText.sections.validation.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.inputText.sections.prefixIcon.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.component.inputText.sections.prefixSuffix.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.component.inputText.sections.iconButtons.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.common.sections.noClear.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.component.inputText.sections.disabledReadonly.title")}` },
      { id: "exemplo-15", label: `15) ${t(i18n, "showcase.component.inputText.sections.externalError.title")}` },
      { id: "exemplo-16", label: `16) ${t(i18n, "showcase.component.inputText.sections.standalone.title")}` },
      { id: "exemplo-17", label: `17) ${t(i18n, "showcase.component.inputText.sections.events.title")}` },
      { id: "exemplo-18", label: `18) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-19", label: `19) ${t(i18n, "showcase.common.sections.elevation.title")}` },
      { id: "exemplo-20", label: "20) Playground" }
    ],
    [i18n.locale]
  );

  return (
    <I18NReady>
      <div
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputText.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputText.subtitle")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(i18n, "showcase.common.examples")}
            </p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {exampleLinks.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                Props Reference
              </Link>
            </SgGrid>
          </div>
        </div>

      <Section
        id="exemplo-1"
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
        <CodeBlock code={`<SgInputText
  id="demo-basic"
  label="${t(i18n, "showcase.component.inputText.labels.fullName")}"
  name="nome"
  register={register}
/>

<button type="submit">
  ${t(i18n, "showcase.component.inputText.actions.submit")}
</button>

<p>${t(i18n, "showcase.common.labels.currentValue", { value: watch("nome") })}</p>`} />
      </Section>

      <Section
        id="exemplo-2"
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
        <CodeBlock code={`<SgInputText
  id="demo-required"
  label="${t(i18n, "showcase.component.inputText.labels.requiredField")}"
  required
  name="required"
  register={register}
/>

<SgInputText
  id="demo-required-custom"
  label="${t(i18n, "showcase.component.inputText.labels.customMessage")}"
  required
  requiredMessage="${t(i18n, "showcase.component.inputText.messages.requiredCustom")}"
  name="requiredCustom"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-3"
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
          <CodeBlock code={`// Controlled porque usamos watch (valor em tempo real) + setValue externo
<SgInputText
  id="demo-controlled"
  label="${t(i18n, "showcase.component.inputText.labels.customerName")}"
  name="controlled"
  control={control}
/>

<button type="button" onClick={() => setValue("controlled", "${t(i18n, "showcase.component.inputText.values.apiSample")}")}>
  ${t(i18n, "showcase.component.inputText.actions.setApi")}
</button>

<button type="button" onClick={() => setValue("controlled", "${t(i18n, "showcase.component.inputText.values.otherSample")}")}>
  ${t(i18n, "showcase.component.inputText.actions.setOther")}
</button>

<button type="button" onClick={() => setValue("controlled", "")}>
  ${t(i18n, "showcase.component.inputText.actions.clear")}
</button>

<p>${t(i18n, "showcase.common.labels.currentState")}: "{controlledValue}"</p>`} />
        </div>
      </Section>

      <Section
        id="exemplo-4"
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
        <CodeBlock code={`<SgInputText
  id="demo-counter"
  label="${t(i18n, "showcase.component.inputText.labels.max20")}"
  maxLength={20}
  showCharCounter
  name="counter"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-5"
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
        <CodeBlock code={`<SgInputText
  id="demo-minlength"
  label="${t(i18n, "showcase.component.inputText.labels.min5")}"
  minLength={5}
  showCharCounter
  name="minlength"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-6"
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
        <CodeBlock code={`<SgInputText
  id="demo-words"
  label="${t(i18n, "showcase.component.inputText.labels.min3Words")}"
  minNumberOfWords={3}
  minNumberOfWordsMessage="${t(i18n, "showcase.component.inputText.messages.min3Words")}"
  name="words"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-7"
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
        <CodeBlock code={String.raw`<SgInputText
  id="demo-validation"
  label="${t(i18n, "showcase.component.inputText.labels.onlyLetters")}"
  validation={(v) =>
    /[^\p{L}\s]/u.test(v)
      ? "${t(i18n, "showcase.component.inputText.messages.onlyLetters")}"
      : null
  }
  onValidation={(msg) => console.log(msg)}
  name="validation"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-8"
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
        <CodeBlock code={`<SgInputText
  id="demo-prefix"
  label="${t(i18n, "showcase.component.inputText.labels.search")}"
  prefixIcon={
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  }
  name="prefixIcon"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-9"
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
        <CodeBlock code={`<SgInputText
  id="demo-suffix"
  label="${t(i18n, "showcase.component.inputText.labels.email")}"
  suffixText="@gmail.com"
  name="suffix"
  control={control}
  onChange={(value) => log(\`${t(i18n, "showcase.component.inputText.labels.fullValue")}: \${value}\`)}
/>

<SgInputText
  id="demo-prefix-text"
  label="${t(i18n, "showcase.component.inputText.labels.website")}"
  prefixText="www."
  name="prefix"
  control={control}
  onChange={(value) => log(\`${t(i18n, "showcase.component.inputText.labels.fullValue")}: \${value}\`)}
/>

<button type="button" onClick={() => setValue("prefix", "www.test.com.br")}>
  ${t(i18n, "showcase.component.inputText.actions.setExternalValue")}
</button>

<SgInputText
  id="demo-both"
  label="${t(i18n, "showcase.component.inputText.labels.domain")}"
  prefixText="www."
  suffixText=".seedgrid.com.br"
  name="both"
  control={control}
/>`} />
      </Section>

      <Section
        id="exemplo-10"
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
          <CodeBlock code={`<SgInputText
  id="demo-iconbtns"
  label="${t(i18n, "showcase.component.inputText.labels.copyText")}"
  name="iconbtns"
  register={register}
  iconButtons={[
    <button
      key="copy"
      type="button"
      className="text-foreground/60 hover:text-primary"
      title="${t(i18n, "showcase.component.inputText.actions.copy")}"
      onClick={() => {
        navigator.clipboard.writeText(iconBtnValue);
        setIconBtnLog((prev) => [\`${t(i18n, "showcase.component.inputText.labels.copied")}: "\${iconBtnValue}"\`, ...prev].slice(0, 5));
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    </button>,
    <button
      key="alert"
      type="button"
      className="text-foreground/60 hover:text-primary"
      title="${t(i18n, "showcase.component.inputText.actions.showAlert")}"
      onClick={() => {
        setIconBtnLog((prev) => [\`${t(i18n, "showcase.component.inputText.labels.alertTriggered")}\`, ...prev].slice(0, 5));
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    </button>
  ]}
/>`} />
        </div>
      </Section>

      <Section
        id="exemplo-11"
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
        <CodeBlock code={`<SgInputText id="demo-noborder" label="${t(i18n, "showcase.common.labels.noBorder")}" withBorder={false} name="noborder" register={register} />
<SgInputText id="demo-filled" label="${t(i18n, "showcase.common.labels.filled")}" filled name="filled" register={register} />`} />
      </Section>

      <Section
        id="exemplo-12"
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
        <CodeBlock code={`<SgInputText id="demo-noclear" label="${t(i18n, "showcase.common.labels.noClear")}" clearButton={false} name="noclear" register={register} />`} />
      </Section>

      <Section
        id="exemplo-13"
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
        <CodeBlock code={`<SgInputText id="demo-w200" label="${t(i18n, "showcase.common.labels.width200")}" width={200} name="w200" register={register} />
<SgInputText id="demo-w300" label="${t(i18n, "showcase.common.labels.width300Rounded")}" width={300} borderRadius={20} name="w300" register={register} />`} />
      </Section>

      <Section
        id="exemplo-14"
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
        <CodeBlock code={`<SgInputText
  id="demo-disabled"
  label="${t(i18n, "showcase.common.labels.disabled")}"
  enabled={false}
  name="disabled"
  register={register}
/>

<SgInputText
  id="demo-readonly"
  label="${t(i18n, "showcase.component.inputText.labels.readonly")}"
  readOnly
  name="readonly"
  register={register}
/>`} />
      </Section>

      <Section
        id="exemplo-15"
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
        <CodeBlock code={`<SgInputText
  id="demo-error"
  label="${t(i18n, "showcase.component.inputText.labels.externalError")}"
  error="${t(i18n, "showcase.component.inputText.messages.externalError")}"
  name="error"
  register={register}
/>`} />
      </Section>

      {/* ?? Standalone Form ?? */}
      <Section
        id="exemplo-16"
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
        <CodeBlock code={`import React from "react";
import { SgInputText } from "@seedgrid/fe-components";

export default function Example() {
  const nomeRef = React.useRef<HTMLInputElement | null>(null);
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const cpfRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (nomeRef.current) nomeRef.current.value = "${t(i18n, "showcase.component.inputText.defaults.name")}";
    if (emailRef.current) emailRef.current.value = "${t(i18n, "showcase.component.inputText.defaults.email")}";
    if (cpfRef.current) cpfRef.current.value = "12345678909";
  }, []);

  const handleSave = () => {
    const payload = {
      nome: nomeRef.current?.value ?? "",
      email: emailRef.current?.value ?? "",
      cpf: cpfRef.current?.value ?? ""
    };
    console.log("Salvar:", payload);
  };

  return (
    <div className="space-y-3">
      <SgInputText id="nome" label="${t(i18n, "showcase.component.inputText.labels.name")}" inputProps={{ ref: nomeRef }} />
      <SgInputText id="email" label="${t(i18n, "showcase.component.inputText.labels.emailLabel")}" inputProps={{ ref: emailRef }} />
      <SgInputText id="cpf" label="${t(i18n, "showcase.component.inputText.labels.cpf")}" inputProps={{ ref: cpfRef }} />
      <button type="button" onClick={handleSave}>${t(i18n, "showcase.component.inputText.actions.save")}</button>
    </div>
  );
}`} />
      </Section>

      <Section
        id="exemplo-17"
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
        <CodeBlock code={`<SgInputText
  id="demo-events"
  label="${t(i18n, "showcase.common.labels.typeAndLog")}"
  required
  onChange={(v) => log(\`onChange: "\${v}"\`)}
  onEnter={() => log("${t(i18n, "showcase.component.inputText.logs.onEnter")}")} 
  onExit={() => log("${t(i18n, "showcase.component.inputText.logs.onExit")}")} 
  onClear={() => log("${t(i18n, "showcase.component.inputText.logs.onClear")}")} 
  onValidation={(msg) => log(\`${t(i18n, "showcase.common.labels.onValidation")}: \${msg ?? "${t(i18n, "showcase.common.labels.valid")}" }\`)}
/>`} />
      </Section>

      <Section
  id="exemplo-18"
  title={`18) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputText
      id="sg-input-text-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputText
      id="sg-input-text-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
      elevation="md"
      withBorder={false}
    />
    <SgInputText
      id="sg-input-text-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputText
  id="sg-input-text-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputText
  id="sg-input-text-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
  elevation="md"
  withBorder={false}
/>

<SgInputText
  id="sg-input-text-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section
  id="exemplo-19"
  title={`19) ${t(i18n, "showcase.common.sections.elevation.title")}`}
  description={t(i18n, "showcase.common.sections.elevation.description")}
>
  <SgGrid columns={{ base: 1, md: 2 }} gap={8} className="w-full">
    <SgInputText
      id="sg-input-text-elevation-none"
      label={t(i18n, "showcase.common.labels.elevationNone")}
      elevation="none"
    />
    <SgInputText
      id="sg-input-text-elevation-sm"
      label={t(i18n, "showcase.common.labels.elevationSm")}
      elevation="sm"
    />
    <SgInputText
      id="sg-input-text-elevation-md"
      label={t(i18n, "showcase.common.labels.elevationMd")}
      elevation="md"
    />
    <SgInputText
      id="sg-input-text-elevation-lg"
      label={t(i18n, "showcase.common.labels.elevationLg")}
      elevation="lg"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputText
  id="sg-input-text-elevation-none"
  label="${t(i18n, "showcase.common.labels.elevationNone")}"
  elevation="none"
/>

<SgInputText
  id="sg-input-text-elevation-sm"
  label="${t(i18n, "showcase.common.labels.elevationSm")}"
  elevation="sm"
/>

<SgInputText
  id="sg-input-text-elevation-md"
  label="${t(i18n, "showcase.common.labels.elevationMd")}"
  elevation="md"
/>

<SgInputText
  id="sg-input-text-elevation-lg"
  label="${t(i18n, "showcase.common.labels.elevationLg")}"
  elevation="lg"
/>`} />
</Section>

<Section
        id="exemplo-20"
        title="20) Playground"
        description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgInputText" })}
      >
        <SgPlayground
          title="SgInputText Playground"
          interactive
          codeContract="appFile"
          code={INPUT_TEXT_PLAYGROUND_CODE}
          height={720}
          defaultOpen
        />
      </Section>

      {/* Props Reference */}
      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">
          {t(i18n, "showcase.component.inputText.props.title")}
        </h2>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">labelPosition</td><td className="py-2 pr-4">&quot;float&quot; | &quot;top&quot; | &quot;left&quot;</td><td className="py-2 pr-4">&quot;float&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.labelPosition")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelWidth</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;11rem&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.labelWidth")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelAlign</td><td className="py-2 pr-4">&quot;start&quot; | &quot;center&quot; | &quot;end&quot;</td><td className="py-2 pr-4">&quot;start&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.labelAlign")}</td></tr>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">&quot;none&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td><td className="py-2 pr-4">&quot;sm&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputText.props.rows.elevation")}</td></tr>
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
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
