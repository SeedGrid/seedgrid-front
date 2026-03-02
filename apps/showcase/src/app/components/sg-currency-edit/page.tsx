"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgButton, SgCurrencyEdit, SgGrid, SgPlayground } from "@seedgrid/fe-components";
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

const CURRENCY_EDIT_PLAYGROUND_CODE = `import * as React from "react";
import { useForm } from "react-hook-form";
import { SgButton, SgCurrencyEdit, SgGrid } from "@seedgrid/fe-components";

export default function App() {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      amount: "1234.50"
    }
  });

  const amount = watch("amount") ?? "";
  const [currency, setCurrency] = React.useState<"BRL" | "USD" | "EUR">("BRL");
  const [locale, setLocale] = React.useState("pt-BR");
  const [showCurrencySymbol, setShowCurrencySymbol] = React.useState(true);
  const [allowNegative, setAllowNegative] = React.useState(true);
  const [decimals, setDecimals] = React.useState(2);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);

  const applyCurrency = (next: "BRL" | "USD" | "EUR", nextLocale: string) => {
    setCurrency(next);
    setLocale(nextLocale);
  };

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={currency === "BRL" ? "solid" : "outline"} onClick={() => applyCurrency("BRL", "pt-BR")}>
          BRL
        </SgButton>
        <SgButton size="sm" appearance={currency === "USD" ? "solid" : "outline"} onClick={() => applyCurrency("USD", "en-US")}>
          USD
        </SgButton>
        <SgButton size="sm" appearance={currency === "EUR" ? "solid" : "outline"} onClick={() => applyCurrency("EUR", "pt-PT")}>
          EUR
        </SgButton>
        <SgButton size="sm" appearance={showCurrencySymbol ? "solid" : "outline"} onClick={() => setShowCurrencySymbol((prev) => !prev)}>
          simbolo
        </SgButton>
      </SgGrid>

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
        <SgButton size="sm" appearance="outline" onClick={() => setDecimals((prev) => (prev === 0 ? 2 : 0))}>
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
        <SgCurrencyEdit
          id="playground-currency-edit"
          label="SgCurrencyEdit Playground"
          name="amount"
          control={control}
          currency={currency}
          locale={locale}
          decimals={decimals}
          showCurrencySymbol={showCurrencySymbol}
          allowNegative={allowNegative}
          filled={filled}
          withBorder={withBorder}
        />
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
        Valor atual: <strong>{amount || "-"}</strong>
      </div>
    </div>
  );
}`;

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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.currencyEdit.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.currencyEdit.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.currencyEdit.sections.controlled.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.currencyEdit.sections.validation.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.currencyEdit.sections.currency.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.currencyEdit.sections.symbol.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.currencyEdit.sections.iconButtons.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.currencyEdit.sections.noNegative.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.component.currencyEdit.sections.noDecimals.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.component.currencyEdit.sections.minMax.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.component.currencyEdit.sections.emptyValue.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.component.currencyEdit.sections.visual.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.component.currencyEdit.sections.standalone.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.component.currencyEdit.sections.events.title")}` },
      { id: "exemplo-15", label: `15) ${t(i18n, "showcase.component.currencyEdit.sections.sizeBorder.title")}` },
      { id: "exemplo-16", label: "16) Playground" }
    ],
    [i18n.locale]
  );

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.currencyEdit.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.currencyEdit.subtitle")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exemplos
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
        title={`1) ${t(i18n, "showcase.component.currencyEdit.sections.basic.title")}`}
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
          <SgButton type="submit" size="sm" appearance="outline">
            {t(i18n, "showcase.component.currencyEdit.actions.submit")}
          </SgButton>
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

<SgButton type="submit" size="sm" appearance="outline">
  ${t(i18n, "showcase.component.currencyEdit.actions.submit")}
</SgButton>

