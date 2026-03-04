"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgButton, SgGrid, SgInputNumber, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code.trimStart()} />;
}

const INPUT_NUMBER_PLAYGROUND_CODE = `import * as React from "react";
import { useForm } from "react-hook-form";
import { SgButton, SgGrid, SgInputNumber } from "@seedgrid/fe-components";

export default function App() {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      amount: "1234.50"
    }
  });

  const amount = watch("amount") ?? "";
  const [allowNegative, setAllowNegative] = React.useState(true);
  const [decimals, setDecimals] = React.useState(2);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={allowNegative ? "solid" : "outline"} onClick={() => setAllowNegative((prev) => !prev)}>
          allowNegative
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance={withBorder ? "solid" : "outline"} onClick={() => setWithBorder((prev) => !prev)}>
          withBorder
        </SgButton>
        <SgButton
          size="sm"
          appearance="outline"
          onClick={() => setDecimals((prev) => (prev === 0 ? 2 : prev === 2 ? 4 : 0))}
        >
          decimals: {decimals}
        </SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("amount", "12345.67")}>
          Set API
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("amount", "0.00")}>
          Zero
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("amount", "-250.90")}>
          Negativo
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("amount", "")}>
          Limpar
        </SgButton>
      </SgGrid>

      <div className="rounded-md border border-border p-4">
        <SgInputNumber
          id="playground-input-number"
          label="SgInputNumber Playground"
          name="amount"
          control={control}
          decimals={decimals}
          allowNegative={allowNegative}
          filled={filled}
          withBorder={withBorder}
        />
      </div>

      <div className="rounded-md border border-border p-4">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputNumber id="label-float" label="Float" hintText="0.00" labelPosition="float" />
          <SgInputNumber id="label-top" label="Top" hintText="0.00" labelPosition="top" />
          <SgInputNumber
            id="label-left"
            label="Left"
            hintText="0.00"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
        Valor atual: <strong>{amount || "-"}</strong>
      </div>
    </div>
  );
}`;

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
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);
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
    (anchorId: string) => {
      const target = document.getElementById(anchorId);
      if (!target) return;

      const scrollContainer = findScrollContainer(target);
      const extraTopGap = 12;
      const titleEl =
        (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

      const correctIfNeeded = () => {
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopNow = stickyBottomNow + extraTopGap;
        const currentTop = titleEl.getBoundingClientRect().top;
        const delta = currentTop - desiredTopNow;
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
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopNow = stickyBottomNow + extraTopGap;
        const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
      } else {
        const container = scrollContainer as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
        const titleRect = titleEl.getBoundingClientRect();
        const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
        container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
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

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  const exampleLinks = React.useMemo(
    () => [
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputNumber.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputNumber.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputNumber.sections.controlled.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputNumber.sections.validation.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputNumber.sections.prefixIcon.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputNumber.sections.prefixSuffix.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputNumber.sections.iconButtons.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.inputNumber.sections.noNegative.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.component.inputNumber.sections.noDecimals.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.component.inputNumber.sections.minMax.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.component.inputNumber.sections.emptyValue.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.component.inputNumber.sections.visual.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.component.inputNumber.sections.standalone.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.component.inputNumber.sections.events.title")}` },
      { id: "exemplo-15", label: `15) ${t(i18n, "showcase.component.inputNumber.sections.sizeBorder.title")}` },
      { id: "exemplo-16", label: `16) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-17", label: "17) Playground" }
    ],
    [i18n.locale]
  );
  const inputNumberPropsRows = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.id") },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.label") },
    { prop: "decimals", type: "number", defaultValue: "2", description: t(i18n, "showcase.component.inputNumber.props.rows.decimals") },
    { prop: "allowNegative", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.inputNumber.props.rows.allowNegative") },
    { prop: "emptyValue", type: '"null" | "zero"', defaultValue: '"zero"', description: t(i18n, "showcase.component.inputNumber.props.rows.emptyValue") },
    { prop: "prefixText / suffixText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.prefixSuffix") },
    { prop: "minValue / maxValue", type: "number", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.minMax") },
    { prop: "required", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.inputNumber.props.rows.required") },
    { prop: "requiredMessage", type: "string", defaultValue: "auto", description: t(i18n, "showcase.component.inputNumber.props.rows.requiredMessage") },
    { prop: "validation", type: "(value) => string | null", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.validation") },
    { prop: "onValidation", type: "(msg) => void", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.onValidation") },
    { prop: "onChange / onEnter / onExit / onClear", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.events") },
    { prop: "inputProps", type: "InputHTMLAttributes", defaultValue: "{}", description: t(i18n, "showcase.component.inputNumber.props.rows.inputProps") },
    { prop: "clearButton", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.inputNumber.props.rows.clearButton") },
    { prop: "enabled / readOnly", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.inputNumber.props.rows.enabledReadOnly") },
    { prop: "withBorder / filled", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.inputNumber.props.rows.withBorderFilled") },
    { prop: "labelPosition", type: '"float" | "top" | "left"', defaultValue: '"float"', description: t(i18n, "showcase.common.props.rows.labelPosition") },
    { prop: "labelWidth", type: "number | string", defaultValue: '"11rem"', description: t(i18n, "showcase.common.props.rows.labelWidth") },
    { prop: "labelAlign", type: '"start" | "center" | "end"', defaultValue: '"start"', description: t(i18n, "showcase.common.props.rows.labelAlign") },
    { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"sm"', description: t(i18n, "showcase.common.props.rows.elevation") },
    { prop: "width / borderRadius", type: "number | string", defaultValue: "100% / -", description: t(i18n, "showcase.component.inputNumber.props.rows.widthBorderRadius") },
    { prop: "register / control / name", type: "react-hook-form", defaultValue: "-", description: t(i18n, "showcase.component.inputNumber.props.rows.rhf") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputNumber.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputNumber.subtitle")}
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
        title={`1) ${t(i18n, "showcase.component.inputNumber.sections.basic.title")}`}
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
          <SgButton type="submit" size="sm" appearance="outline">
            {t(i18n, "showcase.component.inputNumber.actions.submit")}
          </SgButton>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.currentValue", { value: basicValue })}
          </p>
        </form>
        <CodeBlock code={`<SgInputNumber
  id="demo-basic"
  label="${t(i18n, "showcase.component.inputNumber.labels.value")}"
  name="valor"
  register={register}
  decimals={2}
/>

<SgButton type="submit" size="sm" appearance="outline">
  ${t(i18n, "showcase.component.inputNumber.actions.submit")}
</SgButton>

<p>${t(i18n, "showcase.component.inputNumber.labels.currentValue", { value: watchValueSnippet })}</p>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.inputNumber.sections.required.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-required"
  label="${t(i18n, "showcase.component.inputNumber.labels.required")}"
  required
  name="required"
  register={register}
  decimals={2}
/>

<SgInputNumber
  id="demo-required-custom"
  label="${t(i18n, "showcase.component.inputNumber.labels.customMessage")}"
  required
  requiredMessage="${t(i18n, "showcase.component.inputNumber.messages.requiredCustom")}"
  name="requiredCustom"
  register={register}
  decimals={2}
/>`} />
      </Section>

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.inputNumber.sections.controlled.title")}`}
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
          <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
            <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "12345.00")}>
              {t(i18n, "showcase.component.inputNumber.actions.setApi")}
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "0.00")}>
              {t(i18n, "showcase.component.inputNumber.actions.reset")}
            </SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              severity="danger"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.inputNumber.actions.clear")}
            </SgButton>
          </SgGrid>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-controlled"
  label="${t(i18n, "showcase.component.inputNumber.labels.controlled")}"
  name="controlled"
  control={control}
  decimals={2}
