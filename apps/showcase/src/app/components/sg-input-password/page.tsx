"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgInputPassword, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
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

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputPassword } from "@seedgrid/fe-components";

export default function App() {
  const [required, setRequired] = React.useState(false);
  const [filled, setFilled] = React.useState(false);
  const [withBorder, setWithBorder] = React.useState(true);
  const [showStrengthBar, setShowStrengthBar] = React.useState(true);
  const [value, setValue] = React.useState("");

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
        <SgButton size="sm" appearance={showStrengthBar ? "solid" : "outline"} onClick={() => setShowStrengthBar((prev) => !prev)}>
          strengthBar
        </SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("Aa1!Seedgrid")}>
          Set API
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue("")}>
          Limpar
        </SgButton>
      </SgGrid>

      <SgInputPassword
        id="playground-password"
        label="SgInputPassword Playground"
        hintText="Digite ou gere"
        required={required}
        filled={filled}
        withBorder={withBorder}
        showStrengthBar={showStrengthBar}
        inputProps={{ value, onChange: (event) => setValue(event.target.value) }}
      />

      <div className="rounded border border-border p-3">
        <p className="mb-2 text-xs text-muted-foreground">labelPosition</p>
        <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
          <SgInputPassword id="label-float" label="Float" hintText="Type password" labelPosition="float" />
          <SgInputPassword id="label-top" label="Top" hintText="Type password" labelPosition="top" />
          <SgInputPassword
            id="label-left"
            label="Left"
            hintText="Type password"
            labelPosition="left"
            labelWidth={120}
            labelAlign="end"
          />
        </SgGrid>
      </div>
    </div>
  );
}`;

export default function SgInputPasswordPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputPassword.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputPassword.sections.required.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputPassword.sections.validation.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.common.sections.visual.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.common.sections.events.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-7", label: "7) Playground" }
    ],
    [i18n.locale]
  );
  const inputPasswordPropsRows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputPassword.props.rows.id") },
    { prop: "label / hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputPassword.props.rows.labelHintText") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputPassword.props.rows.required") },
    { prop: "validation / onValidation", type: "functions", defaultValue: "-", description: t(i18n, "showcase.component.inputPassword.props.rows.validation") },
    { prop: "maxLength / minSize", type: "number", defaultValue: "- / 8", description: t(i18n, "showcase.component.inputPassword.props.rows.lengthRules") },
    { prop: "showStrengthBar", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.inputPassword.props.rows.showStrengthBar") },
    { prop: "commonPasswordCheck", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.inputPassword.props.rows.commonPasswordCheck") },
    { prop: "clearButton / withBorder / filled / enabled / readOnly", type: "boolean", defaultValue: "varies", description: t(i18n, "showcase.component.inputPassword.props.rows.visualFlags") },
    { prop: "labelPosition", type: '"float" | "top" | "left"', defaultValue: '"float"', description: t(i18n, "showcase.common.props.rows.labelPosition") },
    { prop: "labelWidth", type: "number | string", defaultValue: '"11rem"', description: t(i18n, "showcase.common.props.rows.labelWidth") },
    { prop: "labelAlign", type: '"start" | "center" | "end"', defaultValue: '"start"', description: t(i18n, "showcase.common.props.rows.labelAlign") },
    { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"sm"', description: t(i18n, "showcase.common.props.rows.elevation") },
    { prop: "width / borderRadius", type: "number | string", defaultValue: "100% / -", description: t(i18n, "showcase.component.inputPassword.props.rows.widthBorderRadius") },
    { prop: "onChange / onEnter / onExit / onClear", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputPassword.props.rows.events") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPassword.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.inputPassword.subtitle")}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(i18n, "showcase.common.examples")}</p>
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
          title={`1) ${t(i18n, "showcase.component.inputPassword.sections.basic.title")}`}
          description={t(i18n, "showcase.component.inputPassword.sections.basic.description")}
        >
          <div className="w-80">
            <SgInputPassword
              id="demo-basic"
              label={t(i18n, "showcase.component.inputPassword.labels.password")}
              hintText={t(i18n, "showcase.component.inputPassword.labels.passwordHint")}
              onChange={(value) => setBasicValue(value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
            </p>
          </div>
          <CodeBlock code={`<SgInputPassword\n  id="demo-basic"\n  label="${t(i18n, "showcase.component.inputPassword.labels.password")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.passwordHint")}"\n  onChange={(value) => setBasicValue(value)}\n/>`} />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.inputPassword.sections.required.title")}`}
          description={t(i18n, "showcase.component.inputPassword.sections.required.description")}
        >
          <div className="w-80">
            <SgInputPassword
              id="demo-required"
              label={t(i18n, "showcase.component.inputPassword.labels.requiredPassword")}
              hintText={t(i18n, "showcase.component.inputPassword.labels.requiredHint")}
              required
            />
          </div>
          <CodeBlock code={`<SgInputPassword\n  id="demo-required"\n  label="${t(i18n, "showcase.component.inputPassword.labels.requiredPassword")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.requiredHint")}"\n  required\n/>`} />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.inputPassword.sections.validation.title")}`}
          description={t(i18n, "showcase.component.inputPassword.sections.validation.description")}
        >
          <div className="w-80">
            <SgInputPassword
              id="demo-validation"
              label={t(i18n, "showcase.component.inputPassword.labels.min8")}
              hintText={t(i18n, "showcase.component.inputPassword.labels.min8Hint")}
              validation={(value) =>
                value.length < 8 ? t(i18n, "showcase.component.inputPassword.messages.min8") : null
              }
              onValidation={(msg) => setValidationMsg(msg)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg ?? t(i18n, "showcase.common.labels.valid")}
            </p>
          </div>
          <CodeBlock code={`<SgInputPassword\n  id="demo-validation"\n  label="${t(i18n, "showcase.component.inputPassword.labels.min8")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.min8Hint")}"\n  validation={(value) => value.length < 8 ? "${t(i18n, "showcase.component.inputPassword.messages.min8")}" : null}\n  onValidation={(msg) => setValidationMsg(msg)}\n/>`} />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.common.sections.visual.title")}`}
          description={t(i18n, "showcase.common.sections.visual.description")}
        >
          <div className="w-80">
            <SgInputPassword id="demo-noborder" label={t(i18n, "showcase.common.labels.noBorder")} withBorder={false} />
          </div>
          <div className="w-80">
            <SgInputPassword id="demo-filled" label={t(i18n, "showcase.common.labels.filled")} filled />
          </div>
          <div className="w-80">
            <SgInputPassword id="demo-noclear" label={t(i18n, "showcase.common.labels.noClear")} clearButton={false} />
          </div>
          <CodeBlock code={`<SgInputPassword id="demo-noborder" label="${t(i18n, "showcase.common.labels.noBorder")}" withBorder={false} />\n<SgInputPassword id="demo-filled" label="${t(i18n, "showcase.common.labels.filled")}" filled />\n<SgInputPassword id="demo-noclear" label="${t(i18n, "showcase.common.labels.noClear")}" clearButton={false} />`} />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.common.sections.events.title")}`}
          description={t(i18n, "showcase.common.sections.events.description")}
        >
          <div className="w-80">
            <SgInputPassword
              id="demo-events"
              label={t(i18n, "showcase.common.labels.typeAndLog")}
              required
              onChange={(value) => log(`onChange: "${value}"`)}
              onEnter={() => log(t(i18n, "showcase.component.inputPassword.logs.onEnter"))}
              onExit={() => log(t(i18n, "showcase.component.inputPassword.logs.onExit"))}
              onClear={() => log(t(i18n, "showcase.component.inputPassword.logs.onClear"))}
            />
            <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
              {eventLog.length === 0 ? (
                <span className="text-muted-foreground">{t(i18n, "showcase.common.labels.interactHint")}</span>
              ) : (
                eventLog.map((entry, index) => <div key={index}>{entry}</div>)
              )}
            </div>
          </div>
          <CodeBlock code={`<SgInputPassword\n  id="demo-events"\n  label="${t(i18n, "showcase.common.labels.typeAndLog")}"\n  required\n  onChange={(value) => log(\`onChange: "\${value}"\`)}\n  onEnter={() => log("${t(i18n, "showcase.component.inputPassword.logs.onEnter")}")}\n  onExit={() => log("${t(i18n, "showcase.component.inputPassword.logs.onExit")}")}\n  onClear={() => log("${t(i18n, "showcase.component.inputPassword.logs.onClear")}")}\n/>`} />
        </Section>

        <Section
  id="exemplo-6"
  title={`6) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
  description={t(i18n, "showcase.common.sections.labelPosition.description")}
>
  <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
    <SgInputPassword
      id="sg-input-password-label-float"
      label={t(i18n, "showcase.common.labels.labelFloat")}
      labelPosition="float"
    />
    <SgInputPassword
      id="sg-input-password-label-top"
      label={t(i18n, "showcase.common.labels.labelTop")}
      labelPosition="top"
    />
    <SgInputPassword
      id="sg-input-password-label-left"
      label={t(i18n, "showcase.common.labels.labelLeft")}
      labelPosition="left"
      labelWidth={140}
      labelAlign="end"
    />
  </SgGrid>
  <CodeBlock code={`<SgInputPassword
  id="sg-input-password-label-float"
  label="${t(i18n, "showcase.common.labels.labelFloat")}"
  labelPosition="float"
/>

<SgInputPassword
  id="sg-input-password-label-top"
  label="${t(i18n, "showcase.common.labels.labelTop")}"
  labelPosition="top"
/>

<SgInputPassword
  id="sg-input-password-label-left"
  label="${t(i18n, "showcase.common.labels.labelLeft")}"
  labelPosition="left"
  labelWidth={140}
  labelAlign="end"
/>`} />
</Section>

<Section id="exemplo-7" title="7) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgInputPassword Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={inputPasswordPropsRows} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
