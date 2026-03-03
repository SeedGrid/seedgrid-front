"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgInputPhone, SgPlayground } from "@seedgrid/fe-components";
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

const INPUT_PHONE_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputPhone } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [clearButton, setClearButton] = React.useState(true);
  const [enabled, setEnabled] = React.useState(true);
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 3 }} gap={8}>
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
        <SgButton size="sm" appearance="outline" onClick={() => setEnabled((prev) => !prev)}>
          enabled: {String(enabled)}
        </SgButton>
      </SgGrid>

      <SgInputPhone
        id="playground-phone"
        label="Telefone"
        hintText="Digite um telefone com DDD"
        required={required}
        filled={filled}
        withBorder={withBorder}
        clearButton={clearButton}
        enabled={enabled}
        inputProps={{ value, onChange: (event) => setValue(event.target.value) }}
      />
    </div>
  );
}`;

export default function SgInputPhonePage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputPhone.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputPhone.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputPhone.sections.invalid.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputPhone.sections.validation.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.common.sections.noClear.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.common.sections.disabled.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-10", label: "10) Playground" }
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
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPhone.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputPhone.subtitle")}
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
        title={`1) ${t(i18n, "showcase.component.inputPhone.sections.basic.title")}`}
        description={t(i18n, "showcase.component.inputPhone.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-basic"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `"${basicValue}"` })}
          </p>
        </div>
        <CodeBlock code={`<SgInputPhone\n  id="telefone"\n  label="${t(i18n, "showcase.component.inputPhone.labels.phone")}"\n  hintText="${t(i18n, "showcase.component.inputPhone.labels.phoneHint")}"\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.inputPhone.sections.required.title")}`}
        description={t(i18n, "showcase.component.inputPhone.sections.required.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-required"
            label={t(i18n, "showcase.component.inputPhone.labels.required")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputPhone
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputPhone.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputPhone.messages.required")}
          />
        </div>
        <CodeBlock code={`<SgInputPhone\n  id="telefone"\n  label="${t(i18n, "showcase.component.inputPhone.labels.required")}"\n  hintText="${t(i18n, "showcase.component.inputPhone.labels.requiredHint")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.inputPhone.messages.required")}"\n/>`} />
      </Section>

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.inputPhone.sections.invalid.title")}`}
        description={t(i18n, "showcase.component.inputPhone.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-invalid"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            invalidMessage={t(i18n, "showcase.component.inputPhone.messages.invalid")}
          />
        </div>
        <CodeBlock code={`<SgInputPhone\n  id="telefone"\n  label="${t(i18n, "showcase.component.inputPhone.labels.phone")}"\n  hintText="${t(i18n, "showcase.component.inputPhone.labels.phoneHint")}"\n  invalidMessage="${t(i18n, "showcase.component.inputPhone.messages.invalid")}"\n/>`} />
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.inputPhone.sections.validation.title")}`}
        description={t(i18n, "showcase.component.inputPhone.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-validation"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            validation={(v) => (v.startsWith("(00)") ? t(i18n, "showcase.component.inputPhone.messages.dddInvalid") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputPhone\n  id="telefone"\n  label="${t(i18n, "showcase.component.inputPhone.labels.phone")}"\n  hintText="${t(i18n, "showcase.component.inputPhone.labels.phoneHint")}"\n  validation={(v) => (v.startsWith("(00)") ? "${t(i18n, "showcase.component.inputPhone.messages.dddInvalid")}" : null)}\n  onValidation={(msg) => console.log(msg)}\n/>`} />
      </Section>

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.common.sections.visual.title")}`}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputPhone
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            filled
          />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" withBorder={false} />\n<SgInputPhone id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" filled />`} />
      </Section>

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.common.sections.noClear.title")}`}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            clearButton={false}
          />
        </div>
        <CodeBlock code={`<SgInputPhone id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" clearButton={false} />`} />
      </Section>

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.common.sections.sizeBorder.title")}`}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputPhone
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            width={200}
          />
          <SgInputPhone
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" width={200} />\n<SgInputPhone id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" width={300} borderRadius={20} />`} />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.common.sections.disabled.title")}`}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            enabled={false}
            inputProps={{ defaultValue: "(11) 99999-0000" }}
          />
        </div>
        <CodeBlock code={`<SgInputPhone id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}" enabled={false} />`} />
      </Section>

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.common.sections.events.title")}`}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputPhone.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputPhone.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputPhone.logs.onClear"))}
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
        <CodeBlock code={`<SgInputPhone\n  id="eventos"\n  label="${t(i18n, "showcase.component.inputPhone.labels.withEvents")}"\n  hintText="${t(i18n, "showcase.component.inputPhone.labels.phone")}"\n  required\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("focus")}\n  onExit={() => console.log("blur")}\n  onClear={() => console.log("cleared")}\n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>

      <Section
        id="exemplo-10"
        title="10) Playground"
        description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgInputPhone" })}
      >
        <SgPlayground
          title="SgInputPhone Playground"
          interactive
          codeContract="appFile"
          code={INPUT_PHONE_PLAYGROUND_CODE}
          height={620}
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
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto de dica abaixo do label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">Validação obrigatória.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">invalidMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">Mensagem para telefone inválido.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation / onValidation</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">Validação customizada e callback de resultado.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe borda do input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Aplica estilo preenchido.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Mostra botão de limpar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">Controle de largura e arredondamento.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Habilita ou desabilita o campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">Props nativas do input interno.</td></tr>
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