/>

<SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
  <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "12345.00")}>
    ${t(i18n, "showcase.component.inputNumber.actions.setApi")}
  </SgButton>

  <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "0.00")}>
    ${t(i18n, "showcase.component.inputNumber.actions.reset")}
  </SgButton>

  <SgButton size="sm" appearance="outline" severity="danger" onClick={() => setValue("controlled", "")}>
    ${t(i18n, "showcase.component.inputNumber.actions.clear")}
  </SgButton>
</SgGrid>

<p>${t(i18n, "showcase.component.inputNumber.labels.currentState")}: "{watch("controlled")}"</p>`} />
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.inputNumber.sections.validation.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-validation"
  label="${t(i18n, "showcase.component.inputNumber.labels.evenOnly")}"
  name="validation"
  register={register}
  decimals={0}
  validation={(v) => {
    const n = Number(v);
    return Number.isFinite(n) && n % 2 === 0 ? null : "${t(i18n, "showcase.component.inputNumber.messages.evenOnly")}";
  }}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.inputNumber.sections.prefixIcon.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-prefix-icon"
  label="${t(i18n, "showcase.component.inputNumber.labels.search")}"
  name="prefixIcon"
  register={register}
  decimals={2}
  prefixIcon={
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  }
/>`} />
      </Section>

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.inputNumber.sections.prefixSuffix.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-prefix-text"
  label="${t(i18n, "showcase.component.inputNumber.labels.price")}"
  prefixText="R$"
  name="prefix"
  control={control}
  decimals={2}