<p>${t(i18n, "showcase.component.currencyEdit.labels.currentValue", { value: watchValueSnippet })}</p>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.currencyEdit.sections.required.title")}`}
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
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.currencyEdit.sections.controlled.title")}`}
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
          <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
            <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "12345.00")}>
              {t(i18n, "showcase.component.currencyEdit.actions.setApi")}
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "0.00")}>
              {t(i18n, "showcase.component.currencyEdit.actions.reset")}
            </SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              severity="danger"
              onClick={() => setValue("controlled", "")}
            >
              {t(i18n, "showcase.component.currencyEdit.actions.clear")}
            </SgButton>
          </SgGrid>
        </div>
        <CodeBlock code={`<SgCurrencyEdit
  id="demo-controlled"
  label="${t(i18n, "showcase.component.currencyEdit.labels.controlled")}"
  name="controlled"
  control={control}
  currency="BRL"
/>

<SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
  <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "12345.00")}>
    ${t(i18n, "showcase.component.currencyEdit.actions.setApi")}
  </SgButton>

  <SgButton size="sm" appearance="outline" onClick={() => setValue("controlled", "0.00")}>
    ${t(i18n, "showcase.component.currencyEdit.actions.reset")}
  </SgButton>

  <SgButton size="sm" appearance="outline" severity="danger" onClick={() => setValue("controlled", "")}>
    ${t(i18n, "showcase.component.currencyEdit.actions.clear")}
  </SgButton>
</SgGrid>

<p>${t(i18n, "showcase.component.currencyEdit.labels.currentState")}: "{watch("controlled")}"</p>`} />
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.currencyEdit.sections.validation.title")}`}
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
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.currencyEdit.sections.currency.title")}`}
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
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.currencyEdit.sections.symbol.title")}`}
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
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.currencyEdit.sections.iconButtons.title")}`}
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
    <SgButton key="copy" type="button" iconOnly size="sm" appearance="ghost" onClick={() => navigator.clipboard.writeText(iconBtnValue ?? "")} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>} />,
    <SgButton key="alert" type="button" iconOnly size="sm" appearance="ghost" onClick={() => alert("ok")} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>} />
  ]}
/>`} />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.component.currencyEdit.sections.noNegative.title")}`}
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
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.component.currencyEdit.sections.noDecimals.title")}`}
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
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.component.currencyEdit.sections.minMax.title")}`}
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
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.component.currencyEdit.sections.emptyValue.title")}`}
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
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.component.currencyEdit.sections.visual.title")}`}
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
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.component.currencyEdit.sections.standalone.title")}`}
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
            {t(i18n, "showcase.component.currencyEdit.actions.save")}
          </SgButton>
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.component.currencyEdit.labels.result")}:{" "}
            {standaloneSaveResult ? <code className="rounded bg-muted px-1">{standaloneSaveResult}</code> : "-"}
          </p>
        </div>
        <CodeBlock code={`import React from "react";
import { SgButton, SgCurrencyEdit } from "@seedgrid/fe-components";

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
      <SgButton type="button" size="sm" appearance="outline" onClick={handleSave}>
        ${t(i18n, "showcase.component.currencyEdit.actions.save")}
      </SgButton>
    </div>
  );
}`} />
      </Section>

      <Section
        id="exemplo-14"
        title={`14) ${t(i18n, "showcase.component.currencyEdit.sections.events.title")}`}
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
        id="exemplo-15"
        title={`15) ${t(i18n, "showcase.component.currencyEdit.sections.sizeBorder.title")}`}
        description={t(i18n, "showcase.component.currencyEdit.sections.sizeBorder.description")}
      >
        <SgGrid columns={{ base: 1, sm: 2 }} gap={16}>
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
        </SgGrid>
        <CodeBlock code={`<SgGrid columns={{ base: 1, sm: 2 }} gap={16}>
  <SgCurrencyEdit id="demo-w200" label="${t(i18n, "showcase.component.currencyEdit.labels.width200")}" width={200} name="w200" register={register} currency="BRL" />
  <SgCurrencyEdit id="demo-w300" label="${t(i18n, "showcase.component.currencyEdit.labels.width300Rounded")}" width={300} borderRadius={20} name="w300" register={register} currency="BRL" />
</SgGrid>`} />
      </Section>

      <Section
        id="exemplo-16"
        title="16) Playground"
        description="Simule as principais props do SgCurrencyEdit em tempo real."
      >
        <SgPlayground
          title="SgCurrencyEdit Playground"
          interactive
          codeContract="appFile"
          code={CURRENCY_EDIT_PLAYGROUND_CODE}
          height={780}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">Referencia de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrao</th>
                <th className="pb-2 font-semibold">Descricao</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Label exibido acima do input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currency</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">"BRL"</td><td className="py-2">Moeda usada na exibicao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">locale</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">i18n locale</td><td className="py-2">Localizacao para formatacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">decimals</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">minor unit</td><td className="py-2">Casas decimais do valor.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currencyDisplay</td><td className="py-2 pr-4">"symbol" | "code" | ...</td><td className="py-2 pr-4">"symbol"</td><td className="py-2">Formato do simbolo da moeda.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCurrencySymbol</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe/oculta simbolo da moeda.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">allowNegative</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Permite valores negativos.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minValue / maxValue</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Limites numericos aceitos.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Define o campo como obrigatorio.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">Mensagem para validacao required.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">validacao customizada.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback de retorno da validacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onEnter / onExit / onClear</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">Eventos de interacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">Props nativas do input interno.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe botao de limpar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">Estado habilitado e somente leitura.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder / filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">Variacoes visuais do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">Dimensao e borda.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">register / control / name</td><td className="py-2 pr-4">react-hook-form</td><td className="py-2 pr-4">-</td><td className="py-2">Integracao com React Hook Form.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
