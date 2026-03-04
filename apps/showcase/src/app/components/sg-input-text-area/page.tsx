"use client";

import React from "react";
import Link from "next/link";
import { SgButton, SgGrid, SgInputTextArea, SgPlayground } from "@seedgrid/fe-components";
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

const INPUT_TEXTAREA_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputTextArea } from "@seedgrid/fe-components";

export default function App() {
  const [value, setValue] = React.useState("Texto inicial");
  const [required, setRequired] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [showCharCounter, setShowCharCounter] = React.useState(true);
  const [maxLength, setMaxLength] = React.useState(120);
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={required ? "solid" : "outline"} onClick={() => setRequired((prev) => !prev)}>
          required
        </SgButton>
        <SgButton size="sm" appearance={filled ? "solid" : "outline"} onClick={() => setFilled((prev) => !prev)}>
          filled
        </SgButton>
        <SgButton size="sm" appearance={withBorder ? "solid" : "outline"} onClick={() => setWithBorder((prev) => !prev)}>
          withBorder
        </SgButton>
        <SgButton size="sm" appearance={showCharCounter ? "solid" : "outline"} onClick={() => setShowCharCounter((prev) => !prev)}>
          counter
        </SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={enabled ? "solid" : "outline"} onClick={() => setEnabled((prev) => !prev)}>
          enabled
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setMaxLength((prev) => (prev === 120 ? 60 : 120))}>
          maxLength: {maxLength}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("Texto vindo da API\\ncom quebra de linha.")}>
          Set API
        </SgButton>
        <SgButton size="sm" appearance="outline" severity="danger" onClick={() => setValue("")}>
          Limpar
        </SgButton>
      </SgGrid>

      <SgInputTextArea
        id="playground-textarea"
        label="SgInputTextArea Playground"
        required={required}
        filled={filled}
        withBorder={withBorder}
        showCharCounter={showCharCounter}
        maxLength={maxLength}
        enabled={enabled}
        textareaProps={{
          value,
          onChange: (event) => setValue(event.target.value)
        }}
      />

      <div className="rounded-md border border-border p-4">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputTextArea id="label-float" label="Float" hintText="Type a note..." labelPosition="float" />
          <SgInputTextArea id="label-top" label="Top" hintText="Type a note..." labelPosition="top" />
          <SgInputTextArea
            id="label-left"
            label="Left"
            hintText="Type a note..."
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