/>

<SgInputNumber
  id="demo-suffix-text"
  label="${t(i18n, "showcase.component.inputNumber.labels.weight")}"
  suffixText="kg"
  name="suffix"
  control={control}
  decimals={2}
/>

<SgInputNumber
  id="demo-both"
  label="${t(i18n, "showcase.component.inputNumber.labels.total")}"
  prefixText="R$"
  suffixText="m"
  name="both"
  control={control}
  decimals={2}
/>`} />
      </Section>

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.inputNumber.sections.iconButtons.title")}`}
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
              <SgButton
                key="copy"
                type="button"
                iconOnly
                size="sm"
                appearance="ghost"
                className="h-6 w-6 text-foreground/60 hover:text-primary"
                title="Copiar valor"
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue ?? "");
                  setIconBtnLog((prev) => [`Copiado: "${iconBtnValue}"`, ...prev].slice(0, 5));
                }}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                }
              />,
              <SgButton
                key="alert"
                type="button"
                iconOnly
                size="sm"
                appearance="ghost"
                className="h-6 w-6 text-foreground/60 hover:text-primary"
                title="Exibir alerta"
                onClick={() => {
                  setIconBtnLog((prev) => ["Alerta disparado!", ...prev].slice(0, 5));
                }}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                }
              />
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
        <CodeBlock code={`<SgInputNumber
  id="demo-iconbtns"
  label="${t(i18n, "showcase.component.inputNumber.labels.copyNumber")}"
  name="iconbtns"
  register={register}
  decimals={2}
  iconButtons={[
    <SgButton key="copy" type="button" iconOnly size="sm" appearance="ghost" onClick={() => navigator.clipboard.writeText(iconBtnValue ?? "")} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>} />,
    <SgButton key="alert" type="button" iconOnly size="sm" appearance="ghost" onClick={() => alert("ok")} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>} />
  ]}
/>`} />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.component.inputNumber.sections.noNegative.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-no-negative"
  label="${t(i18n, "showcase.component.inputNumber.labels.positiveOnly")}"
  name="positivo"
  register={register}
  allowNegative={false}
  decimals={2}
/>`} />
      </Section>

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.component.inputNumber.sections.noDecimals.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-no-decimals"
  label="${t(i18n, "showcase.component.inputNumber.labels.quantity")}"
  name="inteiro"
  register={register}
  decimals={0}
/>`} />
      </Section>

      <Section
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.component.inputNumber.sections.minMax.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-minmax"
  label="${t(i18n, "showcase.component.inputNumber.labels.minMax")}"
  name="minmax"
  register={register}
  minValue={10}
  maxValue={100}
  decimals={2}
/>`} />
      </Section>

      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.component.inputNumber.sections.emptyValue.title")}`}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-empty"
  label="${t(i18n, "showcase.component.inputNumber.labels.canBeEmpty")}"
  name="vazio"
  register={register}
  emptyValue="null"
  decimals={2}
