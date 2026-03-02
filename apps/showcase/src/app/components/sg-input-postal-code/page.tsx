"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import Link from "next/link";
import { SgGrid, SgInputPostalCode, SgPlayground, type ViaCepResponse, type PostalCodeCountry } from "@seedgrid/fe-components";
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

const INPUT_POSTAL_CODE_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputPostalCode } from "@seedgrid/fe-components";

export default function App() {
  const [country, setCountry] = React.useState<"BR" | "PT" | "US">("BR");
  const [required, setRequired] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [clearButton, setClearButton] = React.useState(true);
  const [value, setValue] = React.useState("");

  const hintByCountry = {
    BR: "00000-000",
    PT: "0000-000",
    US: "00000"
  } as const;

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 3 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setCountry("BR")}>BR</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setCountry("PT")}>PT</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setCountry("US")}>US</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRequired((prev) => !prev)}>
          required: {String(required)}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setFilled((prev) => !prev)}>
          filled: {String(filled)}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setWithBorder((prev) => !prev)}>
          withBorder: {String(withBorder)}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setClearButton((prev) => !prev)}>
          clearButton: {String(clearButton)}
        </SgButton>
      </SgGrid>

      <SgInputPostalCode
        id="playground-postal"
        country={country}
        label="Código postal"
        hintText={hintByCountry[country]}
        required={required}
        filled={filled}
        withBorder={withBorder}
        clearButton={clearButton}
        inputProps={{ value, onChange: (event) => setValue(event.target.value) }}
      />
    </div>
  );
}`;

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

  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

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
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

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
      container.scrollTo(
        { top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" }
      );
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputPostalCode.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputPostalCode.sections.countries.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputPostalCode.sections.required.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputPostalCode.sections.controlled.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputPostalCode.sections.validation.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputPostalCode.sections.viacep.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputPostalCode.sections.prefixIcon.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.inputPostalCode.sections.prefixSuffix.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.component.inputPostalCode.sections.iconButtons.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.component.inputPostalCode.sections.disabledReadonly.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.component.inputPostalCode.sections.standalone.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-15", label: "15) Playground" }
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
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPostalCode.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputPostalCode.subtitle")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</p>
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
        title={`1) ${t(i18n, "showcase.component.inputPostalCode.sections.basic.title")}`}
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

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.inputPostalCode.sections.countries.title")}`}
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

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.inputPostalCode.sections.required.title")}`}
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

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.inputPostalCode.sections.controlled.title")}`}
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

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.inputPostalCode.sections.validation.title")}`}
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

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.inputPostalCode.sections.viacep.title")}`}
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

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.inputPostalCode.sections.prefixIcon.title")}`}
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

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.component.inputPostalCode.sections.prefixSuffix.title")}`}
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

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.component.inputPostalCode.sections.iconButtons.title")}`}
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

      <Section
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.common.sections.visual.title")}`}
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

      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.common.sections.sizeBorder.title")}`}
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

      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.component.inputPostalCode.sections.disabledReadonly.title")}`}
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

      <Section
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.component.inputPostalCode.sections.standalone.title")}`}
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

      <Section
        id="exemplo-14"
        title={`14) ${t(i18n, "showcase.common.sections.events.title")}`}
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

      <Section id="exemplo-15" title="15) Playground" description="Simule as principais props em tempo real.">
        <SgPlayground
          title="SgInputPostalCode Playground"
          interactive
          codeContract="appFile"
          code={INPUT_POSTAL_CODE_PLAYGROUND_CODE}
          height={680}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrão</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">country</td><td className="py-2 pr-4">"BR" | "PT" | "US" | "ES" | "UY" | "AR" | "PY"</td><td className="py-2 pr-4">"BR"</td><td className="py-2">Define máscara e regra do país.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label / hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do campo e dica.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">Validação obrigatória.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation / onValidation</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">Validação customizada e callback.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateWithViaCep / viaCepErrorMessage / onViaCepResult</td><td className="py-2 pr-4">boolean / string / function</td><td className="py-2 pr-4">false / auto / -</td><td className="py-2">Consulta ViaCEP para CEPs brasileiros.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon / prefixText / suffixText / iconButtons</td><td className="py-2 pr-4">ReactNode / string / string / ReactNode[]</td><td className="py-2 pr-4">-</td><td className="py-2">Customizações visuais do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder / filled / clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false / true</td><td className="py-2">Ajustes de aparência.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">Dimensão e raio da borda.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">Estado do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">name / register / control</td><td className="py-2 pr-4">string / function / object</td><td className="py-2 pr-4">-</td><td className="py-2">Integração com React Hook Form.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">Props do input interno (ex.: ref/value).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onEnter / onExit / onClear</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">Eventos de interação.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