export default function SgInputTextAreaPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [controlledValue, setControlledValue] = React.useState(
    t(i18n, "showcase.component.inputTextArea.defaults.controlled")
  );
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    setControlledValue(t(i18n, "showcase.component.inputTextArea.defaults.controlled"));
  }, [i18n.locale]);

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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputTextArea.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputTextArea.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputTextArea.sections.controlled.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputTextArea.sections.counter.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputTextArea.sections.minLength.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputTextArea.sections.minWords.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputTextArea.sections.minLines.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.component.inputTextArea.sections.validation.title")}` },
      { id: "exemplo-9", label: `9) ${t(i18n, "showcase.component.inputTextArea.sections.sizeLines.title")}` },
      { id: "exemplo-10", label: `10) ${t(i18n, "showcase.component.inputTextArea.sections.prefixIcon.title")}` },
      { id: "exemplo-11", label: `11) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-12", label: `12) ${t(i18n, "showcase.common.sections.noClear.title")}` },
      { id: "exemplo-13", label: `13) ${t(i18n, "showcase.common.sections.sizeBorder.title")}` },
      { id: "exemplo-14", label: `14) ${t(i18n, "showcase.component.inputTextArea.sections.disabledReadonly.title")}` },
      { id: "exemplo-15", label: `15) ${t(i18n, "showcase.component.inputTextArea.sections.externalError.title")}` },
      { id: "exemplo-16", label: `16) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-17", label: `17) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-18", label: "18) Playground" }
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
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputTextArea.title")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t(i18n, "showcase.component.inputTextArea.subtitle")}
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
        title={`1) ${t(i18n, "showcase.component.inputTextArea.sections.basic.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.basic.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-basic"
            label={t(i18n, "showcase.component.inputTextArea.labels.description")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-basic"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.description")}"\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.inputTextArea.sections.required.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.required.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-required"
            label={t(i18n, "showcase.component.inputTextArea.labels.requiredField")}
            required
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputTextArea.labels.customMessage")}
            required
            requiredMessage={t(i18n, "showcase.component.inputTextArea.messages.requiredCustom")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="demo-required"
  label="${t(i18n, "showcase.component.inputTextArea.labels.requiredField")}"
  required
/>

<SgInputTextArea
  id="demo-required-custom"
  label="${t(i18n, "showcase.component.inputTextArea.labels.customMessage")}"
  required
  requiredMessage="${t(i18n, "showcase.component.inputTextArea.messages.requiredCustom")}"
/>`} />
      </Section>

      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.inputTextArea.sections.controlled.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputTextArea
            id="demo-controlled"
            label={t(i18n, "showcase.component.inputTextArea.labels.notes")}
            textareaProps={{
              value: controlledValue,
              onChange: (e) => setControlledValue(e.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentState")}: {" "}
            <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => setControlledValue(t(i18n, "showcase.component.inputTextArea.values.apiSample"))}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.setApi")}
            </SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => setControlledValue(t(i18n, "showcase.component.inputTextArea.values.otherSample"))}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.setOther")}
            </SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              severity="danger"
              onClick={() => setControlledValue("")}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.clear")}
            </SgButton>
          </SgGrid>
        </div>
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">{t(i18n, "showcase.component.inputTextArea.labels.howItWorks")}</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.1")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.2")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.3")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.4")}</li>
          </ul>
          <CodeBlock code={`import React from "react";
import { SgButton, SgGrid, SgInputTextArea } from "@seedgrid/fe-components";

export default function Example() {
  const [controlledValue, setControlledValue] = React.useState("${t(i18n, "showcase.component.inputTextArea.defaults.controlled").replace(/\n/g, "\\n")}");

  return (
    <div className="w-96 space-y-3">
      <SgInputTextArea
        id="demo-controlled"
        label="${t(i18n, "showcase.component.inputTextArea.labels.notes")}"
        textareaProps={{
          value: controlledValue,
          onChange: (event) => setControlledValue(event.target.value)
        }}
      />

      <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setControlledValue("${t(i18n, "showcase.component.inputTextArea.values.apiSample").replace(/\n/g, "\\n")}")}>
          ${t(i18n, "showcase.component.inputTextArea.actions.setApi")}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setControlledValue("${t(i18n, "showcase.component.inputTextArea.values.otherSample").replace(/\n/g, "\\n")}")}>
          ${t(i18n, "showcase.component.inputTextArea.actions.setOther")}
        </SgButton>
        <SgButton size="sm" appearance="outline" severity="danger" onClick={() => setControlledValue("")}>
          ${t(i18n, "showcase.component.inputTextArea.actions.clear")}
        </SgButton>
      </SgGrid>

      <p>${t(i18n, "showcase.common.labels.currentState")}: "{controlledValue}"</p>
    </div>
  );
}`} />
        </div>
      </Section>

      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.inputTextArea.sections.counter.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.counter.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-counter"
            label={t(i18n, "showcase.component.inputTextArea.labels.max100")}
            maxLength={100}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-counter"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.max100")}"\n  maxLength={100}\n  showCharCounter\n/>`} />
      </Section>

      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.inputTextArea.sections.minLength.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.minLength.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlength"
            label={t(i18n, "showcase.component.inputTextArea.labels.min10")}
            minLength={10}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-minlength"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min10")}"\n  minLength={10}\n  showCharCounter\n/>`} />
      </Section>

      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.inputTextArea.sections.minWords.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.minWords.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-words"
            label={t(i18n, "showcase.component.inputTextArea.labels.min5Words")}
            minNumberOfWords={5}
            minNumberOfWordsMessage={t(i18n, "showcase.component.inputTextArea.messages.min5Words")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-words"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min5Words")}"\n  minNumberOfWords={5}\n  minNumberOfWordsMessage="${t(i18n, "showcase.component.inputTextArea.messages.min5Words")}"\n/>`} />
      </Section>

      <Section
        id="exemplo-7"
        title={`7) ${t(i18n, "showcase.component.inputTextArea.sections.minLines.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.minLines.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlines"
            label={t(i18n, "showcase.component.inputTextArea.labels.min3Lines")}
            minLines={3}
            minLinesMessage={t(i18n, "showcase.component.inputTextArea.messages.min3Lines")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-minlines"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min3Lines")}"\n  minLines={3}\n  minLinesMessage="${t(i18n, "showcase.component.inputTextArea.messages.min3Lines")}"\n/>`} />
      </Section>

      <Section
        id="exemplo-8"
        title={`8) ${t(i18n, "showcase.component.inputTextArea.sections.validation.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.validation.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-validation"
            label={t(i18n, "showcase.component.inputTextArea.labels.noNumbers")}
            validation={(v) =>
              /\d/.test(v) ? t(i18n, "showcase.component.inputTextArea.messages.noNumbers") : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={String.raw`<SgInputTextArea\n  id="demo-validation"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.noNumbers")}"\n  validation={(v) =>\n    /\\d/.test(v) ? "${t(i18n, "showcase.component.inputTextArea.messages.noNumbers")}" : null\n  }\n  onValidation={(msg) => console.log(msg)}\n/>`} />
      </Section>

      <Section
        id="exemplo-9"
        title={`9) ${t(i18n, "showcase.component.inputTextArea.sections.sizeLines.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.sizeLines.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-small"
            label={t(i18n, "showcase.component.inputTextArea.labels.heightSmall")}
            height={100}
            maxLines={2}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-large"
            label={t(i18n, "showcase.component.inputTextArea.labels.heightLarge")}
            height={250}
            maxLines={8}
          />
        </div>
        <CodeBlock code={`// ${t(i18n, "showcase.component.inputTextArea.labels.compact")}\n<SgInputTextArea\n  id="demo-height-small"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.compact")}"\n  height={100}\n  maxLines={2}\n/>\n\n// ${t(i18n, "showcase.component.inputTextArea.labels.expanded")}\n<SgInputTextArea\n  id="demo-height-large"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.expanded")}"\n  height={250}\n  maxLines={8}\n/>`} />
      </Section>

      <Section
        id="exemplo-10"
        title={`10) ${t(i18n, "showcase.component.inputTextArea.sections.prefixIcon.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.prefixIcon.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-prefix"
            label={t(i18n, "showcase.component.inputTextArea.labels.notes")}
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            }
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="notas"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.notes")}"\n  prefixIcon={<PencilIcon />}\n/>`} />
      </Section>

      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.common.sections.visual.title")}`}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-96">
          <SgInputTextArea id="demo-noborder" label={t(i18n, "showcase.common.labels.noBorder")} withBorder={false} />
        </div>
        <div className="w-96">
          <SgInputTextArea id="demo-filled" label={t(i18n, "showcase.common.labels.filled")} filled />
        </div>
        <CodeBlock code={`<SgInputTextArea id="demo-noborder" label="${t(i18n, "showcase.common.labels.noBorder")}" withBorder={false} />\n<SgInputTextArea id="demo-filled" label="${t(i18n, "showcase.common.labels.filled")}" filled />`} />
      </Section>

      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.common.sections.noClear.title")}`}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-96">
          <SgInputTextArea id="demo-noclear" label={t(i18n, "showcase.common.labels.noClear")} clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputTextArea id="demo-noclear" label="${t(i18n, "showcase.common.labels.noClear")}" clearButton={false} />`} />
      </Section>

      <Section
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.common.sections.sizeBorder.title")}`}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <SgGrid columns={{ base: 1, sm: 2 }} gap={16}>
          <SgInputTextArea id="demo-w250" label={t(i18n, "showcase.component.inputTextArea.labels.width250")} width={250} />
          <SgInputTextArea id="demo-w350" label={t(i18n, "showcase.component.inputTextArea.labels.width350Rounded")} width={350} borderRadius={16} />
        </SgGrid>
        <CodeBlock code={`<SgGrid columns={{ base: 1, sm: 2 }} gap={16}>
  <SgInputTextArea id="demo-w250" label="${t(i18n, "showcase.component.inputTextArea.labels.width250")}" width={250} />
  <SgInputTextArea id="demo-w350" label="${t(i18n, "showcase.component.inputTextArea.labels.width350Rounded")}" width={350} borderRadius={16} />
</SgGrid>`} />
      </Section>

      <Section
        id="exemplo-14"
        title={`14) ${t(i18n, "showcase.component.inputTextArea.sections.disabledReadonly.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.disabledReadonly.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            enabled={false}
            textareaProps={{ defaultValue: t(i18n, "showcase.common.labels.notEditable") }}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-readonly"
            label={t(i18n, "showcase.component.inputTextArea.labels.readonly")}
            textareaProps={{ readOnly: true, defaultValue: t(i18n, "showcase.component.inputTextArea.defaults.readonly") }}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea id="demo-disabled" label="${t(i18n, "showcase.common.labels.disabled")}" enabled={false} />
<SgInputTextArea
  id="demo-readonly"
  label="${t(i18n, "showcase.component.inputTextArea.labels.readonly")}"
  textareaProps={{ readOnly: true }}
/>`} />
      </Section>

      <Section
        id="exemplo-15"
        title={`15) ${t(i18n, "showcase.component.inputTextArea.sections.externalError.title")}`}
        description={t(i18n, "showcase.component.inputTextArea.sections.externalError.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-error"
            label={t(i18n, "showcase.component.inputTextArea.labels.externalError")}
            error={t(i18n, "showcase.component.inputTextArea.messages.externalError")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-error"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.externalError")}"\n  error="${t(i18n, "showcase.component.inputTextArea.messages.externalError")}"\n/>`} />
      </Section>

      <Section
        id="exemplo-16"
        title={`16) ${t(i18n, "showcase.common.sections.events.title")}`}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            required
            onChange={(v) => log(`onChange: "${v.replace(/\n/g, "\\n")}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputTextArea.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputTextArea.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputTextArea.logs.onClear"))}
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
                {t(i18n, "showcase.component.inputTextArea.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="demo-events"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.withEvents")}"\n  required\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onEnter")}")} \n  onExit={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onExit")}")} \n  onClear={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onClear")}")} \n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>

      <Section
  id="exemplo-17"
  title={`17) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputTextArea
      id="sg-input-text-area-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputTextArea
      id="sg-input-text-area-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputTextArea
      id="sg-input-text-area-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputTextArea
  id="sg-input-text-area-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputTextArea
  id="sg-input-text-area-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputTextArea
  id="sg-input-text-area-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section
        id="exemplo-18"
        title="18) Playground"
        description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgInputTextArea" })}
      >
        <SgPlayground
          title="SgInputTextArea Playground"
          interactive
          codeContract="appFile"
          code={INPUT_TEXTAREA_PLAYGROUND_CODE}
          height={760}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, "showcase.component.inputTextArea.props.title")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.prop")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.type")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.default")}</th>
                <th className="pb-2 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.label")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.labelText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelPosition</td><td className="py-2 pr-4">&quot;float&quot; | &quot;top&quot; | &quot;left&quot;</td><td className="py-2 pr-4">&quot;float&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.labelPosition")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelWidth</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;11rem&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.labelWidth")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelAlign</td><td className="py-2 pr-4">&quot;start&quot; | &quot;center&quot; | &quot;end&quot;</td><td className="py-2 pr-4">&quot;start&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.labelAlign")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.hintText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.error")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">textareaProps</td><td className="py-2 pr-4">TextareaHTMLAttributes</td><td className="py-2 pr-4">{`{}`}</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.textareaProps")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.maxLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">4</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.maxLines")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLines")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLinesMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLinesMessage")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minNumberOfWords</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minNumberOfWords")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.prefixIcon")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.clearButton")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"100%"</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.width")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">height</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"150px"</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.height")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.borderRadius")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.filled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.withBorder")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">elevation</td><td className="py-2 pr-4">&quot;none&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td><td className="py-2 pr-4">&quot;sm&quot;</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.elevation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.enabled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.requiredMessage")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCounter</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.showCharCounter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value: string) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.validation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateOnBlur</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.validateOnBlur")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg: string | null) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onValidation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onChange")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEnter</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onEnter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onExit")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClear</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onClear")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