/>`} />
      </Section>

      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.component.inputNumber.sections.visual.title")}`}
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
        <CodeBlock code={`<SgInputNumber id="demo-noborder" label="${t(i18n, "showcase.component.inputNumber.labels.noBorder")}" withBorder={false} name="noborder" register={register} decimals={2} />
<SgInputNumber id="demo-filled" label="${t(i18n, "showcase.component.inputNumber.labels.filled")}" filled name="filled" register={register} decimals={2} />`} />
      </Section>

      <Section
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.component.inputNumber.sections.standalone.title")}`}
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
          <SgButton
            type="button"
            size="sm"
            appearance="outline"
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
          </SgButton>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.inputNumber.labels.result")}:{" "}
            {standaloneSaveResult ? <code className="rounded bg-muted px-1">{standaloneSaveResult}</code> : "-"}
          </p>
        </div>
        <CodeBlock code={`import React from "react";
import { SgButton, SgInputNumber } from "@seedgrid/fe-components";

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
      <SgInputNumber id="a" label="${t(i18n, "showcase.component.inputNumber.labels.entry1")}" decimals={2} inputProps={{ ref: refA }} />
      <SgInputNumber id="b" label="${t(i18n, "showcase.component.inputNumber.labels.entry2")}" decimals={2} inputProps={{ ref: refB }} />
      <SgInputNumber id="c" label="${t(i18n, "showcase.component.inputNumber.labels.entry3")}" decimals={2} inputProps={{ ref: refC }} />
      <SgButton type="button" size="sm" appearance="outline" onClick={handleSave}>
        ${t(i18n, "showcase.component.inputNumber.actions.save")}
      </SgButton>
    </div>
  );
}`} />
      </Section>

      <Section
        id="exemplo-14"
        title={`14) ${t(i18n, "showcase.component.inputNumber.sections.events.title")}`}
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
            onValidation={(msg) => log(`onValidation: ${msg ?? t(i18n, "showcase.common.labels.valid")}`)}
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
        <CodeBlock code={`<SgInputNumber
  id="demo-events"
  label="${t(i18n, "showcase.component.inputNumber.labels.typeAndLog")}"
  required
  decimals={2}
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>

      <Section
        id="exemplo-15"
        title={`15) ${t(i18n, "showcase.component.inputNumber.sections.sizeBorder.title")}`}
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
        <CodeBlock code={`<SgInputNumber id="demo-w200" label="${t(i18n, "showcase.component.inputNumber.labels.width200")}" width={200} name="w200" register={register} decimals={2} />
<SgInputNumber id="demo-w300" label="${t(i18n, "showcase.component.inputNumber.labels.width300Rounded")}" width={300} borderRadius={20} name="w300" register={register} decimals={2} />`} />
      </Section>

      <Section
  id="exemplo-16"
  title={`16) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputNumber
      id="sg-input-number-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputNumber
      id="sg-input-number-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputNumber
      id="sg-input-number-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputNumber
  id="sg-input-number-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputNumber
  id="sg-input-number-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputNumber
  id="sg-input-number-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section
        id="exemplo-17"
        title="17) Playground"
        description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgInputNumber" })}
      >
        <SgPlayground
          title="SgInputNumber Playground"
          interactive
          codeContract="appFile"
          code={INPUT_NUMBER_PLAYGROUND_CODE}
          height={720}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, "showcase.component.inputNumber.props.title")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputNumber.props.headers.prop")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputNumber.props.headers.type")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputNumber.props.headers.default")}</th>
                <th className="pb-2 font-semibold">{t(i18n, "showcase.component.inputNumber.props.headers.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inputNumberPropsRows.map((row) => (
                <tr key={row.prop}>
                  <td className="py-2 pr-4 font-mono text-xs">{row.prop}</td>
                  <td className="py-2 pr-4">{row.type}</td>
                  <td className="py-2 pr-4">{row.defaultValue}</td>
                  <td className="py-2">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

